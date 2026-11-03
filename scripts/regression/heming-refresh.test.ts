import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { formToBirthInfo, vnProvinceRequired, VN_PROVINCE_REQUIRED_MESSAGE } from '../../lib/ziwei/share';
import type { BirthInfo } from '../../lib/ziwei/types';

// Exercise the actual request callback across two renders, without a private backend.
const source = readFileSync(new URL('../../app/heming/page.tsx', import.meta.url), 'utf8');
const start = source.indexOf('  // 表单是否填齐');
const end = source.indexOf('  const cardStyle =', start);
assert.ok(start >= 0 && end > start);
const body = `export function makeRun(ctx) {
  const {chartA,chartB,formA,formB,generateChart,formToBirthInfo,setFormError,
    setAnalyzing,setAnalysis,setAnalysisError,setChartA,setChartB,fetch,
    setApiMissing,analysisRef,vnProvinceRequired,VN_PROVINCE_REQUIRED_MESSAGE} = ctx;
  const useCallback = (fn) => fn;
  ${source.slice(start, end)}
  return runAnalysis;
}`;
const moduleExports: Record<string, (ctx: object) => () => Promise<void>> = {};
new Function('exports', 'setTimeout', ts.transpileModule(body, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText)(moduleExports, () => {});
const noop = () => {};
const form = { year: '1990', month: '1', day: '1', clockHour: '8', clockMinute: '0',
  gender: 'male' as const, unknownTime: false, name: 'A', province: '', city: '', longitude: 120 };
let chartA: unknown = null;
let chartB: unknown = null;
let currentForm: typeof form & { country?: 'VN' | 'CN' } = { ...form };
let lastFormError: string | null = null;
const requests: { chartA: { birthInfo: BirthInfo }; chartB: { birthInfo: BirthInfo } }[] = [];
const context = () => ({
  chartA, chartB, formA: currentForm, formB: { ...form, name: 'B' }, formToBirthInfo,
  vnProvinceRequired, VN_PROVINCE_REQUIRED_MESSAGE,
  generateChart: async (birthInfo: BirthInfo) => ({ birthInfo }),
  setChartA: (value: unknown) => { chartA = value; },
  setChartB: (value: unknown) => { chartB = value; },
  setFormError: (value: string | null) => { lastFormError = value; }, setAnalyzing: noop, setAnalysis: noop, setAnalysisError: noop,
  setApiMissing: noop, analysisRef: { current: null },
  fetch: async (_url: string, options: { body: string }) => {
    requests.push(JSON.parse(options.body));
    return { status: 200, ok: true, body: new ReadableStream({ start(controller) { controller.close(); } }) };
  },
});
async function main() {
  await moduleExports.makeRun(context())();
  currentForm = { ...form, year: '1991' };
  await moduleExports.makeRun(context())();
  assert.equal(requests.length, 2);
  assert.equal(requests[0].chartA.birthInfo.year, 1990);
  assert.equal(requests[1].chartA.birthInfo.year, 1991, 'the second request must use edited birth data');
  assert.equal(requests[1].chartB.birthInfo.name, 'B');
  // Sinh ở Việt Nam trước 13/6/1975 mà chưa chọn tỉnh → chặn, không gửi request
  currentForm = { ...form, year: '1950', country: 'VN' };
  await moduleExports.makeRun(context())();
  assert.equal(requests.length, 2, 'VN 1950 chưa chọn tỉnh không được lập lá số');
  assert.ok(lastFormError?.includes('Người thứ nhất (A)') && lastFormError.includes('13/6/1975'), `formError: ${lastFormError}`);
  currentForm = { ...form, year: '1980', country: 'VN' };
  await moduleExports.makeRun(context())();
  assert.equal(requests.length, 3, 'VN 1980 chưa chọn tỉnh vẫn lập lá số như trước');
  console.log('Heming edited-form request regression passed');
}
main().catch(error => { console.error(error); process.exitCode = 1; });

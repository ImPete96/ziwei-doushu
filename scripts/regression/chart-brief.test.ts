/**
 * chart-brief.ts: bản tóm tắt lá số gửi cho AI (/api/interpret).
 *
 * Ca 17/2/2007 giờ Ngọ, Hà Nội: theo âm lịch Việt Nam là mùng 1 Tết Đinh Hợi (lịch Trung Quốc
 * còn là 30 tháng Chạp Bính Tuất), nên Tứ Hóa năm sinh phải theo can Đinh. Bản tóm tắt phải
 * đủ 12 cung, không còn chữ Hán, và không chứa họ tên.
 *
 * chart-brief.ts kéo theo patterns.ts có `server-only` (chỉ Next mới phân giải được), nên trỏ
 * nó về một module rỗng như patterns-sihua-bonus.test.ts rồi mới import.
 */
import assert from 'node:assert/strict';
import * as nodeModule from 'node:module';
import { generateChart } from '../../lib/ziwei/algorithm';
import type { BirthInfo } from '../../lib/ziwei/types';

type HookResult = { url?: string; format?: string; source?: string; shortCircuit?: boolean };
const { registerHooks } = nodeModule as unknown as {
  registerHooks(hooks: {
    resolve(specifier: string, context: unknown, next: (s: string, c: unknown) => HookResult): HookResult;
    load(url: string, context: unknown, next: (u: string, c: unknown) => HookResult): HookResult;
  }): void;
};
const SERVER_ONLY_STUB = 'data:text/javascript,';
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'server-only') return { url: SERVER_ONLY_STUB, shortCircuit: true };
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === SERVER_ONLY_STUB) return { format: 'commonjs', source: '', shortCircuit: true };
    return nextLoad(url, context);
  },
});

async function main() {
  const { buildChartBrief } = await import('../../lib/ai/chart-brief');

  const info: BirthInfo = {
    year: 2007, month: 2, day: 17, hour: 6, gender: 'male', name: 'Nguyễn Văn Thử',
    country: 'VN', utcOffsetMinutes: 420, longitude: 105.85,
  };
  const chart = generateChart(info, { now: new Date('2026-11-03T00:00:00Z') });
  const brief = buildChartBrief(chart, 2026);

  if (process.env.SHOW) console.log(brief);
  assert.match(brief, /Năm sinh âm lịch: Đinh Hợi; ngày 1 tháng 1/);
  assert.match(brief, /Tứ Hóa năm sinh \(can Đinh\): Hóa Lộc: Thái Âm, Hóa Quyền: Thiên Đồng, Hóa Khoa: Thiên Cơ, Hóa Kỵ: Cự Môn/);
  assert.match(brief, /Lưu niên 2026 \(Bính Ngọ\): Tứ Hóa Hóa Lộc: Thiên Đồng/);
  assert.match(brief, /Đại hạn hiện tại: 15–24 tuổi, tại cung Huynh Đệ \(can Đinh\)\n {2}Tứ Hóa đại hạn: Hóa Lộc: Thái Âm/);
  assert.equal(brief.match(/^- cung .+ — /gm)?.length, 12, '12 dòng cung');
  assert.match(brief, /^## 12 cung.*\n- cung Mệnh — Mậu Thân/m, 'cung Mệnh đứng đầu danh sách');
  assert.doesNotMatch(brief, /[㐀-鿿]/, 'không còn chữ Hán');
  assert.ok(!brief.includes('Nguyễn Văn Thử'), 'không gửi họ tên');
  assert.equal(chart.palaces.length, 12);

  // Phủ Tướng triều viên trích cổ thư trong ngoặc kép thẳng "府相朝垣…" (khác ca trên dùng “…”)
  const chart2 = generateChart({ year: 1996, month: 12, day: 28, hour: 0, gender: 'male', country: 'VN', utcOffsetMinutes: 420, longitude: 106.25 }, { now: new Date('2026-11-03T00:00:00Z') });
  const brief2 = buildChartBrief(chart2, 2026);
  assert.match(brief2, /Phủ Tướng triều viên/);
  assert.doesNotMatch(brief2, /[㐀-鿿]/, 'không còn chữ Hán trong ngoặc kép thẳng');

  console.log('✅ chart-brief: âm lịch VN, Tứ Hóa năm sinh/lưu niên, 12 cung, không chữ Hán, không họ tên');
}

main().catch((e) => { console.error(e); process.exit(1); });

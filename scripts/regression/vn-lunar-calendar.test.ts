/**
 * Hồi quy: âm lịch Việt Nam (UTC+7) cho người sinh ở Việt Nam; Trung Quốc giữ nguyên lịch lunar-javascript.
 *
 * Bảng thần chú (độc lập với code được kiểm):
 *   · Tết VN theo Hồ Ngọc Đức (xemamlich.uhm.vn/calrules_en.html) và lichamviet.com:
 *     1968 VN 29/1 – TQ 30/1; 1985 VN 21/1 – TQ 20/2; 2007 VN 17/2 – TQ 18/2; 2030 VN 2/2 – TQ 3/2.
 *     Các năm trùng: 1976 31/1, 1990 27/1, 2000 5/2, 2023 22/1, 2024 10/2, 2025 29/1, 2026 17/2.
 *   · 1985 VN nhuận tháng 2 (21/3–19/4/1985), TQ 1985 không nhuận (TQ nhuận tháng 10 năm 1984).
 *   · Miền Bắc lịch UTC+7 từ 1/1/1968, miền Nam từ 13/6/1975 (vn-lunar-calendar.ts).
 *
 * ① lịch theo múi giờ ở UTC+8 trùng lunar-javascript từng ngày 1960–2050 (sau 1960 lunar-javascript tính
 *   thuần thiên văn; trước đó dùng bảng hiệu chỉnh lịch sử SB — kiểm 1900–1959 ngoại trừ đúng 3 tháng đó);
 * ② Tết VN / TQ, tháng nhuận 1985;
 * ③ nhánh lá số theo múi giờ ép UTC+8 trùng hệt nhánh Trung Quốc (chứng minh cầu nối sang iztro đúng);
 * ④ lá số VN ≠ CN ở các ngày lệch; miền Nam 1969–1975 = CN; tiết khí so theo giờ VN thật;
 * ⑤ chính sách tháng nhuận trên tháng nhuận riêng của VN.
 */
import { astro } from 'iztro';
import { Solar } from 'lunar-javascript';
import { generateChart, resolveEffectiveLunarDate } from '../../lib/ziwei/algorithm';
import {
  gregorianFromJdn, jdnFromGregorian, leapMonthTz, lunarMonthTz, lunarToSolarTz, solarToLunarTz,
} from '../../lib/ziwei/lunar-calendar-tz';
import { leapMonthOfLunarYear, lunarToSolar } from '../../lib/ziwei/lunar-solar';
import { vnLunarCalendar } from '../../lib/ziwei/vn-lunar-calendar';
import { resolveVnPlace } from '../../lib/ziwei/vn-places';
import type { BirthInfo, ZiweiChart } from '../../lib/ziwei/types';

let bad = 0;
const fail = (m: string) => { bad++; console.log(`  ❌ ${m}`); };
const ymd = (d: { year: number; month: number; day: number } | null) => d ? `${d.year}-${d.month}-${d.day}` : 'null';
const POLICIES = ['split', 'next-month', 'prev-month', 'origin-month'] as const;
const NORTH = 'Hà Nội';
const SOUTH = 'TP. Hồ Chí Minh';

/**
 * Phần lá số phụ thuộc ngày âm: bỏ birthInfo (khác ở country/province) và tứ trụ tiết khí (người VN luôn so
 * điểm giao tiết theo giờ VN, nên chỉ khác CN khi sinh sát giờ giao tiết — kiểm riêng bên dưới).
 */
function chartCore(c: ZiweiChart): string {
  const { birthInfo: _b, lunarInfo: { fourPillars: _p, ...lunar }, ...rest } = c;
  return JSON.stringify({ ...rest, lunar });
}
/** «Hôm nay» cố định để tuổi mụ / đại hạn hiện tại không phụ thuộc ngày chạy test */
const NOW = new Date(Date.UTC(2026, 10, 3, 5));
const gen = (info: BirthInfo, opts: Parameters<typeof generateChart>[1] = {}) => generateChart(info, { now: NOW, ...opts });

/* ── ⓪ dữ liệu nơi sinh dùng trong test ───────────────────────────── */
{
  if (resolveVnPlace(NORTH)?.region !== 'north') fail(`${NORTH} phải thuộc miền Bắc`);
  if (resolveVnPlace(SOUTH)?.region !== 'south') fail(`${SOUTH} phải thuộc miền Nam`);
}

/* ── ① UTC+8 = lunar-javascript ──────────────────────────────────── */
{
  console.log('① lịch theo múi giờ UTC+8 trùng lunar-javascript');
  // Bảng SB (寿星万年历) hiệu chỉnh theo lịch TQ đã ban hành — không phải thiên văn: sóc lúc 00:01–00:05 giờ BJ
  // (ngày dương đầu tháng theo lunar-javascript; lệch đúng 1 ngày, cả tháng 30 ngày)
  const SB_RANGES = [[1914, 11, 17], [1916, 2, 3], [1920, 11, 10]].map(([y, m, d]) => jdnFromGregorian(y, m, d));
  let days = 0, mismatched = 0, sbDays = 0;
  for (let j = jdnFromGregorian(1900, 1, 1); j <= jdnFromGregorian(2050, 12, 31); j++) {
    const g = gregorianFromJdn(j);
    const l = Solar.fromYmd(g.year, g.month, g.day).getLunar();
    const t = solarToLunarTz(g.year, g.month, g.day, 480);
    days++;
    if (l.getYear() === t.year && l.getMonth() === (t.isLeap ? -t.month : t.month) && l.getDay() === t.day) continue;
    if (SB_RANGES.some((s) => j >= s && j < s + 30)) { sbDays++; continue; }
    mismatched++;
    if (mismatched <= 5) fail(`${ymd(g)}: lunar-javascript ${l.getYear()}/${l.getMonth()}/${l.getDay()} ≠ ${t.year}/${t.isLeap ? 'L' : ''}${t.month}/${t.day}`);
  }
  if (sbDays !== 90) fail(`3 tháng hiệu chỉnh SB phải lệch đúng 90 ngày, được ${sbDays}`);
  if (!mismatched) console.log(`  ✅ ${days} ngày 1900–2050 trùng (trừ ${sbDays} ngày của 3 tháng TQ hiệu chỉnh lịch sử 1914/1916/1920)`);
}

/* ── ② Tết + tháng nhuận ─────────────────────────────────────────── */
{
  console.log('② Tết Việt Nam / Trung Quốc, tháng nhuận');
  const TET: Array<[number, string, string]> = [
    [1968, '1968-1-29', '1968-1-30'],
    [1969, '1969-2-16', '1969-2-17'],
    [1976, '1976-1-31', '1976-1-31'],
    [1985, '1985-1-21', '1985-2-20'],
    [1990, '1990-1-27', '1990-1-27'],
    [2000, '2000-2-5', '2000-2-5'],
    [2007, '2007-2-17', '2007-2-18'],
    [2023, '2023-1-22', '2023-1-22'],
    [2024, '2024-2-10', '2024-2-10'],
    [2025, '2025-1-29', '2025-1-29'],
    [2026, '2026-2-17', '2026-2-17'],
    [2030, '2030-2-2', '2030-2-3'],
  ];
  for (const [y, vn, cn] of TET) {
    const v = ymd(lunarToSolarTz(y, 1, 1, false, 420));
    const c = ymd(lunarToSolarTz(y, 1, 1, false, 480));
    const lj = Solar.fromYmd(...(cn.split('-').map(Number) as [number, number, number])).getLunar();
    if (v !== vn) fail(`Tết ${y} VN: ${v}, cần ${vn}`);
    if (c !== cn) fail(`Tết ${y} TQ: ${c}, cần ${cn}`);
    if (lj.getMonth() !== 1 || lj.getDay() !== 1) fail(`Tết ${y} TQ theo lunar-javascript không phải ${cn}`);
  }
  const leap85 = lunarMonthTz(1985, 2, true, 420);
  if (!leap85 || ymd(gregorianFromJdn(leap85.startJdn)) !== '1985-3-21' || ymd(gregorianFromJdn(leap85.startJdn + leap85.days - 1)) !== '1985-4-19') {
    fail(`VN 1985 nhuận tháng 2 phải 21/3–19/4/1985, được ${leap85 ? ymd(gregorianFromJdn(leap85.startJdn)) : 'không có'}`);
  }
  if (leapMonthTz(1985, 480) !== 0 || leapMonthTz(1984, 480) !== 10 || leapMonthTz(1984, 420) !== 0) {
    fail(`tháng nhuận 1984/1985: TQ ${leapMonthTz(1984, 480)}/${leapMonthTz(1985, 480)}, VN ${leapMonthTz(1984, 420)}/${leapMonthTz(1985, 420)}`);
  }
  // âm → dương → âm khứ hồi trên cả tuế, gồm tháng nhuận
  for (const y of [1985, 1995, 2031]) {
    for (let m = 1; m <= 12; m++) {
      for (const leap of [false, true]) {
        const mo = lunarMonthTz(y, m, leap, 420);
        if (!mo) continue;
        for (const d of [1, mo.days]) {
          const s = lunarToSolarTz(y, m, d, leap, 420)!;
          const back = solarToLunarTz(s.year, s.month, s.day, 420);
          if (back.year !== y || back.month !== m || back.day !== d || back.isLeap !== leap) fail(`khứ hồi ${y}/${leap ? 'L' : ''}${m}/${d}`);
        }
      }
    }
  }
  if (lunarToSolarTz(1985, 2, 30, true, 420) === null) fail('VN 30 tháng 2 nhuận 1985 phải tồn tại');
  if (lunarToSolarTz(1985, 3, 1, true, 420) !== null) fail('VN 1985 không có nhuận tháng 3');
  // lunar-solar.ts: mặc định lịch TQ (như cũ), tham số 420 = lịch VN
  if (ymd(lunarToSolar(1985, 1, 1)) !== '1985-2-20' || ymd(lunarToSolar(1985, 1, 1, false, 420)) !== '1985-1-21') fail('lunar-solar.ts Tết 1985');
  if (leapMonthOfLunarYear(1985) !== 0 || leapMonthOfLunarYear(1985, 420) !== 2) fail('lunar-solar.ts nhuận 1985');
  if (!bad) console.log('  ✅ Tết 12 năm, nhuận 1985 VN (21/3–19/4), khứ hồi âm↔dương');
}

/* ── ③ nhánh múi giờ ép UTC+8 ≡ nhánh Trung Quốc ──────────────────── */
{
  console.log('③ lá số qua lịch theo múi giờ (ép UTC+8) trùng hệt lá số Trung Quốc');
  let n = 0, diff = 0;
  let seed = 20261103;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const j0 = jdnFromGregorian(1960, 1, 1), j1 = jdnFromGregorian(2050, 12, 31);
  const cases: BirthInfo[] = [];
  for (let i = 0; i < 120; i++) {
    const g = gregorianFromJdn(j0 + Math.floor(rnd() * (j1 - j0)));
    cases.push({ ...g, hour: Math.floor(rnd() * 12), gender: rnd() < 0.5 ? 'male' : 'female' });
  }
  // dồn thêm các ngày trong tháng nhuận và ngày 29/30 (nơi chính sách nhuận và «ngày 30» khó nhất)
  for (let j = jdnFromGregorian(2023, 1, 1); j <= jdnFromGregorian(2025, 12, 31); j++) {
    const g = gregorianFromJdn(j);
    const l = Solar.fromYmd(g.year, g.month, g.day).getLunar();
    if (l.getMonth() < 0 ? [1, 15, 16, 29, 30].includes(l.getDay()) : l.getDay() === 30) {
      cases.push({ ...g, hour: j % 12, gender: j % 2 ? 'male' : 'female' });
    }
  }
  for (const info of cases) {
    for (const leapMonth of POLICIES) {
      const a = JSON.stringify(generateChart(info, { leapMonth }));
      const b = JSON.stringify(generateChart(info, { leapMonth, lunarUtcOffsetMinutes: 480 }));
      n++;
      if (a !== b) { diff++; if (diff <= 5) fail(`${ymd(info)} giờ ${info.hour} ${leapMonth}: khác nhánh TQ`); }
    }
  }
  if (!diff) console.log(`  ✅ ${n} lá số (${cases.length} ngày × 4 chính sách nhuận) trùng từng byte`);

  // Cơ sở của việc dựng ngày 30 từ năm âm cách 60·k năm: iztro an sao không phụ thuộc số năm, chỉ can chi.
  let shifted = 0;
  const stars = (c: ZiweiChart) => JSON.stringify([
    c.palaces, c.mingGongBranch, c.shenGongBranch, c.wuxingJu, c.ziweiPos, c.daXians, c.mingZhu, c.shenZhu, c.yinYangGender,
  ].map((x) => (Array.isArray(x) && x.length === 12 ? (x as ZiweiChart['palaces']).map(({ isCurrentDaXian: _c, ...p }) => p) : x)));
  for (let i = 0; i < 40; i++) {
    const g = gregorianFromJdn(jdnFromGregorian(1960, 1, 1) + Math.floor(rnd() * 11000));
    const l = Solar.fromYmd(g.year, g.month, g.day).getLunar();
    if (l.getMonth() < 0) continue;
    const later = lunarToSolar(l.getYear() + 60, l.getMonth(), l.getDay());
    if (!later) continue;
    const hour = i % 12;
    shifted++;
    if (stars(generateChart({ ...g, hour, gender: 'female' })) !== stars(generateChart({ ...later, hour, gender: 'female' }))) {
      fail(`${ymd(g)} và ${ymd(later)} (cùng ngày âm, cách 60 năm) phải an sao như nhau`);
    }
  }
  if (!bad) console.log(`  ✅ ${shifted} cặp ngày âm cách 60 năm an sao như nhau (cơ sở dựng ngày 30)`);
}

/* ── ④ lá số VN ≠ CN ở ngày lệch; miền Nam trước 13/6/1975 = CN ─────── */
{
  console.log('④ lá số Việt Nam theo âm lịch VN');
  const base = (y: number, m: number, d: number, hour = 6): BirthInfo => ({ year: y, month: m, day: d, hour, gender: 'male' });
  const vn = (b: BirthInfo, province?: string): BirthInfo => ({ ...b, country: 'VN', ...(province ? { province } : {}) });

  // [ngày, âm VN mong đợi, âm CN mong đợi]
  const DIFF: Array<[BirthInfo, string, string]> = [
    [base(2007, 2, 17), '2007/1/1', '2006/12/30'],   // Tết 2007: khác cả năm (Đinh Hợi vs Bính Tuất)
    [base(1985, 1, 21), '1985/1/1', '1984/12/1'],    // Tết 1985 VN; TQ còn tháng Chạp... (sau nhuận 10)
    [base(2018, 11, 7), '2018/10/1', '2018/9/30'],
    [base(2030, 2, 2), '2030/1/1', '2029/12/30'],
    [base(1984, 11, 23), '1984/11/1', '1984/L10/1'], // tháng nhuận khác nhau
  ];
  for (const [b, expVn, expCn] of DIFF) {
    for (const province of [undefined, NORTH]) {
      const cv = gen(vn(b, province));
      const cc = gen(b);
      const fmt = (c: ZiweiChart) => `${c.lunarInfo.lunarYear}/${c.lunarInfo.isLeapMonth ? 'L' : ''}${c.lunarInfo.lunarMonth}/${c.lunarInfo.lunarDay}`;
      // prev-month (mặc định khác) không đổi số tháng; dùng origin-month để thấy đúng «nhuận»
      const cco = gen(b, { leapMonth: 'origin-month' });
      if (fmt(cv) !== expVn) fail(`${ymd(b)} VN(${province ?? 'chưa chọn tỉnh'}): âm ${fmt(cv)}, cần ${expVn}`);
      if (fmt(cco) !== expCn) fail(`${ymd(b)} CN: âm ${fmt(cco)}, cần ${expCn}`);
      if (chartCore(cv) === chartCore(cc)) fail(`${ymd(b)}: lá số VN phải khác CN`);
    }
  }
  // Tết 2007 VN: năm Đinh Hợi (丁=3, 亥=11)
  const t07 = gen(vn(base(2007, 2, 17)));
  if (t07.lunarInfo.yearStem !== 3 || t07.lunarInfo.yearBranch !== 11) fail(`Tết 2007 VN phải năm Đinh Hợi, được ${t07.lunarInfo.yearStem}/${t07.lunarInfo.yearBranch}`);
  if (t07.lunarInfo.fourPillarsLunar?.[0] !== '丁亥' || t07.lunarInfo.fourPillarsLunar?.[1] !== '壬寅') fail(`Tết 2007 VN: tứ trụ âm ${t07.lunarInfo.fourPillarsLunar}`);

  // Miền Bắc 1968–1975 theo UTC+7, miền Nam theo UTC+8 (= Trung Quốc)
  for (const b of [base(1968, 1, 29), base(1969, 2, 16), base(1974, 12, 13), base(1975, 4, 11)]) {
    const north = gen(vn(b, NORTH));
    const south = gen(vn(b, SOUTH));
    const cn = gen(b);
    if (chartCore(south) !== chartCore(cn)) fail(`${ymd(b)} miền Nam phải trùng lá số CN`);
    if (chartCore(north) === chartCore(cn)) fail(`${ymd(b)} miền Bắc phải theo lịch VN (khác CN)`);
    if (north.lunarInfo.lunarDay !== 1) fail(`${ymd(b)} miền Bắc phải là mùng 1, được ${north.lunarInfo.lunarDay}`);
  }
  // Cả năm 1970 (không có ngày lệch giữa hai lịch): Nam = Bắc = CN
  for (let m = 1; m <= 12; m++) {
    for (const d of [1, 15, 28]) {
      const b = base(1970, m, d, (m + d) % 12);
      const cn = chartCore(gen(b));
      if (chartCore(gen(vn(b, SOUTH))) !== cn) fail(`1970-${m}-${d} miền Nam ≠ CN`);
      if (chartCore(gen(vn(b, NORTH))) !== cn) fail(`1970-${m}-${d} miền Bắc ≠ CN (1970 không có ngày lệch)`);
    }
  }
  // Mốc: Bắc 1/1/1968, Nam 13/6/1975; chưa chọn tỉnh từ 1968 → UTC+7
  const cal = (y: number, m: number, d: number, province?: string) => vnLunarCalendar({ year: y, month: m, day: d, province }).offsetMinutes;
  if (cal(1967, 12, 31, NORTH) !== 480 || cal(1968, 1, 1, NORTH) !== 420) fail('mốc miền Bắc 1/1/1968');
  if (cal(1975, 6, 12, SOUTH) !== 480 || cal(1975, 6, 13, SOUTH) !== 420) fail('mốc miền Nam 13/6/1975');
  if (cal(1990, 1, 1) !== 420 || cal(1960, 1, 1) !== 480) fail('chưa chọn tỉnh');
  // Trước 1968 người VN = lịch TQ (cả 1914–1920 hiệu chỉnh lịch sử)
  for (const b of [base(1914, 11, 17), base(1916, 2, 3), base(1967, 12, 1), base(1957, 3, 1)]) {
    if (chartCore(gen(vn(b, NORTH))) !== chartCore(gen(b))) fail(`${ymd(b)} miền Bắc trước 1968 phải = CN`);
  }

  // Tiết khí so theo thời điểm thật: Lập xuân 1991-02-04 16:08 giờ Bắc Kinh. Giờ Thân (giữa canh 16:00):
  // TQ 16:00 BJ → trước Lập xuân (庚午年 己丑月); VN 16:00 = 17:00 BJ → sau Lập xuân (辛未年 庚寅月).
  {
    const b = base(1991, 2, 4, 8);
    const cnP = gen(b).lunarInfo.fourPillars;
    const vnP = gen(vn(b, NORTH)).lunarInfo.fourPillars;
    if (cnP?.[0] !== '庚午' || cnP?.[1] !== '己丑') fail(`1991-02-04 giờ Thân CN: ${cnP}`);
    if (vnP?.[0] !== '辛未' || vnP?.[1] !== '庚寅') fail(`1991-02-04 giờ Thân VN: ${vnP} (tiết khí phải so theo giờ VN)`);
    if (vnP?.[2] !== cnP?.[2] || vnP?.[3] !== cnP?.[3]) fail('can chi ngày/giờ không phụ thuộc lịch');
  }
  // Giờ VN luôn quy về giờ Bắc Kinh khi so điểm giao tiết, KỂ CẢ khi ngày âm theo lịch +8 (miền Nam trước 1975):
  // Lập hạ 1970-05-06 06:33 giờ BJ. Giờ Mão (giữa canh 06:00): TQ 06:00 BJ → còn tháng 庚辰; miền Nam VN
  // 06:00 = 07:00 BJ → đã sang tháng 辛巳. Ngày âm / lá số an sao vẫn y CN.
  {
    const b = base(1970, 5, 6, 3);
    const cn = gen(b), south = gen(vn(b, SOUTH));
    if (cn.lunarInfo.fourPillars?.[1] !== '庚辰') fail(`1970-05-06 giờ Mão CN: ${cn.lunarInfo.fourPillars}`);
    if (south.lunarInfo.fourPillars?.[1] !== '辛巳') fail(`1970-05-06 giờ Mão miền Nam: ${south.lunarInfo.fourPillars} (phải so tiết theo giờ VN)`);
    if (chartCore(south) !== chartCore(cn)) fail('1970-05-06 miền Nam: ngoài tứ trụ tiết khí phải y CN');
    // Giờ Thìn (giữa canh 08:00) đã qua Lập hạ ở cả hai → tứ trụ y hệt
    if (JSON.stringify(gen(vn(base(1970, 5, 6, 4), SOUTH)).lunarInfo) !== JSON.stringify(gen(base(1970, 5, 6, 4)).lunarInfo)) fail('1970-05-06 giờ Thìn: lunarInfo phải y CN');
  }

  // Quảng Trị mới vắt qua sông Bến Hải (vn-places.ts): mục con quyết định miền → lịch 1968–1975
  {
    const b = base(1969, 2, 16); // Tết Kỷ Dậu miền Bắc; miền Nam / TQ còn 30 tháng Chạp
    const at = (province?: string, city?: string) => gen({ ...b, country: 'VN', ...(province ? { province } : {}), ...(city ? { city } : {}) }).lunarInfo;
    const cases: Array<[string | undefined, string | undefined, number, number]> = [
      ['Quảng Trị', 'Quảng Trị (cũ)', 12, 30],
      ['Quảng Trị', 'Vĩnh Linh (bắc sông Bến Hải)', 1, 1],
      [undefined, undefined, 1, 1],
    ];
    for (const [province, city, m, d] of cases) {
      const l = at(province, city);
      if (l.lunarMonth !== m || l.lunarDay !== d) fail(`1969-02-16 ${province ?? 'chưa chọn tỉnh'}${city ? ' / ' + city : ''}: âm ${l.lunarDay}/${l.lunarMonth}, cần ${d}/${m}`);
    }
    if (vnLunarCalendar({ ...b, province: 'Quảng Trị', city: 'Quảng Trị (cũ)' }).offsetMinutes !== 480) fail('Quảng Trị (cũ) 1969 phải lịch +8');
    if (vnLunarCalendar({ ...b, province: 'Quảng Trị', city: 'Vĩnh Linh (bắc sông Bến Hải)' }).offsetMinutes !== 420) fail('Vĩnh Linh 1969 phải lịch +7');
    if (vnLunarCalendar({ year: 1972, month: 6, day: 1 }).offsetMinutes !== 420) fail('VN chưa chọn tỉnh 1968–1975 phải lịch +7');
  }

  // Tuổi mụ: năm âm HÔM NAY theo lịch VN cho mọi người sinh ở VN. «Hôm nay» = 2/2/2030 trưa giờ VN —
  // đã Tết Canh Tuất ở VN, TQ còn năm Kỷ Dậu (Tết TQ 3/2/2030).
  {
    const tet2030 = new Date(Date.UTC(2030, 1, 2, 5));
    const age = (info: BirthInfo) => generateChart(info, { now: tet2030 }).currentAge;
    const b90 = base(1990, 6, 1), b70 = base(1970, 6, 1);
    if (age(b90) !== 40) fail(`CN sinh 1990, hôm nay 2/2/2030: tuổi ${age(b90)}, cần 40 (TQ chưa Tết)`);
    if (age(vn(b90, NORTH)) !== 41) fail(`VN sinh 1990: tuổi ${age(vn(b90, NORTH))}, cần 41 (Tết VN 2/2/2030)`);
    if (age(vn(b70, SOUTH)) !== 61) fail(`VN miền Nam sinh 1970 (lịch sinh +8): tuổi ${age(vn(b70, SOUTH))}, cần 61`);
    if (age(vn(b70, NORTH)) !== 61) fail(`VN miền Bắc sinh 1970: tuổi ${age(vn(b70, NORTH))}, cần 61`);
    if (age(vn(base(1960, 6, 1), NORTH)) !== 71) fail('VN miền Bắc sinh 1960 (lịch sinh +8): tuổi phải 71');
    if (age(b70) !== 60) fail(`CN sinh 1970: tuổi ${age(b70)}, cần 60`);
    // Sinh 1/2/1985 (VN đã là năm Ất Sửu 1985 từ 21/1; TQ còn Giáp Tý 1984) → hôm nay NOW (2026) tuổi 42 / 43
    if (gen(vn(base(1985, 2, 1), NORTH)).currentAge !== 42) fail('VN sinh 1/2/1985 (năm âm 1985) năm 2026 phải 42 tuổi');
    if (gen(base(1985, 2, 1)).currentAge !== 43) fail('CN sinh 1/2/1985 (năm âm 1984) năm 2026 phải 43 tuổi');
    // Đại hạn hiện tại theo cùng tuổi
    const c = generateChart(vn(b90, NORTH), { now: tet2030 });
    const dx = c.daXians[c.currentDaXianIndex];
    if (c.currentDaXianIndex >= 0 && !(dx.startAge <= 41 && 41 <= dx.endAge)) fail('đại hạn hiện tại phải chứa tuổi 41');
  }

  // Cầu nối iztro cần yearDivide/horoscopeDivide = 'normal' (algorithm.ts đặt tường minh); lệch cấu hình → báo lỗi rõ
  {
    if (astro.getConfig().horoscopeDivide !== 'normal' || astro.getConfig().yearDivide !== 'normal') fail('astro.config phải normal/normal');
    astro.config({ horoscopeDivide: 'exact' });
    try {
      gen(vn(base(2007, 2, 17), NORTH));
      fail('horoscopeDivide=exact: nhánh lịch VN phải ném lỗi');
    } catch (e) {
      if (!String(e).includes('horoscopeDivide')) fail(`lỗi không rõ ràng: ${String(e)}`);
    } finally {
      astro.config({ horoscopeDivide: 'normal' });
    }
  }

  // Ngày 30 VN không có ở tháng tương ứng của lịch TQ → dựng từ năm âm cách 60 năm, phải ra đúng ngày 30
  {
    let found = 0;
    for (let j = jdnFromGregorian(1990, 1, 1); j <= jdnFromGregorian(2050, 12, 31) && found < 3; j++) {
      const g = gregorianFromJdn(j);
      const t = solarToLunarTz(g.year, g.month, g.day, 420);
      if (t.day !== 30 || t.isLeap) continue;
      const cnMonth = lunarMonthTz(t.year, t.month, false, 480);
      if (cnMonth && cnMonth.days === 30) continue;
      found++;
      const c = gen({ ...g, hour: 3, gender: 'female', country: 'VN' });
      if (c.lunarInfo.lunarDay !== 30 || c.lunarInfo.lunarMonth !== t.month || c.lunarInfo.lunarYear !== t.year) fail(`${ymd(g)} ngày 30 VN: ${JSON.stringify(c.lunarInfo)}`);
      // Kiểm độc lập phần an sao: Tử Vi chỉ theo (cục, ngày âm); cung Mệnh chỉ theo (tháng âm, giờ).
      // Tìm lá số Trung Quốc bất kỳ có cùng cục + ngày 30, và cùng tháng + giờ, rồi so.
      let ziweiChecked = false, mingChecked = false;
      for (let y = 1990; y <= 2049 && !(ziweiChecked && mingChecked); y++) {
        const cm = lunarMonthTz(y, t.month, false, 480);
        if (!cm) continue;
        const day = cm.days === 30 ? 30 : 1;
        const s = lunarToSolar(y, t.month, day)!;
        const ref = gen({ ...s, hour: 3, gender: 'female' });
        if (!mingChecked) {
          mingChecked = true;
          if (ref.mingGongBranch !== c.mingGongBranch) fail(`${ymd(g)} ngày 30 VN: cung Mệnh ${c.mingGongBranch} ≠ ${ref.mingGongBranch} (tháng ${t.month}, giờ Mão)`);
        }
        if (day === 30 && ref.wuxingJu === c.wuxingJu) {
          ziweiChecked = true;
          if (ref.ziweiPos !== c.ziweiPos) fail(`${ymd(g)} ngày 30 VN: Tử Vi ở ${c.ziweiPos} ≠ ${ref.ziweiPos} (${ymd(s)}, cục ${c.wuxingJu})`);
        }
      }
      if (!ziweiChecked || !mingChecked) fail(`${ymd(g)}: không tìm được lá số đối chiếu cho ngày 30`);
    }
    if (found === 0) fail('không tìm thấy ca ngày 30 chỉ có ở lịch VN (dữ liệu test lạc hậu?)');
  }
  if (!bad) console.log('  ✅ ngày lệch VN≠CN, Bắc/Nam 1968–1975, 1970, mốc chuyển lịch, tiết khí, ngày 30');
}

/* ── ⑤ chính sách tháng nhuận trên tháng nhuận riêng của VN ─────────── */
{
  console.log('⑤ chính sách tháng nhuận — VN 1985 nhuận tháng 2 (TQ: tháng 2 thường)');
  // 1985-04-10: VN nhuận 2 ngày 21; TQ tháng 2 ngày 21
  const exp: Record<typeof POLICIES[number], [number, boolean]> = {
    split: [3, false], 'next-month': [3, false], 'prev-month': [2, false], 'origin-month': [2, true],
  };
  for (const p of POLICIES) {
    const e = resolveEffectiveLunarDate(1985, 4, 10, p, 420);
    if (e.rawLunarMonth !== -2 || e.rawLunarDay !== 21 || e.lunarMonth !== exp[p][0] || e.isLeapMonth !== exp[p][1]) fail(`VN ${p}: ${JSON.stringify(e)}`);
    const c = resolveEffectiveLunarDate(1985, 4, 10, p);
    if (c.rawLunarMonth !== 2 || c.lunarMonth !== 2 || c.isLeapMonth) fail(`CN ${p}: ${JSON.stringify(c)}`);
    const chart = gen({ year: 1985, month: 4, day: 10, hour: 5, gender: 'female', country: 'VN' }, { leapMonth: p });
    if (chart.lunarInfo.lunarMonth !== exp[p][0] || chart.lunarInfo.isLeapMonth !== exp[p][1]) fail(`VN lá số ${p}: ${JSON.stringify(chart.lunarInfo)}`);
  }
  // split/next-month (→ tháng 3) phải cho cùng lá số với ngày tháng 3 thường cùng ngày 21 của VN
  const viaLeap = gen({ year: 1985, month: 4, day: 10, hour: 5, gender: 'female', country: 'VN' }, { leapMonth: 'next-month' });
  const month3 = lunarToSolarTz(1985, 3, 21, false, 420)!;
  const plain = gen({ ...month3, hour: 5, gender: 'female', country: 'VN' }, { leapMonth: 'next-month' });
  const pal = (c: ZiweiChart) => JSON.stringify(c.palaces.map((p) => [p.name, p.stars.map((s) => s.name)]));
  if (pal(viaLeap) !== pal(plain)) fail('VN nhuận 2 ngày 21 (next-month) phải an sao như 21 tháng 3');
  if (!bad) console.log('  ✅ bốn chính sách nhuận đúng trên tháng nhuận chỉ có ở lịch VN');
}

if (bad) {
  console.error(`\n❌ ${bad} mục không khớp — âm lịch Việt Nam / Trung Quốc sai, lá số người sinh ở VN sẽ lệch ngày âm.`);
  process.exit(1);
}
console.log('\n✅ Tất cả đạt: âm lịch VN theo UTC+7 (đúng miền/thời kỳ), Trung Quốc giữ nguyên lunar-javascript.');

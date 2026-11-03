/**
 * Âm lịch (lịch âm dương kiểu Trung Hoa / Việt Nam) tính theo MÚI GIỜ THAM SỐ — thuần TypeScript, không mạng.
 *
 * Lịch Trung Quốc và lịch Việt Nam dùng cùng một bộ quy tắc, chỉ khác kinh tuyến tính ngày:
 * Trung Quốc UTC+8 (120°E), Việt Nam UTC+7 (105°E). Sóc hoặc trung khí rơi vào khoảng 23:00–24:00 giờ
 * Việt Nam (= 00:00–01:00 giờ Bắc Kinh) thì hai lịch lệch nhau một ngày, có khi lệch cả tháng nhuận.
 *
 * ── Quy tắc (định khí, áp dụng từ lịch Thời Hiến 1645 trở đi) ─────────────────
 *   1. Ngày đầu tháng âm = ngày (theo giờ địa phương của múi giờ lịch) chứa thời điểm sóc (trăng mới).
 *   2. Tháng chứa Đông chí (kinh độ Mặt Trời 270°) là tháng 11.
 *   3. Giữa hai tháng 11 liên tiếp có 13 tháng → năm nhuận; tháng đầu tiên sau tháng 11 không chứa
 *      trung khí (kinh độ Mặt Trời bội của 30°) là tháng nhuận, mang số của tháng liền trước.
 *   «Tháng chứa trung khí» xét theo ngày địa phương: so cung 30° của kinh độ Mặt Trời lúc 0:00 giờ địa
 *   phương của ngày đầu tháng này và ngày đầu tháng sau (như thuật toán Hồ Ngọc Đức).
 *
 * ── Nguồn ─────────────────────────────────────────────────────────────────────
 *   · Hồ Ngọc Đức, «Computing the Vietnamese lunar calendar» / «Thuật toán tính âm lịch»
 *     (bản gốc informatik.uni-leipzig.de/~duc/amlich/, bản sao https://www.xemamlich.uhm.vn/calrules_en.html):
 *     quy tắc 1–3, kinh tuyến 105°E; ví dụ Tết 1985 VN 21/01/1985 vs TQ 20/02/1985, tháng nhuận
 *     21/03–19/04/1985; Tết 2007 VN 17/02 vs TQ 18/02. Cấu trúc hàm convertSolar2Lunar / getLeapMonthOffset
 *     ở đây theo bản của ông, nhưng thay phần thiên văn rút gọn bằng công thức chính xác hơn (dưới).
 *   · Jean Meeus, «Astronomical Algorithms» 2nd ed. (1998): ch. 49 (tuần trăng — đủ 25 số hạng tuần hoàn +
 *     14 số hạng hành tinh), ch. 25 + phụ lục III (VSOP87 rút gọn cho kinh độ Mặt Trời), ch. 22 (chương động).
 *   · ΔT: Espenak & Meeus (2006), «Polynomial expressions for Delta T» (NASA Five Millennium Canon).
 *   Độ chính xác: sóc vài giây – vài chục giây, kinh độ Mặt Trời ~1″ (≈ 25 giây thời gian) — đủ để chỉ
 *   lệch khi sự kiện rơi sát nửa đêm trong khoảng < 1 phút.
 *   Kiểm chứng: với UTC+8 khớp lunar-javascript (lịch TQ mà iztro dùng) từng ngày 1900–2050, xem
 *   scripts/regression/vn-lunar-calendar.test.ts.
 */

const RAD = Math.PI / 180;

// ─── Ngày Julius ──────────────────────────────────────────────────────────────

/** Số ngày Julius (JDN, ngày bắt đầu lúc trưa) của một ngày dương lịch Gregory. */
export function jdnFromGregorian(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

export function gregorianFromJdn(jdn: number): { year: number; month: number; day: number } {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    day: e - Math.floor((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * Math.floor(m / 10),
    year: 100 * b + d - 4800 + Math.floor(m / 10),
  };
}

// ─── ΔT = TT − UT (giây), Espenak & Meeus 2006 ───────────────────────────────

function deltaTSeconds(decimalYear: number): number {
  const y = decimalYear;
  if (y < 1860) { const u = (y - 1820) / 100; return -20 + 32 * u * u; }
  if (y < 1900) { const t = y - 1860; return 7.62 + 0.5737 * t - 0.251754 * t ** 2 + 0.01680668 * t ** 3 - 0.0004473624 * t ** 4 + t ** 5 / 233174; }
  if (y < 1920) { const t = y - 1900; return -2.79 + 1.494119 * t - 0.0598939 * t ** 2 + 0.0061966 * t ** 3 - 0.000197 * t ** 4; }
  if (y < 1941) { const t = y - 1920; return 21.2 + 0.84493 * t - 0.0761 * t ** 2 + 0.0020936 * t ** 3; }
  if (y < 1961) { const t = y - 1950; return 29.07 + 0.407 * t - t ** 2 / 233 + t ** 3 / 2547; }
  if (y < 1986) { const t = y - 1975; return 45.45 + 1.067 * t - t ** 2 / 260 - t ** 3 / 718; }
  if (y < 2005) { const t = y - 2000; return 63.86 + 0.3345 * t - 0.060374 * t ** 2 + 0.0017275 * t ** 3 + 0.000651814 * t ** 4 + 0.00002373599 * t ** 5; }
  if (y < 2050) { const t = y - 2000; return 62.92 + 0.32217 * t + 0.005589 * t ** 2; }
  if (y < 2150) { const u = (y - 1820) / 100; return -20 + 32 * u * u - 0.5628 * (2150 - y); }
  const u = (y - 1820) / 100; return -20 + 32 * u * u;
}

function deltaTDays(jd: number): number {
  return deltaTSeconds(2000 + (jd - 2451545) / 365.25) / 86400;
}

// ─── Sóc (Meeus ch. 49) ───────────────────────────────────────────────────────

/** JDE (giờ động lực TT) của sóc thứ k; k = 0 là sóc 6/1/2000. */
function newMoonJde(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T, T3 = T2 * T, T4 = T3 * T;
  let jde = 2451550.09766 + 29.530588861 * k + 0.00015437 * T2 - 0.00000015 * T3 + 0.00000000073 * T4;
  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const M = (2.5534 + 29.1053567 * k - 0.0000014 * T2 - 0.00000011 * T3) * RAD;
  const Mp = (201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T4) * RAD;
  const F = (160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T4) * RAD;
  const Om = (124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3) * RAD;
  const s = Math.sin;
  jde +=
    -0.4072 * s(Mp)
    + 0.17241 * E * s(M)
    + 0.01608 * s(2 * Mp)
    + 0.01039 * s(2 * F)
    + 0.00739 * E * s(Mp - M)
    - 0.00514 * E * s(Mp + M)
    + 0.00208 * E * E * s(2 * M)
    - 0.00111 * s(Mp - 2 * F)
    - 0.00057 * s(Mp + 2 * F)
    + 0.00056 * E * s(2 * Mp + M)
    - 0.00042 * s(3 * Mp)
    + 0.00042 * E * s(M + 2 * F)
    + 0.00038 * E * s(M - 2 * F)
    - 0.00024 * E * s(2 * Mp - M)
    - 0.00017 * s(Om)
    - 0.00007 * s(Mp + 2 * M)
    + 0.00004 * s(2 * Mp - 2 * F)
    + 0.00004 * s(3 * M)
    + 0.00003 * s(Mp + M - 2 * F)
    + 0.00003 * s(2 * Mp + 2 * F)
    - 0.00003 * s(Mp + M + 2 * F)
    + 0.00003 * s(Mp - M + 2 * F)
    - 0.00002 * s(Mp - M - 2 * F)
    - 0.00002 * s(3 * Mp + M)
    + 0.00002 * s(4 * Mp);
  const A: Array<[number, number, number, number]> = [
    // [hệ số, A0, hệ số k, hệ số T²]
    [0.000325, 299.77, 0.107408, -0.009173],
    [0.000165, 251.88, 0.016321, 0],
    [0.000164, 251.83, 26.651886, 0],
    [0.000126, 349.42, 36.412478, 0],
    [0.00011, 84.66, 18.206239, 0],
    [0.000062, 141.74, 53.303771, 0],
    [0.00006, 207.14, 2.453732, 0],
    [0.000056, 154.84, 7.30686, 0],
    [0.000047, 34.52, 27.261239, 0],
    [0.000042, 207.19, 0.121824, 0],
    [0.00004, 291.34, 1.844379, 0],
    [0.000037, 161.72, 24.198154, 0],
    [0.000035, 239.56, 25.513099, 0],
    [0.000023, 331.55, 3.592518, 0],
  ];
  for (const [c, a0, ak, at2] of A) jde += c * s((a0 + ak * k + at2 * T2) * RAD);
  return jde;
}

/** Thời điểm sóc thứ k theo JD (UT). k = 0 là sóc 6/1/2000; k âm = trước đó. */
export function newMoonUt(k: number): number {
  const jde = newMoonJde(k);
  return jde - deltaTDays(jde);
}

/** Ngày địa phương (JDN) chứa sóc thứ k theo offset UTC (phút). */
function newMoonDay(k: number, offsetMinutes: number): number {
  return Math.floor(newMoonUt(k) + 0.5 + offsetMinutes / 1440);
}

// ─── Kinh độ biểu kiến Mặt Trời (VSOP87 rút gọn, Meeus phụ lục III) ────────────

type Vsop = ReadonlyArray<readonly [number, number, number]>;
const L0: Vsop = [
  [175347046, 0, 0], [3341656, 4.6692568, 6283.07585], [34894, 4.6261, 12566.1517], [3497, 2.7441, 5753.3849],
  [3418, 2.8289, 3.5231], [3136, 3.6277, 77713.7715], [2676, 4.4181, 7860.4194], [2343, 6.1352, 3930.2097],
  [1324, 0.7425, 11506.7698], [1273, 2.0371, 529.691], [1199, 1.1096, 1577.3435], [990, 5.233, 5884.927],
  [902, 2.045, 26.298], [857, 3.508, 398.149], [780, 1.179, 5223.694], [753, 2.533, 5507.553],
  [505, 4.583, 18849.228], [492, 4.205, 775.523], [357, 2.92, 0.067], [317, 5.849, 11790.629],
  [284, 1.899, 796.298], [271, 0.315, 10977.079], [243, 0.345, 5486.778], [206, 4.806, 2544.314],
  [205, 1.869, 5573.143], [202, 2.458, 6069.777], [156, 0.833, 213.299], [132, 3.411, 2942.463],
  [126, 1.083, 20.775], [115, 0.645, 0.98], [103, 0.636, 4694.003], [102, 0.976, 15720.839],
  [102, 4.267, 7.114], [99, 6.21, 2146.17], [98, 0.68, 155.42], [86, 5.98, 161000.69],
  [85, 1.3, 6275.96], [85, 3.67, 71430.7], [80, 1.81, 17260.15], [79, 3.04, 12036.46],
  [75, 1.76, 5088.63], [74, 3.5, 3154.69], [74, 4.68, 801.82], [70, 0.83, 9437.76],
  [62, 3.98, 8827.39], [61, 1.82, 7084.9], [57, 2.78, 6286.6], [56, 4.39, 14143.5],
  [56, 3.47, 6279.55], [52, 0.19, 12139.55], [52, 1.33, 1748.02], [51, 0.28, 5856.48],
  [49, 0.49, 1194.45], [41, 5.37, 8429.24], [41, 2.4, 19651.05], [39, 6.17, 10447.39],
  [37, 6.04, 10213.29], [37, 2.57, 1059.38], [36, 1.71, 2352.87], [36, 1.78, 6812.77],
  [33, 0.59, 17789.85], [30, 0.44, 83996.85], [30, 2.74, 1349.87], [25, 3.16, 4690.48],
];
const L1: Vsop = [
  [628331966747, 0, 0], [206059, 2.678235, 6283.07585], [4303, 2.6351, 12566.1517], [425, 1.59, 3.523],
  [119, 5.796, 26.298], [109, 2.966, 1577.344], [93, 2.59, 18849.23], [72, 1.14, 529.69],
  [68, 1.87, 398.15], [67, 4.41, 5507.55], [59, 2.89, 5223.69], [56, 2.17, 155.42],
  [45, 0.4, 796.3], [36, 0.47, 775.52], [29, 2.65, 7.11], [21, 5.34, 0.98],
  [19, 1.85, 5486.78], [19, 4.97, 213.3], [17, 2.99, 6275.96], [16, 0.03, 2544.31],
  [16, 1.43, 2146.17], [15, 1.21, 10977.08], [12, 2.83, 1748.02], [12, 3.26, 5088.63],
  [12, 5.27, 1194.45], [12, 2.08, 4694], [11, 0.77, 553.57], [10, 1.3, 6286.6],
  [10, 4.24, 1349.87], [9, 2.7, 242.73], [9, 5.64, 951.72], [8, 5.3, 2352.87],
  [6, 2.65, 9437.76], [6, 4.67, 4690.48],
];
const L2: Vsop = [
  [52919, 0, 0], [8720, 1.0721, 6283.0758], [309, 0.867, 12566.152], [27, 0.05, 3.52],
  [16, 5.19, 26.3], [16, 3.68, 155.42], [10, 0.76, 18849.23], [9, 2.06, 77713.77],
  [7, 0.83, 775.52], [5, 4.66, 1577.34], [4, 1.03, 7.11], [4, 3.44, 5573.14],
  [3, 5.14, 796.3], [3, 6.05, 5507.55], [3, 1.19, 242.73], [3, 6.12, 529.69],
  [3, 0.31, 398.15], [3, 2.28, 553.57], [2, 4.38, 5223.69], [2, 3.75, 0.98],
];
const L3: Vsop = [
  [289, 5.844, 6283.076], [35, 0, 0], [17, 5.49, 12566.15], [3, 5.2, 155.42],
  [1, 4.72, 3.52], [1, 5.3, 18849.23], [1, 5.97, 242.73],
];
const L4: Vsop = [[114, 3.142, 0], [8, 4.13, 6283.08], [1, 3.84, 12566.15]];
const L5: Vsop = [[1, 3.14, 0]];
const R0: Vsop = [
  [100013989, 0, 0], [1670700, 3.0984635, 6283.07585], [13956, 3.05525, 12566.1517], [3084, 5.1985, 77713.7715],
  [1628, 1.1739, 5753.3849], [1576, 2.8469, 7860.4194], [925, 5.453, 11506.77], [542, 4.564, 3930.21],
  [472, 3.661, 5884.927], [346, 0.964, 5507.553], [329, 5.9, 5223.694], [307, 0.299, 5573.143],
  [243, 4.273, 11790.629], [212, 5.847, 1577.344], [186, 5.022, 10977.079], [175, 3.012, 18849.228],
  [110, 5.055, 5486.778], [98, 0.89, 6069.78], [86, 5.69, 15720.84], [86, 1.27, 161000.69],
  [65, 0.27, 17260.15], [63, 0.92, 529.69], [57, 2.01, 83996.85], [56, 5.24, 71430.7],
  [49, 3.25, 2544.31], [47, 2.58, 775.52], [45, 5.54, 9437.76], [43, 6.01, 6275.96],
  [39, 5.36, 4694], [38, 2.39, 8827.39], [37, 0.83, 19651.05], [37, 4.9, 12139.55],
  [36, 1.67, 12036.46], [35, 1.84, 2942.46], [33, 0.24, 7084.9], [32, 0.18, 5088.63],
  [32, 1.78, 398.15], [28, 1.21, 6286.6], [28, 1.9, 6279.55], [26, 4.59, 10447.39],
];
const R1: Vsop = [
  [103019, 1.10749, 6283.07585], [1721, 1.0644, 12566.1517], [702, 3.142, 0], [32, 1.02, 18849.23],
  [31, 2.84, 5507.55], [25, 1.32, 5223.69], [18, 1.42, 1577.34], [10, 5.91, 10977.08],
  [9, 1.42, 6275.96], [9, 0.27, 5486.78],
];
const R2: Vsop = [
  [4359, 5.7846, 6283.0758], [124, 5.579, 12566.152], [12, 3.14, 0], [9, 3.63, 77713.77],
  [6, 1.87, 5573.14], [3, 5.47, 18849.23],
];

function vsopSum(series: Vsop, tau: number): number {
  let sum = 0;
  for (const [a, b, c] of series) sum += a * Math.cos(b + c * tau);
  return sum;
}

/** Kinh độ biểu kiến Mặt Trời (độ, 0–360) tại JDE (giờ TT). */
function apparentSunLongitude(jde: number): number {
  const tau = (jde - 2451545) / 365250;
  const L = (vsopSum(L0, tau) + vsopSum(L1, tau) * tau + vsopSum(L2, tau) * tau ** 2
    + vsopSum(L3, tau) * tau ** 3 + vsopSum(L4, tau) * tau ** 4 + vsopSum(L5, tau) * tau ** 5) / 1e8;
  const R = (vsopSum(R0, tau) + vsopSum(R1, tau) * tau + vsopSum(R2, tau) * tau ** 2) / 1e8;
  const T = tau * 10;
  // Địa tâm, chuyển FK5 (−0.09033″), chương động Δψ (Meeus 22, 4 số hạng chính), quang sai
  let lon = L / RAD + 180;
  const Om = (125.04452 - 1934.136261 * T) * RAD;
  const Ls = (280.4665 + 36000.7698 * T) * RAD;
  const Lm = (218.3165 + 481267.8813 * T) * RAD;
  const dPsi = -17.2 * Math.sin(Om) - 1.32 * Math.sin(2 * Ls) - 0.23 * Math.sin(2 * Lm) + 0.21 * Math.sin(2 * Om);
  lon += (-0.09033 + dPsi - 20.4898 / R) / 3600;
  return ((lon % 360) + 360) % 360;
}

/** Cung 30° (0–11) của kinh độ Mặt Trời lúc 0:00 giờ địa phương của ngày JDN. 9 = cung chứa Đông chí. */
function sunSectorAtLocalMidnight(jdn: number, offsetMinutes: number): number {
  const jdUt = jdn - 0.5 - offsetMinutes / 1440;
  return Math.floor(apparentSunLongitude(jdUt + deltaTDays(jdUt)) / 30);
}

// ─── Dựng lịch ───────────────────────────────────────────────────────────────

/** k (Meeus) của sóc gần JDN cho trước (chỉ là ước lượng ±1). */
function approxK(jdn: number): number {
  return Math.round((jdn - 2451550.1) / 29.530588861);
}

/** Ngày đầu tháng chứa ngày JDN (tháng = khoảng giữa hai ngày sóc liên tiếp). Trả về [k, startJdn]. */
function monthStartContaining(jdn: number, offsetMinutes: number): [number, number] {
  let k = approxK(jdn) + 1;
  while (newMoonDay(k, offsetMinutes) > jdn) k--;
  while (newMoonDay(k + 1, offsetMinutes) <= jdn) k++;
  return [k, newMoonDay(k, offsetMinutes)];
}

/** [k, JDN] ngày đầu tháng 11 âm (tháng chứa Đông chí) của năm dương lịch `year`. */
function month11(year: number, offsetMinutes: number): [number, number] {
  // Đông chí luôn trong 20–23/12; tháng 11 là tháng chứa 31/12 hoặc tháng trước đó.
  const [k, start] = monthStartContaining(jdnFromGregorian(year, 12, 31), offsetMinutes);
  if (sunSectorAtLocalMidnight(start, offsetMinutes) >= 9) return [k - 1, newMoonDay(k - 1, offsetMinutes)];
  return [k, start];
}

export interface LunarMonthEntry {
  /** Năm âm lịch (năm có tháng Giêng chứa tháng này) */
  year: number;
  month: number;
  isLeap: boolean;
  /** JDN ngày mùng 1 */
  startJdn: number;
  /** Số ngày (29 / 30) */
  days: number;
}

/**
 * Các tháng âm từ tháng 11 của năm dương `y − 1` (gồm) tới tháng 11 của năm dương `y` (không gồm) — «tuế» y.
 */
function buildSui(y: number, offsetMinutes: number): LunarMonthEntry[] {
  const [ka, a11] = month11(y - 1, offsetMinutes);
  const [kb, b11] = month11(y, offsetMinutes);
  const n = kb - ka; // 12 hoặc 13
  const starts: number[] = [];
  for (let i = 0; i <= n; i++) starts.push(i === 0 ? a11 : i === n ? b11 : newMoonDay(ka + i, offsetMinutes));
  let leapIdx = -1;
  if (n === 13) {
    for (let i = 1; i < n; i++) {
      if (sunSectorAtLocalMidnight(starts[i], offsetMinutes) === sunSectorAtLocalMidnight(starts[i + 1], offsetMinutes)) {
        leapIdx = i;
        break;
      }
    }
    // Không xảy ra với quy tắc trên trong thực tế; phòng hờ để không trả lịch thiếu tháng nhuận
    if (leapIdx < 0) throw new Error(`lunar-calendar-tz: không tìm thấy tháng nhuận trong tuế ${y} (UTC${offsetMinutes / 60})`);
  }
  const months: LunarMonthEntry[] = [];
  let seenFirstMonth = false;
  for (let i = 0; i < n; i++) {
    const shifted = leapIdx >= 0 && i >= leapIdx ? i - 1 : i;
    const month = ((10 + shifted) % 12) + 1;
    const isLeap = i === leapIdx;
    if (month === 1 && !isLeap) seenFirstMonth = true;
    months.push({ year: seenFirstMonth ? y : y - 1, month, isLeap, startJdn: starts[i], days: starts[i + 1] - starts[i] });
  }
  return months;
}

const suiCache = new Map<string, LunarMonthEntry[]>();

function sui(y: number, offsetMinutes: number): LunarMonthEntry[] {
  const key = `${offsetMinutes}:${y}`;
  let months = suiCache.get(key);
  if (!months) {
    months = buildSui(y, offsetMinutes);
    if (suiCache.size > 2000) suiCache.clear();
    suiCache.set(key, months);
  }
  return months;
}

export interface TzLunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
  /** Số ngày của tháng âm này */
  monthDays: number;
}

/** Dương → âm theo lịch dùng múi giờ `offsetMinutes` (480 = lịch Trung Quốc, 420 = lịch Việt Nam). */
export function solarToLunarTz(year: number, month: number, day: number, offsetMinutes: number): TzLunarDate {
  const jdn = jdnFromGregorian(year, month, day);
  let months = sui(year + 1, offsetMinutes);
  if (jdn < months[0].startJdn) months = sui(year, offsetMinutes);
  for (let i = months.length - 1; i >= 0; i--) {
    const m = months[i];
    if (jdn >= m.startJdn) {
      return { year: m.year, month: m.month, day: jdn - m.startJdn + 1, isLeap: m.isLeap, monthDays: m.days };
    }
  }
  // Không tới được: tuế bắt đầu bằng tháng 11 nên mọi ngày ≥ months[0].startJdn
  throw new Error(`lunar-calendar-tz: không định vị được ${year}-${month}-${day}`);
}

/** Tháng âm (năm, tháng, nhuận) theo múi giờ; không tồn tại → undefined. */
export function lunarMonthTz(year: number, month: number, isLeap: boolean, offsetMinutes: number): LunarMonthEntry | undefined {
  // Tháng 1–10 của năm âm Y nằm trong tuế Y; tháng 11–12 nằm trong tuế Y + 1
  const candidates = month >= 11 ? [...sui(year + 1, offsetMinutes), ...sui(year, offsetMinutes)] : sui(year, offsetMinutes);
  return candidates.find((m) => m.year === year && m.month === month && m.isLeap === isLeap);
}

/** Âm → dương; ngày không tồn tại (tháng nhuận không có / ngày 30 của tháng thiếu) → null. */
export function lunarToSolarTz(
  year: number, month: number, day: number, isLeap: boolean, offsetMinutes: number,
): { year: number; month: number; day: number } | null {
  const m = lunarMonthTz(year, month, isLeap, offsetMinutes);
  if (!m || !Number.isInteger(day) || day < 1 || day > m.days) return null;
  return gregorianFromJdn(m.startJdn + day - 1);
}

/** Tháng nhuận (1–12) của năm âm; 0 nếu không nhuận. */
export function leapMonthTz(year: number, offsetMinutes: number): number {
  for (const m of [...sui(year, offsetMinutes), ...sui(year + 1, offsetMinutes)]) {
    if (m.isLeap && m.year === year) return m.month;
  }
  return 0;
}

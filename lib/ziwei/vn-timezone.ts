/**
 * Lịch sử múi giờ Việt Nam theo vùng — bảng tĩnh, không phụ thuộc ICU của trình duyệt.
 *
 * Người dùng nhập GIỜ ĐỒNG HỒ tại nơi sinh vào lúc sinh. Muốn ra giờ mặt trời thật phải biết
 * đồng hồ khi đó chạy theo múi giờ nào (kinh tuyến chuẩn = offset / 4, xem true-solar-time.ts).
 *
 * ── Nguồn ─────────────────────────────────────────────────────────────────────
 * IANA tzdata (https://github.com/eggert/tz, nhánh main @ c53fe556, tương ứng 2026a — cũng là
 * bản tz trong Node 26 / ICU 78.3 dùng để kiểm chéo):
 *   · file `asia`, Zone Asia/Ho_Chi_Minh (miền Nam; cả nước từ 1975-06-13);
 *   · file `backzone`, Zone Asia/Hanoi (miền Bắc trước 1970; bản build mặc định của tzdb/ICU
 *     KHÔNG có zone này — Hà Nội từ 1970 được trỏ về Asia/Bangkok, luôn +07, xem zone1970.tab).
 * tzdata dẫn nguồn chính: Trần Tiến Bình, «Lịch Việt Nam: thế kỷ XX-XXI (1901-2100)», NXB Văn Hoá -
 * Thông Tin, 2005, tr. 49-50; Việt Nam Dân Quốc Công Báo số 1 (29/9/1945); Dụ số 46 ngày 25/6/1955
 * (Công Báo VN số 92); Sắc lệnh 362-TTP ngày 30/12/1959 (Công Báo VNCH 2/1/1960).
 *
 *   Zone Asia/Ho_Chi_Minh 7:06:30 LMT 1906 Jul 1 | 7:06:30 PLMT 1911 May 1 | 7:00 1942 Dec 31 23:00
 *        | 8:00 1945 Mar 14 23:00 | 9:00 1945 Sep 1 24:00 | 7:00 1947 Apr 1 | 8:00 1955 Jul 1 01:00
 *        | 7:00 1959 Dec 31 23:00 | 8:00 1975 Jun 13 | 7:00
 *   Zone Asia/Hanoi (backzone) 7:03:24 LMT 1906 Jul 1 | 7:06:30 PLMT 1911 May 1 | 7:00 1942 Dec 31 23:00
 *        | 8:00 1945 Mar 14 23:00 | 9:00 1945 Sep 2 | 7:00 1947 Apr 1 | 8:00 1954 Oct | 7:00
 * (Mốc UNTIL tính theo giờ đồng hồ của giai đoạn đang kết thúc.)
 *
 * ── Điểm không chắc chắn (giữ nguyên như tzdata, không tự đoán thêm) ─────────
 *   · Trước 1906-07-01 (LMT): tzdata ghi giờ trung bình địa phương của riêng Sài Gòn/Hà Nội. Ở đây hiểu
 *     là giờ trung bình ĐỊA PHƯƠNG NƠI SINH (offset = kinh độ × 4) → không hiệu chỉnh kinh độ.
 *   · 1906–1911 PLMT (giờ Phù Liễn) = +7:06:30.13; dùng +7:06:30 như tzdata.
 *   · 1947-04-01 → +08 là «Đông Dương thuộc Pháp kiểm soát»; vùng do Việt Minh kiểm soát có thể vẫn
 *     dùng +07 — tzdata không ghi, ở đây theo tzdata (+08 cho cả hai miền).
 *   · Miền Bắc về +07 «tháng 10/1954, không rõ ngày giờ» (Trần Tiến Bình); tzdata dùng 1954-10-01 00:00.
 *     Hải Phòng do Pháp giữ tới 5/1955 — không có dữ liệu riêng, xếp theo miền Bắc.
 *   · Miền Nam 1960–1975: tzdata ghi chú đồng hồ ở các vùng đổi chủ trong chiến tranh có thể khác,
 *     không có chi tiết. Sau 30/4/1975 miền Nam vẫn +08 tới 1975-06-13 00:00.
 *   · Ranh giới hai miền 1954–1975 là sông Bến Hải (~vĩ tuyến 17): Vĩnh Linh (Quảng Trị) ở phía Bắc;
 *     phần còn lại của Quảng Trị trở vào là miền Nam (xem vn-places.ts).
 *
 * ── Giờ đồng hồ rơi vào lúc chuyển múi giờ ───────────────────────────────────
 * Theo quy ước «compatible» (RFC 5545 / Temporal): giờ trùng hai lần (lùi đồng hồ) lấy lần đầu,
 * giờ không tồn tại (tiến đồng hồ) đọc theo offset trước mốc. Cả hai trường hợp đều dùng offset CŨ,
 * và được báo ra qua `transition` để giao diện cảnh báo.
 */

export type VnRegion = 'north' | 'south';

export interface VnZonePeriod {
  /** Offset UTC (phút, đông dương). null = giờ trung bình địa phương nơi sinh (LMT). */
  offsetMinutes: number | null;
  /** Hết hiệu lực từ giờ đồng hồ này (theo offset của chính giai đoạn này); null = đến nay. */
  until: readonly [year: number, month: number, day: number, hour: number, minute: number] | null;
  /** Ghi chú tiếng Việt cho giai đoạn khác UTC+7 (hiển thị trên form). */
  note?: string;
}

const COMMON_BEFORE_1947: readonly VnZonePeriod[] = [
  { offsetMinutes: null, until: [1906, 7, 1, 0, 0], note: 'Trước 1/7/1906 chưa có giờ chuẩn — tính theo giờ trung bình địa phương nơi sinh' },
  { offsetMinutes: 426.5, until: [1911, 5, 1, 0, 0], note: '1906–1911 Đông Dương dùng giờ Phù Liễn (UTC+7:06:30)' },
  { offsetMinutes: 420, until: [1942, 12, 31, 23, 0] },
  { offsetMinutes: 480, until: [1945, 3, 14, 23, 0], note: '31/12/1942–14/3/1945 Đông Dương dùng UTC+8' },
  { offsetMinutes: 540, until: [1945, 9, 2, 0, 0], note: '15/3/1945–1/9/1945 dùng giờ Tokyo (UTC+9)' },
  { offsetMinutes: 420, until: [1947, 4, 1, 0, 0] },
];

const FRENCH_UTC8_NOTE = 'Từ 1/4/1947 vùng Pháp kiểm soát dùng UTC+8 (vùng kháng chiến có thể vẫn dùng UTC+7 — chưa có tư liệu)';

export const VN_ZONE_HISTORY: Record<VnRegion, readonly VnZonePeriod[]> = {
  // backzone Asia/Hanoi; từ 1970 trùng Asia/Bangkok (+07)
  north: [
    ...COMMON_BEFORE_1947,
    { offsetMinutes: 480, until: [1954, 10, 1, 0, 0], note: FRENCH_UTC8_NOTE },
    { offsetMinutes: 420, until: null },
  ],
  // asia Asia/Ho_Chi_Minh
  south: [
    ...COMMON_BEFORE_1947,
    { offsetMinutes: 480, until: [1955, 7, 1, 1, 0], note: FRENCH_UTC8_NOTE + '; miền Nam giữ UTC+8 tới 1/7/1955' },
    { offsetMinutes: 420, until: [1959, 12, 31, 23, 0] },
    { offsetMinutes: 480, until: [1975, 6, 13, 0, 0], note: 'Miền Nam (Việt Nam Cộng hòa) dùng UTC+8 từ 31/12/1959 đến 13/6/1975' },
    { offsetMinutes: 420, until: null },
  ],
};

export interface VnZoneResult {
  /** Offset UTC áp dụng cho giờ đồng hồ đã nhập (phút). */
  offsetMinutes: number;
  /** true = giai đoạn LMT, offset chính là kinh độ nơi sinh × 4. */
  localMeanTime: boolean;
  note?: string;
  /** Giờ nhập nằm trong khoảng chuyển múi giờ: lặp hai lần hoặc không tồn tại (đã đọc theo offset cũ). */
  transition?: 'ambiguous' | 'nonexistent';
}

/** Phút kể từ epoch của giờ đồng hồ «ngây thơ» (không múi giờ) — chỉ dùng để so sánh. */
function wallMinutes(y: number, mo: number, d: number, h: number, mi: number): number {
  return Date.UTC(y, mo - 1, d, h, mi) / 60000;
}

/**
 * Offset UTC của giờ đồng hồ tại Việt Nam theo vùng (trước 1975) và ngày giờ sinh.
 * `longitude` chỉ dùng cho giai đoạn LMT trước 1906 (offset = kinh độ × 4).
 */
export function vnUtcOffset(
  region: VnRegion,
  longitude: number,
  year: number, month: number, day: number, hour: number, minute: number,
): VnZoneResult {
  const periods = VN_ZONE_HISTORY[region];
  const lmt = longitude * 4;
  const w = wallMinutes(year, month, day, hour, minute);
  for (let i = 0; i < periods.length; i++) {
    const p = periods[i];
    const off = p.offsetMinutes ?? lmt;
    const result: VnZoneResult = { offsetMinutes: off, localMeanTime: p.offsetMinutes === null, ...(p.note ? { note: p.note } : {}) };
    if (!p.until) return result;
    const next = periods[i + 1];
    const nextOff = next.offsetMinutes ?? lmt;
    const until = wallMinutes(...p.until);
    const gap = nextOff - off;
    // compatible: giờ trùng / không tồn tại đều đọc theo offset cũ
    if (w < until + Math.max(0, gap)) {
      if (gap < 0 && w >= until + gap) result.transition = 'ambiguous';
      else if (gap > 0 && w >= until) result.transition = 'nonexistent';
      return result;
    }
  }
  // không tới được: giai đoạn cuối luôn until = null
  return { offsetMinutes: 420, localMeanTime: false };
}

/** «UTC+7», «UTC+8», «UTC+7:06:30»; LMT trả về «giờ địa phương». */
export function formatUtcOffset(z: Pick<VnZoneResult, 'offsetMinutes' | 'localMeanTime'>): string {
  if (z.localMeanTime) return 'giờ trung bình địa phương';
  const total = Math.round(Math.abs(z.offsetMinutes) * 60);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const sign = z.offsetMinutes < 0 ? '-' : '+';
  return `UTC${sign}${h}${m || s ? `:${String(m).padStart(2, '0')}` : ''}${s ? `:${String(s).padStart(2, '0')}` : ''}`;
}

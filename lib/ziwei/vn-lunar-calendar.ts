/**
 * Âm lịch Việt Nam theo miền và thời kỳ: tháng âm của người sinh ở Việt Nam tính theo múi giờ nào.
 *
 * Lịch âm chỉ khác nhau ở kinh tuyến tính ngày sóc / trung khí (lunar-calendar-tz.ts):
 *   UTC+8 (120°E) = lịch Trung Quốc — chính là lịch lunar-javascript / iztro đang dùng;
 *   UTC+7 (105°E) = lịch Việt Nam hiện hành.
 *
 * ── Quy tắc áp dụng (theo ngày dương của lá số, tức «排盘日» sau khi đổi ngày giờ Tý) ──
 *   · Miền Bắc: trước 1/1/1968 → UTC+8; từ 1/1/1968 → UTC+7.
 *   · Miền Nam: trước 13/6/1975 → UTC+8; từ 13/6/1975 → UTC+7.
 *   · Chưa chọn tỉnh (form chỉ cho phép khi sinh từ 13/6/1975): trước 1968 → UTC+8 (hai miền như nhau);
 *     từ 1968 → UTC+7 (lịch nhà nước; ca 1968–6/1975 không chọn tỉnh chỉ có ở dữ liệu cũ / API).
 *   Miền lấy theo resolveVnPlace(province, city).region (vn-places.ts, ranh giới sông Bến Hải).
 *
 * ── Nguồn ─────────────────────────────────────────────────────────────────────
 *   · Quyết định ngày 8/8/1967 của Hội đồng Chính phủ VNDCCH (thường dẫn là 121-CP — số hiệu chưa đối chiếu
 *     bản gốc): đổi giờ chuẩn UTC+8 → UTC+7 và dùng lịch âm do Nha Khí tượng lập theo UTC+7 (Wikipedia «Vietnamese calendar», mục Historical developments,
 *     dẫn Helmer Aslaksen, «The Mathematics of the Chinese Calendar», tr. 29–30: «North and South Vietnam
 *     celebrated Tết 1968 on different days»).
 *   · Mốc 1/1/1968: Gramps PR #2374 (bảng lịch VN tính bằng thuật toán Hồ Ngọc Đức, «UTC+8 before 1968-01-01
 *     and UTC+7 from then on», đối chiếu từng ngày); lichamviet.com «Vietnamese vs Chinese Lunar Calendar»
 *     («1968 was the first year North Vietnam used a calendar computed for UTC+7»; Tết 1968 VN 29/1 vs TQ 30/1).
 *   · Miền Nam dùng UTC+8 tới sau chiến tranh (Wikipedia: «Southern Vietnam would later join this change at
 *     the end of the Vietnam War in 1975»; Tết Mậu Thân miền Nam = 30/1/1968 = ngày Tết TQ). Mốc 13/6/1975 là
 *     ngày miền Nam chuyển giờ đồng hồ sang UTC+7 (tzdata Asia/Ho_Chi_Minh, xem vn-timezone.ts).
 *     Lịch UTC+7 và UTC+8 trùng nhau hoàn toàn từ 12/4/1975 tới 1/9/1978 (kiểm bằng lunar-calendar-tz),
 *     nên chọn mốc nào trong khoảng đó (30/4/1975, 13/6/1975, Tết Bính Thìn 31/1/1976) đều ra cùng kết quả.
 *   · Hồ Ngọc Đức, «Computing the Vietnamese lunar calendar» (https://www.xemamlich.uhm.vn/calrules_en.html):
 *     lịch VN theo kinh tuyến 105°E; Tết 1985 VN 21/1 vs TQ 20/2; Tết 2007 VN 17/2 vs TQ 18/2.
 *
 * ── Điểm KHÔNG chắc chắn ──────────────────────────────────────────────────────
 *   · Trước 1945, triều Nguyễn dùng lịch Hiệp Kỷ (theo phép Thời Hiến nhà Thanh); Wikipedia (dẫn Selin 2008,
 *     tr. 356–359) ghi từ 1841 Hiệp Kỷ có lúc khác lịch Thời Hiến do khác kinh độ — kinh tuyến cụ thể và các
 *     ngày khác không có dữ liệu ở đây. Ta dùng lịch Trung Quốc (UTC+8) như Hồ Ngọc Đức / Gramps; người sinh
 *     trước 1945 ở VN có thể lệch ở vài ngày sóc sát nửa đêm.
 *   · 1945–1967 miền Bắc / 1954–1975 miền Nam: coi như dùng lịch Trung Quốc (UTC+8); nguồn trên chỉ khẳng
 *     định gián tiếp (miền Bắc «đổi sang» UTC+7 năm 1967–1968, miền Nam đón Tết 1968 cùng ngày với TQ).
 *   · Vùng giải phóng ở miền Nam 1968–1975 có thể đã theo lịch miền Bắc (Tết Mậu Thân) — không xử lý.
 *   · Các tháng lunar-javascript hiệu chỉnh theo lịch sử TQ (1914-11, 1916-02, 1920-11 — bảng SB của 寿星万年历)
 *     nằm trong giai đoạn UTC+8 nên vẫn đi theo lunar-javascript như HEAD.
 */
import { resolveVnPlace } from './vn-places';
import type { VnRegion } from './vn-timezone';

export const CN_LUNAR_OFFSET_MINUTES = 480;
export const VN_LUNAR_OFFSET_MINUTES = 420;

/** Ngày đầu tiên miền Bắc dùng âm lịch UTC+7. */
export const VN_NORTH_LUNAR_UTC7_FROM = { year: 1968, month: 1, day: 1 } as const;
/** Ngày đầu tiên miền Nam dùng âm lịch UTC+7 (cùng mốc đổi giờ đồng hồ). */
export const VN_SOUTH_LUNAR_UTC7_FROM = { year: 1975, month: 6, day: 13 } as const;

export interface VnLunarCalendar {
  /** 480 = lịch Trung Quốc (lunar-javascript), 420 = lịch Việt Nam */
  offsetMinutes: typeof CN_LUNAR_OFFSET_MINUTES | typeof VN_LUNAR_OFFSET_MINUTES;
  /** Miền đã dùng để quyết định; undefined = chưa chọn tỉnh */
  region?: VnRegion;
}

function ymd(d: { year: number; month: number; day: number }): number {
  return d.year * 10000 + d.month * 100 + d.day;
}

/** Múi giờ âm lịch cho người sinh ở Việt Nam vào ngày dương (year, month, day). */
export function vnLunarCalendar(info: {
  year: number; month: number; day: number; province?: string; city?: string;
}): VnLunarCalendar {
  const region = resolveVnPlace(info.province, info.city)?.region;
  const from = region === 'south' ? VN_SOUTH_LUNAR_UTC7_FROM : VN_NORTH_LUNAR_UTC7_FROM;
  const offsetMinutes = ymd(info) >= ymd(from) ? VN_LUNAR_OFFSET_MINUTES : CN_LUNAR_OFFSET_MINUTES;
  return region ? { offsetMinutes, region } : { offsetMinutes };
}

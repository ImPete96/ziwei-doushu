import type { VnRegion } from './vn-timezone';

/**
 * Nơi sinh Việt Nam: 34 đơn vị hành chính cấp tỉnh từ 1/7/2025 (6 thành phố trực thuộc trung ương + 28 tỉnh)
 * làm cấp chọn chính; 63 tỉnh/thành cũ đã nhập vào là mục con tùy chọn («Quảng Bình (cũ)») để chính xác hơn
 * về kinh độ và xác định miền trước 1975.
 *
 * NGUỒN ĐƠN VỊ HÀNH CHÍNH (tra 2026-11-03):
 *   · Tên + tỉnh cũ nhập vào: Nghị quyết 202/2025/QH15 (Quốc hội thông qua 12/6/2025; đơn vị mới hoạt động từ
 *     1/7/2025), Điều 1 khoản 1–24 — bản dịch english.luatvietnam.vn/…/resolution-202-2025-qh15-…-402728-d1.html.
 *   · Trung tâm chính trị – hành chính: phương án kèm Nghị quyết 60-NQ/TW (12/4/2025) — NQ 202 không ghi trung tâm;
 *     danh sách theo tienphong.vn/post-1733448.html («Phương án 34 tỉnh, thành phố được BCH Trung ương thông qua»).
 *     Trung tâm ghi «đặt tại tỉnh X (hiện nay)» → dùng toạ độ tỉnh lỵ cũ của tỉnh X.
 *
 * NGUỒN TOẠ ĐỘ (truy vấn 2026-11-03, làm tròn 0,01°): Wikidata P625 của thực thể thành phố/thị xã tỉnh lỵ cũ
 * (https://query.wikidata.org), đối chiếu Wikipedia API prop=coordinates. Ngoại lệ: Hà Nội lấy trung tâm
 * Hoàn Kiếm (21.03, 105.85; Wikidata Q1858 ghi 105.84); Hải Phòng lấy Wikipedia (20.87, 106.68) vì Wikidata
 * Q72818 chỉ ghi thô (20.8, 106.67); Phan Thiết (10.93, 108.10) và Lào Cai (22.48, 103.98) lấy theo trung tâm
 * thành phố trên Wikipedia vì điểm Wikidata lệch về phía ngoài nội thị (Phan Thiết Q25315 108.158 — gần
 * hướng Mũi Né; Lào Cai Q33373 103.995/22.419 — tâm địa giới, vi.wikipedia 103.983/22.420). Sai số 0,01° kinh độ = 2,4 giây giờ mặt trời.
 *
 * `region`: miền theo ranh giới 1954–1975 (sông Bến Hải ~ vĩ tuyến 17) — quyết định lịch sử múi giờ
 * (vn-timezone.ts). Từ Quảng Bình (cũ) trở ra: Bắc; từ Quảng Trị (cũ) trở vào: Nam. Riêng huyện Vĩnh Linh
 * (Quảng Trị cũ) ở bờ bắc sông Bến Hải thuộc miền Bắc → mục con riêng. Tỉnh Quảng Trị mới (= Quảng Bình +
 * Quảng Trị cũ) là đơn vị duy nhất vắt qua ranh giới: khi hai miền khác múi giờ phải chọn mục con
 * (vnPlaceRegions → share.ts vnProvinceRequired).
 *
 * KHOÁ lưu trong form / lịch sử / link chia sẻ: `province` = tên đơn vị (mới, hoặc tên tỉnh cũ của dữ liệu
 * trước đây), `city` = tên mục con ('' = trung tâm hành chính). 63 tên tỉnh cũ vẫn tra được: tên cũ → tỉnh mới
 * + mục con «X (cũ)», cùng toạ độ / miền như trước. 7 tên cũ trùng tên mới (Lào Cai, Bắc Ninh, Quảng Trị,
 * Gia Lai, Tây Ninh, Đồng Tháp, An Giang) được hiểu là đơn vị MỚI (trung tâm hành chính mới).
 * Không trùng khoá Trung Quốc (lib/ziwei/cities.ts toàn chữ Hán) và viPlace() giữ nguyên chuỗi không có
 * chữ Hán, nên mọi chỗ hiển thị bằng viPlace() đều ra đúng tên.
 */

export interface VnLocality {
  name: string;
  latitude: number;
  longitude: number;
  region: VnRegion;
  /** Tỉnh lỵ cũ / địa danh dùng làm toạ độ (chỉ để hiển thị) */
  seat?: string;
}

export interface VnProvince {
  name: string;
  /** Trung tâm hành chính mới dùng làm toạ độ mặc định */
  capital: string;
  latitude: number;
  longitude: number;
  region: VnRegion;
  /** Thành phố trực thuộc trung ương */
  municipality: boolean;
  /** Tỉnh/thành cũ (trước 1/7/2025) đã nhập vào; đơn vị không sáp nhập = [tên cũ của chính nó] */
  formerProvinces: string[];
  /** Mục con tùy chọn: các tỉnh cũ «X (cũ)» (chỉ đơn vị sáp nhập) + địa điểm khác miền (Vĩnh Linh) */
  localities?: VnLocality[];
}

export interface VnFormerProvince {
  name: string;
  /** Tỉnh lỵ cũ */
  capital: string;
  latitude: number;
  longitude: number;
  region: VnRegion;
  /** Đơn vị từ 1/7/2025 */
  now: string;
}

const N: VnRegion = 'north';
const S: VnRegion = 'south';

/** 63 tỉnh/thành trước 1/7/2025 — toạ độ tỉnh lỵ, miền 1954–1975, đơn vị mới (NQ 202/2025/QH15). */
export const VN_FORMER_PROVINCES: VnFormerProvince[] = [
  { name: 'Hà Nội', capital: 'Hà Nội (Hoàn Kiếm)', latitude: 21.03, longitude: 105.85, region: N, now: 'Hà Nội' },
  { name: 'TP. Hồ Chí Minh', capital: 'TP. Hồ Chí Minh (Quận 1)', latitude: 10.78, longitude: 106.70, region: S, now: 'TP. Hồ Chí Minh' },
  { name: 'Hải Phòng', capital: 'Hải Phòng', latitude: 20.87, longitude: 106.68, region: N, now: 'Hải Phòng' },
  { name: 'Đà Nẵng', capital: 'Đà Nẵng', latitude: 16.07, longitude: 108.21, region: S, now: 'Đà Nẵng' },
  { name: 'Cần Thơ', capital: 'Cần Thơ (Ninh Kiều)', latitude: 10.04, longitude: 105.79, region: S, now: 'Cần Thơ' },

  { name: 'An Giang', capital: 'Long Xuyên', latitude: 10.37, longitude: 105.42, region: S, now: 'An Giang' },
  { name: 'Bà Rịa – Vũng Tàu', capital: 'Bà Rịa', latitude: 10.50, longitude: 107.17, region: S, now: 'TP. Hồ Chí Minh' },
  { name: 'Bắc Giang', capital: 'Bắc Giang', latitude: 21.27, longitude: 106.19, region: N, now: 'Bắc Ninh' },
  { name: 'Bắc Kạn', capital: 'Bắc Kạn', latitude: 22.15, longitude: 105.84, region: N, now: 'Thái Nguyên' },
  { name: 'Bạc Liêu', capital: 'Bạc Liêu', latitude: 9.28, longitude: 105.72, region: S, now: 'Cà Mau' },
  { name: 'Bắc Ninh', capital: 'Bắc Ninh', latitude: 21.19, longitude: 106.08, region: N, now: 'Bắc Ninh' },
  { name: 'Bến Tre', capital: 'Bến Tre', latitude: 10.23, longitude: 106.38, region: S, now: 'Vĩnh Long' },
  { name: 'Bình Định', capital: 'Quy Nhơn', latitude: 13.77, longitude: 109.23, region: S, now: 'Gia Lai' },
  { name: 'Bình Dương', capital: 'Thủ Dầu Một', latitude: 11.00, longitude: 106.66, region: S, now: 'TP. Hồ Chí Minh' },
  { name: 'Bình Phước', capital: 'Đồng Xoài', latitude: 11.52, longitude: 106.85, region: S, now: 'Đồng Nai' },
  { name: 'Bình Thuận', capital: 'Phan Thiết', latitude: 10.93, longitude: 108.10, region: S, now: 'Lâm Đồng' },
  { name: 'Cà Mau', capital: 'Cà Mau', latitude: 9.18, longitude: 105.15, region: S, now: 'Cà Mau' },
  { name: 'Cao Bằng', capital: 'Cao Bằng', latitude: 22.67, longitude: 106.25, region: N, now: 'Cao Bằng' },
  { name: 'Đắk Lắk', capital: 'Buôn Ma Thuột', latitude: 12.67, longitude: 108.05, region: S, now: 'Đắk Lắk' },
  { name: 'Đắk Nông', capital: 'Gia Nghĩa', latitude: 11.98, longitude: 107.70, region: S, now: 'Lâm Đồng' },
  { name: 'Điện Biên', capital: 'Điện Biên Phủ', latitude: 21.39, longitude: 103.02, region: N, now: 'Điện Biên' },
  { name: 'Đồng Nai', capital: 'Biên Hòa', latitude: 10.95, longitude: 106.82, region: S, now: 'Đồng Nai' },
  { name: 'Đồng Tháp', capital: 'Cao Lãnh', latitude: 10.46, longitude: 105.63, region: S, now: 'Đồng Tháp' },
  { name: 'Gia Lai', capital: 'Pleiku', latitude: 13.97, longitude: 108.01, region: S, now: 'Gia Lai' },
  { name: 'Hà Giang', capital: 'Hà Giang', latitude: 22.82, longitude: 104.98, region: N, now: 'Tuyên Quang' },
  { name: 'Hà Nam', capital: 'Phủ Lý', latitude: 20.55, longitude: 105.91, region: N, now: 'Ninh Bình' },
  { name: 'Hà Tĩnh', capital: 'Hà Tĩnh', latitude: 18.34, longitude: 105.91, region: N, now: 'Hà Tĩnh' },
  { name: 'Hải Dương', capital: 'Hải Dương', latitude: 20.94, longitude: 106.33, region: N, now: 'Hải Phòng' },
  { name: 'Hậu Giang', capital: 'Vị Thanh', latitude: 9.78, longitude: 105.47, region: S, now: 'Cần Thơ' },
  { name: 'Hòa Bình', capital: 'Hòa Bình', latitude: 20.82, longitude: 105.34, region: N, now: 'Phú Thọ' },
  { name: 'Hưng Yên', capital: 'Hưng Yên', latitude: 20.65, longitude: 106.05, region: N, now: 'Hưng Yên' },
  { name: 'Khánh Hòa', capital: 'Nha Trang', latitude: 12.25, longitude: 109.19, region: S, now: 'Khánh Hòa' },
  { name: 'Kiên Giang', capital: 'Rạch Giá', latitude: 10.01, longitude: 105.08, region: S, now: 'An Giang' },
  { name: 'Kon Tum', capital: 'Kon Tum', latitude: 14.35, longitude: 108.00, region: S, now: 'Quảng Ngãi' },
  { name: 'Lai Châu', capital: 'Lai Châu', latitude: 22.40, longitude: 103.44, region: N, now: 'Lai Châu' },
  { name: 'Lâm Đồng', capital: 'Đà Lạt', latitude: 11.94, longitude: 108.44, region: S, now: 'Lâm Đồng' },
  { name: 'Lạng Sơn', capital: 'Lạng Sơn', latitude: 21.85, longitude: 106.76, region: N, now: 'Lạng Sơn' },
  { name: 'Lào Cai', capital: 'Lào Cai', latitude: 22.48, longitude: 103.98, region: N, now: 'Lào Cai' },
  { name: 'Long An', capital: 'Tân An', latitude: 10.53, longitude: 106.40, region: S, now: 'Tây Ninh' },
  { name: 'Nam Định', capital: 'Nam Định', latitude: 20.42, longitude: 106.17, region: N, now: 'Ninh Bình' },
  { name: 'Nghệ An', capital: 'Vinh', latitude: 18.67, longitude: 105.69, region: N, now: 'Nghệ An' },
  { name: 'Ninh Bình', capital: 'Ninh Bình', latitude: 20.25, longitude: 105.98, region: N, now: 'Ninh Bình' },
  { name: 'Ninh Thuận', capital: 'Phan Rang – Tháp Chàm', latitude: 11.56, longitude: 108.99, region: S, now: 'Khánh Hòa' },
  { name: 'Phú Thọ', capital: 'Việt Trì', latitude: 21.31, longitude: 105.39, region: N, now: 'Phú Thọ' },
  { name: 'Phú Yên', capital: 'Tuy Hòa', latitude: 13.09, longitude: 109.31, region: S, now: 'Đắk Lắk' },
  { name: 'Quảng Bình', capital: 'Đồng Hới', latitude: 17.48, longitude: 106.60, region: N, now: 'Quảng Trị' },
  { name: 'Quảng Nam', capital: 'Tam Kỳ', latitude: 15.57, longitude: 108.48, region: S, now: 'Đà Nẵng' },
  { name: 'Quảng Ngãi', capital: 'Quảng Ngãi', latitude: 15.12, longitude: 108.79, region: S, now: 'Quảng Ngãi' },
  { name: 'Quảng Ninh', capital: 'Hạ Long', latitude: 20.95, longitude: 107.09, region: N, now: 'Quảng Ninh' },
  { name: 'Quảng Trị', capital: 'Đông Hà', latitude: 16.81, longitude: 107.09, region: S, now: 'Quảng Trị' },
  { name: 'Sóc Trăng', capital: 'Sóc Trăng', latitude: 9.60, longitude: 105.97, region: S, now: 'Cần Thơ' },
  { name: 'Sơn La', capital: 'Sơn La', latitude: 21.33, longitude: 103.91, region: N, now: 'Sơn La' },
  { name: 'Tây Ninh', capital: 'Tây Ninh', latitude: 11.31, longitude: 106.10, region: S, now: 'Tây Ninh' },
  { name: 'Thái Bình', capital: 'Thái Bình', latitude: 20.45, longitude: 106.34, region: N, now: 'Hưng Yên' },
  { name: 'Thái Nguyên', capital: 'Thái Nguyên', latitude: 21.60, longitude: 105.85, region: N, now: 'Thái Nguyên' },
  { name: 'Thanh Hóa', capital: 'Thanh Hóa', latitude: 19.81, longitude: 105.78, region: N, now: 'Thanh Hóa' },
  { name: 'Thừa Thiên Huế', capital: 'Huế', latitude: 16.46, longitude: 107.58, region: S, now: 'Huế' },
  { name: 'Tiền Giang', capital: 'Mỹ Tho', latitude: 10.36, longitude: 106.36, region: S, now: 'Đồng Tháp' },
  { name: 'Trà Vinh', capital: 'Trà Vinh', latitude: 9.94, longitude: 106.34, region: S, now: 'Vĩnh Long' },
  { name: 'Tuyên Quang', capital: 'Tuyên Quang', latitude: 21.83, longitude: 105.22, region: N, now: 'Tuyên Quang' },
  { name: 'Vĩnh Long', capital: 'Vĩnh Long', latitude: 10.25, longitude: 105.97, region: S, now: 'Vĩnh Long' },
  { name: 'Vĩnh Phúc', capital: 'Vĩnh Yên', latitude: 21.31, longitude: 105.60, region: N, now: 'Phú Thọ' },
  { name: 'Yên Bái', capital: 'Yên Bái', latitude: 21.70, longitude: 104.87, region: N, now: 'Lào Cai' },
];

/** Địa điểm con không phải tỉnh cũ, khác miền với tỉnh cũ chứa nó. */
const EXTRA_LOCALITIES: Record<string, VnLocality[]> = {
  'Quảng Trị': [
    // Hồ Xá, huyện lỵ Vĩnh Linh (Quảng Trị cũ) — bờ bắc sông Bến Hải, thuộc miền Bắc 1954–1975
    { name: 'Vĩnh Linh (bắc sông Bến Hải)', latitude: 17.07, longitude: 107.01, region: N, seat: 'Hồ Xá' },
  ],
};

/** Hậu tố nhãn mục con tỉnh cũ: «Quảng Bình (cũ)». */
export const VN_FORMER_SUFFIX = ' (cũ)';

/**
 * 34 đơn vị từ 1/7/2025 và tỉnh cũ đặt trung tâm chính trị – hành chính (Phương án kèm NQ 60-NQ/TW).
 * 6 thành phố trực thuộc trung ương trước, sau đó 28 tỉnh theo thứ tự chữ cái.
 */
const UNITS: ReadonlyArray<readonly [name: string, center: string, municipality?: true]> = [
  ['Hà Nội', 'Hà Nội', true],
  ['TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', true],
  ['Hải Phòng', 'Hải Phòng', true],
  ['Đà Nẵng', 'Đà Nẵng', true],
  ['Cần Thơ', 'Cần Thơ', true],
  ['Huế', 'Thừa Thiên Huế', true],

  ['An Giang', 'Kiên Giang'],
  ['Bắc Ninh', 'Bắc Giang'],
  ['Cà Mau', 'Cà Mau'],
  ['Cao Bằng', 'Cao Bằng'],
  ['Đắk Lắk', 'Đắk Lắk'],
  ['Điện Biên', 'Điện Biên'],
  ['Đồng Nai', 'Đồng Nai'],
  ['Đồng Tháp', 'Tiền Giang'],
  ['Gia Lai', 'Bình Định'],
  ['Hà Tĩnh', 'Hà Tĩnh'],
  ['Hưng Yên', 'Hưng Yên'],
  ['Khánh Hòa', 'Khánh Hòa'],
  ['Lai Châu', 'Lai Châu'],
  ['Lạng Sơn', 'Lạng Sơn'],
  ['Lào Cai', 'Yên Bái'],
  ['Lâm Đồng', 'Lâm Đồng'],
  ['Nghệ An', 'Nghệ An'],
  ['Ninh Bình', 'Ninh Bình'],
  ['Phú Thọ', 'Phú Thọ'],
  ['Quảng Ngãi', 'Quảng Ngãi'],
  ['Quảng Ninh', 'Quảng Ninh'],
  ['Quảng Trị', 'Quảng Bình'],
  ['Sơn La', 'Sơn La'],
  ['Tây Ninh', 'Long An'],
  ['Thái Nguyên', 'Thái Nguyên'],
  ['Thanh Hóa', 'Thanh Hóa'],
  ['Tuyên Quang', 'Tuyên Quang'],
  ['Vĩnh Long', 'Vĩnh Long'],
];

const formerByName = new Map(VN_FORMER_PROVINCES.map(f => [f.name, f]));

export const VN_PROVINCES: VnProvince[] = UNITS.map(([name, center, municipality]) => {
  const c = formerByName.get(center)!;
  const formers = VN_FORMER_PROVINCES.filter(f => f.now === name);
  const localities: VnLocality[] = [
    // Đơn vị không sáp nhập: không cần mục con tỉnh cũ (trùng trung tâm)
    ...(formers.length > 1
      ? formers.map(f => ({ name: f.name + VN_FORMER_SUFFIX, latitude: f.latitude, longitude: f.longitude, region: f.region, seat: f.capital }))
      : []),
    ...(EXTRA_LOCALITIES[name] ?? []),
  ];
  return {
    name,
    capital: c.capital,
    latitude: c.latitude,
    longitude: c.longitude,
    region: c.region,
    municipality: !!municipality,
    formerProvinces: formers.map(f => f.name),
    ...(localities.length ? { localities } : {}),
  };
});

const provinceByName = new Map(VN_PROVINCES.map(p => [p.name, p]));

/**
 * Tra đơn vị theo khoá (chuẩn hoá NFC để chịu được chuỗi dán từ nguồn khác). Nhận cả tên mới (34) lẫn
 * tên tỉnh cũ (63, dữ liệu / link trước đây) → trả về đơn vị từ 1/7/2025 chứa nó.
 */
export function findVnProvince(name: string | undefined | null): VnProvince | undefined {
  if (!name) return undefined;
  const key = name.normalize('NFC');
  const p = provinceByName.get(key);
  if (p) return p;
  const f = formerByName.get(key);
  return f ? provinceByName.get(f.now) : undefined;
}

/** Khoá chuẩn (đơn vị mới + mục con) của một cặp province/city — tên tỉnh cũ → «X (cũ)». */
export function canonicalVnPlace(province: string | undefined | null, city?: string | null): { province: string; city: string } | undefined {
  const p = findVnProvince(province);
  if (!p) return undefined;
  const cityKey = city?.normalize('NFC');
  if (cityKey && p.localities?.some(l => l.name === cityKey)) return { province: p.name, city: cityKey };
  const key = province!.normalize('NFC');
  // Tên tỉnh cũ không trùng tên mới → mục con tỉnh cũ (đơn vị không sáp nhập: không có mục con = trung tâm)
  const former = key !== p.name ? key + VN_FORMER_SUFFIX : '';
  return { province: p.name, city: p.localities?.some(l => l.name === former) ? former : '' };
}

/**
 * Địa điểm cụ thể (trung tâm hành chính hoặc mục con) — `city` rỗng = trung tâm hành chính mới;
 * tên tỉnh cũ không kèm mục con = tỉnh lỵ cũ (cùng toạ độ / miền như dữ liệu 63 tỉnh).
 */
export function resolveVnPlace(province: string | undefined | null, city?: string | null): VnLocality | undefined {
  const c = canonicalVnPlace(province, city);
  if (!c) return undefined;
  const p = provinceByName.get(c.province)!;
  const sub = c.city ? p.localities?.find(l => l.name === c.city) : undefined;
  return sub ?? { name: p.capital, latitude: p.latitude, longitude: p.longitude, region: p.region };
}

/**
 * Các miền 1954–1975 mà nơi sinh đã chọn có thể thuộc. [] = chưa chọn / khoá lạ; 1 phần tử = đã xác định;
 * 2 phần tử = đang dùng trung tâm mặc định của đơn vị vắt qua sông Bến Hải (Quảng Trị mới) → cần chọn mục con
 * khi hai miền khác múi giờ.
 */
export function vnPlaceRegions(province: string | undefined | null, city?: string | null): VnRegion[] {
  const c = canonicalVnPlace(province, city);
  if (!c) return [];
  const p = provinceByName.get(c.province)!;
  if (c.city) return [p.localities!.find(l => l.name === c.city)!.region];
  const regions = new Set<VnRegion>([p.region, ...(p.localities ?? []).map(l => l.region)]);
  return [...regions];
}

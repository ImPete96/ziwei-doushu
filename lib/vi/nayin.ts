/**
 * Tên nạp âm (60 hoa giáp, mỗi cặp can chi liền nhau chung một tên), theo cách gọi quen thuộc
 * trên lá số Việt. Ngũ hành của từng tên khớp NAYIN_ELEMENTS trong lib/ziwei/constants.ts
 * (scripts/regression/nayin.test.ts đối chiếu).
 */
export const NAYIN_VI = [
  'Hải Trung Kim', 'Lư Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim',
  'Sơn Đầu Hỏa', 'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc',
  'Tuyền Trung Thủy', 'Ốc Thượng Thổ', 'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Trường Lưu Thủy',
  'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc', 'Bích Thượng Thổ', 'Kim Bạch Kim',
  'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Trạch Thổ', 'Thoa Xuyến Kim', 'Tang Đố Mộc',
  'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy',
] as const;

/** Nạp âm của can chi (stem 0–9 Giáp…Quý, branch 0–11 Tý…Hợi); can chi lệch âm dương trả về '' */
export function nayinVi(stem: number, branch: number): string {
  if (stem % 2 !== branch % 2) return '';
  const cycle = (((6 * stem - 5 * branch) % 60) + 60) % 60; // vị trí trong 60 hoa giáp, Giáp Tý = 0
  return NAYIN_VI[Math.floor(cycle / 2)];
}

/**
 * Form lập lá số cho người Việt: nơi sinh Việt Nam + lịch sử múi giờ VN theo vùng/ngày.
 *
 * Người dùng nhập giờ đồng hồ tại VN lúc sinh. Trước đây form luôn hiểu là giờ Bắc Kinh (UTC+8, 120°E)
 * nên người sinh ở VN bị lệch giờ mặt trời gần 1 tiếng → có thể sai canh giờ, sai cả ngày (giờ Tý muộn).
 *
 * Bản này chốt:
 *   1. Dữ liệu 34 đơn vị hành chính từ 1/7/2025 (NQ 202/2025/QH15) + 63 tỉnh cũ làm mục con (khoá, kinh độ,
 *      miền 1954–1975); tên tỉnh cũ (link co=vn trước đây) vẫn tra ra cùng toạ độ / miền.
 *   2. Bảng múi giờ tĩnh (lib/ziwei/vn-timezone.ts) khớp IANA tzdata qua Intl của Node
 *      (Asia/Ho_Chi_Minh cho miền Nam; Asia/Bangkok cho miền Bắc từ 1970) — runtime không dùng Intl.
 *   3. Các ca VN: Hà Nội / TP.HCM 2000 (UTC+7), Sài Gòn 1970 (UTC+8), Hà Nội 1970 (UTC+7), Quảng Trị mới
 *      (Quảng Bình cũ = Bắc, Quảng Trị cũ = Nam, Vĩnh Linh = Bắc),
 *      biên canh giờ và giờ Tý muộn nơi VN khác giả định UTC+8 cũ.
 *   4. Trung Quốc và mọi form cũ không có `country`: kết quả y hệt HEAD (a54e6be) — so với bản sao
 *      nguyên văn của HEAD (share.ts formToBirthInfo / calcTrueSolarBranch và các hàm true-solar-time.ts
 *      chúng gọi) trên toàn bộ tỉnh/thành TQ; bản sao không import gì từ code hiện tại.
 *   5. VN + sinh trước 13/6/1975 + chưa chọn tỉnh → bị chặn (múi giờ khi đó khác theo miền); tỉnh mới vắt qua
 *      sông Bến Hải chưa chọn khu vực + hai miền khác múi giờ lúc sinh → bị chặn.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { formToBirthInfo, formSolarTime, formToSearchParams, searchParamsToForm, vnProvinceRequired, vnProvinceRequiredMessage, VN_PROVINCE_REQUIRED_MESSAGE } from '../../lib/ziwei/share';
import { branchFromSolarMinutes, longitudeCorrection } from '../../lib/ziwei/true-solar-time';
import { VN_FORMER_PROVINCES, VN_PROVINCES, canonicalVnPlace, findVnProvince, resolveVnPlace, vnPlaceRegions } from '../../lib/ziwei/vn-places';
import { VN_ZONE_HISTORY, vnUtcOffset, formatUtcOffset, type VnRegion } from '../../lib/ziwei/vn-timezone';
import { PROVINCES } from '../../lib/ziwei/cities';
import type { BirthFormState } from '../../components/BirthForm';
import type { BirthInfo } from '../../lib/ziwei/types';

// ── 1) Dữ liệu tỉnh thành ────────────────────────────────────────────────────
// 34 đơn vị theo NQ 202/2025/QH15 (Điều 1) — 6 thành phố trực thuộc trung ương + 28 tỉnh; trung tâm hành chính
// theo phương án kèm NQ 60-NQ/TW. Bảng kỳ vọng viết tay, độc lập với vn-places.ts.
const EXPECTED_UNITS: Record<string, { center: string; formers: string[]; municipality?: true }> = {
  'Hà Nội': { center: 'Hà Nội', formers: ['Hà Nội'], municipality: true },
  'Huế': { center: 'Thừa Thiên Huế', formers: ['Thừa Thiên Huế'], municipality: true },
  'Hải Phòng': { center: 'Hải Phòng', formers: ['Hải Phòng', 'Hải Dương'], municipality: true },
  'Đà Nẵng': { center: 'Đà Nẵng', formers: ['Đà Nẵng', 'Quảng Nam'], municipality: true },
  'TP. Hồ Chí Minh': { center: 'TP. Hồ Chí Minh', formers: ['TP. Hồ Chí Minh', 'Bà Rịa – Vũng Tàu', 'Bình Dương'], municipality: true },
  'Cần Thơ': { center: 'Cần Thơ', formers: ['Cần Thơ', 'Sóc Trăng', 'Hậu Giang'], municipality: true },
  'Lai Châu': { center: 'Lai Châu', formers: ['Lai Châu'] },
  'Điện Biên': { center: 'Điện Biên', formers: ['Điện Biên'] },
  'Sơn La': { center: 'Sơn La', formers: ['Sơn La'] },
  'Lạng Sơn': { center: 'Lạng Sơn', formers: ['Lạng Sơn'] },
  'Quảng Ninh': { center: 'Quảng Ninh', formers: ['Quảng Ninh'] },
  'Thanh Hóa': { center: 'Thanh Hóa', formers: ['Thanh Hóa'] },
  'Nghệ An': { center: 'Nghệ An', formers: ['Nghệ An'] },
  'Hà Tĩnh': { center: 'Hà Tĩnh', formers: ['Hà Tĩnh'] },
  'Cao Bằng': { center: 'Cao Bằng', formers: ['Cao Bằng'] },
  'Tuyên Quang': { center: 'Tuyên Quang', formers: ['Hà Giang', 'Tuyên Quang'] },
  'Lào Cai': { center: 'Yên Bái', formers: ['Yên Bái', 'Lào Cai'] },
  'Thái Nguyên': { center: 'Thái Nguyên', formers: ['Bắc Kạn', 'Thái Nguyên'] },
  'Phú Thọ': { center: 'Phú Thọ', formers: ['Vĩnh Phúc', 'Hòa Bình', 'Phú Thọ'] },
  'Bắc Ninh': { center: 'Bắc Giang', formers: ['Bắc Giang', 'Bắc Ninh'] },
  'Hưng Yên': { center: 'Hưng Yên', formers: ['Thái Bình', 'Hưng Yên'] },
  'Ninh Bình': { center: 'Ninh Bình', formers: ['Hà Nam', 'Nam Định', 'Ninh Bình'] },
  'Quảng Trị': { center: 'Quảng Bình', formers: ['Quảng Bình', 'Quảng Trị'] },
  'Quảng Ngãi': { center: 'Quảng Ngãi', formers: ['Kon Tum', 'Quảng Ngãi'] },
  'Gia Lai': { center: 'Bình Định', formers: ['Bình Định', 'Gia Lai'] },
  'Khánh Hòa': { center: 'Khánh Hòa', formers: ['Ninh Thuận', 'Khánh Hòa'] },
  'Lâm Đồng': { center: 'Lâm Đồng', formers: ['Đắk Nông', 'Bình Thuận', 'Lâm Đồng'] },
  'Đắk Lắk': { center: 'Đắk Lắk', formers: ['Phú Yên', 'Đắk Lắk'] },
  'Đồng Nai': { center: 'Đồng Nai', formers: ['Bình Phước', 'Đồng Nai'] },
  'Tây Ninh': { center: 'Long An', formers: ['Long An', 'Tây Ninh'] },
  'Vĩnh Long': { center: 'Vĩnh Long', formers: ['Bến Tre', 'Trà Vinh', 'Vĩnh Long'] },
  'Đồng Tháp': { center: 'Tiền Giang', formers: ['Tiền Giang', 'Đồng Tháp'] },
  'Cà Mau': { center: 'Cà Mau', formers: ['Bạc Liêu', 'Cà Mau'] },
  'An Giang': { center: 'Kiên Giang', formers: ['Kiên Giang', 'An Giang'] },
};
// Ảnh chụp dữ liệu 63 tỉnh trước khi đổi sang 34 đơn vị (tên|vĩ độ|kinh độ|miền n/s) — tên cũ phải tra ra y hệt.
const FORMER_SNAPSHOT = 'Hà Nội|21.03|105.85|n;TP. Hồ Chí Minh|10.78|106.7|s;Hải Phòng|20.87|106.68|n;Đà Nẵng|16.07|108.21|s;Cần Thơ|10.04|105.79|s;An Giang|10.37|105.42|s;Bà Rịa – Vũng Tàu|10.5|107.17|s;Bắc Giang|21.27|106.19|n;Bắc Kạn|22.15|105.84|n;Bạc Liêu|9.28|105.72|s;Bắc Ninh|21.19|106.08|n;Bến Tre|10.23|106.38|s;Bình Định|13.77|109.23|s;Bình Dương|11|106.66|s;Bình Phước|11.52|106.85|s;Bình Thuận|10.93|108.1|s;Cà Mau|9.18|105.15|s;Cao Bằng|22.67|106.25|n;Đắk Lắk|12.67|108.05|s;Đắk Nông|11.98|107.7|s;Điện Biên|21.39|103.02|n;Đồng Nai|10.95|106.82|s;Đồng Tháp|10.46|105.63|s;Gia Lai|13.97|108.01|s;Hà Giang|22.82|104.98|n;Hà Nam|20.55|105.91|n;Hà Tĩnh|18.34|105.91|n;Hải Dương|20.94|106.33|n;Hậu Giang|9.78|105.47|s;Hòa Bình|20.82|105.34|n;Hưng Yên|20.65|106.05|n;Khánh Hòa|12.25|109.19|s;Kiên Giang|10.01|105.08|s;Kon Tum|14.35|108|s;Lai Châu|22.4|103.44|n;Lâm Đồng|11.94|108.44|s;Lạng Sơn|21.85|106.76|n;Lào Cai|22.48|103.98|n;Long An|10.53|106.4|s;Nam Định|20.42|106.17|n;Nghệ An|18.67|105.69|n;Ninh Bình|20.25|105.98|n;Ninh Thuận|11.56|108.99|s;Phú Thọ|21.31|105.39|n;Phú Yên|13.09|109.31|s;Quảng Bình|17.48|106.6|n;Quảng Nam|15.57|108.48|s;Quảng Ngãi|15.12|108.79|s;Quảng Ninh|20.95|107.09|n;Quảng Trị|16.81|107.09|s;Sóc Trăng|9.6|105.97|s;Sơn La|21.33|103.91|n;Tây Ninh|11.31|106.1|s;Thái Bình|20.45|106.34|n;Thái Nguyên|21.6|105.85|n;Thanh Hóa|19.81|105.78|n;Thừa Thiên Huế|16.46|107.58|s;Tiền Giang|10.36|106.36|s;Trà Vinh|9.94|106.34|s;Tuyên Quang|21.83|105.22|n;Vĩnh Long|10.25|105.97|s;Vĩnh Phúc|21.31|105.6|n;Yên Bái|21.7|104.87|n'
  .split(';').map(r => { const [name, lat, lon, reg] = r.split('|'); return { name, latitude: Number(lat), longitude: Number(lon), region: (reg === 'n' ? 'north' : 'south') as VnRegion }; });
assert.equal(FORMER_SNAPSHOT.length, 63);

assert.equal(VN_PROVINCES.length, 34, 'đúng 34 đơn vị hành chính cấp tỉnh từ 1/7/2025');
assert.equal(new Set(VN_PROVINCES.map(p => p.name)).size, 34, 'khoá tỉnh không trùng');
assert.equal(VN_PROVINCES.filter(p => p.municipality).length, 6, '6 thành phố trực thuộc trung ương');
assert.deepEqual(new Set(VN_PROVINCES.map(p => p.name)), new Set(Object.keys(EXPECTED_UNITS)), 'tên 34 đơn vị theo NQ 202/2025/QH15');
assert.equal(VN_FORMER_PROVINCES.length, 63);
const cnKeys = new Set(PROVINCES.flatMap(p => [p.name, ...p.cities.map(c => c.name)]));
const formerOwner = new Map<string, string>();
for (const p of VN_PROVINCES) {
  const exp = EXPECTED_UNITS[p.name];
  assert.equal(p.municipality, !!exp.municipality, `${p.name}: loại đơn vị`);
  assert.deepEqual([...p.formerProvinces].sort(), [...exp.formers].sort(), `${p.name}: tỉnh cũ nhập vào`);
  const center = FORMER_SNAPSHOT.find(f => f.name === exp.center)!;
  assert.deepEqual([p.latitude, p.longitude, p.region], [center.latitude, center.longitude, center.region], `${p.name}: toạ độ trung tâm hành chính = tỉnh lỵ ${exp.center} cũ`);
  for (const f of p.formerProvinces) {
    assert.ok(!formerOwner.has(f), `${f}: tỉnh cũ thuộc hơn một đơn vị mới`);
    formerOwner.set(f, p.name);
  }
  for (const key of [p.name, ...(p.localities ?? []).map(l => l.name)]) {
    assert.equal(key, key.normalize('NFC'), `${key}: khoá phải ở dạng NFC`);
    assert.ok(!cnKeys.has(key), `${key}: không được trùng khoá Trung Quốc`);
  }
  for (const pt of [p, ...(p.localities ?? [])]) {
    assert.ok(pt.longitude >= 102.1 && pt.longitude <= 109.5, `${pt.name}: kinh độ ngoài lãnh thổ VN`);
    assert.ok(pt.latitude >= 8.5 && pt.latitude <= 23.4, `${pt.name}: vĩ độ ngoài lãnh thổ VN`);
    assert.equal(Math.round(pt.longitude * 100) / 100, pt.longitude, `${pt.name}: kinh độ làm tròn 0,01°`);
  }
  // Đơn vị sáp nhập: mỗi tỉnh cũ là một mục con «X (cũ)»
  if (p.formerProvinces.length > 1) {
    for (const f of p.formerProvinces) {
      const snap = FORMER_SNAPSHOT.find(s => s.name === f)!;
      const l = p.localities?.find(x => x.name === `${f} (cũ)`);
      assert.ok(l, `${p.name}: thiếu mục con ${f} (cũ)`);
      assert.deepEqual([l.latitude, l.longitude, l.region], [snap.latitude, snap.longitude, snap.region], `${f} (cũ): toạ độ / miền tỉnh lỵ cũ`);
    }
  }
}
assert.equal(formerOwner.size, 63, 'mapping đủ 63 tỉnh cũ, mỗi tỉnh cũ thuộc đúng 1 đơn vị mới');
assert.deepEqual(new Set(formerOwner.keys()), new Set(FORMER_SNAPSHOT.map(f => f.name)));
for (const f of VN_FORMER_PROVINCES) assert.equal(formerOwner.get(f.name), f.now, `${f.name}: now khớp formerProvinces`);
// Miền 1954–1975 của 63 tỉnh cũ không đổi: Quảng Bình trở ra = 29 Bắc, Quảng Trị trở vào = 34 Nam
assert.equal(FORMER_SNAPSHOT.filter(f => f.region === 'north').length, 29);
assert.equal(FORMER_SNAPSHOT.filter(f => f.region === 'south').length, 34);
// Đơn vị vắt qua sông Bến Hải: chỉ Quảng Trị mới
const spanning = VN_PROVINCES.filter(p => vnPlaceRegions(p.name, '').length > 1).map(p => p.name);
assert.deepEqual(spanning, ['Quảng Trị'], 'chỉ Quảng Trị mới (= Quảng Bình + Quảng Trị cũ) gồm cả hai miền');
assert.equal(findVnProvince('Quảng Trị')?.region, 'north', 'trung tâm hành chính Quảng Trị mới ở Đồng Hới (Bắc)');
assert.equal(findVnProvince('Quảng Trị')?.capital, 'Đồng Hới');
assert.equal(resolveVnPlace('Quảng Trị', 'Quảng Bình (cũ)')?.region, 'north');
assert.equal(resolveVnPlace('Quảng Trị', 'Quảng Trị (cũ)')?.region, 'south');
assert.equal(resolveVnPlace('Quảng Trị', 'Vĩnh Linh (bắc sông Bến Hải)')?.region, 'north', 'Vĩnh Linh ở bắc vĩ tuyến 17');
assert.deepEqual(vnPlaceRegions('Quảng Trị', 'Quảng Trị (cũ)'), ['south']);
assert.deepEqual(vnPlaceRegions('', ''), []);
assert.equal(findVnProvince('Hà Nội'.normalize('NFD'))?.name, 'Hà Nội', 'tra khoá chịu được chuỗi NFD');
assert.equal(findVnProvince('Không có tỉnh này'), undefined);

// Tương thích: 63 tên tỉnh cũ (dữ liệu / link co=vn trước đây) → đơn vị mới + mục con, cùng toạ độ / miền
const NEW_NAMES = new Set(VN_PROVINCES.map(p => p.name));
const collide = FORMER_SNAPSHOT.filter(f => NEW_NAMES.has(f.name) && findVnProvince(f.name)!.formerProvinces.length > 1).map(f => f.name);
assert.deepEqual(new Set(collide), new Set(['Lào Cai', 'Bắc Ninh', 'Quảng Trị', 'Gia Lai', 'Tây Ninh', 'Đồng Tháp', 'An Giang',
  'TP. Hồ Chí Minh', 'Hải Phòng', 'Đà Nẵng', 'Cần Thơ', 'Thái Nguyên', 'Phú Thọ', 'Hưng Yên', 'Ninh Bình', 'Quảng Ngãi', 'Khánh Hòa',
  'Lâm Đồng', 'Đắk Lắk', 'Đồng Nai', 'Vĩnh Long', 'Cà Mau', 'Tuyên Quang']), 'tên cũ trùng tên đơn vị sáp nhập');
for (const f of FORMER_SNAPSHOT) {
  const p = findVnProvince(f.name);
  assert.equal(p?.name, formerOwner.get(f.name), `${f.name} → ${formerOwner.get(f.name)}`);
  const pt = (x: { latitude: number; longitude: number; region: VnRegion } | undefined) => x && [x.latitude, x.longitude, x.region];
  // Luôn tra được qua mục con «X (cũ)» (hoặc tên đơn vị không sáp nhập)
  const sub = p!.formerProvinces.length > 1 ? resolveVnPlace(p!.name, `${f.name} (cũ)`) : resolveVnPlace(p!.name, '');
  assert.deepEqual(pt(sub), pt(f), `${f.name}: tỉnh mới + mục con = toạ độ cũ`);
  if (!NEW_NAMES.has(f.name) || p!.formerProvinces.length === 1) {
    // Tên cũ không trùng tên đơn vị sáp nhập: link cũ (province = tên cũ, city = '') ra đúng như trước
    assert.deepEqual(pt(resolveVnPlace(f.name, '')), pt(f), `${f.name}: link cũ cùng toạ độ / miền`);
    assert.deepEqual(vnPlaceRegions(f.name, ''), [f.region]);
  } else {
    // Tên cũ trùng tên đơn vị sáp nhập → hiểu là đơn vị mới (trung tâm hành chính mới); muốn toạ độ cũ chọn «X (cũ)»
    assert.deepEqual(pt(resolveVnPlace(f.name, '')), [p!.latitude, p!.longitude, p!.region]);
  }
}
assert.deepEqual(canonicalVnPlace('Bình Dương', ''), { province: 'TP. Hồ Chí Minh', city: 'Bình Dương (cũ)' });
assert.deepEqual(canonicalVnPlace('Quảng Bình', ''), { province: 'Quảng Trị', city: 'Quảng Bình (cũ)' });
assert.deepEqual(canonicalVnPlace('Thừa Thiên Huế', ''), { province: 'Huế', city: '' });
assert.deepEqual(canonicalVnPlace('Quảng Trị', 'Vĩnh Linh (bắc sông Bến Hải)'), { province: 'Quảng Trị', city: 'Vĩnh Linh (bắc sông Bến Hải)' });
assert.deepEqual(canonicalVnPlace('Gia Lai', 'không có'), { province: 'Gia Lai', city: '' }, 'mục con lạ = trung tâm');

// ── 2) Bảng múi giờ tĩnh khớp tzdata (Intl của Node chỉ dùng để kiểm) ───────────
function intlOffsetMinutes(timeZone: string, utcMs: number): number {
  const name = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
    .formatToParts(new Date(utcMs)).find(p => p.type === 'timeZoneName')!.value;
  if (name === 'GMT') return 0;
  const m = name.match(/^GMT([+-])(\d{2}):(\d{2})(?::(\d{2}))?$/);
  assert.ok(m, `không đọc được offset ICU: ${name}`);
  const v = Number(m[2]) * 60 + Number(m[3]) + Number(m[4] ?? 0) / 60;
  return m[1] === '-' ? -v : v;
}
const transitionsWall = (region: VnRegion) => VN_ZONE_HISTORY[region]
  .filter(p => p.until).map(p => Date.UTC(p.until![0], p.until![1] - 1, p.until![2], p.until![3], p.until![4]));
const DAY = 86_400_000;
function sweep(region: VnRegion, tz: string, fromMs: number, toMs: number) {
  const near = transitionsWall(region);
  let checked = 0;
  for (let t = fromMs, i = 0; t < toMs; t += 3 * DAY + 3_600_000 * 7, i++) {
    if (near.some(x => Math.abs(x - t) < 2 * DAY)) continue;
    const d = new Date(t);
    const z = vnUtcOffset(region, 106, d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes());
    const expected = intlOffsetMinutes(tz, t - z.offsetMinutes * 60_000);
    assert.equal(z.offsetMinutes, expected, `${region} ${d.toISOString().slice(0, 16)} lệch ${tz}`);
    checked++;
  }
  return checked;
}
let sampled = 0;
sampled += sweep('south', 'Asia/Ho_Chi_Minh', Date.UTC(1906, 6, 2), Date.UTC(2027, 0, 1));
// Miền Bắc (backzone Asia/Hanoi) trùng Asia/Ho_Chi_Minh trước 1954-10 và trong 1955-07..1959-12
sampled += sweep('north', 'Asia/Ho_Chi_Minh', Date.UTC(1906, 6, 2), Date.UTC(1954, 8, 29));
sampled += sweep('north', 'Asia/Ho_Chi_Minh', Date.UTC(1955, 6, 3), Date.UTC(1959, 11, 29));
// Từ 1970 tzdb trỏ miền Bắc về Asia/Bangkok (+07)
sampled += sweep('north', 'Asia/Bangkok', Date.UTC(1970, 0, 1), Date.UTC(2027, 0, 1));
assert.ok(sampled > 15000, `số mẫu so với tzdata quá ít: ${sampled}`);

// Mốc chuyển chính xác (giờ đồng hồ) và quy ước compatible
const off = (r: VnRegion, y: number, mo: number, d: number, h: number, mi: number) => vnUtcOffset(r, 106, y, mo, d, h, mi);
assert.equal(off('south', 1959, 12, 31, 22, 59).offsetMinutes, 420);
assert.deepEqual(off('south', 1959, 12, 31, 23, 30), { offsetMinutes: 420, localMeanTime: false, transition: 'nonexistent' }, '23:00–23:59 31/12/1959 không tồn tại ở miền Nam → đọc theo UTC+7');
assert.equal(off('south', 1960, 1, 1, 0, 0).offsetMinutes, 480, 'miền Nam UTC+8 từ 00:00 1/1/1960');
assert.equal(off('north', 1960, 1, 1, 0, 0).offsetMinutes, 420, 'miền Bắc vẫn UTC+7');
assert.equal(off('south', 1975, 4, 30, 12, 0).offsetMinutes, 480, 'sau 30/4/1975 miền Nam vẫn UTC+8');
assert.equal(off('south', 1975, 6, 12, 22, 59).offsetMinutes, 480);
const amb = off('south', 1975, 6, 12, 23, 30);
assert.equal(amb.offsetMinutes, 480, '23:xx 12/6/1975 lặp hai lần → lấy lần đầu (UTC+8)');
assert.equal(amb.transition, 'ambiguous');
assert.equal(off('south', 1975, 6, 13, 0, 0).offsetMinutes, 420, 'cả nước UTC+7 từ 13/6/1975');
assert.equal(off('north', 1954, 9, 30, 12, 0).offsetMinutes, 480, 'Hà Nội UTC+8 tới 10/1954 (tzdata backzone)');
assert.equal(off('north', 1954, 10, 1, 0, 0).offsetMinutes, 420);
assert.equal(off('south', 1955, 6, 30, 23, 59).offsetMinutes, 480);
assert.equal(off('south', 1955, 7, 1, 0, 30).transition, 'ambiguous', '00:00–00:59 1/7/1955 lặp hai lần');
assert.equal(off('south', 1955, 7, 1, 1, 0).offsetMinutes, 420);
assert.equal(off('south', 1945, 6, 1, 12, 0).offsetMinutes, 540, 'giờ Tokyo 1945');
for (const r of ['north', 'south'] as const) {
  // 31/12/1942 23:00 +7 → +8: 23:00–23:59 không tồn tại
  assert.deepEqual(off(r, 1942, 12, 31, 22, 59), { offsetMinutes: 420, localMeanTime: false });
  assert.deepEqual(off(r, 1942, 12, 31, 23, 0), { offsetMinutes: 420, localMeanTime: false, transition: 'nonexistent' });
  assert.equal(off(r, 1942, 12, 31, 23, 59).transition, 'nonexistent');
  assert.equal(off(r, 1943, 1, 1, 0, 0).offsetMinutes, 480);
  assert.equal(off(r, 1943, 1, 1, 0, 0).transition, undefined);
  // 1/9/1945 24:00 +9 → +7: 22:00–23:59 ngày 1/9 lặp hai lần → lần đầu (+9)
  assert.equal(off(r, 1945, 9, 1, 21, 59).transition, undefined);
  assert.equal(off(r, 1945, 9, 1, 21, 59).offsetMinutes, 540);
  for (const [h, mi] of [[22, 0], [23, 0], [23, 59]] as const) {
    const z = off(r, 1945, 9, 1, h, mi);
    assert.equal(z.offsetMinutes, 540, `1/9/1945 ${h}:${mi} lặp → +9`);
    assert.equal(z.transition, 'ambiguous', `1/9/1945 ${h}:${mi} lặp`);
  }
  assert.deepEqual(off(r, 1945, 9, 2, 0, 0), { offsetMinutes: 420, localMeanTime: false });
  // 1/4/1947 00:00 +7 → +8: 00:00–00:59 không tồn tại
  assert.equal(off(r, 1947, 3, 31, 23, 59).transition, undefined);
  assert.deepEqual(off(r, 1947, 4, 1, 0, 30), { offsetMinutes: 420, localMeanTime: false, transition: 'nonexistent' });
  assert.equal(off(r, 1947, 4, 1, 1, 0).offsetMinutes, 480);
  assert.equal(off(r, 1947, 4, 1, 1, 0).transition, undefined);
}
// 1/7/1906 LMT → PLMT (+7:06:30 = kinh tuyến 106,625°E)
{
  // Đà Nẵng 108.21°E: LMT +7:12:50 > PLMT → lùi đồng hồ ~6,3 phút, 23:53:40–23:59 ngày 30/6 lặp hai lần
  const dn = 108.21;
  assert.deepEqual(vnUtcOffset('south', dn, 1906, 6, 30, 23, 50), { offsetMinutes: dn * 4, localMeanTime: true, note: VN_ZONE_HISTORY.south[0].note });
  const a = vnUtcOffset('south', dn, 1906, 6, 30, 23, 55);
  assert.equal(a.transition, 'ambiguous', 'Đà Nẵng 30/6/1906 23:55 lặp');
  assert.equal(a.localMeanTime, true, 'lặp → lần đầu (LMT)');
  assert.equal(a.offsetMinutes, dn * 4);
  const b = vnUtcOffset('south', dn, 1906, 7, 1, 0, 0);
  assert.equal(b.offsetMinutes, 426.5);
  assert.equal(b.transition, undefined);
  // Hà Nội 105.85°E: LMT < PLMT → tiến đồng hồ ~3,1 phút, 00:00–00:03 ngày 1/7 không tồn tại
  const c = vnUtcOffset('north', 105.85, 1906, 7, 1, 0, 2);
  assert.equal(c.transition, 'nonexistent');
  assert.equal(c.localMeanTime, true);
  assert.equal(vnUtcOffset('north', 105.85, 1906, 7, 1, 0, 4).offsetMinutes, 426.5);
}
assert.equal(off('south', 1908, 1, 1, 12, 0).offsetMinutes, 426.5, 'giờ Phù Liễn +7:06:30');
const lmt = vnUtcOffset('north', 105.85, 1903, 1, 1, 12, 0);
assert.equal(lmt.localMeanTime, true);
assert.equal(lmt.offsetMinutes, 105.85 * 4, 'trước 1906 = giờ trung bình nơi sinh');
assert.equal(formatUtcOffset({ offsetMinutes: 420, localMeanTime: false }), 'UTC+7');
assert.equal(formatUtcOffset({ offsetMinutes: 480, localMeanTime: false }), 'UTC+8');
assert.equal(formatUtcOffset({ offsetMinutes: 426.5, localMeanTime: false }), 'UTC+7:06:30');

// ── 3) Ca Việt Nam qua formToBirthInfo / formSolarTime ─────────────────────────
function vnForm(province: string, date: [number, number, number], hm: [number, number], extra: Partial<BirthFormState> = {}): BirthFormState {
  return {
    name: '', year: String(date[0]), month: String(date[1]), day: String(date[2]),
    clockHour: String(hm[0]), clockMinute: String(hm[1]), unknownTime: false,
    province, city: '', longitude: findVnProvince(province)?.longitude ?? 105,
    gender: 'male', country: 'VN', ...extra,
  };
}
/** Giả định cũ: giờ nhập là giờ Bắc Kinh, kinh độ VN, kinh tuyến 120°E */
function legacyUtc8(f: BirthFormState): BirthFormState {
  return { ...f, country: undefined, province: f.province ? '测试' : '', longitude: f.longitude };
}
const pick = (b: BirthInfo) => ({ year: b.year, month: b.month, day: b.day, hour: b.hour });
const approx = (a: number, b: number, label: string) => assert.ok(Math.abs(a - b) < 1e-9, `${label}: ${a} ≠ ${b}`);

// Hà Nội 2000, UTC+7, 105.85°E: 08:58 → +3,4 phút → 09:01 giờ Tỵ (UTC+8 cũ: 08:01 giờ Thìn)
{
  const f = vnForm('Hà Nội', [2000, 5, 10], [8, 58]);
  const s = formSolarTime(f);
  assert.equal(s.utcOffsetMinutes, 420);
  assert.equal(s.meridian, 105);
  approx(s.correctionMinutes, 3.4, 'Hà Nội hiệu chỉnh');
  const info = formToBirthInfo(f);
  assert.deepEqual(pick(info), { year: 2000, month: 5, day: 10, hour: 5 }, 'Hà Nội 2000 08:58 → giờ Tỵ');
  assert.equal(info.country, 'VN');
  assert.equal(info.utcOffsetMinutes, 420);
  assert.equal(info.longitude, 105.85);
  assert.equal(info.province, 'Hà Nội');
  assert.equal(formToBirthInfo(legacyUtc8(f)).hour, 4, 'giả định UTC+8 cũ cho ra giờ Thìn — sai');
}
// TP.HCM 2000, UTC+7: 08:55 → +6,8 → 09:01,8 giờ Tỵ
{
  const f = vnForm('TP. Hồ Chí Minh', [2000, 5, 10], [8, 55]);
  const s = formSolarTime(f);
  assert.equal(s.utcOffsetMinutes, 420);
  approx(s.correctionMinutes, 6.8, 'TP.HCM 2000 hiệu chỉnh');
  assert.deepEqual(pick(formToBirthInfo(f)), { year: 2000, month: 5, day: 10, hour: 5 });
}
// Sài Gòn 1970, UTC+8 (VNCH): 13:00 → −53,2 phút → 12:06,8 giờ Ngọ (nếu coi là UTC+7 sẽ ra giờ Mùi)
{
  const f = vnForm('TP. Hồ Chí Minh', [1970, 6, 15], [13, 0]);
  const s = formSolarTime(f);
  assert.equal(s.utcOffsetMinutes, 480);
  assert.equal(s.meridian, 120);
  approx(s.correctionMinutes, 106.7 * 4 - 480, 'Sài Gòn 1970 hiệu chỉnh');
  assert.ok(s.zone?.note?.includes('Việt Nam Cộng hòa'), 'phải có ghi chú giai đoạn UTC+8 miền Nam');
  const info = formToBirthInfo(f);
  assert.deepEqual(pick(info), { year: 1970, month: 6, day: 15, hour: 6 }, 'Sài Gòn 1970 13:00 → giờ Ngọ');
  assert.equal(info.utcOffsetMinutes, 480);
  assert.equal(branchFromSolarMinutes(13 * 60 + longitudeCorrection(106.7, 420)), 7, 'nếu hiểu là UTC+7 sẽ ra giờ Mùi');
}
// Hà Nội 1970: miền Bắc UTC+7 (tzdata backzone Asia/Hanoi; Asia/Bangkok từ 1970) → 13:03,4 giờ Mùi
{
  const f = vnForm('Hà Nội', [1970, 6, 15], [13, 0]);
  assert.equal(formSolarTime(f).utcOffsetMinutes, 420);
  assert.equal(formSolarTime(f).zone?.note, undefined);
  assert.deepEqual(pick(formToBirthInfo(f)), { year: 1970, month: 6, day: 15, hour: 7 }, 'Hà Nội 1970 13:00 → giờ Mùi');
}
// Quảng Trị mới 1970: Quảng Bình cũ (Đồng Hới, Bắc) UTC+7, Quảng Trị cũ (Đông Hà, Nam) UTC+8, Vĩnh Linh (Bắc) UTC+7
{
  const qt = (city: string, date: [number, number, number] = [1970, 6, 15], hm: [number, number] = [13, 0]) =>
    vnForm('Quảng Trị', date, hm, { city });
  assert.equal(vnProvinceRequired(qt('')), true, 'Quảng Trị mới 1970 chưa chọn khu vực → bị chặn');
  assert.match(vnProvinceRequiredMessage(qt('')), /Quảng Trị gồm cả vùng phía Bắc và phía Nam sông Bến Hải/);
  assert.match(VN_PROVINCE_REQUIRED_MESSAGE, /khu vực/, 'thông báo chung (/heming) nhắc chọn khu vực');
  const qb = formSolarTime(qt('Quảng Bình (cũ)'));
  assert.equal(vnProvinceRequired(qt('Quảng Bình (cũ)')), false);
  assert.equal(qb.utcOffsetMinutes, 420, 'Quảng Bình (cũ) 1970 → miền Bắc UTC+7');
  assert.equal(qb.longitude, 106.60);
  const dh = formSolarTime(qt('Quảng Trị (cũ)'));
  assert.equal(vnProvinceRequired(qt('Quảng Trị (cũ)')), false);
  assert.equal(dh.utcOffsetMinutes, 480, 'Quảng Trị (cũ) 1970 → miền Nam UTC+8');
  assert.equal(dh.longitude, 107.09);
  assert.equal(formToBirthInfo(qt('Quảng Trị (cũ)')).utcOffsetMinutes, 480);
  const vl = formSolarTime(qt('Vĩnh Linh (bắc sông Bến Hải)'));
  assert.equal(vl.utcOffsetMinutes, 420);
  assert.equal(vl.longitude, 107.01);
  // Link cũ theo 63 tỉnh: province = tên tỉnh cũ → miền như trước, không bị chặn
  assert.equal(vnProvinceRequired(vnForm('Quảng Bình', [1970, 6, 15], [13, 0])), false);
  assert.equal(formSolarTime(vnForm('Quảng Bình', [1970, 6, 15], [13, 0])).utcOffsetMinutes, 420);
  assert.equal(vnProvinceRequired(vnForm('Quảng Trị', [1970, 6, 15], [13, 0], { city: 'Vĩnh Linh (bắc sông Bến Hải)' })), false);
  // Hai miền cùng múi giờ → không bắt buộc chọn khu vực (dùng trung tâm Đồng Hới)
  assert.equal(vnProvinceRequired(qt('', [1980, 6, 15])), false, 'sau 1975 cả nước UTC+7');
  assert.equal(formSolarTime(qt('', [1980, 6, 15])).utcOffsetMinutes, 420);
  assert.equal(vnProvinceRequired(qt('', [1957, 6, 15])), false, '7/1955–12/1959 hai miền cùng UTC+7');
  assert.equal(vnProvinceRequired(qt('', [1950, 6, 15])), false, '1947–9/1954 hai miền cùng UTC+8');
  assert.equal(vnProvinceRequired(qt('', [1903, 1, 1])), false, 'trước 1906: giờ địa phương, không phụ thuộc miền');
  // Hai miền khác múi giờ: 10/1954–6/1955 và 1/1960–12/6/1975 (so vnUtcOffset 'north' với 'south')
  assert.equal(vnProvinceRequired(qt('', [1955, 1, 1])), true);
  assert.equal(vnProvinceRequired(qt('', [1975, 6, 12], [22, 0])), true);
  assert.equal(vnProvinceRequired(qt('', [1975, 6, 12], [23, 30])), true, 'giờ lặp: miền Nam đọc lần đầu UTC+8');
  assert.equal(vnProvinceRequired(qt('', [1975, 6, 13], [0, 0])), false);
  assert.equal(vnProvinceRequired(qt('', [1959, 12, 31], [23, 30])), false, 'giờ không tồn tại ở miền Nam đọc theo UTC+7 = miền Bắc');
  assert.equal(vnProvinceRequired(qt('', [1960, 1, 1], [0, 0])), true);
  assert.equal(vnProvinceRequired({ ...qt(''), unknownTime: true }), true, 'không rõ giờ: xét giữa trưa');
  // Bắt buộc ⇔ hai miền khác múi giờ, quét mỗi ~10 ngày 1900–1980
  for (let t = Date.UTC(1900, 0, 1); t < Date.UTC(1981, 0, 1); t += 10 * DAY + 3_600_000 * 5) {
    const dt = new Date(t);
    const [y, mo, d, h] = [dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate(), dt.getUTCHours()];
    const differ = vnUtcOffset('north', 106.6, y, mo, d, h, 0).offsetMinutes !== vnUtcOffset('south', 106.6, y, mo, d, h, 0).offsetMinutes;
    assert.equal(vnProvinceRequired(qt('', [y, mo, d], [h, 0])), differ, `${y}-${mo}-${d} ${h}h: bắt buộc ⇔ hai miền khác múi giờ`);
  }
  // Tỉnh mới không vắt qua ranh giới: chọn tỉnh là đủ
  assert.equal(vnProvinceRequired(vnForm('Huế', [1970, 6, 15], [13, 0])), false);
  assert.equal(formSolarTime(vnForm('Huế', [1970, 6, 15], [13, 0])).utcOffsetMinutes, 480);
  assert.equal(formSolarTime(vnForm('Thừa Thiên Huế', [1970, 6, 15], [13, 0])).longitude, 107.58, 'tên cũ Thừa Thiên Huế');
  assert.equal(vnProvinceRequiredMessage(vnForm('', [1950, 1, 1], [13, 0])), VN_PROVINCE_REQUIRED_MESSAGE);
}
// Giờ Tý muộn — Hà Nội 31/1/2000 23:10 → 23:13,4 → sang ngày 1/2 giờ Tý.
// Giả định UTC+8 cũ: 22:13 giờ Hợi, ở lại 31/1 → khác cả ngày lẫn canh giờ.
{
  const f = vnForm('Hà Nội', [2000, 1, 31], [23, 10]);
  assert.deepEqual(pick(formToBirthInfo(f)), { year: 2000, month: 2, day: 1, hour: 0 }, 'Hà Nội 23:10 → Tý muộn, sang ngày');
  assert.deepEqual(pick(formToBirthInfo(legacyUtc8(f))), { year: 2000, month: 1, day: 31, hour: 11 }, 'giả định UTC+8 cũ: Hợi, không sang ngày');
}
// Sài Gòn 1970 (UTC+8): 23:30 → 22:36,8 giờ Hợi, KHÔNG sang ngày (nếu coi UTC+7 sẽ sang ngày)
{
  const f = vnForm('TP. Hồ Chí Minh', [1970, 1, 31], [23, 30]);
  assert.deepEqual(pick(formToBirthInfo(f)), { year: 1970, month: 1, day: 31, hour: 11 });
}
// Sài Gòn 1970: 00:30 ngày 1/2 → 23:36,8 ngày 31/1 = Tý muộn của 31/1 → lá số ngày 1/2 giờ Tý (#63)
{
  const f = vnForm('TP. Hồ Chí Minh', [1970, 2, 1], [0, 30]);
  const s = formSolarTime(f);
  assert.ok(s.solarMinutes < 0, 'giờ mặt trời rơi về ngày hôm trước');
  assert.deepEqual(pick(formToBirthInfo(f)), { year: 1970, month: 2, day: 1, hour: 0 });
}
// Sài Gòn 1970: 01:20 → 00:26,8 giờ Tý sớm, cùng ngày (UTC+7 sẽ ra giờ Sửu)
{
  const f = vnForm('TP. Hồ Chí Minh', [1970, 3, 5], [1, 20]);
  assert.deepEqual(pick(formToBirthInfo(f)), { year: 1970, month: 3, day: 5, hour: 0 });
}
// Chưa chọn nơi sinh (VN, từ 13/6/1975): không hiệu chỉnh — giữ giờ nhập; Tý muộn vẫn sang ngày theo giờ nhập;
// không ghi offset giả định
for (const year of [2000, 1980]) {
  const f = vnForm('', [year, 1, 31], [23, 10]);
  assert.equal(vnProvinceRequired(f), false, `${year} không chọn tỉnh vẫn được`);
  const s = formSolarTime(f);
  assert.equal(s.corrected, false);
  assert.equal(s.correctionMinutes, 0);
  assert.equal(s.utcOffsetMinutes, undefined);
  assert.equal(s.meridian, undefined);
  const info = formToBirthInfo(f);
  assert.deepEqual(pick(info), { year, month: 2, day: 1, hour: 0 });
  assert.equal(info.longitude, undefined);
  assert.equal(info.country, 'VN');
  assert.equal('utcOffsetMinutes' in info, false, 'không chọn tỉnh → không ghi utcOffsetMinutes');
  assert.equal(formToBirthInfo(vnForm('', [year, 1, 31], [22, 59])).hour, 11);
}

// ── 5) VN + trước 13/6/1975 + chưa chọn tỉnh → bắt buộc chọn tỉnh ───────────────
assert.equal(vnProvinceRequired(vnForm('', [1950, 6, 15], [13, 0])), true, '1950 không chọn tỉnh → bị chặn');
assert.equal(vnProvinceRequired(vnForm('', [1975, 6, 12], [13, 0])), true, '12/6/1975 vẫn trước mốc thống nhất');
assert.equal(vnProvinceRequired(vnForm('', [1975, 6, 13], [13, 0])), false, 'từ 13/6/1975 không bắt buộc');
assert.equal(vnProvinceRequired(vnForm('', [1908, 1, 1], [13, 0])), true, 'giờ Phù Liễn cũng bắt buộc');
assert.equal(vnProvinceRequired(vnForm('Hà Nội', [1950, 6, 15], [13, 0])), false, 'đã chọn tỉnh thì không chặn');
assert.equal(vnProvinceRequired(vnForm('Không có tỉnh này', [1950, 6, 15], [13, 0])), true, 'khoá tỉnh lạ = chưa chọn');
assert.equal(vnProvinceRequired(vnForm('', [1950, 6, 15], [13, 0], { day: '' })), false, 'chưa đủ ngày sinh thì chưa xét');
assert.equal(vnProvinceRequired({ ...vnForm('', [1950, 6, 15], [13, 0]), country: 'CN' }), false, 'Trung Quốc giữ hành vi cũ');
assert.equal(vnProvinceRequired({ ...vnForm('', [1950, 6, 15], [13, 0]), country: undefined }), false, 'form cũ = Trung Quốc');
// Không rõ giờ sinh: giờ Tý, không đổi ngày
assert.deepEqual(pick(formToBirthInfo(vnForm('Hà Nội', [2000, 1, 31], [23, 10], { unknownTime: true }))), { year: 2000, month: 1, day: 31, hour: 0 });
// Link chia sẻ: VN có co=vn và đọc lại được; link cũ không có co → Trung Quốc
{
  const f = vnForm('Hà Nội', [2000, 5, 10], [8, 58]);
  const back = searchParamsToForm(formToSearchParams(f))!;
  assert.equal(back.country, 'VN');
  assert.equal(back.province, 'Hà Nội');
  assert.deepEqual(pick(formToBirthInfo({ ...f, ...back } as BirthFormState)), pick(formToBirthInfo(f)));
  const old = searchParamsToForm(new URLSearchParams('y=1990&m=5&d=1&h=8&mi=0&p=北京市&c=北京&lo=116.4&g=m'))!;
  assert.equal(old.country, 'CN', 'link cũ không có co → Trung Quốc');
}

// ── 4) Trung Quốc / form cũ: y hệt HEAD ──────────────────────────────────────
// Bản sao NGUYÊN VĂN từ HEAD a54e6be (chỉ đổi tên hàm, thêm kiểu tại chỗ). Không sửa, không import code hiện tại.
// — từ `git show a54e6be:lib/ziwei/true-solar-time.ts`:
interface HeadGregorianDate { year: number; month: number; day: number }
function headShiftGregorianDate(date: HeadGregorianDate, dayOffset: number): HeadGregorianDate {
  const shifted = new Date(Date.UTC(date.year, date.month - 1, date.day + dayOffset));
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}
function headBranchFromSolarMinutes(normalizedMinutes: number): number {
  if (normalizedMinutes >= 1380 || normalizedMinutes < 60) return 0;
  return Math.floor((normalizedMinutes - 60) / 120) + 1;
}
function headResolveZiweiDayOffset(
  solar: { dayOffset: number; normalizedMinutes: number; branch: number },
  lateZishi: 'next-day' | 'current-day' | 'all-current' | 'day-cur-time-next' = 'next-day',
): number {
  // day-cur-time-next changes the hour-pillar convention, not the Ziwei
  // main-chart date. Only the explicit next-day rule advances this date.
  const nextDayRule = lateZishi === 'next-day';
  const isLateZishi = solar.branch === 0 && solar.normalizedMinutes >= 1380;

  if (solar.dayOffset < 0 && isLateZishi) {
    return nextDayRule ? solar.dayOffset + 1 : solar.dayOffset;
  }
  if (solar.dayOffset !== 0) return solar.dayOffset;
  if (isLateZishi) return nextDayRule ? 1 : 0;
  return 0;
}
// — từ `git show a54e6be:lib/ziwei/share.ts`:
function headCalcTrueSolarBranch(clockHour: number, clockMinute: number, longitude: number): number {
  const clockMins = clockHour * 60 + clockMinute;
  const offset = (longitude - 120) * 4;
  const solar = ((clockMins + offset) % 1440 + 1440) % 1440;
  if (solar >= 1380 || solar < 60) return 0;
  return Math.floor((solar - 60) / 120) + 1;
}
function headFormToBirthInfo(form: BirthFormState): BirthInfo {
  let y = parseInt(form.year) || 0;
  let m = parseInt(form.month) || 0;
  let d = parseInt(form.day) || 0;
  let hour = 0;
  if (!form.unknownTime) {
    const solar = (parseInt(form.clockHour) || 0) * 60 + (parseInt(form.clockMinute) || 0) + (form.longitude - 120) * 4;
    const normalizedMinutes = ((solar % 1440) + 1440) % 1440;
    hour = headBranchFromSolarMinutes(normalizedMinutes);
    const dayOffset = headResolveZiweiDayOffset({ dayOffset: Math.floor(solar / 1440), normalizedMinutes, branch: hour });
    if (dayOffset !== 0 && y > 0 && m > 0 && d > 0) {
      ({ year: y, month: m, day: d } = headShiftGregorianDate({ year: y, month: m, day: d }, dayOffset));
    }
  }
  return {
    year: y, month: m, day: d,
    hour,
    gender: form.gender,
    name: form.name || undefined,
    province: form.province || undefined,
    city: form.city || undefined,
    longitude: form.province ? form.longitude : undefined,
  };
}

let cnChecked = 0;
const cnDates: Array<[string, string, string]> = [['1988', '6', '15'], ['2000', '12', '31'], ['1975', '2', '28'], ['2024', '2', '29']];
const minutes = ['0', '7', '29', '30', '52', '59'];
for (const prov of PROVINCES) {
  for (const city of prov.cities) {
    for (const [year, month, day] of cnDates) {
      for (let h = 0; h < 24; h++) {
        for (const mi of minutes) {
          const legacy: BirthFormState = {
            name: '', year, month, day, clockHour: String(h), clockMinute: mi, unknownTime: false,
            province: prov.name, city: city.name, longitude: city.longitude, gender: 'female',
          };
          const head = headFormToBirthInfo(legacy);
          assert.deepStrictEqual(formToBirthInfo(legacy), head, `form cũ ${city.name} ${year}-${month}-${day} ${h}:${mi}`);
          assert.deepStrictEqual(formToBirthInfo({ ...legacy, country: 'CN' }), head, `Trung Quốc ${city.name} ${year}-${month}-${day} ${h}:${mi}`);
          const b = headCalcTrueSolarBranch(h, Number(mi), city.longitude);
          assert.equal(formSolarTime({ ...legacy, country: 'CN' }).branch, b, 'canh giờ hiển thị = HEAD');
          cnChecked++;
        }
      }
    }
  }
}
// Không chọn nơi sinh / kinh độ lạ / không rõ giờ — vẫn y HEAD
for (const extra of [
  { province: '', city: '', longitude: 120 },
  { province: '', city: '', longitude: 100 },
  { province: '测试', city: '', longitude: 80 },
  { province: '北京市', city: '北京', longitude: 116.4, unknownTime: true },
]) {
  for (let h = 0; h < 24; h++) {
    const legacy: BirthFormState = { name: 'x', year: '2000', month: '1', day: '31', clockHour: String(h), clockMinute: '30', unknownTime: false, gender: 'male', ...extra };
    assert.deepStrictEqual(formToBirthInfo(legacy), headFormToBirthInfo(legacy));
    assert.deepStrictEqual(formToBirthInfo({ ...legacy, country: 'CN' }), headFormToBirthInfo(legacy));
  }
}
assert.ok(cnChecked > 100000, `số ca Trung Quốc quá ít: ${cnChecked}`);

// ── 6) BirthForm / heming: mặc định Việt Nam, form cũ = Trung Quốc, dùng formSolarTime ─────
const src = readFileSync(new URL('../../components/BirthForm.tsx', import.meta.url), 'utf8');
assert.match(src, /country:\s*initialData\?\.country\s*\?\?\s*\(initialData\?\.year \|\| initialData\?\.province \? 'CN' : 'VN'\)/,
  'form trống mặc định Việt Nam; dữ liệu cũ không có country = Trung Quốc');
assert.match(src, /formSolarTime\(form\)/, 'canh giờ hiển thị phải dùng formSolarTime (cùng nguồn với formToBirthInfo)');
assert.doesNotMatch(src, /longitude\s*-\s*120/, 'BirthForm không tự tính (kinh độ − 120) × 4 — dùng solar.correctionMinutes');
assert.match(src, /province:\s*vnProvinceRequired\(form\)\s*\?\s*vnProvinceRequiredMessage\(form\)/, 'BirthForm phải chặn VN trước 1975 chưa chọn tỉnh / khu vực (errors.province)');
assert.match(src, /canonicalVnPlace\(form\.province, form\.city\)/, 'BirthForm hiển thị tên tỉnh cũ theo đơn vị mới + mục con');
const heming = readFileSync(new URL('../../app/heming/page.tsx', import.meta.url), 'utf8');
assert.match(heming, /vnProvinceRequired/, '/heming (form không có nút submit riêng) cũng phải chặn');

console.log(`✅ Form người Việt: 34 tỉnh/thành (+63 tỉnh cũ làm mục con), Quảng Trị mới theo miền, múi giờ VN khớp tzdata (${sampled} mẫu), ca VN/Tý muộn đúng, Trung Quốc y HEAD (${cnChecked} ca)`);

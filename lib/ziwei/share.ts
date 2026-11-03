import type { BirthFormState } from '@/components/BirthForm';
import type { BirthCountry, BirthInfo } from './types';
import { branchFromSolarMinutes, longitudeCorrection, resolveZiweiDayOffset, shiftGregorianDate, zoneMeridian } from './true-solar-time';
import { findVnProvince, resolveVnPlace, vnPlaceRegions, type VnLocality } from './vn-places';
import { vnUtcOffset, type VnZoneResult } from './vn-timezone';

/** Form cũ (lịch sử, link chia sẻ trước khi có Việt Nam) không có `country` → Trung Quốc. */
export function formCountry(form: Pick<BirthFormState, 'country'>): BirthCountry {
  return form.country === 'VN' ? 'VN' : 'CN';
}

/** Cả nước dùng chung UTC+7 từ 13/6/1975 (vn-timezone.ts); trước mốc này giờ đồng hồ khác nhau theo miền / thời kỳ. */
export const VN_UNIFIED_UTC7_FROM = { year: 1975, month: 6, day: 13 } as const;

export const VN_PROVINCE_REQUIRED_MESSAGE =
  'Sinh trước 13/6/1975: vui lòng chọn tỉnh/thành nơi sinh (và khu vực nếu tỉnh mới gồm cả vùng phía Bắc lẫn phía Nam sông Bến Hải, như Quảng Trị = Quảng Bình + Quảng Trị cũ). Khi đó giờ đồng hồ ở Việt Nam có giai đoạn là UTC+8 hoặc UTC+9 và khác nhau giữa miền Bắc, miền Nam — không biết nơi sinh thì không hiểu đúng được giờ đã nhập (có thể lệch hơn 1 tiếng).';

/** Thông báo riêng khi đã chọn tỉnh vắt qua sông Bến Hải nhưng chưa chọn khu vực. */
export function vnAreaRequiredMessage(province: string): string {
  return `${province} gồm cả vùng phía Bắc và phía Nam sông Bến Hải (vĩ tuyến 17). Ngày giờ sinh này hai miền dùng múi giờ khác nhau — vui lòng chọn khu vực nơi sinh (tỉnh cũ, hoặc Vĩnh Linh nếu ở bờ bắc sông Bến Hải).`;
}

type VnRequiredFields = Pick<BirthFormState, 'country' | 'province' | 'city' | 'year' | 'month' | 'day'>
  & Partial<Pick<BirthFormState, 'clockHour' | 'clockMinute' | 'unknownTime'>>;

/**
 * Việt Nam + nơi sinh chưa đủ để biết múi giờ lúc sinh → bắt buộc chọn (form chặn lập lá số):
 * · chưa chọn tỉnh + ngày sinh trước 13/6/1975;
 * · đã chọn tỉnh vắt qua sông Bến Hải (Quảng Trị mới) nhưng chưa chọn khu vực, và lúc sinh hai miền khác
 *   múi giờ (vnUtcOffset 'north' ≠ 'south'; không rõ giờ sinh: lấy giữa trưa như formSolarTime).
 * Từ 13/6/1975 trở đi không chọn tỉnh vẫn được (không hiệu chỉnh, như quy ước repo).
 */
export function vnProvinceRequired(form: VnRequiredFields): boolean {
  if (formCountry(form) !== 'VN') return false;
  const y = parseInt(form.year) || 0;
  const m = parseInt(form.month) || 0;
  const d = parseInt(form.day) || 0;
  if (!y || !m || !d) return false;
  const regions = vnPlaceRegions(form.province, form.city);
  if (regions.length === 1) return false;
  if (regions.length > 1) {
    const lon = resolveVnPlace(form.province, form.city)!.longitude;
    const h = form.unknownTime ? 12 : parseInt(form.clockHour ?? '') || 0;
    const mi = form.unknownTime ? 0 : parseInt(form.clockMinute ?? '') || 0;
    const offsets = new Set(regions.map(r => vnUtcOffset(r, lon, y, m, d, h, mi).offsetMinutes));
    return offsets.size > 1;
  }
  const u = VN_UNIFIED_UTC7_FROM;
  return y * 10000 + m * 100 + d < u.year * 10000 + u.month * 100 + u.day;
}

/** Thông báo cho vnProvinceRequired — cụ thể theo trường hợp (BirthForm); /heming dùng VN_PROVINCE_REQUIRED_MESSAGE. */
export function vnProvinceRequiredMessage(form: Pick<BirthFormState, 'province'>): string {
  const p = findVnProvince(form.province);
  return p ? vnAreaRequiredMessage(p.name) : VN_PROVINCE_REQUIRED_MESSAGE;
}

export interface FormSolarTime {
  country: BirthCountry;
  /** Có hiệu chỉnh kinh độ hay không (VN: đã chọn tỉnh; CN: đã chọn tỉnh — giữ quy ước cũ). */
  corrected: boolean;
  /**
   * Offset UTC (phút) mà giờ đồng hồ đã nhập được hiểu theo. VN: chỉ có khi đã chọn tỉnh
   * (chưa đủ ngày sinh thì tạm UTC+7 để hiển thị); chưa chọn tỉnh = undefined, không hiệu chỉnh.
   */
  utcOffsetMinutes?: number;
  /** Kinh tuyến chuẩn = offset / 4 */
  meridian?: number;
  longitude?: number;
  /** Hiệu chỉnh kinh độ (phút) cộng vào giờ đồng hồ */
  correctionMinutes: number;
  /** Giờ mặt trời (phút kể từ 0h ngày nhập; có thể < 0 hoặc ≥ 1440 khi lệch ngày) */
  solarMinutes: number;
  normalizedMinutes: number;
  branch: number;
  /** VN: địa điểm đã chọn (tỉnh lỵ hoặc mục con) */
  place?: VnLocality;
  /** VN: kết quả tra lịch sử múi giờ; vắng khi chưa đủ ngày sinh / chưa chọn tỉnh */
  zone?: VnZoneResult;
}

/**
 * Giờ mặt trời của form — MỘT nơi duy nhất cho cả BirthForm (hiển thị canh giờ) và formToBirthInfo.
 *
 * · Trung Quốc (và mọi form cũ không có `country`): y nguyên HEAD — giờ Bắc Kinh, (kinh độ − 120) × 4,
 *   kể cả khi chưa chọn tỉnh (kinh độ mặc định 120 → hiệu chỉnh 0). Không tự xử lý giờ mùa hè TQ
 *   (dst-cn.ts chỉ để cảnh báo, như trước).
 * · Việt Nam: giờ đồng hồ tại VN lúc sinh; offset UTC theo vùng + ngày giờ (vn-timezone.ts), kinh tuyến
 *   chuẩn = offset / 4. Chưa chọn tỉnh → không hiệu chỉnh (giữ giờ nhập), như quy ước repo.
 * Cùng quy ước với nhánh TQ: chỉ hiệu chỉnh kinh độ, không cộng phương trình thời gian.
 */
export function formSolarTime(form: BirthFormState): FormSolarTime {
  const country = formCountry(form);
  const clockMins = (parseInt(form.clockHour) || 0) * 60 + (parseInt(form.clockMinute) || 0);
  let utcOffsetMinutes: number | undefined = 480;
  let correctionMinutes: number;
  let longitude: number | undefined;
  let place: VnLocality | undefined;
  let zone: VnZoneResult | undefined;
  let corrected: boolean;

  if (country === 'CN') {
    longitude = form.longitude;
    correctionMinutes = longitudeCorrection(form.longitude);
    corrected = !!form.province;
  } else {
    place = resolveVnPlace(form.province, form.city);
    utcOffsetMinutes = place ? 420 : undefined;
    const y = parseInt(form.year) || 0;
    const m = parseInt(form.month) || 0;
    const d = parseInt(form.day) || 0;
    if (place && y > 0 && m > 0 && d > 0) {
      // Không rõ giờ sinh: lấy giữa trưa chỉ để hiển thị múi giờ của ngày đó
      const h = form.unknownTime ? 12 : parseInt(form.clockHour) || 0;
      const mi = form.unknownTime ? 0 : parseInt(form.clockMinute) || 0;
      zone = vnUtcOffset(place.region, place.longitude, y, m, d, h, mi);
      utcOffsetMinutes = zone.offsetMinutes;
    }
    longitude = place?.longitude;
    corrected = !!place;
    correctionMinutes = place ? longitudeCorrection(place.longitude, utcOffsetMinutes) : 0;
  }

  const solarMinutes = clockMins + correctionMinutes;
  const normalizedMinutes = ((solarMinutes % 1440) + 1440) % 1440;
  return {
    country,
    corrected,
    utcOffsetMinutes,
    meridian: utcOffsetMinutes === undefined ? undefined : zoneMeridian(utcOffsetMinutes),
    longitude,
    correctionMinutes,
    solarMinutes,
    normalizedMinutes,
    branch: form.unknownTime ? 0 : branchFromSolarMinutes(normalizedMinutes),
    place,
    zone,
  };
}

/** BirthFormState → BirthInfo
 *
 * 子时规则（倪海厦体系/三合派标准）：
 * · 23:00-23:59 = 晚子时，**按次日**排盘（日期 +1）
 * · 00:00-00:59 = 早子时，按本日排盘
 * 这与「时辰支同为子(0)」并不冲突——子时分早晚两段，需要在日期上区分。
 */
export function formToBirthInfo(form: BirthFormState): BirthInfo {
  let y = parseInt(form.year) || 0;
  let m = parseInt(form.month) || 0;
  let d = parseInt(form.day) || 0;
  let hour = 0;
  const solar = formSolarTime(form);

  // 晚子时换日按真太阳时判定，与时辰支同一口径（见 true-solar-time.ts 的 resolveZiweiDayOffset）。
  // 只看钟表 23 点会和经度校正后的时辰错位：东经 100° 钟表 23:30 是真太阳时 22:10 亥时，不该换日。
  // Việt Nam dùng cùng logic, trên giờ mặt trời đã hiệu chỉnh theo múi giờ VN lịch sử.
  if (!form.unknownTime) {
    hour = solar.branch;
    const dayOffset = resolveZiweiDayOffset({ dayOffset: Math.floor(solar.solarMinutes / 1440), normalizedMinutes: solar.normalizedMinutes, branch: hour });
    if (dayOffset !== 0 && y > 0 && m > 0 && d > 0) {
      ({ year: y, month: m, day: d } = shiftGregorianDate({ year: y, month: m, day: d }, dayOffset));
    }
  }

  const base: BirthInfo = {
    year: y, month: m, day: d,
    hour,
    gender: form.gender,
    name: form.name || undefined,
    province: form.province || undefined,
    city: form.city || undefined,
    longitude: form.province ? form.longitude : undefined,
  };
  if (solar.country === 'CN') return base;
  return {
    ...base,
    longitude: solar.longitude,
    country: 'VN',
    // Chỉ ghi offset khi đã tra được theo tỉnh + ngày sinh; không ghi giá trị giả định
    ...(solar.zone ? { utcOffsetMinutes: solar.zone.offsetMinutes } : {}),
  };
}

/** BirthFormState → URLSearchParams（用于分享链接） */
export function formToSearchParams(form: BirthFormState): URLSearchParams {
  const p = new URLSearchParams();
  if (form.name) p.set('n', form.name);
  p.set('y', form.year);
  p.set('m', form.month);
  p.set('d', form.day);
  if (form.unknownTime) {
    p.set('u', '1');
  } else {
    p.set('h', form.clockHour);
    p.set('mi', form.clockMinute);
  }
  if (form.province) p.set('p', form.province);
  if (form.city) p.set('c', form.city);
  if (form.longitude && form.longitude !== 120) p.set('lo', String(form.longitude));
  // Link cũ không có `co` = Trung Quốc
  if (formCountry(form) === 'VN') p.set('co', 'vn');
  p.set('g', form.gender === 'male' ? 'm' : 'f');
  return p;
}

/** URLSearchParams → Partial<BirthFormState>，不完整时返回 null */
export function searchParamsToForm(params: URLSearchParams): Partial<BirthFormState> | null {
  const year = params.get('y');
  const month = params.get('m');
  const day = params.get('d');
  if (!year || !month || !day) return null;
  return {
    name: params.get('n') || '',
    year,
    month,
    day,
    unknownTime: params.get('u') === '1',
    clockHour: params.get('h') || '8',
    clockMinute: params.get('mi') || '0',
    province: params.get('p') || '',
    city: params.get('c') || '',
    longitude: parseFloat(params.get('lo') || '120'),
    gender: params.get('g') === 'f' ? 'female' : 'male',
    country: params.get('co') === 'vn' ? 'VN' : 'CN',
  };
}

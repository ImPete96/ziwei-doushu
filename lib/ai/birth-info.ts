import 'server-only';
import type { BirthInfo } from '../ziwei/types';

/**
 * Đọc chart.birthInfo trình duyệt gửi lên, chỉ giữ các trường cần để an lại lá số trên máy chủ
 * (không lấy họ tên, không tin phần còn lại của chart). Dùng chung cho /api/interpret và /api/patterns.
 */
export function parseBirthInfo(raw: unknown): BirthInfo | null {
  const b = (raw as { birthInfo?: Record<string, unknown> } | null)?.birthInfo;
  if (!b) return null;
  const int = (v: unknown) => (Number.isInteger(v) ? (v as number) : undefined);
  const year = int(b.year), month = int(b.month), day = int(b.day), hour = int(b.hour);
  if (year === undefined || month === undefined || day === undefined || hour === undefined) return null;
  if (b.gender !== 'male' && b.gender !== 'female') return null;
  return {
    year, month, day, hour, gender: b.gender,
    country: b.country === 'VN' ? 'VN' : undefined,
    utcOffsetMinutes: int(b.utcOffsetMinutes),
    longitude: typeof b.longitude === 'number' && Number.isFinite(b.longitude) ? b.longitude : undefined,
    unknownTime: b.unknownTime === true ? true : undefined,
  } as BirthInfo;
}

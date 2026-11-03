import 'server-only';

/**
 * Giới hạn lượt gọi AI trong bộ nhớ của tiến trình: theo IP mỗi giờ và tổng mỗi ngày.
 * Đủ cho một máy chủ đơn; chạy nhiều instance (serverless) thì cần kho dùng chung như Redis.
 */

const HOUR_MS = 60 * 60 * 1000;
const PER_IP_PER_HOUR = Number(process.env.AI_RATE_PER_HOUR ?? 30);
const PER_DAY = Number(process.env.AI_DAILY_LIMIT ?? 500);

const hits = new Map<string, number[]>();
let day = '';
let dayCount = 0;

export type QuotaResult = { ok: true } | { ok: false; reason: 'ip' | 'day' };

export function takeQuota(ip: string, now = Date.now()): QuotaResult {
  const today = new Date(now).toISOString().slice(0, 10);
  if (today !== day) {
    day = today;
    dayCount = 0;
    hits.clear();
  }
  if (dayCount >= PER_DAY) return { ok: false, reason: 'day' };

  const recent = (hits.get(ip) ?? []).filter((t) => now - t < HOUR_MS);
  if (recent.length >= PER_IP_PER_HOUR) {
    hits.set(ip, recent);
    return { ok: false, reason: 'ip' };
  }
  recent.push(now);
  hits.set(ip, recent);
  dayCount++;
  return { ok: true };
}

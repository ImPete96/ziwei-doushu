import { generateChart } from '@/lib/ziwei/algorithm';
import { detectPatterns } from '@/lib/ziwei/patterns';
import { parseBirthInfo } from '@/lib/ai/birth-info';

/**
 * POST /api/patterns — cách cục engine nhận diện cho một lá số.
 * lib/ziwei/patterns.ts chỉ chạy trên máy chủ, nên PatternsCard ở trang lá số lấy kết quả qua đây.
 * Vào: { chart: { birthInfo } }. Ra: { patterns: Pattern[] }.
 */
export async function POST(req: Request) {
  let body: { chart?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'invalid-json' }, { status: 400 });
  }
  const birthInfo = parseBirthInfo(body.chart);
  if (!birthInfo) return Response.json({ error: 'invalid-request' }, { status: 400 });
  try {
    return Response.json({ patterns: detectPatterns(generateChart(birthInfo)) });
  } catch {
    return Response.json({ error: 'invalid-birth-info' }, { status: 400 });
  }
}

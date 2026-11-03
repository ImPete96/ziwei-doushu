import Anthropic from '@anthropic-ai/sdk';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo } from '@/lib/ziwei/types';
import { buildChartBrief } from '@/lib/ai/chart-brief';
import { takeQuota } from '@/lib/ai/rate-limit';
import { streamOllama, OllamaError, OLLAMA_MODEL, type ChatMessage } from '@/lib/ai/ollama';

/**
 * POST /api/interpret — luận giải lá số bằng Claude, hoặc model chạy trên máy qua Ollama
 * khi AI_PROVIDER=ollama.
 *
 * Vào: { chart, messages } như InsightPanel / ChatPanel gửi. Lá số được an lại trên máy chủ
 * từ chart.birthInfo, nên dữ liệu đưa cho AI luôn do engine tính, không tin phần còn lại
 * của chart phía trình duyệt.
 * Ra: SSE, mỗi dòng `data: {"delta":{"text":"..."}}`, kết thúc bằng `data: [DONE]`.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PROVIDER = process.env.AI_PROVIDER === 'ollama' ? 'ollama' : 'anthropic';
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-5-5';
const EFFORT = (process.env.AI_EFFORT || 'medium') as 'low' | 'medium' | 'high' | 'xhigh' | 'max';
// Mô hình nhận `fallbacks: "default"` (chuyển sang mô hình dự phòng khi bị từ chối nhầm).
const FALLBACK_MODELS = new Set(['claude-opus-5-5', 'claude-opus-5', 'claude-fable-5-1', 'claude-sonnet-5-5']);

const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 8000;
const MAX_TOTAL_CHARS = 60000;

const SYSTEM_PROMPT = `Bạn là thầy luận Tử Vi Đẩu Số theo hệ thống Thiên Kỷ của Nghê Hải Hạ, trả lời bằng tiếng Việt.

Nguyên tắc:
- Căn cứ duy nhất là lá số do engine an sao cung cấp bên dưới. Không tự an thêm sao, không đổi vị trí sao, độ sáng hay Tứ Hóa. Thiếu dữ liệu thì nói rõ là thiếu.
- Dùng thuật ngữ Hán-Việt quen thuộc với người Việt (Hóa Lộc, Tam phương tứ chính, vô chính diệu, đại hạn, lưu niên…). Không viết chữ Hán.
- Luận theo trọng tâm của hệ Nghê Hải Hạ: chính tinh và độ sáng, Tứ Hóa (năm sinh, đại hạn, lưu niên), Tam phương tứ chính, cung vô chính diệu mượn sao cung đối. Khi dẫn quan điểm của Nghê Hải Hạ hay cổ thư, chỉ nêu ý chung, không bịa trích dẫn nguyên văn hay số tập, mốc thời gian.
- Khi người dùng yêu cầu cấu trúc với tiêu đề dạng **【...】**, giữ đúng các tiêu đề đó, mỗi tiêu đề một dòng riêng.
- Viết cụ thể, gắn với sao và cung trong lá số này; tránh câu chung chung áp cho ai cũng đúng.
- Giọng điềm tĩnh, xây dựng, không phán định mệnh tuyệt đối, không hù dọa.
- Sức khỏe, pháp lý, tài chính: chỉ nói xu hướng theo lá số, khuyên hỏi chuyên gia khi cần; không chẩn đoán bệnh, không khuyên đầu tư cụ thể.
- Lục thân (cha mẹ, anh em, con cái): Nghê Hải Hạ cho rằng Đẩu Số yếu hơn ở phần này, nên nói rõ đây chỉ là tham khảo.`;

function parseMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_MESSAGES) return null;
  const msgs: ChatMessage[] = [];
  let total = 0;
  for (const m of raw) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') return null;
    if (m.content.length > MAX_MESSAGE_CHARS) return null;
    total += m.content.length;
    // Tin trả lời rỗng (lượt trước lỗi giữa chừng) thì bỏ, API không nhận nội dung rỗng.
    if (m.content.trim()) msgs.push({ role: m.role, content: m.content });
  }
  if (total > MAX_TOTAL_CHARS || msgs[0]?.role !== 'user' || msgs.at(-1)?.role !== 'user') return null;
  return msgs;
}

function parseBirthInfo(raw: unknown): BirthInfo | null {
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
  } as BirthInfo;
}

function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'local';
}

function errorText(err: unknown): string {
  if (err instanceof OllamaError) {
    if (err.kind === 'connect') return 'Không kết nối được Ollama. Hãy mở ứng dụng Ollama trên máy rồi thử lại.';
    if (err.kind === 'model') return `Ollama chưa có model ${OLLAMA_MODEL}. Chạy lệnh: ollama pull ${OLLAMA_MODEL}`;
    return `Ollama báo lỗi: ${err.message}`;
  }
  if (err instanceof Anthropic.AuthenticationError) {
    return 'API key Anthropic không hợp lệ. Kiểm tra ANTHROPIC_API_KEY trong file .env.local rồi khởi động lại máy chủ.';
  }
  if (err instanceof Anthropic.RateLimitError) return 'Anthropic đang giới hạn lượt gọi, vui lòng thử lại sau ít phút.';
  if (err instanceof Anthropic.APIConnectionError) return 'Không kết nối được tới Anthropic, vui lòng thử lại sau.';
  if (err instanceof Anthropic.APIError) return `Anthropic báo lỗi ${err.status ?? ''}, vui lòng thử lại sau.`;
  if (err instanceof Anthropic.AnthropicError) {
    return 'Chưa cấu hình Anthropic: thêm ANTHROPIC_API_KEY vào file .env.local rồi khởi động lại máy chủ.';
  }
  return 'Luận giải thất bại, vui lòng thử lại sau.';
}

export async function POST(req: Request) {
  let body: { chart?: unknown; messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'invalid-json' }, { status: 400 });
  }
  const birthInfo = parseBirthInfo(body.chart);
  const messages = parseMessages(body.messages);
  if (!birthInfo || !messages) return Response.json({ error: 'invalid-request' }, { status: 400 });

  let brief: string;
  try {
    brief = buildChartBrief(generateChart(birthInfo), new Date().getFullYear());
  } catch {
    return Response.json({ error: 'invalid-birth-info' }, { status: 400 });
  }

  const quota = takeQuota(clientIp(req));

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (text: string) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text } })}\n\n`));
      try {
        if (!quota.ok) {
          send(quota.reason === 'ip'
            ? 'Bạn đã dùng hết lượt luận giải trong giờ này, vui lòng quay lại sau.'
            : 'Hôm nay đã hết lượt luận giải AI, vui lòng quay lại vào ngày mai.');
          return;
        }
        if (PROVIDER === 'ollama') {
          await streamOllama({
            system: `${SYSTEM_PROMPT}\n\n# Lá số của người hỏi\n\n${brief}`,
            messages,
            signal: req.signal,
            onText: send,
          });
          return;
        }
        const client = new Anthropic();
        const useFallback = FALLBACK_MODELS.has(MODEL);
        const claude = client.beta.messages.stream({
          model: MODEL,
          max_tokens: 16000,
          output_config: { effort: EFFORT },
          ...(useFallback ? { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const } : {}),
          cache_control: { type: 'ephemeral' },
          system: [
            { type: 'text', text: SYSTEM_PROMPT },
            { type: 'text', text: `# Lá số của người hỏi\n\n${brief}` },
          ],
          messages,
        }, { signal: req.signal });

        for await (const event of claude) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') send(event.delta.text);
        }
        const final = await claude.finalMessage();
        if (final.stop_reason === 'refusal') send('\n\n(AI đã từ chối trả lời yêu cầu này.)');
        else if (final.stop_reason === 'max_tokens') send('\n\n(Bài luận dài quá giới hạn nên bị cắt.)');
      } catch (err) {
        if (req.signal.aborted) return;
        console.error('[api/interpret]', err);
        send(errorText(err));
      } finally {
        try {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch { /* client đã ngắt kết nối */ }
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

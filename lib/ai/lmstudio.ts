import 'server-only';
import { thinkFilter, type ChatMessage } from './ollama';

/**
 * Gọi model chạy trên máy qua máy chủ của LM Studio (chuẩn OpenAI /v1/chat/completions, SSE).
 * Độ dài ngữ cảnh do LM Studio đặt lúc nạp model, không chỉnh được qua API này:
 * nạp bằng `lms load <model> -c 16384` để bản tóm tắt lá số không bị cắt.
 */

const BASE_URL = (process.env.LMSTUDIO_BASE_URL || 'http://localhost:1234/v1').replace(/\/+$/, '');
export const LMSTUDIO_MODEL = process.env.LMSTUDIO_MODEL || '';
// Model có chế độ suy nghĩ (Qwen3.5…) sẽ nghĩ rất lâu bằng tiếng Anh trước khi trả lời;
// 'none' tắt hẳn. Để trống nếu model không nhận tham số này.
const REASONING_EFFORT = process.env.LMSTUDIO_REASONING_EFFORT ?? 'none';

export class LmStudioError extends Error {
  constructor(public kind: 'connect' | 'config' | 'http', detail?: string) {
    super(detail ?? kind);
  }
}

function errorMessage(raw: string): string {
  try {
    const j = JSON.parse(raw) as { error?: string | { message?: string } };
    if (typeof j.error === 'string') return j.error;
    if (j.error?.message) return j.error.message;
  } catch { /* không phải JSON */ }
  return raw.slice(0, 300);
}

export async function streamLmStudio(opts: {
  system: string;
  messages: ChatMessage[];
  signal: AbortSignal;
  onText: (text: string) => void;
}): Promise<void> {
  if (!LMSTUDIO_MODEL) throw new LmStudioError('config');
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: LMSTUDIO_MODEL,
        messages: [{ role: 'system', content: opts.system }, ...opts.messages],
        stream: true,
        ...(REASONING_EFFORT ? { reasoning_effort: REASONING_EFFORT } : {}),
      }),
      signal: opts.signal,
    });
  } catch (err) {
    if (opts.signal.aborted) throw err;
    throw new LmStudioError('connect');
  }
  if (!res.ok || !res.body) throw new LmStudioError('http', errorMessage(await res.text()));

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  const strip = thinkFilter();
  let buffer = '';
  const handle = (line: string) => {
    if (!line.startsWith('data:')) return;
    const data = line.slice(5).trim();
    if (!data || data === '[DONE]') return;
    const obj = JSON.parse(data) as {
      error?: string | { message?: string };
      choices?: { delta?: { content?: string | null } }[];
    };
    if (obj.error) throw new LmStudioError('http', errorMessage(data));
    const text = obj.choices?.[0]?.delta?.content;
    if (text) {
      const out = strip(text);
      if (out) opts.onText(out);
    }
  };
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buffer.indexOf('\n')) >= 0) {
      handle(buffer.slice(0, nl).trimEnd());
      buffer = buffer.slice(nl + 1);
    }
  }
  handle((buffer + decoder.decode()).trimEnd());
}

import 'server-only';

/**
 * Gọi model chạy trên máy qua Ollama (API gốc /api/chat, trả NDJSON từng dòng).
 * Dùng API gốc thay vì lớp tương thích OpenAI để đặt được num_ctx: mặc định của Ollama
 * nhỏ, bản tóm tắt lá số + lời dặn sẽ bị cắt mất phần đầu mà không báo lỗi.
 */

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

const BASE_URL = (process.env.OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/+$/, '');
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma3:12b';
const NUM_CTX = Number(process.env.OLLAMA_NUM_CTX ?? 16384);

export class OllamaError extends Error {
  constructor(public kind: 'connect' | 'model' | 'http', detail?: string) {
    super(detail ?? kind);
  }
}

/** Bỏ khối <think>…</think> ở đầu câu trả lời (model có chế độ suy nghĩ như qwen3). */
function thinkFilter() {
  let state: 'probe' | 'think' | 'pass' = 'probe';
  let buf = '';
  return (chunk: string): string => {
    if (state === 'pass') return chunk;
    buf += chunk;
    if (state === 'probe') {
      const head = buf.trimStart();
      if (head.length < 7 && '<think>'.startsWith(head)) return '';
      if (!head.startsWith('<think>')) {
        state = 'pass';
        const out = buf;
        buf = '';
        return out;
      }
      state = 'think';
    }
    const end = buf.indexOf('</think>');
    if (end < 0) return '';
    state = 'pass';
    const out = buf.slice(end + '</think>'.length).trimStart();
    buf = '';
    return out;
  };
}

export async function streamOllama(opts: {
  system: string;
  messages: ChatMessage[];
  signal: AbortSignal;
  onText: (text: string) => void;
}): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [{ role: 'system', content: opts.system }, ...opts.messages],
        stream: true,
        options: { num_ctx: NUM_CTX },
      }),
      signal: opts.signal,
    });
  } catch (err) {
    if (opts.signal.aborted) throw err;
    throw new OllamaError('connect');
  }
  if (res.status === 404) throw new OllamaError('model');
  if (!res.ok || !res.body) throw new OllamaError('http', `HTTP ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  const strip = thinkFilter();
  let buffer = '';
  const handle = (line: string) => {
    if (!line.trim()) return;
    const obj = JSON.parse(line) as { message?: { content?: string }; error?: string };
    if (obj.error) throw new OllamaError('http', obj.error);
    const text = obj.message?.content;
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
      handle(buffer.slice(0, nl));
      buffer = buffer.slice(nl + 1);
    }
  }
  handle(buffer + decoder.decode());
}

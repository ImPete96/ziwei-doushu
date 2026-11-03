/**
 * lib/ai/ollama.ts với một máy chủ Ollama giả lập (không cần cài Ollama):
 * ① NDJSON bị cắt giữa dòng và giữa ký tự UTF-8 vẫn ghép đúng; khối <think> đầu bài bị bỏ;
 *   gửi kèm lời dặn hệ thống và num_ctx.
 * ② model chưa tải (404) → OllamaError kind 'model'.
 * ③ không có máy chủ → OllamaError kind 'connect'.
 *
 * ollama.ts có `server-only`, trỏ nó về module rỗng như patterns-sihua-bonus.test.ts.
 */
import assert from 'node:assert/strict';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import * as nodeModule from 'node:module';

type HookResult = { url?: string; format?: string; source?: string; shortCircuit?: boolean };
const { registerHooks } = nodeModule as unknown as {
  registerHooks(hooks: {
    resolve(specifier: string, context: unknown, next: (s: string, c: unknown) => HookResult): HookResult;
    load(url: string, context: unknown, next: (u: string, c: unknown) => HookResult): HookResult;
  }): void;
};
const SERVER_ONLY_STUB = 'data:text/javascript,';
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'server-only') return { url: SERVER_ONLY_STUB, shortCircuit: true };
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === SERVER_ONLY_STUB) return { format: 'commonjs', source: '', shortCircuit: true };
    return nextLoad(url, context);
  },
});

const lines = ['<thi', 'nk>đang nghĩ…', '</think>\n\n', '**【Mệnh cách】**\n', 'Phá Quân thủ Mệnh', '.']
  .map((content) => JSON.stringify({ message: { role: 'assistant', content }, done: false }) + '\n')
  .concat(JSON.stringify({ done: true }) + '\n');
const payload = Buffer.from(lines.join(''));

let received: { model?: string; messages?: { role: string; content: string }[]; options?: { num_ctx?: number } } = {};
const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', (c) => { body += c; });
  req.on('end', async () => {
    received = JSON.parse(body);
    res.writeHead(200, { 'Content-Type': 'application/x-ndjson' });
    // Gửi từng mẩu 7 byte: cắt ngang dòng JSON và ngang ký tự tiếng Việt nhiều byte
    for (let i = 0; i < payload.length; i += 7) {
      res.write(payload.subarray(i, i + 7));
      await new Promise((r) => setTimeout(r, 1));
    }
    res.end();
  });
});

async function main() {
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  const port = (server.address() as AddressInfo).port;
  process.env.OLLAMA_BASE_URL = `http://127.0.0.1:${port}`;
  process.env.OLLAMA_MODEL = 'gemma3:12b';
  const { streamOllama, OllamaError } = await import('../../lib/ai/ollama');
  const signal = new AbortController().signal;
  const messages = [{ role: 'user' as const, content: 'Luận Mệnh cách' }];

  let text = '';
  await streamOllama({ system: 'LỜI DẶN', messages, signal, onText: (t) => { text += t; } });
  assert.equal(text, '**【Mệnh cách】**\nPhá Quân thủ Mệnh.');
  assert.equal(received.messages?.[0]?.role, 'system');
  assert.equal(received.messages?.[0]?.content, 'LỜI DẶN');
  assert.equal(received.options?.num_ctx, 16384);
  console.log('  ✅ ① ghép NDJSON bị cắt, bỏ <think>, gửi lời dặn + num_ctx');

  // ② máy chủ trả 404 như Ollama khi model chưa được tải về
  const orig = server.listeners('request')[0] as http.RequestListener;
  server.removeAllListeners('request');
  server.on('request', (req, res) => {
    req.resume();
    req.on('end', () => {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "model 'gemma3:12b' not found" }));
    });
  });
  await assert.rejects(
    streamOllama({ system: 'x', messages, signal, onText: () => {} }),
    (e: unknown) => e instanceof OllamaError && e.kind === 'model',
  );
  server.removeAllListeners('request');
  server.on('request', orig);
  console.log('  ✅ ② model chưa tải → kind model');

  await new Promise<void>((r) => server.close(() => r()));
  await assert.rejects(
    streamOllama({ system: 'x', messages, signal, onText: () => {} }),
    (e: unknown) => e instanceof OllamaError && e.kind === 'connect',
  );
  console.log('  ✅ ③ không có máy chủ → kind connect');
  console.log('✅ ollama-stream: tất cả đạt');
}

main().catch((e) => { console.error(e); process.exit(1); });

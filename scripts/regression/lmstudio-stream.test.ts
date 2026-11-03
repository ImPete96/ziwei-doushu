/**
 * lib/ai/lmstudio.ts với một máy chủ LM Studio giả lập (chuẩn OpenAI, SSE):
 * ① SSE bị cắt giữa dòng và giữa ký tự UTF-8 vẫn ghép đúng; reasoning_content bị bỏ qua;
 *   gửi kèm lời dặn hệ thống, model và reasoning_effort 'none'.
 * ② HTTP 400 kèm {"error":{"message"}} → LmStudioError kind 'http' mang đúng thông báo.
 * ③ không có máy chủ → LmStudioError kind 'connect'.
 *
 * lmstudio.ts có `server-only`, trỏ nó về module rỗng như patterns-sihua-bonus.test.ts.
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

const deltas = [{ role: 'assistant', reasoning_content: 'Thinking…' }, { content: '**【Mệnh cách】**\n' }, { content: 'Phá Quân thủ Mệnh' }, { content: '.' }];
const payload = Buffer.from(
  deltas.map((delta) => `data: ${JSON.stringify({ choices: [{ index: 0, delta }] })}\n\n`).join('') + 'data: [DONE]\n\n',
);

let received: { model?: string; reasoning_effort?: string; messages?: { role: string; content: string }[] } = {};
let mode: 'ok' | 'error' = 'ok';
const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', (c) => { body += c; });
  req.on('end', async () => {
    received = JSON.parse(body);
    if (mode === 'error') {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: 'The number of tokens to keep from the initial prompt is greater than the context length' } }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/event-stream' });
    // Gửi từng mẩu 9 byte: cắt ngang dòng SSE và ngang ký tự tiếng Việt nhiều byte
    for (let i = 0; i < payload.length; i += 9) {
      res.write(payload.subarray(i, i + 9));
      await new Promise((r) => setTimeout(r, 1));
    }
    res.end();
  });
});

async function main() {
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  const port = (server.address() as AddressInfo).port;
  process.env.LMSTUDIO_BASE_URL = `http://127.0.0.1:${port}/v1`;
  process.env.LMSTUDIO_MODEL = 'qwen/qwen3.5-9b';
  const { streamLmStudio, LmStudioError } = await import('../../lib/ai/lmstudio');
  const signal = new AbortController().signal;
  const messages = [{ role: 'user' as const, content: 'Luận Mệnh cách' }];

  let text = '';
  await streamLmStudio({ system: 'LỜI DẶN', messages, signal, onText: (t) => { text += t; } });
  assert.equal(text, '**【Mệnh cách】**\nPhá Quân thủ Mệnh.');
  assert.equal(received.model, 'qwen/qwen3.5-9b');
  assert.equal(received.reasoning_effort, 'none');
  assert.deepEqual(received.messages?.[0], { role: 'system', content: 'LỜI DẶN' });
  console.log('  ✅ ① ghép SSE bị cắt, bỏ reasoning_content, gửi model + reasoning_effort + lời dặn');

  mode = 'error';
  await assert.rejects(
    streamLmStudio({ system: 'x', messages, signal, onText: () => {} }),
    (e: unknown) => e instanceof LmStudioError && e.kind === 'http' && e.message.includes('context length'),
  );
  console.log('  ✅ ② lỗi HTTP → kind http kèm thông báo của LM Studio');

  await new Promise<void>((r) => server.close(() => r()));
  await assert.rejects(
    streamLmStudio({ system: 'x', messages, signal, onText: () => {} }),
    (e: unknown) => e instanceof LmStudioError && e.kind === 'connect',
  );
  console.log('  ✅ ③ không có máy chủ → kind connect');
  console.log('✅ lmstudio-stream: tất cả đạt');
}

main().catch((e) => { console.error(e); process.exit(1); });

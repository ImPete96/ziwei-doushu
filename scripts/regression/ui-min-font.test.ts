/**
 * Sàn cỡ chữ 12px cho các thành phần trang lá số (bàn cung, thanh thời gian, bảng luận giải).
 * Bản gốc dùng 7–10px cùng chữ bán trong suốt khiến sao phụ gần như không đọc được.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const FILES = ['components/PalaceCell.tsx', 'components/ChartBoard.tsx', 'components/TimeNav.tsx', 'components/InsightPanel.tsx'];
const MIN = 12;
// Badge Tứ Hóa / nhãn Mệnh–Thân là chip in đậm, cho phép 11px
const ALLOW_11 = /text-\[11px\][^"]*(rounded-full|rounded leading-tight)/;

const problems: string[] = [];
for (const file of FILES) {
  const lines = readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/text-\[(\d+)px\]|fontSize:\s*'(\d+)px'/g)) {
      const px = Number(m[1] ?? m[2]);
      if (px >= MIN || (px === 11 && ALLOW_11.test(line))) continue;
      problems.push(`${file}:${i + 1} ${px}px`);
    }
  });
}
assert.deepEqual(problems, [], `Chữ nhỏ hơn ${MIN}px:\n${problems.join('\n')}`);
console.log(`✅ ui-min-font: ${FILES.length} file trang lá số không có chữ dưới ${MIN}px`);

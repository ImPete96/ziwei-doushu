/**
 * 古籍原典查询库 — 入口
 *
 * 加载所有古籍数据 + 提供查询/搜索 API
 * 数据为 JSON 静态打包，零 DB 依赖、零网络请求
 */

import type { Book, Paragraph, SearchHit } from './types';
import { guSuiFu } from './data/gusuifu';
import { ziWeiQuanJi } from './data/quanji';
import { ziWeiQuanShu } from './data/quanshu';

/** 所有已收录古籍 */
export const ALL_BOOKS: Book[] = [
  guSuiFu,
  ziWeiQuanJi,
  ziWeiQuanShu,
];

/** 总段落数（用于首页统计） */
export const TOTAL_PARAGRAPHS = ALL_BOOKS.reduce(
  (sum, b) => sum + b.chapters.reduce((s, c) => s + c.paragraphs.length, 0),
  0,
);

/** 按 slug 取书 */
export function getBookBySlug(slug: string): Book | null {
  return ALL_BOOKS.find(b => b.slug === slug) ?? null;
}

/** 按章节序号取章节 */
export function getChapter(bookSlug: string, chapterIdx: number) {
  const book = getBookBySlug(bookSlug);
  if (!book) return null;
  const chapter = book.chapters[chapterIdx];
  if (!chapter) return null;
  return { book, chapter, chapterIdx };
}

/** 按段落 id 取段落（含书与章节信息）*/
export function getParagraphById(id: string) {
  for (const book of ALL_BOOKS) {
    for (let i = 0; i < book.chapters.length; i++) {
      const ch = book.chapters[i];
      const p = ch.paragraphs.find(p => p.id === id);
      if (p) {
        return { book, chapter: ch, chapterIdx: i, paragraph: p };
      }
    }
  }
  return null;
}

/**
 * 全文搜索
 *
 * 简单子字符串匹配（不分词，对中文 OK）
 * 先匹配原文 text，再匹配越南语译文 translation（大小写、dấu tiếng Việt đều不敏感：
 * "that sat" khớp "Thất Sát", "hoa ky" khớp "Hóa Kỵ"）。
 * 繁简转换暂不支持
 */
export function searchClassics(query: string, limit = 30): SearchHit[] {
  const q = query.trim().normalize('NFC');
  if (q.length < 1) return [];

  const hits: SearchHit[] = [];
  for (const book of ALL_BOOKS) {
    for (const chapter of book.chapters) {
      for (const p of chapter.paragraphs) {
        // 原文优先；原文未命中时再查译文
        let source = p.text;
        let idx = source.indexOf(q);
        if (idx < 0 && p.translation) {
          source = p.translation;
          idx = indexOfFolded(source, q);
        }
        if (idx < 0) continue;

        // 提取上下文（前后各 40 字）
        const start = Math.max(0, idx - 40);
        const end = Math.min(source.length, idx + q.length + 40);
        const before = source.slice(start, idx);
        const matched = source.slice(idx, idx + q.length);
        const after = source.slice(idx + q.length, end);

        const snippet = (start > 0 ? '…' : '')
          + escapeHtml(before)
          + `<mark>${escapeHtml(matched)}</mark>`
          + escapeHtml(after)
          + (end < source.length ? '…' : '');

        hits.push({
          bookSlug: book.slug,
          bookTitle: book.title,
          chapterTitle: chapter.title,
          paragraphId: p.id,
          snippet,
          text: p.text,
        });

        if (hits.length >= limit) return hits;
      }
    }
  }
  return hits;
}

/**
 * Bỏ dấu + chữ thường theo từng ký tự, giữ nguyên độ dài chuỗi (mỗi chữ tiếng Việt dạng NFC là
 * một code unit, gấp về đúng một chữ cái), nên vị trí tìm được trên chuỗi đã gấp dùng thẳng cho chuỗi gốc.
 */
export function foldVi(s: string): string {
  let out = '';
  for (const ch of s) {
    let f = ch === 'đ' || ch === 'Đ' ? 'd' : ch.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    if (f.length !== ch.length) f = ch.toLowerCase().length === ch.length ? ch.toLowerCase() : ch;
    out += f;
  }
  return out;
}

/** indexOf không phân biệt hoa thường và dấu tiếng Việt; trả về vị trí trên chuỗi gốc */
function indexOfFolded(haystack: string, needle: string): number {
  return foldVi(haystack).indexOf(foldVi(needle));
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export type { Book, Chapter, Paragraph, SearchHit } from './types';

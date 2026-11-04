/**
 * 古籍原典查询库 · 主页
 *
 * 列出所有收录古籍 + 全局搜索入口
 */

import Link from 'next/link';
import { ALL_BOOKS, TOTAL_PARAGRAPHS } from '@/lib/classics';
import LibrarySearch from './LibrarySearch';

export const metadata = {
  title: 'Phương pháp luận của Nghê sư · Thư viện cổ thư · Tử Vi Đẩu Số Toàn Tập / Toàn Thư / Cốt Tủy Phú',
  description: 'Tra cứu toàn văn các cổ thư Tử Vi Đẩu Số có thẩm quyền: «Tử Vi Đẩu Số Toàn Tập», «Tử Vi Đẩu Số Toàn Thư», «Cốt Tủy Phú» — nguồn dẫn chứng của bộ «Thiên Kỷ» của Nghê Hải Hạ. Nguyên văn chữ Hán kèm bản dịch tiếng Việt.',
};

export default function LibraryHomePage() {
  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>

      {/* Hero */}
      <div className="text-center px-6 py-16">
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: 'var(--tx-0)', marginBottom: '12px' }}>
          Thư viện cổ thư
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--tx-2)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          Nguyên văn chữ Hán đối chiếu bản dịch tiếng Việt: {ALL_BOOKS.length} bộ cổ thư, {TOTAL_PARAGRAPHS} đoạn.
        </p>
      </div>

      {/* 搜索 */}
      <div className="max-w-2xl mx-auto px-6 mb-12">
        <LibrarySearch />
      </div>

      {/* 古籍列表 */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_BOOKS.map(book => (
            <Link
              key={book.slug}
              href={`/library/${book.slug}`}
              style={{
                display: 'block',
                background: 'var(--bg-card)',
                border: '1px solid var(--ac-bdr)',
                borderRadius: '14px',
                padding: '24px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px var(--ac-bg)',
              }}
              
            >
              <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.02em', marginBottom: '6px' }}>
                {book.dynasty} · {book.author.split(' ')[0]}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--tx-0)', marginBottom: '10px', letterSpacing: '0.03em' }}>
                {book.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--tx-2)', lineHeight: 1.7, marginBottom: '14px' }}>
                {book.intro}
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--tx-3)' }}>
                <span>{book.chapters.length} chương</span>
                <span style={{ color: 'var(--ac-bdr)' }}>·</span>
                <span>{book.chapters.reduce((s, c) => s + c.paragraphs.length, 0)} đoạn tinh hoa</span>
              </div>
              <div style={{
                display: 'inline-flex',
                marginTop: '14px',
                fontSize: '11px',
                color: 'var(--ac)',
                letterSpacing: '0.15em',
                fontWeight: 500,
              }}>
                Vào đọc →
              </div>
            </Link>
          ))}
        </div>

        {/* 底部说明 */}
        <div style={{ marginTop: '60px', padding: '24px', background: 'var(--ac-bg)', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--ac-dim)', fontWeight: 600, letterSpacing: '0.15em', marginBottom: '8px' }}>
            Về thư viện này
          </div>
          <div style={{ fontSize: '12px', color: 'var(--tx-2)', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto' }}>
            Các cổ thư được thu thập đều thuộc phạm vi công cộng (bản khắc in đời Minh). Nguyên văn chữ Hán được giữ nguyên, kèm bản dịch tiếng Việt.<br />
            Nội dung liên tục được hoàn thiện; sắp tới sẽ bổ sung trọn bộ «Tử Vi Đẩu Số Toàn Tập» và mục lục dẫn chứng «Thiên Kỷ» của Nghê Hải Hạ.<br />
            Nếu phát hiện sai sót, xin vui lòng liên hệ với chúng tôi.
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * /knowledge — 知识库主页
 * 列出 14 主星，每星可看其在 13 宫位的解读
 */

import Link from 'next/link';
import { ALL_STARS, ALL_TOPICS, getKnowledge, STAR_BRIEF_SEO, STAR_TO_SLUG } from '@/lib/seo/knowledge';
import { TOPIC_LABEL } from '@/lib/ziwei/db-analysis';
import { viPalaceFull, viStar } from '@/lib/vi/terms';

export const metadata = {
  title: 'Kho tri thức Tử Vi Đẩu Số · 14 chính tinh · Hệ chính tông Nghê Hải Hạ',
  description: 'Kho tri thức Tử Vi Đẩu Số biên soạn theo hệ «Thiên Kỷ» của Nghê Hải Hạ và các cổ thư «Tử Vi Đẩu Số Toàn Tập», «Cốt Tủy Phú». Tóm lược tính chất 14 chính tinh, kèm lối vào thư viện cổ thư.',
  keywords: ['Tử Vi Đẩu Số', 'Nghê Hải Hạ', 'Tử Vi Đẩu Số Nghê Hải Hạ', 'Tử Vi Đẩu Số Toàn Tập', 'Tử Vi Đẩu Số Toàn Thư', '14 chính tinh', '12 cung'],
};

export default function KnowledgeHomePage() {
  const STAR_DESCRIPTIONS_QUICK = STAR_BRIEF_SEO;

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>

      {/* Hero */}
      <div className="text-center px-6 py-14">
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: 'var(--tx-0)', marginBottom: '12px' }}>
          Kho tri thức Tử Vi Đẩu Số
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--tx-2)', letterSpacing: '0.08em', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          Tóm lược tính chất <strong style={{ color: 'var(--ac)' }}>{ALL_STARS.length}</strong> chính tinh theo hệ «Thiên Kỷ» của Nghê Hải Hạ.<br />
          Nguyên văn và bản dịch cổ thư xem ở <Link href="/library" style={{ color: 'var(--ac)' }}>Thư viện cổ thư</Link>.
        </p>
      </div>

      {/* 14 主星卡片 */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.02em', textAlign: 'center', marginBottom: '24px' }}>
          Mười bốn chính tinh
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {ALL_STARS.map(star => (
            <Link
              key={star}
              href={`#sao-${STAR_TO_SLUG[star]}`}
              style={{
                display: 'block',
                padding: '14px 10px',
                background: 'var(--bg-card)',
                border: '1px solid var(--ac-bdr)',
                borderRadius: '10px',
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
              className="hover:underline underline-offset-4"
            >
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
                {viStar(star)}
              </div>
            </Link>
          ))}
        </div>

        {/* 详细列表（每个主星 + 简介 + 进入按钮） */}
        <div className="mt-14 space-y-4">
          {ALL_STARS.map(star => (
            <div key={star} id={`sao-${STAR_TO_SLUG[star]}`} style={{
              scrollMarginTop: '24px',
              background: 'var(--bg-card)',
              border: '1px solid var(--ac-bdr)',
              borderRadius: '12px',
              padding: '18px 22px',
            }}>
              <div className="flex items-baseline gap-3 mb-2">
                <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.1em' }}>
                  Sao {viStar(star)}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.15em' }}>
                  Chính tinh
                </span>
              </div>
              <p style={{ fontSize: '15px', color: 'var(--tx-2)', lineHeight: 1.7, marginBottom: '12px' }}>
                {STAR_DESCRIPTIONS_QUICK[star] || ''}
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_TOPICS.map(t => {
                  const k = getKnowledge(star, t);
                  if (!k.exists) return null;
                  return (
                    <Link
                      key={t}
                      href={`/knowledge/${STAR_TO_SLUG[star]}/${t}`}
                      style={{
                        fontSize: '11px',
                        padding: '4px 10px',
                        background: 'var(--ac-bg)',
                        border: '1px solid var(--ac-bdr)',
                        borderRadius: '999px',
                        color: 'var(--tx-2)',
                        textDecoration: 'none',
                      }}
                    >
                      Nhập {viPalaceFull(k.palaceName)} · {TOPIC_LABEL[t]}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

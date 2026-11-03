'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ScrollIntro from '@/components/ScrollIntro';

export default function PreviewPage() {
  const router = useRouter();
  // replayKey 用于强制重置 ScrollIntro（用户点"再播放一次"时）
  const [replayKey, setReplayKey] = useState(0);
  const [done, setDone] = useState(false);

  return (
    <>
      {/* 卷轴开场动画 */}
      <ScrollIntro key={replayKey} onComplete={() => setDone(true)} />

      {/* 动画结束后的「样片说明 + 操作按钮」面板 */}
      {done && (
        <main style={{
          minHeight: '100vh',
          background: '#0d0a08',
          color: '#e8dcc4',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '48px 24px',
          fontFamily: '"Noto Serif", "Times New Roman", "Songti SC", serif',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.4em', color: '#c89647', marginBottom: '16px' }}>
            SCROLL · INTRO · PREVIEW
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            letterSpacing: '0.06em',
            color: '#e8dcc4',
            marginBottom: '16px',
            fontWeight: 600,
          }}>
            Cuộn thư Tử Vi · Xem trước màn mở đầu
          </h1>
          <p style={{
            fontSize: '14px', color: '#a89878',
            maxWidth: '500px', lineHeight: 1.9,
            letterSpacing: '0.1em',
            marginBottom: '40px',
            fontFamily: '"Noto Serif", "Times New Roman", "Songti SC", serif',
          }}>
            Hiệu ứng cuộn thư bạn vừa xem sẽ từ từ mở ra mỗi lần vào trang chủ.<br />
            Nếu hài lòng, hãy cho tôi biết để gắn vào trang chủ / đưa lên chính thức.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
            <button
              onClick={() => { setDone(false); setReplayKey(k => k + 1); }}
              style={{
                background: '#a8302a',
                color: '#f5ecd7',
                padding: '14px 28px',
                fontSize: '14px',
                fontFamily: '"Noto Serif", "Times New Roman", "Songti SC", serif',
                letterSpacing: '0.12em',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Phát lại lần nữa
            </button>
            <button
              onClick={() => router.push('/')}
              style={{
                background: 'transparent',
                color: '#e8dcc4',
                padding: '14px 28px',
                fontSize: '14px',
                fontFamily: '"Noto Serif", "Times New Roman", "Songti SC", serif',
                letterSpacing: '0.12em',
                border: '1px solid rgba(232,220,196,0.25)',
                cursor: 'pointer',
              }}
            >
              Vào trang chủ bản gốc
            </button>
          </div>

          <div style={{
            marginTop: '40px', fontSize: '12px', color: '#6e6048',
            letterSpacing: '0.15em',
            display: 'flex', gap: '20px',
          }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Bản gốc ↗</Link>
            <span>·</span>
            <Link href="/chart" style={{ color: 'inherit', textDecoration: 'none' }}>Lá số</Link>
            <span>·</span>
            <Link href="/heming" style={{ color: 'inherit', textDecoration: 'none' }}>Hợp đôi</Link>
          </div>

          {/* 时间轴说明 */}
          <div style={{
            marginTop: '64px',
            padding: '24px 32px',
            border: '1px solid rgba(232,220,196,0.12)',
            maxWidth: '500px',
            fontSize: '12px',
            color: '#a89878',
            lineHeight: 1.9,
            letterSpacing: '0.1em',
            fontFamily: '"Noto Serif", "Times New Roman", "Songti SC", serif',
            textAlign: 'left',
          }}>
            <div style={{ color: '#c89647', marginBottom: '12px', letterSpacing: '0.2em', fontSize: '11px' }}>Dòng thời gian hiệu ứng</div>
            <div>· 0.0 ~ 1.7 s &nbsp;&nbsp;Cuộn thư mở từ giữa ra hai bên</div>
            <div>· 1.9 ~ 2.7 s &nbsp;&nbsp;Nội dung trên giấy Tuyên hiện ra (tiêu đề + phụ đề + ấn son)</div>
            <div>· 2.7 ~ 3.5 s &nbsp;&nbsp;Dừng lại thưởng thức</div>
            <div>· 3.5 ~ 4.2 s &nbsp;&nbsp;Mờ dần toàn bộ, vào trang chủ</div>
            <div style={{ marginTop: '12px', color: '#6e6048', fontSize: '11px' }}>
              Người dùng có thể bấm «Bỏ qua» ở góc dưới bên phải bất cứ lúc nào để vào thẳng trang chủ.
            </div>
          </div>
        </main>
      )}
    </>
  );
}

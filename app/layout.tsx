import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_URL } from '@/lib/site';
import { Alegreya, Be_Vietnam_Pro } from 'next/font/google';

// Be Vietnam Pro: chữ thường, vẽ cho dấu tiếng Việt; Alegreya: tiêu đề và tên sao, nét bút như bản in sách cũ
const body = Be_Vietnam_Pro({ subsets: ['vietnamese', 'latin'], weight: ['400', '500', '600', '700'], variable: '--font-body', display: 'swap' });
const display = Alegreya({ subsets: ['vietnamese', 'latin'], weight: ['500', '700', '800'], variable: '--font-alegreya', display: 'swap' });

export const metadata: Metadata = {
  title: 'Lá Số Tử Vi · Tử Vi Đẩu Số chính tông Nghê Hải Hạ',
  description: 'Theo hệ Tử Vi Đẩu Số chính tông Nghê Hải Hạ, AI luận giải chuyên sâu cách cục lá số, Đại hạn, Lưu niên của bạn, phân tích toàn diện tình cảm, sự nghiệp, tài lộc, sức khỏe',
  keywords: 'Tử Vi Đẩu Số, Nghê Hải Hạ, Tử Vi Đẩu Số Toàn Tập, Tử Vi Đẩu Số Toàn Thư, Cốt Tủy Phú, lá số tử vi, lập lá số, mệnh lý, 14 chính tinh, 12 cung',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Lá Số Tử Vi · Tử Vi Đẩu Số chính tông Nghê Hải Hạ',
    description: 'Theo hệ Tử Vi Đẩu Số chính tông Nghê Hải Hạ, AI luận giải chuyên sâu cách cục lá số, Đại hạn, Lưu niên của bạn, phân tích toàn diện tình cảm, sự nghiệp, tài lộc, sức khỏe',
    url: SITE_URL,
    siteName: 'Nghiên cứu Tử Vi',
    locale: 'vi_VN',
    type: 'website',
  },
  // 站长平台验证（拿到 verification code 后填入对应字段，重新部署即可）
  verification: {
    // Google Search Console: 在 https://search.google.com/search-console 添加站点后获取
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    // Bing Webmaster Tools: 在 https://www.bing.com/webmasters 添加站点后获取
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '808FFC6023A2C359B375DD860FEDA856',
      // 百度站长（等执照下来后）
      'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_VERIFICATION || '',
      // 360 站长（等执照下来后）
      '360-site-verification': process.env.NEXT_PUBLIC_360_VERIFICATION || '',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${body.variable} ${display.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('ziwei-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);else document.documentElement.setAttribute('data-theme','light');}catch(e){}})();` }} />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          <a href="#noi-dung" className="skip-link">Bỏ qua menu, tới nội dung</a>
          <SiteHeader />
          <div id="noi-dung" tabIndex={-1} className="outline-none">
            {children}
          </div>
          <SiteFooter />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

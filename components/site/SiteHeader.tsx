'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

const NAV = [
  { href: '/knowledge', label: 'Kiến thức' },
  { href: '/library', label: 'Thư viện cổ thư' },
  { href: '/library/search', label: 'Tìm kiếm' },
];

/** Thanh menu chung cho mọi trang (gắn trong app/layout.tsx) */
export default function SiteHeader() {
  const pathname = usePathname() ?? '/';
  // /library/search không tính là đang ở /library để chỉ một mục được đánh dấu
  const isActive = (href: string) =>
    href === '/library' ? pathname === '/library' || /^\/library\/(?!search)/.test(pathname) : pathname.startsWith(href);

  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: 'var(--t-bg)', borderBottom: '1px solid var(--t-border)' }}
    >
      <div className="mx-auto flex items-center gap-4 px-6 h-14" style={{ maxWidth: 1280 }}>
        <Link href="/" className="font-display text-[22px] font-bold whitespace-nowrap" style={{ color: 'var(--t-text)' }}>
          Lá Số Tử Vi
        </Link>
        <nav aria-label="Menu chính" className="flex items-center gap-1 ml-auto">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className="px-3 py-1.5 rounded-lg text-[14px] whitespace-nowrap"
              style={{ color: isActive(item.href) ? 'var(--t-gold)' : 'var(--t-text2)' }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/chart"
            aria-current={pathname.startsWith('/chart') ? 'page' : undefined}
            className="ml-2 px-4 py-1.5 rounded-md text-[14px] font-semibold whitespace-nowrap"
            style={{ color: 'var(--t-bg)', background: 'var(--t-gold)' }}
          >
            Lập lá số
          </Link>
          <span className="ml-2"><ThemeToggle /></span>
        </nav>
      </div>
    </header>
  );
}

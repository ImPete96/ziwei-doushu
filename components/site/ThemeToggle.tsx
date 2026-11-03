'use client';
import { useTheme } from '@/components/ThemeProvider';

/** Nút đổi giao diện sáng / tối dùng chung trên thanh menu */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-[13px]"
      style={{ borderColor: 'var(--t-border)', color: 'var(--t-text2)' }}
    >
      <span aria-hidden className="relative w-9 h-5 rounded-full flex-shrink-0" style={{ background: 'var(--t-surface)', border: '1px solid var(--t-border)' }}>
        <span
          className="absolute top-[3px] w-3 h-3 rounded-full transition-[left] duration-300"
          style={{ left: isDark ? 3 : 19, background: 'var(--t-gold)' }}
        />
      </span>
      {isDark ? 'Tối' : 'Sáng'}
    </button>
  );
}

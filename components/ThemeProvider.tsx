'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';

export type Theme = 'dark' | 'light';

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: 'dark', toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Lần dựng đầu luôn là 'dark' như máy chủ, để hydration khớp; màu CSS đã đúng ngay từ đầu nhờ
  // script trong layout đặt data-theme. Gắn xong mới đọc lựa chọn đã lưu cho phần màu tính bằng JS.
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let saved: string | null = null;
    try { saved = localStorage.getItem('ziwei-theme'); } catch { /* bộ nhớ trình duyệt bị chặn */ }
    const attr = document.documentElement.getAttribute('data-theme');
    const next = saved === 'light' || saved === 'dark' ? saved : attr === 'light' ? 'light' : 'dark';
    setTheme(next);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('ziwei-theme', theme); } catch { /* bỏ qua */ }
  }, [theme, mounted]);

  const toggle = () => {
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    setTheme(t => t === 'dark' ? 'light' : 'dark');
    setTimeout(() => root.classList.remove('theme-transitioning'), 420);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {/* framer-motion bỏ chuyển động biến đổi khi hệ điều hành bật "giảm chuyển động" */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

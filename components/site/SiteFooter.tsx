import Link from 'next/link';

/** Chân trang chung: lời miễn trừ + điều khoản, quyền riêng tư, ghi công mã nguồn */
export default function SiteFooter() {
  return (
    <footer className="mt-16" style={{ borderTop: '1px solid var(--t-border)' }}>
      <div className="mx-auto px-6 py-8 text-center text-[13px] leading-relaxed space-y-2" style={{ maxWidth: 1280, color: 'var(--t-faint)' }}>
        <p>Lá Số Tử Vi · theo hệ Tử Vi Đẩu Số của Nghê Hải Hạ · chỉ để tham khảo, không thay cho lời khuyên y tế, tài chính hay pháp lý.</p>
        <p className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <Link href="/terms" className="underline underline-offset-2">Điều khoản sử dụng</Link>
          <Link href="/privacy" className="underline underline-offset-2">Quyền riêng tư</Link>
          <a href="https://github.com/Renhuai123/ziwei-doushu" className="underline underline-offset-2" target="_blank" rel="noopener noreferrer">
            Dựa trên mã nguồn mở ziwei-doushu (MIT)
          </a>
        </p>
      </div>
    </footer>
  );
}

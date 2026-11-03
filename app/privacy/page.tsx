export const metadata = { title: 'Chính sách quyền riêng tư · Lá Số Tử Vi', description: 'Lá Số Tử Vi xử lý dữ liệu ngày sinh và câu hỏi gửi cho AI như thế nào' };

export default function PrivacyPage() {
  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg-0)', borderBottom: '1px solid var(--bdr)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--tx-3)', textDecoration: 'none' }}>
          <span style={{ fontSize: '16px' }}>‹</span>
          <span>Về trang chủ</span>
        </a>
        <div style={{ width: '1px', height: '20px', background: 'var(--bdr-med)' }} />
        <span style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.2em' }}>Lá Số Tử Vi</span>
      </header>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', color: 'var(--tx-1)', lineHeight: 1.8, fontSize: 16 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Chính sách quyền riêng tư</h1>
        <p style={{ fontSize: 14, color: 'var(--tx-2)', marginBottom: 32 }}>Cập nhật lần cuối: tháng 11/2026</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. Lá số được tính ở đâu</h2>
        <p>Ngày, giờ, nơi sinh, giới tính và họ tên (không bắt buộc) bạn nhập được dùng để lập lá số <strong>ngay trong trình duyệt của bạn</strong>. Trang không có tài khoản, không có thanh toán và không lưu lá số của bạn trên máy chủ.</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. Khi bạn dùng luận giải AI</h2>
        <p>Khi bảng luận giải chạy hoặc bạn đặt câu hỏi, trình duyệt gửi lên máy chủ của trang: ngày giờ sinh, giới tính, nơi sinh (kinh độ, múi giờ) và nội dung câu hỏi. Máy chủ lập lại lá số, tóm tắt thành văn bản (12 cung, sao, Tứ Hóa, vận hạn) rồi gửi bản tóm tắt cùng câu hỏi cho dịch vụ AI mà người vận hành trang đã cấu hình:</p>
        <ul style={{ paddingLeft: 24 }}>
          <li>Claude của Anthropic (dịch vụ bên ngoài, xử lý theo chính sách của Anthropic), hoặc</li>
          <li>một model AI chạy ngay trên máy chủ của trang (dữ liệu không ra ngoài).</li>
        </ul>
        <p><strong>Họ tên không được gửi cho AI.</strong> Máy chủ không lưu lá số hay nội dung trò chuyện; địa chỉ IP chỉ được giữ tạm trong bộ nhớ để giới hạn số lượt gọi AI mỗi giờ.</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. Lưu trên trình duyệt của bạn</h2>
        <p>Trang dùng bộ nhớ trình duyệt (localStorage) để ghi nhớ lựa chọn giao diện sáng/tối. Bạn có thể xóa bằng cách xóa dữ liệu trang web trong cài đặt trình duyệt.</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. Thống kê và quảng cáo</h2>
        <p>Trang không gắn công cụ theo dõi, thống kê hay quảng cáo của bên thứ ba.</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>5. Mã nguồn mở</h2>
        <p>Trang được xây từ mã nguồn mở (giấy phép MIT); bạn có thể kiểm tra cách dữ liệu được xử lý trong mã nguồn. Người vận hành từng bản cài đặt chịu trách nhiệm cấu hình dịch vụ AI và máy chủ của mình.</p>

      </main>
    </>
  );
}

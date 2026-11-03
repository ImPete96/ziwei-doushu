export const metadata = { title: 'Chính sách quyền riêng tư · Lá Số Tử Vi', description: 'Chính sách quyền riêng tư của Lá Số Tử Vi' };

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
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', color: 'var(--tx-1)', lineHeight: 1.8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Chính sách quyền riêng tư</h1>
        <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>Cập nhật lần cuối: tháng 4/2026</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. Thông tin chúng tôi thu thập</h2>
      <p>Để cung cấp dịch vụ lập và luận giải lá số Tử Vi, chúng tôi có thể thu thập các thông tin sau:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li><strong>Thông tin cần cho lá số</strong>: họ tên (không bắt buộc), năm tháng ngày sinh dương lịch, giờ sinh, giới tính, kinh độ nơi sinh</li>
        <li><strong>Thông tin tài khoản (sau khi đăng ký)</strong>: số điện thoại (dùng để xác minh SMS và dịch vụ hội viên)</li>
        <li><strong>Thông tin tương tác</strong>: lượt nhấp, lượt xem và lịch sử lá số của bạn trên trang</li>
        <li><strong>Thông tin phản hồi</strong>: đánh giá &quot;đúng / không đúng&quot; và nhận xét bằng chữ của bạn về nội dung luận giải</li>
        <li><strong>Thông tin thanh toán</strong>: khi mua hội viên hoặc dịch vụ lẻ, việc thanh toán do bên thứ ba (Alipay / WeChat Pay) xử lý; Nền tảng không lưu số thẻ đầy đủ hay mật khẩu</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. Cách chúng tôi sử dụng thông tin</h2>
      <ul style={{ paddingLeft: 24 }}>
        <li>Thông tin lá số chỉ dùng cho lần luận giải này và lịch sử lá số trong tài khoản của bạn</li>
        <li>Số điện thoại dùng để đăng ký, đăng nhập, thông báo đơn hàng</li>
        <li>Thông tin phản hồi dùng để liên tục cải thiện chất lượng nội dung mệnh lý (phân tích tổng hợp sau khi ẩn danh)</li>
        <li>Dữ liệu tổng hợp có thể dùng cho nghiên cứu ngành và tối ưu Nền tảng</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. Chia sẻ thông tin và bên thứ ba</h2>
      <p>Ngoài các trường hợp dưới đây, chúng tôi không chia sẻ thông tin cá nhân của bạn với bên thứ ba:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>Nhà cung cấp dịch vụ thanh toán (Alipay / WeChat Pay): xử lý thanh toán đơn hàng</li>
        <li>Nhà cung cấp dịch vụ SMS (ví dụ Alibaba Cloud SMS): gửi mã xác minh</li>
        <li>Nhà cung cấp dịch vụ đám mây (ví dụ Vercel / Cloudflare / Alibaba Cloud): hạ tầng kỹ thuật</li>
        <li>Dịch vụ luận giải AI (ví dụ Anthropic Claude): xử lý hội thoại &quot;hỏi thêm tự do&quot; của bạn (đã ẩn danh)</li>
        <li>Yêu cầu hợp pháp của cơ quan tư pháp hoặc cơ quan nhà nước theo quy định pháp luật</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. Bảo mật thông tin</h2>
      <p>Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý phổ biến trong ngành để bảo vệ thông tin của bạn (mã hóa truyền tải HTTPS, mã hóa lưu trữ cơ sở dữ liệu, kiểm soát quyền truy cập…). Tuy nhiên, xin lưu ý rằng truyền tải qua Internet không thể bảo đảm an toàn 100%.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>5. Quyền của bạn</h2>
      <ul style={{ paddingLeft: 24 }}>
        <li><strong>Tra cứu</strong>: có thể xem toàn bộ lịch sử lá số và đơn hàng trong trung tâm tài khoản</li>
        <li><strong>Xóa</strong>: liên hệ chăm sóc khách hàng để xóa lá số cụ thể trong tài khoản / hủy tài khoản</li>
        <li><strong>Xuất dữ liệu</strong>: có thể yêu cầu xuất toàn bộ dữ liệu cá nhân của bạn</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>6. Cookie và lưu trữ cục bộ</h2>
      <p>Trang dùng cookie / localStorage để: lưu lựa chọn giao diện tối/sáng, lịch sử lá số gần đây, trạng thái đăng nhập hội viên. Bạn có thể tắt trong cài đặt trình duyệt, nhưng một số tính năng có thể bị ảnh hưởng.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>7. Người chưa thành niên</h2>
      <p>Nội dung mệnh lý của Nền tảng dành cho người dùng từ 18 tuổi trở lên. Người chưa thành niên vui lòng sử dụng khi có sự đồng ý của người giám hộ và không được dùng lời luận giải cho quyết định trọng đại trong đời.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>8. Thay đổi chính sách</h2>
      <p>Chính sách này có thể được cập nhật không định kỳ. Thay đổi quan trọng sẽ được thông báo rõ ràng. Tiếp tục sử dụng đồng nghĩa với việc bạn đồng ý với phiên bản đã cập nhật.</p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <a href="/terms" style={{ color: 'var(--ac)' }}>Điều khoản dịch vụ</a> · <a href="/" style={{ color: 'var(--ac)' }}>Về trang chủ</a>
        </p>
      </main>
    </>
  );
}

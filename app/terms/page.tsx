export const metadata = { title: 'Điều khoản dịch vụ · Lá Số Tử Vi', description: 'Điều khoản dịch vụ và thỏa thuận người dùng của Lá Số Tử Vi' };

export default function TermsPage() {
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
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Điều khoản dịch vụ</h1>
        <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>Cập nhật lần cuối: tháng 4/2026</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. Tổng quan dịch vụ</h2>
      <p>Lá Số Tử Vi (sau đây gọi là &quot;Nền tảng&quot;) cung cấp dịch vụ lập và luận giải lá số dựa trên hệ thống Tử Vi Đẩu Số «Thiên Kỷ» của Nghê Hải Hạ. Mọi nội dung mệnh lý trên Nền tảng chỉ mang tính tham khảo, <strong>không cấu thành bất kỳ lời khuyên y tế, đầu tư, pháp lý, tư vấn tâm lý hay quyết định trọng đại nào trong đời</strong>.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. Quy tắc ứng xử của người dùng</h2>
      <p>Khi sử dụng Nền tảng, bạn đồng ý:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>Chỉ sử dụng Nền tảng cho mục đích hợp pháp, tham khảo cá nhân</li>
        <li>Không phát tán nội dung của Nền tảng để bán thương mại, đăng lại hoặc công bố công khai</li>
        <li>Không thực hiện hành vi gây rối hoạt động bình thường của Nền tảng</li>
        <li>Thông tin ngày giờ sinh gửi lên là chân thực; Nền tảng không chịu trách nhiệm về sai lệch luận giải do thông tin sai</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. Sở hữu trí tuệ và điều khoản cấm · Chống thu thập, chống huấn luyện</h2>
      <p style={{ background: 'rgba(168,50,40,0.06)', border: '1px solid rgba(168,50,40,0.2)', padding: 16, borderRadius: 8 }}>
        <strong>Toàn bộ nội dung mệnh lý, kho tri thức (gồm toàn bộ văn bản luận giải 14 chính tinh × 12 cung × nam nữ × Tứ Hóa × Đại hạn, Lưu niên), thiết kế giao diện, phương án tích hợp thuật toán và kho ca mẫu đều do Nền tảng sáng tạo hoặc biên soạn hợp pháp.</strong><br/><br/>
        Nghiêm cấm các hành vi sau; Nền tảng bảo lưu quyền truy cứu trách nhiệm bồi thường dân sự và trách nhiệm hình sự đối với người vi phạm:<br/>
        ① Thu thập nội dung của Nền tảng bằng bất kỳ phương tiện kỹ thuật nào như crawler, script tự động, gọi API hàng loạt;<br/>
        ② Dùng lời luận lá số, văn bản, dữ liệu phản hồi API do Nền tảng tạo ra <strong>để huấn luyện bất kỳ mô hình học máy nào</strong> (bao gồm nhưng không giới hạn ở mô hình ngôn ngữ lớn, mô hình sinh nội dung mệnh lý, mô hình sinh văn bản…);<br/>
        ③ Bán lại, đăng nội dung do Nền tảng tạo ra lên website, ứng dụng hoặc tài khoản mạng xã hội khác;<br/>
        ④ Dịch ngược, sao chép, sửa đổi mã frontend hoặc backend của Nền tảng rồi cung cấp dịch vụ tương tự dưới danh nghĩa &quot;tự vận hành&quot;.<br/><br/>
        Văn bản đầu ra của Nền tảng có nhúng dấu vết truy nguồn; đầu ra sinh ra từ việc sao chép / huấn luyện trái phép có thể bị phát hiện và truy vết. Khi phát hiện vi phạm, Nền tảng có quyền yêu cầu <strong>bồi thường 1 triệu nhân dân tệ cho mỗi trường hợp vi phạm</strong>, đồng thời bảo lưu quyền khởi kiện ra tòa và phối hợp điều tra với cơ quan công an.
      </p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. Tuyên bố miễn trừ trách nhiệm</h2>
      <p>Nội dung mệnh lý của Nền tảng được biên soạn từ tri thức Tử Vi Đẩu Số truyền thống và hệ Nghê Hải Hạ, <strong>không bảo đảm chính xác 100%</strong>. Vận mệnh chịu ảnh hưởng chung của tam tài Thiên, Địa, Nhân; đầu ra của Nền tảng chỉ là tài liệu tham khảo để hiểu bản thân, người dùng cần nhìn nhận lý trí, không nên phụ thuộc quá mức vào bất kỳ nhận định mệnh lý đơn lẻ nào.</p>
      <p>Nền tảng không chịu trách nhiệm pháp lý đối với bất kỳ hậu quả nào phát sinh từ việc sử dụng nội dung của Nền tảng (bao gồm nhưng không giới hạn ở quyết định sai lầm, ảnh hưởng tâm lý, thay đổi quan hệ…).</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>5. Thay đổi và chấm dứt dịch vụ</h2>
      <p>Nền tảng bảo lưu quyền điều chỉnh, tạm ngừng hoặc chấm dứt một phần hay toàn bộ dịch vụ bất cứ lúc nào. Thay đổi quan trọng sẽ được thông báo qua thông báo trên trang hoặc email.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>6. Luật áp dụng và giải quyết tranh chấp</h2>
      <p>Điều khoản này áp dụng pháp luật nước Cộng hòa Nhân dân Trung Hoa. Khi phát sinh tranh chấp, hai bên cần thương lượng thiện chí; nếu thương lượng không thành, tranh chấp được đưa ra Tòa án nhân dân có thẩm quyền tại nơi đặt trụ sở của đơn vị vận hành Nền tảng để giải quyết.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>7. Liên hệ</h2>
      <p>Nếu có thắc mắc, vui lòng liên hệ qua WeChat / email chăm sóc khách hàng được Nền tảng công bố.</p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <a href="/privacy" style={{ color: 'var(--ac)' }}>Chính sách quyền riêng tư</a> · <a href="/" style={{ color: 'var(--ac)' }}>Về trang chủ</a>
        </p>
      </main>
    </>
  );
}

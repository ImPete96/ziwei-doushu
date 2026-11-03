export const metadata = { title: 'Điều khoản sử dụng · Lá Số Tử Vi', description: 'Điều khoản sử dụng Lá Số Tử Vi' };

export default function TermsPage() {
  return (
    <>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', color: 'var(--tx-1)', lineHeight: 1.8, fontSize: 16 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Điều khoản sử dụng</h1>
        <p style={{ fontSize: 14, color: 'var(--tx-2)', marginBottom: 32 }}>Cập nhật lần cuối: tháng 11/2026</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. Trang này là gì</h2>
        <p>Lá Số Tử Vi lập lá số Tử Vi Đẩu Số theo hệ «Thiên Kỷ» của Nghê Hải Hạ và cung cấp luận giải bằng AI. Mọi nội dung <strong>chỉ để tham khảo và học tập</strong>, không phải lời khuyên y tế, tài chính, đầu tư, pháp lý hay tâm lý, và không nên dùng làm căn cứ cho quyết định quan trọng.</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. Về luận giải AI</h2>
        <p>Lời luận do mô hình AI viết dựa trên dữ liệu lá số, nên có thể sai, thiếu hoặc mâu thuẫn. Lá số lập khi không rõ giờ sinh chỉ là giả định theo giờ Tý. Số lượt gọi AI có thể bị giới hạn theo giờ và theo ngày.</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. Sử dụng hợp lý</h2>
        <ul style={{ paddingLeft: 24 }}>
          <li>Chỉ dùng cho mục đích hợp pháp, tham khảo cá nhân.</li>
          <li>Không dùng công cụ tự động để gọi AI hàng loạt hoặc làm quá tải máy chủ.</li>
          <li>Không lập lá số của người khác để quấy rối hay phát tán thông tin cá nhân của họ.</li>
        </ul>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. Bản quyền nội dung</h2>
        <ul style={{ paddingLeft: 24 }}>
          <li>Mã nguồn: giấy phép MIT.</li>
          <li>Cổ thư (Toàn Thư, Toàn Tập, Cốt Tủy Phú): thuộc phạm vi công cộng; bản dịch tiếng Việt đi kèm mã nguồn.</li>
          <li>Trích lời giảng của Nghê Hải Hạ: chỉ dùng phi thương mại (CC BY-NC-SA 4.0), bản quyền bài giảng gốc thuộc chủ sở hữu.</li>
        </ul>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>5. Thay đổi</h2>
        <p>Điều khoản có thể được cập nhật; ngày cập nhật ghi ở đầu trang. Tiếp tục sử dụng trang nghĩa là bạn đồng ý với phiên bản mới.</p>

      </main>
    </>
  );
}

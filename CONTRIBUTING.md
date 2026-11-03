# Đóng góp

Hoan nghênh mọi câu hỏi, bản sửa lỗi và đề xuất. Nói rõ trước hai điều để đỡ mất công qua lại:

- Repo này là **ảnh chụp mã nguồn mở** của engine lập lá số trên [ouranic.cn](https://ouranic.cn/?from=gh-contrib), được đồng bộ định kỳ từ bản trực tuyến (nhịp đồng bộ xem mục “Nhịp bảo trì và đóng góp” trong README).
- Bản mã nguồn mở **không có** kho lời đoán, prompt luận giải AI và bất kỳ API backend `/api/*` nào (xem mục “Ranh giới mã nguồn mở” trong README). Luận giải AI, phân tích xem hợp đôi trả về 404 trong bản mã nguồn mở là hành vi được dự kiến, bạn cần tự hiện thực.

## Đặt câu hỏi

- **Hỏi cách dùng, muốn trao đổi**: vào [khu thảo luận](https://github.com/Renhuai123/ziwei-doushu/discussions).
- **Thấy lá số lập chưa đúng**: dùng template “Thắc mắc kết quả lập lá số”, kèm ngày sinh dương lịch, giờ phút, nơi sinh hoặc kinh độ, giới tính, kết quả của dự án này, và kết quả bạn dùng để đối chiếu. Chỉ ghi “không chuẩn” thì chúng tôi không có cách nào kiểm tra.
  - Độ sáng phụ tinh, quy thuộc tháng nhuận, giờ Tý muộn có đổi ngày hay không vốn khác nhau giữa các trường phái, engine đã làm thành các chuẩn có thể chuyển đổi; những khác biệt này không tính là bug, nhưng hoan nghênh bạn chỉ ra.
- **Chương trình báo lỗi, trang hiển thị bất thường**: dùng template “Lỗi chương trình”, ghi rõ các bước tái hiện và thông báo lỗi.
- **Vấn đề của site chính thức (ouranic.cn)**: dùng template “Vấn đề trên site chính thức”.

Xin đừng đăng số điện thoại, mã xác minh, hay thông tin ngày giờ sinh của người khác khi chưa có sự đồng ý của chính họ vào issue.

## Gửi mã nguồn

```bash
npm ci               # cài đặt theo package-lock.json
npm run typecheck    # kiểm tra kiểu
npm test             # hồi quy lập lá số
```

- Mỗi PR chỉ làm một việc, phần mô tả ghi rõ đã sửa gì, vì sao.
- **Thay đổi kết quả lập lá số**: kèm bằng chứng đối chiếu (xuất xứ, hoặc ảnh chụp màn hình từ phần mềm lập lá số khác), đồng thời thêm kiểm thử hồi quy trong `scripts/regression/` và đăng ký vào script `test` của `package.json`. Thay đổi chuẩn không có xuất xứ thường không được nhận.
- CI sẽ chạy cùng một bộ kiểm tra cho mỗi lần push và PR.

## Giấy phép

Gửi đóng góp đồng nghĩa với việc bạn đồng ý nội dung đóng góp được phát hành theo giấy phép tương ứng:

- Mã nguồn: [MIT](./LICENSE)
- Bộ dữ liệu mẫu: [CC BY 4.0](./DATASET-LICENSE)
- Thư mục nguyên lời Nghê sư `docs/tianji-ziwei/`: [CC BY-NC-SA 4.0](./docs/tianji-ziwei/LICENSE.md), không được dùng thương mại

---

**English.** Issues and PRs are welcome. This repo is an open snapshot of the charting engine behind ouranic.cn; the interpretation database, AI prompts and all `/api/*` backend routes are not included, so AI features return 404 by design. For a chart you believe is wrong, please use the "Chart result question" form with full birth data and a reference result. Before opening a PR, run `npm ci`, `npm run typecheck` and `npm test`; changes to chart results need evidence and a regression test.

<div align="center">

# Tử Vi Đẩu Số · Engine lập lá số mã nguồn mở

### Thuật toán là trí tuệ truyền thống công khai, không nên bị khóa sau tường rào

[![CI](https://github.com/Renhuai123/ziwei-doushu/actions/workflows/ci.yml/badge.svg)](https://github.com/Renhuai123/ziwei-doushu/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](./LICENSE)
[![Dataset: CC BY 4.0](https://img.shields.io/badge/dataset-CC%20BY%204.0-green.svg)](./DATASET-LICENSE)

**Tiếng Việt** · [English](./README.en.md)

<sub>Bản gốc tiếng Trung xem tại repo upstream: https://github.com/Renhuai123/ziwei-doushu</sub>

</div>

**I. Triết lý dự án**: Tử Vi Đẩu Số là viên ngọc quý của mệnh lý học truyền thống Trung Hoa; thầy Nghê Hải Hạ trong 《Thiên Kỷ》 đã hệ thống hóa một cách bài bản hệ thống Tử Vi Đẩu Số chính tông. Chúng tôi mong dùng công nghệ để nhiều người hơn được tiếp cận và học môn học vấn này.

Chúng tôi mở mã nguồn thuật toán lập lá số và kho tri thức vì tin rằng: **thuật toán là trí tuệ truyền thống công khai, không nên bị khóa sau tường rào**. Giá trị thật sự nằm ở chiều sâu của luận giải, sự trau chuốt trải nghiệm người dùng, và những gì tích lũy được qua quá trình vận hành liên tục.

**II. Thông tin dự án**: Hệ thống lập lá số Tử Vi Đẩu Số dựa trên hệ thống giảng dạy <strong>《Thiên Kỷ》 của Nghê Hải Hạ</strong>, bao gồm thuật toán lập lá số hoàn chỉnh, hệ thống Tứ Hóa, kho tri thức Cách cục, dữ liệu nguyên văn cổ thư, cùng một bộ dữ liệu luận giải Tử Vi Đẩu Số mở mã nguồn hoàn chỉnh: **Bộ dữ liệu luận giải v4.0 — 675 nghìn lá số × 13 chiều = 8.77 triệu đoạn luận giải, phần chính văn khoảng 20.4 tỷ chữ, 56.6 GB sau khi giải nén** (phát hành 2026-10-15).

| Bộ dữ liệu | Lá số | Số đoạn luận giải | Sau giải nén | Năm bao phủ | Số chữ luận giải mỗi lá số |
|---|---|---|---|---|---|
| **Bộ dữ liệu luận giải v4.0** (2026-10-15) | **674,976** | **8,774,688** | **56.6 GB** | **1950–2026** (chỉ gồm ngày có thật) | **khoảng 30 nghìn chữ** |
| Bộ dữ liệu mẫu v3.0 | 518,400 | 6,739,200 | 33.1 GB | 1924–1983 | khoảng 21 nghìn chữ |
| Thay đổi | +30% | +30% | **+71%** | +17 năm | +44% |

<sub>Số chữ luận giải mỗi lá số của v3.0 được ước tính theo mẫu 2,160 lá số, các số liệu còn lại là thống kê toàn bộ; mỗi lá số ở cả hai phiên bản đều có 13 chiều.</sub>

Trải nghiệm trực tuyến: [ouranic.cn](https://ouranic.cn/?from=gh-readme) — lập lá số, luận giải AI, lịch sử lá số đều mở hoàn toàn.

> **Lưu ý: về việc luận đoán lục thân**
>
> Tử Vi Đẩu Số có những giới hạn nhất định trong việc luận đoán lục thân (cha mẹ, anh chị em, con cái…). Nghê sư trong 《Thiên Kỷ》 chỉ ra: “斗数批六亲本来就比较差一点。” (“Đẩu Số luận lục thân vốn dĩ đã kém hơn một chút.”) ([2上 · 00:25:27](https://www.bilibili.com/video/BV1KJsLekEfA?p=3&t=1527)) Trong các thuật số truyền thống, Thiết Bản Thần Số có ưu thế riêng trong việc đối chiếu lục thân ([2上 · 00:03:15](https://www.bilibili.com/video/BV1KJsLekEfA?p=3&t=195)); Nghê sư vẫn lấy Tử Vi Đẩu Số làm cốt lõi vì nó có thể kết hợp địa lý, môi trường và nhân sự để phán đoán tổng hợp, hình thành một hệ thống hoàn chỉnh “上知天文、下知地理、中知人事” (“trên biết thiên văn, dưới biết địa lý, giữa biết nhân sự”) ([2上 · 00:25:43](https://www.bilibili.com/video/BV1KJsLekEfA?p=3&t=1543)). Vì vậy, các phân tích liên quan đến lục thân chỉ mang tính tham khảo; ba chiều Phụ Mẫu, Huynh Đệ, Tử Tức trên [ouranic.cn](https://ouranic.cn/?from=gh-readme) cũng kèm theo lời lưu ý tương tự.

---

## Mục lục

| | Chương | Tóm tắt một câu |
|---|------|--------|
| I | [Cập nhật đợt này](#i-cập-nhật-đợt-này-2026-10-15) | Lời đoán 13 chiều được hiệu đính từng câu theo nguyên lời Nghê sư và 《Toàn Thư》, phát hành bộ dữ liệu luận giải v4.0 gồm 675 nghìn lá số × 13 chiều |
| II (mới) | [Bộ dữ liệu luận giải 13 chiều v4.0](#ii-mới-bộ-dữ-liệu-luận-giải-13-chiều-v40-2026-10-15) | Lời đoán phiên bản mới 2026-10-15, 675 nghìn lá số, tải theo năm |
| II | [Bộ dữ liệu mẫu 518 nghìn lá số](#ii-bộ-dữ-liệu-mẫu-518-nghìn-lá-số) | Quy cách, tải xuống, công dụng, giấy phép |
| III | [Bắt đầu nhanh](#iii-bắt-đầu-nhanh) | Từ clone đến chạy được |
| IV | [Engine lập lá số](#iv-engine-lập-lá-số) | Làm được gì, chia tệp ra sao, dữ liệu cổ thư |
| V | [Nguyên lời Nghê sư trong 《Thiên Kỷ · Tử Vi Đẩu Số》](#v-nguyên-lời-nghê-sư-trong-thiên-kỷ--tử-vi-đẩu-số) | 14 bài giảng + 2 đoạn bổ sung, 1848 mục, xem toàn cảnh trong một hình, mục nào cũng phát lại được |
| VI | [Giao diện chỉ là một bản Demo](#vi-giao-diện-chỉ-là-một-bản-demo) | Không phải bản đang chạy trực tuyến, khác biệt được ghi rõ |
| VII | [Ranh giới mã nguồn mở](#vii-ranh-giới-mã-nguồn-mở-những-gì-không-có-ở-đây) | Cái gì mở mã nguồn, cái gì không |
| VIII | [Nhịp bảo trì và đóng góp](#viii-nhịp-bảo-trì-và-đóng-góp) | Nhịp đồng bộ, cách tiếp nhận issue / PR |
| IX | [Giấy phép](#ix-giấy-phép) | Mã nguồn MIT / dữ liệu CC BY 4.0 / cổ thư thuộc phạm vi công cộng / nguyên lời Nghê sư phi thương mại |
| X | [Giới thiệu và liên hệ](#x-giới-thiệu-và-liên-hệ) | Triết lý dự án, công nghệ, cách liên hệ |

---

## I. Cập nhật đợt này (2026-10-15)

Đợt này đi theo bản phát hành 2026-10-15 của website (phiên bản nội dung website `ca268829f7a9`):

![Tổng quan cập nhật đợt này](./docs/update-20261015.png)

**1. Phát hành bộ dữ liệu luận giải 13 chiều v4.0** —— 674,976 lá số (mỗi ngày có thật theo dương lịch từ năm 1950–2026 × 12 canh giờ × nam nữ) × 13 chiều = **8,774,688 đoạn luận giải**, phần chính văn khoảng 20.4 tỷ chữ. Sau giải nén 56.6 GB (v3.0 là 33.1 GB, tăng 71%), sau nén chỉ 161 MB, chia theo năm thành 77 tệp, có thể chỉ tải những năm cần, cũng có thể tải một lần gói tổng hợp mọi năm. Tải xuống xem [Release v4.0-13d](https://github.com/Renhuai123/ziwei-doushu/releases/tag/v4.0-13d), quy cách và trường dữ liệu xem [chương II (mới)](#ii-mới-bộ-dữ-liệu-luận-giải-13-chiều-v40-2026-10-15). Trước khi phát hành, cả 77 tệp đã được giải nén từng tệp một và so sánh từng byte với dữ liệu gốc, kết quả khớp hoàn toàn.

**2. Lời đoán 13 chiều được hiệu đính từng câu theo nguyên lời Nghê sư và nguyên văn 《Toàn Thư》** (kho lời đoán vẫn không mở mã nguồn, kết quả hiệu đính thể hiện trong bộ dữ liệu v4.0):

- Các trích dẫn ghi là của Nghê sư hoặc 《Toàn Thư》 nhưng không tra được xuất xứ thì bị xóa hoặc thay bằng nguyên lời tra được từng chữ; nguyên lời Nghê sư ghi rõ thuộc tập thứ mấy của 《Thiên Kỷ》, phút giây thứ mấy
- Xóa các câu liên quan đến những Tứ Hóa không thể xảy ra (như Thất Sát Hóa Quyền, Tử Vi Hóa Kỵ); bổ sung điều kiện cho những lời đoán chỉ đúng trong một điều kiện nhất định
- Những câu nói cả hai đầu kiểu 「力量强时……落陷时……」 (“khi lực mạnh thì…… khi lạc hãm thì……”) được sửa thành chỉ hiển thị trường hợp đúng theo lá số
- Sức khỏe: tạng phủ nào cần lưu ý được sửa theo quan điểm của Nghê sư — lấy cung có sát tinh tập trung nhiều nhất trong toàn lá số, theo địa chi của cung đó mà ứng với tạng phủ; không còn suy tạng phủ theo ngũ hành của sao
- Mục 「古籍引证」 (“Dẫn chứng cổ thư”) trong kho tri thức của website tăng từ 244 chỗ lên 405 chỗ, chỗ nào cũng tìm được từng chữ trong nguyên văn 《Tử Vi Đẩu Số Toàn Thư》

**3. Đồng bộ engine lập lá số** ([PR #39](https://github.com/Renhuai123/ziwei-doushu/pull/39)) —— `dst-cn.ts` thêm `chinaDSTSpan(year)` để tra thời điểm bắt đầu/kết thúc giờ mùa hè của Trung Quốc trong một năm; `cities.ts` bổ sung kinh độ của các đơn vị cấp huyện trực thuộc tỉnh và các thành phố thuộc Binh đoàn Tân Cương (Thần Nông Giá, các thị/huyện của Hải Nam, A Lạp Nhĩ…), khi chọn nơi sinh là các thành phố này thì hiệu chỉnh giờ mặt trời thật (chân thái dương thời) dùng được.

**4. Giấy phép** —— Phạm vi áp dụng của [`DATASET-LICENSE`](./DATASET-LICENSE) thêm v4.0; ghi rõ nguyên lời Nghê sư được trích dẫn trong luận giải không thuộc phạm vi cấp phép dữ liệu, thống nhất với CC BY-NC-SA 4.0 của nguyên lời Nghê sư ở chương V. Bộ dữ liệu mẫu v3.0 và điều khoản của nó giữ nguyên.

> **Bổ sung 2026-11-02**: Việc đổi ngày ở giờ Tý muộn chuyển sang xét theo **giờ mặt trời thật**, cùng chuẩn với địa chi của canh giờ (#63) — khi đã điền nơi sinh, đồng hồ chỉ 23:30 ở kinh độ Đông 100° (giờ mặt trời thật 22:10, giờ Hợi) được giữ ở ngày hôm đó, không còn bị lập thành 「次日亥时」 (“giờ Hợi ngày hôm sau”); không điền nơi sinh thì không hiệu chỉnh, kết quả không đổi, bản trực tuyến ouranic.cn cũng theo chuẩn này. Khi tham số quy thuộc tháng nhuận viết sai thì báo lỗi ngay, không còn âm thầm lập lá số theo 「归本月」 (“quy về tháng này”) (#71). Cảm ơn Bortlesboat, xunguangzlj-cloud đã gửi đóng góp, Verchiel666 đã rà soát lại.

> **Bổ sung 2026-10-31**: Nền tảng trực tuyến đổi tên thành **OURANIC**, địa chỉ chuyển từ metisziwei.com sang **[ouranic.cn](https://ouranic.cn/?from=gh-readme)** (chủ thể vận hành: 北京王多鱼科技有限责任公司, số đăng ký ICP 京ICP备2026069066号-1); địa chỉ cũ sẽ tự động chuyển hướng, mã nguồn, bộ dữ liệu và giấy phép của repo này đều không đổi.

> **Bổ sung 2026-10-27**: Đồng bộ engine lập lá số — `true-solar-time.ts` hỗ trợ nơi sinh ở nước ngoài: truyền `utcOffsetMinutes` (độ lệch chuẩn cố định của múi giờ nơi sinh), hiệu chỉnh kinh độ theo kinh tuyến trung tâm của múi giờ địa phương, trong nước không truyền thì kết quả không đổi một chữ số nào; thêm `clock-adjust.ts`, chuyển **số đọc trên đồng hồ thành giờ chuẩn** khi có giờ mùa hè, hoặc khi múi giờ năm đó khác hiện nay (qua ngày thì không đổi, để người dùng quyết định); khuyến nghị làm thành nút do người dùng tự bấm, có thể hoàn tác, không tự động sửa. Nhân tiện đính chính: engine giờ mùa hè Trung Quốc **chỉ xác định, không bao giờ tự động trừ**; trước đây bảng 「引擎能力」 (“Năng lực engine”) ghi là 「自动扣除」 (“tự động trừ”) là sai.

> **Bổ sung 2026-10-24**: Triết lý dự án được đưa lên đầu trang — dưới tiêu đề căn giữa một câu 「算法是公开的传统智慧，不应该被锁在围墙里」 (“Thuật toán là trí tuệ truyền thống công khai, không nên bị khóa sau tường rào”), tiếp theo là hai đoạn nguyên văn triết lý (đánh dấu trước là 「项目理念」 “Triết lý dự án”), đoạn giới thiệu cũ được đánh dấu trước là 「项目信息」 (“Thông tin dự án”); mục 「项目理念」 ở chương X đổi thành trỏ về đầu trang.

> **Bổ sung 2026-10-20**: Độ sáng của sao mặc định đổi sang 《Đẩu Số Toàn Thư》, thống nhất với mặc định của các phần mềm lập lá số phổ biến; mặc định cũ 「现代修正 v2」 (“Hiệu chỉnh hiện đại v2”) vẫn có thể chọn trong cài đặt trường phái; bổ sung độ sáng của Thiên Diêu, Thiên Hình, Thiên Hỷ, Đại Hao, Giải Thần, Triệt Không, Phó Triệt, Tuần Không; Nguyệt Đức không còn đánh dấu độ sáng. Dùng 5 lá số chuẩn vàng đối chiếu từng cung, vị trí sao rơi vào cung và độ sáng đều khớp hoàn toàn. Lưu ý: bộ dữ liệu v4.0 (10-15) được sinh theo mặc định cũ 「现代修正 v2」, trong đó chữ độ sáng và một số ít câu luận giải thay đổi theo độ sáng sẽ khác với mặc định mới.

> **Bổ sung 2026-10-06 ~ 10-07**: README thêm 「注：关于六亲判断」 (“Lưu ý: về việc luận đoán lục thân”) (nguyên lời Nghê sư + link xuất xứ, hai bản Trung và Anh); link website thêm mã kênh `?from=`; đồng bộ đính chính kho ngữ liệu nguyên lời Nghê sư (nhóm Nam Đẩu, Bắc Đẩu của chính tinh).

### Đợt cập nhật trước (2026-09-21)


> **Bổ sung 2026-10-03**: 1848 mục nguyên lời Nghê sư trong 《Thiên Kỷ · Tử Vi Đẩu Số》 được tách thành một chương riêng (chương V); gộp đóng góp bên ngoài #29 (kiểm tra chỉ số canh giờ); engine từ chối ngày dương lịch không tồn tại, bộ dữ liệu bổ sung chuẩn trường dữ liệu và các vấn đề đã biết; commit package-lock.json; địa chỉ site có thể cấu hình; bản demo xem hợp đôi đổi sang dùng engine cục bộ để lập lá số, khi thiếu API AI thì thông báo rõ ràng; bổ sung hướng dẫn đóng góp, quy tắc ứng xử, template issue và PR; thêm giới thiệu tiếng Anh [README.en.md](./README.en.md); bỏ hai gói công cụ triển khai không dùng tới (vercel CLI, @cloudflare/next-on-pages), số dependency giảm từ 483 xuống 185; sau đó nâng cấp lên Next.js 16 để vá lỗ hổng postcss, cảnh báo bảo mật của GitHub từ 51 về 0.

![Tổng quan cập nhật đợt này](./docs/update-20260921.png)

Sau ba tháng, repo này hoàn thành một lần cập nhật đầy đủ ([PR #28](https://github.com/Renhuai123/ziwei-doushu/pull/28), 26 tệp, +2736 / −108 dòng):

**1. Engine lập lá số đồng bộ với chuẩn của bản trực tuyến** —— `algorithm.ts` từ 181 dòng lên 641 dòng, ngoài ra cập nhật sihua / types / constants / patterns / cities / famous; thêm 8 module (1367 dòng):

| Module | Tác dụng |
|------|------|
| `true-solar-time.ts` | Hiệu chỉnh giờ mặt trời thật (chênh lệch kinh độ + phương trình thời gian) |
| `dst-cn.ts` | Giờ mùa hè Trung Quốc 1986–1991 |
| `clock-adjust.ts` | Chuyển số đọc đồng hồ thành giờ chuẩn (giờ mùa hè / múi giờ năm đó khác) |
| `lunar-solar.ts` | Chuyển đổi âm lịch / dương lịch và clamp biên tháng nhuận |
| `school-data.ts` / `school-tables.generated.ts` / `school-config.ts` | Dữ liệu và bảng đối chiếu trường phái độ sáng sao, cấu hình chuẩn tháng nhuận và giờ Tý muộn |
| `shier-shen.ts` | Thập nhị thần sát |
| `yunxian-context.ts` | Ngữ cảnh vận hạn (gồm đồng hạn) |

**2. Bổ sung kiểm thử hồi quy và CI** —— trước đây repo này không có bất kỳ kiểm thử nào. Nay có 5 bài hồi quy lập lá số, một lệnh `npm test` chạy hết, mỗi lần push và PR đều tự động chạy trên GitHub Actions.

**3. Sửa chú thích canh giờ lệch trong mẫu** ([#26](https://github.com/Renhuai123/ziwei-doushu/issues/26)) —— trong `famous.ts`, 7 trên 11 mẫu danh nhân có chú thích canh giờ không khớp với chỉ số `hour` (`hour` luôn là **chỉ số địa chi của canh giờ 0–11**, không phải số giờ 0–23). Đã sửa và thêm hồi quy để chốt lại.

**4. Issue tồn đọng giảm từ 18 xuống 4**, những issue còn lại đều đang được xử lý.

**5. Tài liệu và giấy phép** —— thêm [`DATASET-LICENSE`](./DATASET-LICENSE); README bổ sung danh sách năng lực engine, nhịp bảo trì, ranh giới mã nguồn mở; sửa hai mô tả không đúng sự thật (bộ dữ liệu 「口径与线上完全一致」 “chuẩn hoàn toàn giống bản trực tuyến”, giao diện 「完整的 Next.js 15 前端」 “frontend Next.js 15 hoàn chỉnh”).

---

## II (mới). Bộ dữ liệu luận giải 13 chiều v4.0 (2026-10-15)

> **Nơi tải xuống: phía bên phải repo này, [Releases → v4.0-13d](https://github.com/Renhuai123/ziwei-doushu/releases/tag/v4.0-13d)**

v4.0 được sinh lại bằng kho lời đoán của website phiên bản 2026-10-15: lời đoán của 13 chiều phân tích đã được hiệu đính từng câu theo bản ghi từng chữ 《Thiên Kỷ》 của Nghê Hải Hạ và nguyên văn 《Tử Vi Đẩu Số Toàn Thư》 — các trích dẫn không tra được xuất xứ bị xóa hoặc thay bằng nguyên lời tra được từng chữ (nguyên lời Nghê sư ghi rõ số tập và mốc thời gian trong 《Thiên Kỷ》), xóa các câu liên quan đến Tứ Hóa không thể xảy ra, lời đoán có điều kiện thì ghi rõ điều kiện.

### Quy cách

| Mục | Mô tả |
|------|------|
| Số lá số | **674,976 lá số** (dương lịch 1950–2026 × số ngày thật của mỗi tháng × 12 canh giờ × nam nữ) |
| Số đoạn luận giải | **8,774,688 đoạn** (mỗi lá số 13 chiều) |
| Các chiều | Tổng quan mệnh cách, tính cách, tình cảm, sự nghiệp, tài vận, sức khỏe, huynh đệ, tử tức, thiên di, quan hệ nhân tế, điền trạch, phúc đức, phụ mẫu |
| Dung lượng | Sau giải nén 56.6 GB; sau nén 161 MB (77 tệp theo năm, zstd; ngoài ra có một gói tổng hợp mọi năm `ziwei-interp-v4-all.tar`) |
| Chính văn | Khoảng 20.4 tỷ chữ, mỗi lá số khoảng 30 nghìn chữ |
| Cách sinh | Engine lập lá số + kho lời đoán sinh theo cách tất định, không qua AI, cùng đầu vào luôn cho cùng đầu ra |
| Phiên bản nội dung | `ca268829f7a9` (ANALYSIS_CONTENT_VERSION cùng thời với website) |

**Mỗi dòng một lá số** (JSON Lines), các trường:

| Trường | Ý nghĩa |
|------|------|
| `k` | Khóa: `YYYY-MM-DD-时辰序号-性别` (năm-tháng-ngày-chỉ số canh giờ-giới tính), ví dụ `1990-01-01-0-male` |
| `y` / `m` / `d` | Ngày sinh **dương lịch**; chỉ gồm ngày có thật (không còn ngày 30 tháng 2 hay tương tự) |
| `h` | **Chỉ số canh giờ 0–11** (Tý = 0 …… Hợi = 11), không phải giờ đồng hồ; bảng đối chiếu xem phần trước |
| `g` | `male` / `female` |
| `ms` | Chính tinh đầu tiên của cung Mệnh; khi cung Mệnh không có chính tinh thì là `null` |
| `t` | Số chữ của từng chiều |
| `c` | Toàn văn luận giải 13 chiều (Markdown), khóa là `overview` / `personality` / `love` / `career` / `wealth` / `health` / `family` / `children` / `move` / `friends` / `home` / `spirit` / `parents` |

**Ghi chú về chuẩn dữ liệu**
- Là luận giải của góc nhìn lá số bản mệnh; các câu trên website được viết lại theo tuổi hiện tại của người đọc, đoạn pháp tắc của Nghê sư thêm vào cuối mỗi chiều, và luận giải AI đều không có trong bộ dữ liệu.
- Lập lá số trực tiếp theo chỉ số canh giờ, chưa hiệu chỉnh giờ mặt trời thật theo nơi sinh.

### Tải xuống và giải nén

```bash
# Tải tất cả một lần: gh release download v4.0-13d --repo Renhuai123/ziwei-doushu -p "ziwei-interp-v4-all.tar"
# Chỉ cần vài năm thì chỉ tải những năm đó, ví dụ năm 1990
zstd -d --long=27 year-1990.jsonl.zst          # được year-1990.jsonl
shasum -a 256 -c SHA256SUMS.txt --ignore-missing # kiểm tra
```

Bắt buộc phải có `--long=27` (khi nén đã dùng cửa sổ dài). Trên Windows có thể dùng zstd.exe trong [gói phát hành chính thức của zstd](https://github.com/facebook/zstd/releases), tham số giống hệt.

### Ghi chú về trích dẫn

Nguyên lời 《Thiên Kỷ》 của Nghê Hải Hạ được trích dẫn trong luận giải **không thuộc phạm vi cấp phép của bộ dữ liệu này**: đó là những trích dẫn ngắn có ghi số tập và mốc thời gian để chỉ ra xuất xứ của lời đoán, bản quyền thuộc về chủ sở hữu quyền ban đầu; muốn dùng riêng các nguyên lời này theo từng lô thì xử lý theo [CC BY-NC-SA 4.0](./docs/tianji-ziwei/LICENSE.md) của nguyên lời Nghê sư ở chương V. Nguyên văn 《Tử Vi Đẩu Số Toàn Thư》 thuộc phạm vi công cộng.

### Giấy phép

Giống v3.0: **CC BY 4.0, được tự do dùng cho mục đích thương mại, yêu cầu duy nhất là giữ ghi chú nguồn** (ngoại trừ nguyên lời Nghê sư nêu trong phần 「Ghi chú về trích dẫn」 ở trên), điều khoản đầy đủ xem [DATASET-LICENSE](./DATASET-LICENSE). Khi trích dẫn xin ghi:

> 本项目使用了 **紫微斗数开源解读数据集 v4.0**（674,976 张命盘 × 13 维）
> 来源：https://github.com/Renhuai123/ziwei-doushu
> 作者：王多鱼AI

<sub>(Dịch: Dự án này sử dụng **Bộ dữ liệu luận giải Tử Vi Đẩu Số mở mã nguồn v4.0** (674,976 lá số × 13 chiều) — Nguồn: https://github.com/Renhuai123/ziwei-doushu — Tác giả: 王多鱼AI)</sub>

---

## II. Bộ dữ liệu mẫu 518 nghìn lá số

> **Nơi tải xuống: trang [Releases](https://github.com/Renhuai123/ziwei-doushu/releases/tag/v3.0-samples) ở phía bên phải repo này**

Chúng tôi mở mã nguồn một bộ dữ liệu mẫu lá số Tử Vi Đẩu Số hoàn chỉnh, bao phủ **518 nghìn tổ hợp lập lá số** (năm 60 × tháng 12 × ngày 30 × giờ 12 × giới tính 2), mỗi mẫu gồm cấu trúc lá số hoàn chỉnh và văn bản luận giải dựa trên hệ thống của Nghê Hải Hạ.

### 2.1 Quy cách dữ liệu

| Mục | Mô tả |
|------|------|
| Số lượng mẫu | **518,400 mẫu** |
| Tổng dung lượng | Sau nén 5.5 GB (chia 3 phần), sau giải nén 33.1 GB |
| Hệ thống | Chính thống 《Thiên Kỷ》 của Nghê Hải Hạ (phái thuần Phi tinh đã gỡ bỏ) |
| Nội dung | JSON lá số + văn bản luận giải 13 chủ đề (tổng quan mệnh cách, tài vận, sự nghiệp, tình cảm, sức khỏe…) |
| Kiểm chứng | Khác biệt hóa mệnh nam/nữ 100%, phần sức khỏe có Tý Ngọ lưu chú 100%, mệnh nữ có phần dưỡng sinh phụ khoa 100% |
| Chuẩn | Sinh bởi **engine lập lá số bản v3 + kho lời đoán cùng thời**; engine trực tuyến liên tục cập nhật, đầu ra của bản mới có thể khác bộ dữ liệu này |

**Chuẩn các trường** (mỗi mẫu được sinh từ `birthInfo`, trường hay bị hiểu sai là `hour`):

| Trường | Ý nghĩa |
|------|------|
| `birthInfo.year` / `month` / `day` | Ngày sinh **dương lịch**: năm 1924–1983 (một vòng Giáp Tý đầy đủ), mỗi tháng lấy ngày 1–30 |
| `birthInfo.hour` | **Chỉ số canh giờ 0–11**, không phải giờ đồng hồ 0–23: Tý = 0, Sửu = 1 …… Hợi = 11 |
| `birthInfo.gender` | `male` / `female` |
| `birthInfo.longitude` | Cố định 120 (kinh độ Đông 120°, chưa hiệu chỉnh giờ mặt trời thật theo từng nơi) — chỉ là chuẩn của bộ dữ liệu này; form lập lá số trên web hiệu chỉnh theo nơi sinh (Việt Nam / Trung Quốc, xem mục 4.1) |
| Tên tệp `YYYY-MM-DD-hHH-性别.json` (`性别` = giới tính) | Trong đó `hHH` cũng là chỉ số canh giờ, ví dụ `h11` là giờ Hợi, không phải 11 giờ sáng |

Đối chiếu chỉ số canh giờ với giờ đồng hồ:

| Chỉ số | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Canh giờ | Tý | Sửu | Dần | Mão | Thìn | Tỵ | Ngọ | Mùi | Thân | Dậu | Tuất | Hợi |
| Giờ đồng hồ | 23–1 | 1–3 | 3–5 | 5–7 | 7–9 | 9–11 | 11–13 | 13–15 | 15–17 | 17–19 | 19–21 | 21–23 |

Sinh lúc 23:00–23:59 (giờ Tý muộn) thì lập lá số theo ngày hôm sau, canh giờ lấy 0; sinh lúc 00:00–00:59 (giờ Tý sớm) thì lập lá số theo ngày hôm đó, canh giờ cũng lấy 0.

**Vấn đề đã biết: khoảng 2,520 mẫu có ngày không tồn tại.** Khi sinh dữ liệu, mỗi tháng đều lấy ngày 1–30, nên ngày 30 tháng 2, và ngày 29 tháng 2 của năm không nhuận cũng được sinh mẫu, tổng cộng 105 ngày × 12 canh giờ × 2 giới tính = 2,520 mẫu, chiếm 0.49%. Engine v3 gặp loại ngày này không báo lỗi mà lùi sang ngày 1–2 tháng 3 để lập lá số, nên nội dung các mẫu này trùng với mẫu tương ứng của ngày 1–2 tháng 3. Khi sử dụng xin lọc bỏ: `month = 2` và `day = 30`, hoặc `month = 2` và `day = 29` và năm đó không phải năm nhuận. Từ 2026-10-03 engine sẽ trực tiếp từ chối ngày không tồn tại, phiên bản bộ dữ liệu tiếp theo sẽ không còn loại mẫu này.

### 2.2 Cách tải xuống

Vào [Releases](https://github.com/Renhuai123/ziwei-doushu/releases/tag/v3.0-samples) tải các tệp sau:

```
ziwei-samples-v3-part1.zip.001  (1.9 GB)
ziwei-samples-v3-part2.zip.002  (1.9 GB)
ziwei-samples-v3-part3.zip.003  (1.8 GB)
SHA256SUMS.txt                  (tệp kiểm tra)
```

Tải xong thì ghép lại và giải nén:

```bash
# macOS / Linux
cat ziwei-samples-v3-part*.zip.* > combined.zip
unzip combined.zip

# Windows (PowerShell)
Get-Content ziwei-samples-v3-part*.zip.* -Encoding Byte -ReadCount 0 | Set-Content combined.zip -Encoding Byte
Expand-Archive combined.zip
```

### 2.3 Công dụng

- Ngữ liệu huấn luyện để tinh chỉnh (fine-tune) mô hình nhỏ (518 nghìn cặp input-output)
- Nguồn truy xuất RAG cho hội thoại AI
- Làm baseline so sánh A/B sau khi sửa `patterns.ts`
- Nghiên cứu Tử Vi Đẩu Số và phân tích dữ liệu

### 2.4 Giấy phép dữ liệu và trích dẫn

📂 **Mở mã nguồn hoàn toàn · được tự do dùng cho mục đích thương mại** —— bạn có thể dùng bộ dữ liệu này trong bất kỳ dự án nào, bao gồm nhưng không giới hạn:

- Sản phẩm thương mại / SaaS / ứng dụng trả phí
- Tinh chỉnh mô hình AI (mô hình mã nguồn mở hay đóng đều được)
- Phát triển tiếp, phân phối lại, bộ dữ liệu phái sinh
- Nghiên cứu học thuật, blog kỹ thuật, khóa học giảng dạy

Không cần trả phí, không cần xin phép, không cần báo trước.

**Yêu cầu duy nhất là giữ ghi chú nguồn dữ liệu (attribution)**:

> 本项目使用了 **紫微斗数开源样本数据集 v3.0**（518,400 条）
> 来源：https://github.com/Renhuai123/ziwei-doushu
> 作者：王多鱼AI

<sub>(Dịch: Dự án này sử dụng **Bộ dữ liệu mẫu Tử Vi Đẩu Số mở mã nguồn v3.0** (518,400 mẫu) — Nguồn: https://github.com/Renhuai123/ziwei-doushu — Tác giả: 王多鱼AI)</sub>

Đặt ở đâu cũng được:

- **Trang web / sản phẩm**: trang About / Giới thiệu / Nguồn dữ liệu / chân trang, chỉ cần một dòng link
- **Mô hình AI**: trường "Training Data" của thẻ mô hình (Model Card) hoặc thẻ bộ dữ liệu (Dataset Card)
- **Bài báo học thuật**: tài liệu tham khảo hoặc phần lời cảm ơn
- **Bộ dữ liệu phát hành lại**: ghi rõ nguồn thượng nguồn trong README hoặc tệp metadata

Chỉ một điều này thôi, còn lại đều tự do. Điều khoản đầy đủ xem [DATASET-LICENSE](./DATASET-LICENSE). Mong bộ dữ liệu này giúp bạn làm ra thứ tốt —— làm xong nhớ ghé Xiaohongshu / Douyin / Xianyu **@王多鱼AI** chào một tiếng 👋

---

## III. Bắt đầu nhanh

```bash
# Clone
git clone https://github.com/Renhuai123/ziwei-doushu.git
cd ziwei-doushu

# Cài dependency
npm install

# Cấu hình biến môi trường (chỉ xem lá số thì có thể bỏ qua; muốn luận giải AI thì điền ANTHROPIC_API_KEY)
cp .env.example .env.local

# Khởi động server phát triển
npm run dev
```

Kiểm tra cục bộ:

```bash
npm run typecheck   # Kiểm tra kiểu TypeScript toàn bộ
npm test            # Hồi quy engine lập lá số (768 lá số × quy luật bất biến của Tử Vi, giờ mùa hè, biên Lập Xuân, Hồng Loan Thiên Hỷ, tính nhất quán canh giờ của mẫu, biên chỉ số canh giờ, tính hợp lệ của ngày, hai Tứ Hóa cùng cung)
```

Mỗi lần push và PR đều chạy cùng bộ này trên GitHub Actions (xem [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)).

> **Lưu ý về API backend.** Lập lá số, hiển thị lá số, lập lá số xem hợp đôi đều thực hiện trong trình duyệt bằng engine của repo này, **không cần bất kỳ API Key nào**.
>
> **Luận giải AI (`/api/interpret`)** có sẵn trong bản tiếng Việt này, chạy bằng Claude (Anthropic): điền `ANTHROPIC_API_KEY` vào `.env.local` rồi khởi động lại `npm run dev`. Máy chủ an lại lá số từ ngày giờ sinh, tóm tắt bằng tiếng Việt (12 cung, độ sáng, Tứ Hóa năm sinh / đại hạn / lưu niên, cách cục) rồi gửi cho Claude; họ tên không được gửi đi. Mỗi lần mở lá số, bảng luận giải tự gọi AI một lần cho phần «Mệnh cách», nên mỗi lá số tốn ít nhất một lượt gọi có tính phí. Có giới hạn lượt gọi theo IP và theo ngày (`AI_RATE_PER_HOUR`, `AI_DAILY_LIMIT`), lưu trong bộ nhớ của một tiến trình.
>
> **Chạy bằng model trên máy (Ollama):** cài [Ollama](https://ollama.com), tải model (ví dụ `ollama pull gemma3:12b`), rồi đặt `AI_PROVIDER=ollama` trong `.env.local` (đổi model bằng `OLLAMA_MODEL`). Không tốn phí, dữ liệu không rời khỏi máy, nhưng chậm hơn nhiều (vài phút một bài trên máy Mac M1 Pro) và luận kém sâu hơn Claude.
>
> **Hoặc qua LM Studio:** bật máy chủ (`lms server start`), nạp model với ngữ cảnh đủ dài (`lms load qwen/qwen3.5-9b -c 16384`; ngữ cảnh mặc định ngắn sẽ làm mất phần đầu lá số), rồi đặt `AI_PROVIDER=lmstudio` và `LMSTUDIO_MODEL=<tên trong lms ls>` trong `.env.local`. Phần suy nghĩ của model được tắt (`reasoning_effort: none`) để trả lời ngay bằng tiếng Việt.
>
> **Phân tích AI xem hợp đôi (`/api/heming`)** vẫn chưa có; chỗ này sẽ báo thẳng là bản mã nguồn mở không có API này.

---

## IV. Engine lập lá số

Toàn bộ lõi lập lá số nằm trong `lib/ziwei/`.

### 4.1 Làm được gì (khác biệt so với các thư viện lập lá số thông dụng)

| Năng lực | Mô tả |
|------|------|
| **Hiệu chỉnh giờ mặt trời thật** | Tính chênh lệch giờ theo kinh độ nơi sinh + phương trình thời gian, tránh lệch một canh giờ theo hướng Đông–Tây. Form lập lá số (`share.ts` `formSolarTime`) hiệu chỉnh theo kinh độ: mặc định **Việt Nam** — 34 tỉnh/thành từ 1/7/2025 (tỉnh cũ là khu vực tùy chọn), giờ đồng hồ hiểu theo **múi giờ Việt Nam lúc sinh** (UTC+7 hiện nay; trước 13/6/1975 theo lịch sử tzdata từng miền, ví dụ miền Nam 1960–1975 là UTC+8), kinh tuyến chuẩn = múi giờ / 4; chọn **Trung Quốc** thì như trước: giờ Bắc Kinh UTC+8, kinh tuyến 120°. Nước khác chưa hỗ trợ |
| **Giờ mùa hè Trung Quốc** | Tự động xác định khoảng giờ mùa hè các năm 1986–1991 (chỉ xác định, không tự động trừ; số đọc đồng hồ sau khi người dùng xác nhận thì dùng `clock-adjust.ts` chuyển thành giờ chuẩn) |
| **Âm lịch Việt Nam** | Người sinh ở Việt Nam (`country: 'VN'`) đổi dương → âm theo **âm lịch Việt Nam**: sóc và trung khí tính theo giờ UTC+7 (kinh tuyến 105°E, quy tắc Hồ Ngọc Đức; thiên văn Meeus + VSOP87 rút gọn, `lunar-calendar-tz.ts`), áp dụng cho miền Bắc từ 1/1/1968 và miền Nam từ 13/6/1975; trước đó dùng lịch Trung Quốc (UTC+8) như thực tế lịch sử (`vn-lunar-calendar.ts`). Ví dụ Tết 1985: VN 21/1, TQ 20/2; Tết 2007: VN 17/2, TQ 18/2. Năm/tháng/ngày âm, tháng nhuận, can chi năm, tuổi mụ và tứ trụ (điểm giao tiết so theo giờ VN thật) đều theo lịch VN; chọn Trung Quốc thì giữ nguyên lịch lunar-javascript |
| **Bốn chuẩn tháng nhuận** | Tháng nhuận quy về tháng trước / quy về tháng sau / chia theo ngày / theo tháng này, có thể cấu hình, không cố định theo một phái |
| **Đổi ngày ở giờ Tý muộn** | 23:00–23:59 lập lá số theo ngày hôm sau, 00:00–00:59 theo ngày hôm đó; khi đã điền nơi sinh thì xét theo giờ mặt trời thật (cùng chuẩn với canh giờ); chiến lược đổi ngày có thể chuyển đổi |
| **Độ sáng sao 7 mức** | Miếu / Vượng / Đắc / Lợi / Bình / Bất / Hãm, ngoài ra giữ 3 mức phân loại thô để hạ cấp khi hiển thị |
| **Chuyển đổi trường phái độ sáng** | Các trường phái khác nhau (kể cả các phiên bản khác nhau của phần mềm lập lá số phổ biến) xét độ sáng phụ tinh không thống nhất, nên làm thành công tắc thay vì cố định |
| **Tứ Hóa và Phi tinh** | Tứ Hóa năm sinh, Tứ Hóa Đại hạn / Lưu niên, Phi tinh Tự hóa |
| **Thập nhị thần sát** | Tầng bản mệnh khởi theo chi năm sinh, tầng Lưu niên đổi sang khởi theo chi năm lưu niên |
| **Xác định Cách cục** | Kho quy tắc hơn 1100 dòng (Tử Phủ đồng cung, Nhật Nguyệt tịnh minh, Thất Sát triều Đẩu…) |

### 4.2 Phân chia tệp

| Tệp | Mô tả |
|------|------|
| `algorithm.ts` | Quy trình lập lá số hoàn chỉnh: an cung Mệnh, định Ngũ hành cục, an 14 chính tinh, an phụ tinh, xếp Đại hạn Lưu niên |
| `constants.ts` | Hằng số thiên can địa chi, 14 chính tinh, phụ tinh |
| `sihua.ts` | Hệ thống Tứ Hóa Phi tinh (Lộc Quyền Khoa Kỵ), gồm bảng đối chiếu Tứ Hóa theo từng thiên can |
| `patterns.ts` | **Kho tri thức Cách cục hơn 1100 dòng**: quy tắc xác định các Cách cục kinh điển như Tử Phủ đồng cung, Nhật Nguyệt tịnh minh, Thất Sát triều Đẩu |
| `heming-knowledge.ts` | Phương pháp luận xem hợp đôi: logic so sánh hai lá số theo hệ thống của Nghê sư |
| `types.ts` | Định nghĩa kiểu TypeScript |
| `cities.ts` | Kinh vĩ độ các thành phố Trung Quốc, dùng để hiệu chỉnh giờ mặt trời thật |
| `vn-places.ts` / `vn-timezone.ts` | 34 tỉnh/thành Việt Nam theo NQ 202/2025/QH15 (toạ độ trung tâm hành chính mới; 63 tỉnh cũ + Vĩnh Linh là khu vực tùy chọn với toạ độ tỉnh lỵ cũ và miền 1954–1975; tên tỉnh cũ trong link cũ vẫn tra được; Quảng Trị mới vắt qua sông Bến Hải nên bắt buộc chọn khu vực khi hai miền khác múi giờ) và lịch sử múi giờ Việt Nam theo miền (bảng tĩnh theo IANA tzdata) |
| `lunar-calendar-tz.ts` / `vn-lunar-calendar.ts` | Âm lịch theo múi giờ tham số (UTC+8 khớp lunar-javascript từng ngày 1960–2050) và quy tắc chọn âm lịch Việt Nam theo miền / thời kỳ, kèm nguồn |
| `famous.ts` | Dữ liệu ví dụ lá số của danh nhân lịch sử |
| `school-data.ts` / `school-tables.generated.ts` / `school-config.ts` | Dữ liệu và bảng đối chiếu trường phái độ sáng sao, cấu hình chuẩn tháng nhuận và giờ Tý muộn |
| `shier-shen.ts` | Thập nhị thần sát (bản mệnh khởi theo chi năm sinh, tầng Lưu niên khởi theo chi năm lưu niên) |
| `true-solar-time.ts` | Hiệu chỉnh giờ mặt trời thật (chênh lệch kinh độ + phương trình thời gian) |
| `dst-cn.ts` | Các năm và khoảng giờ mùa hè Trung Quốc 1986–1991 |
| `clock-adjust.ts` | Dịch số đọc đồng hồ theo phút thành giờ chuẩn (qua ngày thì không đổi) |
| `yunxian-context.ts` | Ngữ cảnh vận hạn (gồm xử lý đồng hạn) |
| `lunar-solar.ts` | Chuyển đổi âm lịch / dương lịch và clamp biên tháng nhuận |

### 4.3 Nguyên văn cổ thư (`lib/classics/`)

- **Cốt Tủy Phú** (`gusuifu.ts`) — ca quyết cốt lõi của Tử Vi Đẩu Số
- **Tử Vi Đẩu Số Toàn Tập** (`quanji.ts`) — cổ bản đời Thanh
- **Tử Vi Đẩu Số Toàn Thư** (`quanshu.ts`) — bản truyền của Trần Hy Di

### 4.4 Đồ thị tri thức SEO (`lib/seo/`)

Dữ liệu tri thức có cấu trúc 14 chính tinh × 12 cung, có thể dùng để sinh nội dung hoặc xây dựng kho tri thức.

---

## V. Nguyên lời Nghê sư trong 《Thiên Kỷ · Tử Vi Đẩu Số》

![Toàn cảnh 《Thiên Kỷ · Tử Vi Đẩu Số》 của Nghê Hải Hạ trong một hình](./docs/tianji-ziwei/overview.png)

Nguyên lời phần Tử Vi Đẩu Số trong 《Thiên Kỷ》 của Nghê Hải Hạ có tổng cộng **1848 mục**: 14 bài giảng chính khóa (bài 2 – nửa đầu bài 15) cộng 2 đoạn bổ sung, chia theo bài giảng thành 16 tệp, đặt trong [`docs/tianji-ziwei/`](./docs/tianji-ziwei/). Mục nào cũng kèm mốc thời gian xuất xứ, bấm một cái là nhảy về đúng giây đó trong video gốc trên Bilibili.

- **Đọc thế nào**: trước tiên tìm chủ đề muốn xem trong hình trên, rồi bấm vào bài giảng tương ứng, ví dụ [5上](./docs/tianji-ziwei/5%E4%B8%8A.md) (Tử Vi tại Tý), [13上](./docs/tianji-ziwei/13%E4%B8%8A.md) (Sát Phá Tham, Khoa Quyền Lộc tam hội).
- **Lấy từ đâu**: lấy từ repo chị em [nihai-tianji-corpus](https://github.com/Renhuai123/nihai-tianji-corpus), lấy kho ngữ liệu làm chuẩn, sẽ đồng bộ theo kho ngữ liệu.
- **Có được dùng thương mại không**: **Không**. Nội dung chương này áp dụng riêng CC BY-NC-SA 4.0, chi tiết xem [IX. Giấy phép](#ix-giấy-phép).

---

## VI. Giao diện chỉ là một bản Demo

Mã giao diện nằm trong `app/` và `components/`. Giao diện trong repo là **một ví dụ tối giản chạy được**, tác dụng là chạy engine lập lá số và vẽ lá số ra, tiện cho bạn xây sản phẩm của riêng mình trên nền đó. **Giao diện của bản thương mại trực tuyến không thuộc phạm vi mã nguồn mở**, hai bên chênh lệch rất lớn:

| Trang / Component | Repo này (Demo) | Bản thương mại trực tuyến |
|------|------|------|
| Trang lập lá số `app/chart/page.tsx` | 75 dòng | 1227 dòng |
| Bảng luận giải `InsightPanel` | 467 dòng | 5088 dòng |
| Ô lưới lá số `ChartBoard` | 285 dòng | 1334 dòng |
| Ô cung `PalaceCell` | 201 dòng | 1192 dòng |
| Trang xem hợp đôi `app/heming/page.tsx` | 368 dòng | 1937 dòng |

**Demo chạy được**: form thông tin ngày sinh, lưới lá số và chi tiết cung, chuyển đổi bản mệnh / Đại hạn / Lưu niên, trình đọc cổ thư (tìm kiếm toàn văn), bách khoa mệnh lý (14 chính tinh × 12 cung), giao diện sáng/tối, tương thích thiết bị di động.

**Demo không có**: giao diện tương tác đã được làm lại trên bản trực tuyến, luận giải AI dạng streaming, đồ thị xem hợp đôi, thẻ chia sẻ, và **bản thân nội dung lời đoán** (`db-analysis.ts` là hiện thực giữ chỗ). Nghĩa là, Demo vẽ được lá số nhưng không đưa ra được bộ luận giải như bản trực tuyến.

---

## VII. Ranh giới mã nguồn mở: những gì không có ở đây

| | Nội dung |
|---|---|
| ✅ **Mở mã nguồn** | Engine lập lá số (`lib/ziwei/`), nguyên văn cổ thư thuộc phạm vi công cộng (`lib/classics/`), đồ thị tri thức SEO (`lib/seo/`), giao diện Demo, bộ dữ liệu mẫu 518 nghìn lá số, bộ dữ liệu luận giải 13 chiều v4.0 |
| ❌ **Không mở mã nguồn** | Kho lời đoán (`lib/ziwei/db-analysis.ts` là giữ chỗ, bản trực tuyến là lời đoán 13 chủ đề dài hàng vạn dòng), prompt luận giải AI, API backend (`/api/interpret`…), hệ thống người dùng (đăng nhập / hội viên / thanh toán), bảo mật phía server (chữ ký, chống spam, watermark), cấu hình triển khai |

Nếu bạn cần năng lực luận giải AI, có thể tham khảo kho tri thức trong `lib/ziwei/patterns.ts` và `heming-knowledge.ts`, kết hợp với bất kỳ LLM nào để tự xây dựng prompt.

---

## VIII. Nhịp bảo trì và đóng góp

Repo này là **ảnh chụp mở của engine lập lá số + bộ dữ liệu**, không phải một sản phẩm mã nguồn mở được bảo trì toàn thời gian; nói rõ để mọi người khỏi phải đoán:

- **Đồng bộ engine**: đồng bộ tầng engine trong `lib/ziwei/` theo các bản phát hành trực tuyến và gắn tag; kho lời đoán, luận giải AI, frontend của site thương mại không thuộc phạm vi đồng bộ.
- **Issue**: có đọc, nhưng có thể trả lời không kịp thời; các vấn đề kèm bước tái hiện hoặc ví dụ lá số cụ thể (năm tháng ngày giờ + giới tính + điểm nào không đúng) được ưu tiên xử lý.
- **PR**: hoan nghênh, đặc biệt là kiểm thử hồi quy, sửa chuẩn, tài liệu. Thay đổi đụng đến chuẩn lập lá số xin kèm căn cứ (nguyên văn cổ thư hoặc đối chiếu kiểm chứng được).

---

## IX. Giấy phép

Repo này được cấp phép theo bốn phần. Ba phần đầu là giấy phép dễ dãi, **dùng thương mại không bị hạn chế**; thư mục nguyên lời Nghê sư **không được dùng thương mại**:

| Nội dung | Giấy phép | Nói đơn giản |
|------|------|--------|
| **Mã nguồn** (`lib/`, `app/`, `components/`) | [MIT License](./LICENSE) | Cứ lấy mà dùng, giữ tệp LICENSE là được |
| **Dữ liệu** (bộ dữ liệu mẫu 518 nghìn lá số v3.0, bộ dữ liệu luận giải 13 chiều v4.0 trong Releases) | [CC BY 4.0](./DATASET-LICENSE) · yêu cầu attribution | Dùng thương mại cũng được, **ghi rõ nguồn dữ liệu là được** |
| **Nguyên văn cổ thư** (Cốt Tủy Phú, Tử Vi Đẩu Số Toàn Tập / Toàn Thư…) | Public Domain | Sách cổ đều thuộc phạm vi công cộng, không có bản quyền |
| **Nguyên lời Nghê sư** ([`docs/tianji-ziwei/`](./docs/tianji-ziwei/)) | [CC BY-NC-SA 4.0](./docs/tianji-ziwei/LICENSE.md) | Được trích dẫn, đăng lại, ghi rõ xuất xứ; **không được dùng thương mại**, cải biên thì dùng cùng giấy phép |

**Một câu**: mã nguồn và dữ liệu cứ lấy mà dùng, thương mại cũng được, kèm link nguồn là được; nguyên lời Nghê sư chỉ dành cho học tập nghiên cứu phi thương mại (nguyên lời Nghê sư được trích dẫn trong luận giải của bộ dữ liệu cũng không thuộc phạm vi cấp phép dữ liệu).

<sub>Bản dịch README này mang tính tham khảo; đối với điều khoản pháp lý, văn bản gốc trong [LICENSE](./LICENSE), [DATASET-LICENSE](./DATASET-LICENSE) và [`docs/tianji-ziwei/LICENSE.md`](./docs/tianji-ziwei/LICENSE.md) là bản có hiệu lực.</sub>

---

## X. Giới thiệu và liên hệ

### Triết lý dự án

Xem phần đầu trang này. Muốn tự dựng? Mã nguồn đều ở đây, cứ lấy mà dùng. Ngại phiền? Đến [ouranic.cn](https://ouranic.cn/?from=gh-readme) dùng trực tiếp.

### Công nghệ

- **Framework**: Next.js 16 (App Router)
- **Ngôn ngữ**: TypeScript
- **Style**: Tailwind CSS + hệ thống thiết kế CSS Variables
- **Lập lá số**: dựa trên [iztro](https://github.com/SylarLong/iztro) + lunar-javascript
- **Animation**: Framer Motion

### Liên hệ

- Nền tảng trực tuyến: [ouranic.cn](https://ouranic.cn/?from=gh-readme) (đã hoàn tất đăng ký ICP: 京ICP备2026069066号-1)
- Báo lỗi, gửi bản sửa: xem [CONTRIBUTING.md](./CONTRIBUTING.md); trao đổi về cách dùng xin vào [khu thảo luận](https://github.com/Renhuai123/ziwei-doushu/discussions)
- 💕 Bấm một cái cho may mắn: theo dõi **王多鱼AI** trên Xiaohongshu / Douyin / Xianyu / X để xem ngay các bản ra mắt + mở khóa thêm nhiều kiến thức Tử Vi bổ ích～

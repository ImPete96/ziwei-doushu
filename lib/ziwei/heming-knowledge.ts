/**
 * 紫微斗数合盘知识库
 * 基于倪海厦《天纪》体系 + 《紫微斗数全书》古典断语 + 全网专业资料整合
 * 供合盘 AI 分析使用
 *
 * 显示文案为越南语；键（星名 / 四化 / 星级）保持 iztro 中文以便查表。
 * 倪海厦原话保留汉字原文，并在其后附越南语译文。
 */

// ─── 十四主星在夫妻宫的完整断语 ──────────────────────────

export const STAR_IN_FUQI_GU: Record<string, {
  summary: string;       // 一句话核心
  good: string;          // 吉象条件/表现
  bad: string;           // 凶象/注意事项
  spouse_traits: string; // 配偶外形性格
  timing: string;        // 婚期建议
  ni_quote?: string;     // 倪海厦原话（汉字原文 + 越南语译文）
}> = {
  '紫微': {
    summary: 'Người phối ngẫu kiêu hãnh, giỏi giang; nên kết hôn muộn, tình cảm lấy tôn trọng làm nền',
    good: 'Tam phương có Tả Phù Hữu Bật giáp: phối ngẫu hiền tài, sau cưới được quý nhân giúp; tam hợp gặp Lộc: tài lộc song toàn',
    bad: 'Vua cô độc không có Phù Bật: phối ngẫu cứng rắn, khó giao tiếp; ở cung Thìn, Tuất: tình nghĩa vợ chồng mỏng; hội Phá Quân: trước khi cưới gặp nhiều trở ngại',
    spouse_traits: 'Phối ngẫu khí chất kiêu hãnh, có chính kiến, lòng tự tôn mạnh, năng lực tốt nhưng không dễ bộc lộ tình cảm',
    timing: 'Nên cưới muộn (nam trên 30, nữ trên 27); cưới sớm nhiều trắc trở',
    ni_quote: '紫微在夫妻宫，孤克，宜晚婚，感情好但沟通成本高 (Tử Vi ở cung Phu Thê, cô khắc, nên cưới muộn; tình cảm tốt nhưng tốn công giao tiếp)',
  },
  '天机': {
    summary: 'Hôn nhân nhiều biến đổi; hợp với phối ngẫu chênh lệch tuổi khá lớn',
    good: 'Gặp Lộc Tồn hoặc Hóa Lộc: tình cảm còn duy trì được; hội Thái Âm: thêm tinh tế dịu dàng',
    bad: 'Hóa Kỵ hoặc hội sát: tình cảm biến đổi lớn, dễ chia lìa; Thiên Cơ hay đổi, phối ngẫu do dự trong chuyện tình cảm',
    spouse_traits: 'Phối ngẫu thông minh, hay thay đổi, tâm tư tinh tế, có duyên sâu với tôn giáo triết học, hơi nhạy cảm thần kinh',
    timing: 'Nên chênh tuổi nhiều (từ 6 tuổi trở lên) để giảm xung đột do biến đổi của hai bên',
    ni_quote: '天机善变，不宜独坐，婚姻充满变化 (Thiên Cơ hay đổi, không nên độc tọa, hôn nhân đầy biến đổi)',
  },
  '太阳': {
    summary: 'Nam mệnh được vợ giúp, nữ mệnh vượng phu; lạc hãm hoặc Hóa Kỵ thì ngược lại chủ hình khắc',
    good: 'Miếu vượng (từ Mão đến Thân): phối ngẫu giỏi giang, nam mệnh có hiền nội trợ; nữ mệnh lấy được chồng vượng, hôn nhân mỹ mãn',
    bad: 'Lạc hãm (từ Dậu đến Dần): nam mệnh vợ yếu bệnh, nữ mệnh lấy chồng tầm thường; Hóa Kỵ: nữ mệnh "上不见父，下不见子，中不见夫" (trên không thấy cha, dưới không thấy con, giữa không thấy chồng), mười năm ấy người chồng gặp tai họa lớn',
    spouse_traits: 'Phối ngẫu cởi mở hào phóng, có ý thức về hình ảnh trước công chúng, rộng rãi nhưng đôi khi quá áp đặt',
    timing: 'Tình cảm đầu nồng sau nguội, nên giữ khoảng cách vừa phải để duy trì cảm giác mới mẻ',
    ni_quote: '太阳化忌，上不见父，下不见子，中不见夫——女命那十年丈夫必有重大灾祸 (Thái Dương Hóa Kỵ, trên không thấy cha, dưới không thấy con, giữa không thấy chồng — nữ mệnh trong mười năm ấy chồng ắt gặp tai họa lớn)',
  },
  '武曲': {
    summary: 'Sao quả tú, hôn nhân hình khắc; đều nên cưới muộn',
    good: 'Vũ Khúc Hóa Lộc: phối ngẫu có năng lực tài chính, nhưng nam mệnh lại chê vợ quá giỏi; gặp Lộc Tồn, Phù Bật giáp: hôn nhân vững chắc, có tài',
    bad: 'Hóa Kỵ: cô quả, khó cưới, hoặc phối ngẫu có khuyết tật; Vũ Khúc Thất Sát (cung Mão, Dậu): điềm hôn nhân xấu; gặp bất kỳ sao nào trong tứ sát: chủ ly hôn; Vũ Khúc Phá Quân: gặp sát, Kỵ, hình diệu thì hôn nhân ắt bất lợi',
    spouse_traits: 'Phối ngẫu cương liệt, độc lập, nói thẳng, không giỏi bày tỏ tình cảm; kinh tế vững nhưng tính khá cô khắc',
    timing: 'Nhóm Vũ Khúc đều khuyên kết hôn sau 30 tuổi; cưới sớm tan sớm',
    ni_quote: '武曲化忌，为刑囚之星，武曲系婚姻宜晚 (Vũ Khúc Hóa Kỵ là sao hình tù; nhóm Vũ Khúc nên cưới muộn)',
  },
  '天同': {
    summary: 'Phối ngẫu ôn hòa, thích hưởng thụ; nên chênh tuổi nhiều, cưới muộn là tốt',
    good: 'Gặp Lộc Tồn hoặc Hóa Lộc: phối ngẫu ôn hòa mang tài, gia đình yên ổn; cùng Thái Âm: tình cảm dịu dàng ngọt ngào',
    bad: 'Hóa Kỵ: lúc đầu tình cảm còn được, dần dần nhạt đi, vì không hòa hợp mà sinh oán; gặp nhiều sát: sự lười nhác thành gánh nặng',
    spouse_traits: 'Phối ngẫu hiền hòa lương thiện, lạc quan dễ chịu, nhưng có thể lười, thiên về hưởng lạc',
    timing: 'Nam lấy vợ nhỏ tuổi hơn, nữ lấy chồng lớn tuổi hơn; chênh trên 8 tuổi là kết tóc tốt nhất',
  },
  '廉贞': {
    summary: 'Chính tinh bất ổn nhất ở cung Phu Thê, rủi ro sinh ly tử biệt cao',
    good: 'Liêm Trinh Thiên Phủ (Tý, Ngọ): phối ngẫu ôn hòa thanh tú, tình cảm tạm ổn, phối ngẫu thường là người làm công ăn lương',
    bad: 'Liêm Trinh Tham Lang: không sinh ly thì tử biệt; Liêm Trinh Phá Quân: "làm mộ dưới nước"; Liêm Trinh Thất Sát: "giữa đường chôn xác"; Hóa Kỵ: tình cảm bị quấy nhiễu không dứt, làm lành rồi đổ vỡ lặp lại; đồng cung với Hỏa Tinh: dù có cát diệu cũng ở riêng',
    spouse_traits: 'Phối ngẫu ngoại hình nổi bật, giỏi giao tế, đem lại nhiều giá trị cảm xúc nhưng không ổn định; có thể xa nhiều gần ít',
    timing: 'Nam mệnh nên lấy vợ trẻ hơn (6–12 tuổi), nữ mệnh nên lấy chồng lớn tuổi hơn',
    ni_quote: '廉贞贪狼/廉贞破军在夫妻宫，不管男命女命，非生离即死别；廉贞七杀——半路埋尸；廉贞破军——水中做冢；廉贞贪狼——横夭（夭折） (Liêm Trinh Tham Lang / Liêm Trinh Phá Quân ở cung Phu Thê, bất kể nam hay nữ, không sinh ly thì tử biệt; Liêm Trinh Thất Sát — giữa đường chôn xác; Liêm Trinh Phá Quân — làm mộ dưới nước; Liêm Trinh Tham Lang — chết yểu bất ngờ)',
  },
  '天府': {
    summary: 'Thiện diệu, chủ sinh ly chứ không tử biệt; tình cảm ổn định nhưng bình lặng',
    good: 'Gặp Lộc Tồn hoặc Hóa Lộc: tài lộc song toàn, tình cảm ổn định; tam phương không có sát: vợ chồng bình yên hòa thuận',
    bad: 'Phù hoặc Bật đơn tinh: dễ có cuộc hôn nhân thứ hai; gặp tứ sát: tình cảm lạnh nhạt, khả năng sinh ly tăng',
    spouse_traits: 'Phối ngẫu nho nhã, sở thích rộng, giữ của có nguyên tắc, làm việc giỏi nhưng thiên về bảo thủ',
    timing: 'Nam mệnh phối ngẫu lớn tuổi hơn, nữ mệnh phối ngẫu nhỏ tuổi hơn; tình cảm ổn định nhưng cần chủ động vun đắp',
  },
  '太阴': {
    summary: 'Hợp phối ngẫu thanh tú dịu dàng; lạc hãm thêm sát thì tình cảm nhiều biến đổi',
    good: 'Miếu vượng (từ Tý đến Ngọ) gặp cát: phối ngẫu thanh tú, có thành tựu, nam mệnh vợ đẹp; nữ mệnh: bản thân xinh đẹp có khí chất',
    bad: 'Lạc hãm (từ Mùi đến Hợi): tình cảm dễ đổi, phối ngẫu sức khỏe kém; Hóa Kỵ (nam mệnh càng kỵ): mẹ chồng nàng dâu bất hòa, vợ và mẹ ắt xung đột; gặp Hỏa Linh: tình cảm có biến cố lớn',
    spouse_traits: 'Phối ngẫu dịu dàng thanh tú, tinh tế nhạy cảm, trọng tình cảm nhưng đôi khi cảm tính',
    timing: 'Không có ràng buộc riêng, nhưng khi lạc hãm thì nên cưới muộn',
    ni_quote: '男人的命，最怕太阴化忌，婆媳不和，太太跟妈妈一定不和的 (Mệnh đàn ông sợ nhất Thái Âm Hóa Kỵ: mẹ chồng nàng dâu bất hòa, vợ với mẹ nhất định không hợp)',
  },
  '贪狼': {
    summary: 'Đào hoa vượng nhất, hôn nhân bất ổn, rủi ro ngoại tình cao',
    good: 'Hóa Lộc: phối ngẫu tài nghệ, quyến rũ, tình cảm ngọt ngào (nhưng rủi ro ngoại tình không giảm); gặp Hóa Khoa: giảm ngoại tình',
    bad: 'Hóa Kỵ: thường có hôn nhân thứ hai; Tử Vi Tham Lang (Mão, Dậu): phối ngẫu hay đi xa, có điềm ngoại tình; gặp tứ sát: ắt sinh ly; Tham Lang ở Ngọ (sao võ quan): ngược lại chủ phối ngẫu làm võ chức, khá ổn định',
    spouse_traits: 'Phối ngẫu tài nghệ xuất chúng, giỏi giao tiếp, rất có duyên với người khác giới, nhưng dục vọng mạnh, khó ràng buộc',
    timing: 'Cưới sớm thì tình cảm nhiều biến đổi, nên cưới muộn; trước khi cưới nhất định phải hiểu quan hệ khác giới của đối phương',
    ni_quote: '贪狼除了指桃花星，也指酒色财气赌，统统在贪狼里面；贪狼在午宫是武官星，不要随便批桃花 (Tham Lang ngoài nghĩa sao đào hoa còn chỉ tửu sắc tài khí cờ bạc, tất cả nằm trong Tham Lang; Tham Lang ở Ngọ là sao võ quan, đừng tùy tiện đoán là đào hoa)',
  },
  '巨门': {
    summary: 'Nhiều khẩu thiệt thị phi, vợ chồng dễ cãi nhau; cần Thái Dương hóa giải',
    good: 'Hội Thái Dương miếu vượng: ngược lại chủ hôn nhân hòa mỹ, tài ăn nói thành công cụ giao tiếp; Hóa Lộc: vợ hiền giỏi, đường tài mở ra nhờ vợ',
    bad: 'Hóa Kỵ: phối ngẫu hay cằn nhằn, thị phi không dứt; đồng độ với Đà La: vợ chồng tự chuốc phiền não; độc thủ không có cát: tình cảm dồn nén, mâu thuẫn sâu nhiều',
    spouse_traits: 'Phối ngẫu ăn nói giỏi, hay ghen, trọng thể diện, đôi khi quá khắt khe nhưng trong lòng sâu nặng',
    timing: 'Không có ràng buộc riêng, nhưng cần chuẩn bị tâm lý giao tiếp, mài giũa lâu dài',
  },
  '天相': {
    summary: 'Lương duyên "thân càng thêm thân", phu xướng phụ tùy, hôn nhân kiểu hợp tác',
    good: 'Gặp đủ Phù Bật: tình cảm trung thành, hôn nhân vững chắc; phối ngẫu chính trực vững vàng; Thiên Tướng tam hợp gặp Lộc: tài lộc có thể trông đợi',
    bad: 'Phù hoặc Bật đơn tinh: có thể báo hiệu tái hôn; gặp nhiều sát: trong tình cảm dồn nén ấm ức, không giỏi bày tỏ',
    spouse_traits: 'Phối ngẫu chính trực vững vàng, giữ chữ tín, không thích xung đột, giỏi điều hòa — người bạn đời tuyệt vời',
    timing: 'Thường phát triển từ quan hệ quen biết như bạn học, đồng nghiệp, hàng xóm; vợ chồng nên hợp tác cùng làm việc',
  },
  '天梁': {
    summary: 'Hợp phối ngẫu có trách nhiệm hoặc lớn tuổi hơn; trước khi cưới nhiều trắc trở',
    good: 'Gặp Lộc: phối ngẫu có phúc đức, tình cảm vững vàng; tam hợp có cát: vun đắp tình cảm chín chắn, lý trí',
    bad: 'Hóa Kỵ hoặc gặp sát: hay cằn nhằn, áp đặt thuyết phục, tình cảm xa cách; Thiên Lương phối Thiên Mã: vợ chồng vì hoàn cảnh mà phân tán; trước khi cưới dễ thất bại mối tình đầu',
    spouse_traits: 'Phối ngẫu có trách nhiệm, chín chắn già dặn, giỏi nói lý lẽ nhưng đôi khi hay lên lớp',
    timing: 'Trước khi cưới nhiều trắc trở là chuyện thường, một khi đã cưới lại vững; không có sát thì sau cưới tình càng sâu',
  },
  '七杀': {
    summary: '"Chăn uyên ương lạnh một nửa" — gần ít xa nhiều; nên cưới muộn sau 30 tuổi',
    good: 'Miếu vượng (cung Dần, Thân): phối ngẫu tuy cứng rắn nhưng trung thành, đã dấn thân thì dốc hết sức; Hóa Lộc trợ giúp: giảm cô khắc',
    bad: 'Gặp sát: tình cảm bề ngoài hòa thuận mà trong lòng bất mãn, nam mệnh chủ lấy vợ hai; nữ mệnh hợp làm vợ kế; cung Mão, Dậu (Vũ Khúc Thất Sát): vận hôn nhân kém nhất',
    spouse_traits: 'Phối ngẫu cứng rắn, cô độc, dễ yêu từ cái nhìn đầu tiên và cũng rời đi nhanh; yêu nóng lạnh đều nhanh',
    timing: 'Đều nên cưới muộn, sau 30 tuổi hôn nhân vững hơn; cưới sớm nhiều hình khắc',
    ni_quote: '七杀居夫妇而鸳衾半冷（古赋）；如果你娶个太太是七杀入命，那你就差不多毁了一半了，很累啊，草木皆兵 (Thất Sát ở cung phu thê thì chăn uyên ương lạnh một nửa (cổ phú); nếu anh lấy người vợ Thất Sát nhập Mệnh thì gần như hỏng một nửa rồi, mệt lắm, lúc nào cũng như có giặc)',
  },
  '破军': {
    summary: 'Sao phá hao hôn nhân, không sao sánh bằng; theo đuổi tình cảm không ràng buộc',
    good: 'Hóa Lộc: phá rồi mới lập, tình cảm trải qua sóng gió lại đi được đến cuối; anh tinh nhập miếu: phối ngẫu khôi ngô, cá tính',
    bad: 'Hóa Kỵ: phá hoại tan hoang, thường cưới nhiều lần hoặc không cưới; Tử Vi Phá Quân (Sửu, Mùi): không thêm sát cũng khắc, thêm sát ắt ly; cùng Liêm Trinh: "làm mộ dưới nước"; sau trung niên có tượng ngủ riêng, ở riêng',
    spouse_traits: 'Phối ngẫu theo đuổi tự do, không thích ràng buộc, dám đột phá nhưng quan niệm hôn nhân mỏng, cả đời biến động lớn',
    timing: 'Trước khi cưới dễ yêu từ cái nhìn đầu tiên hoặc cưới vội; nên kéo dài thời gian tìm hiểu rồi mới quyết định',
    ni_quote: '廉贞破军在夫妻宫，水中做坟墓；破军是婚姻破坏力最强的星 (Liêm Trinh Phá Quân ở cung Phu Thê là làm mộ dưới nước; Phá Quân là sao phá hoại hôn nhân mạnh nhất)',
  },
};

// ─── 四化在夫妻宫的完整断语 ─────────────────────────────────

export const SIHUA_IN_FUQI_GU = {
  '化禄': 'Có duyên tiền định với phối ngẫu, phối ngẫu lạc quan, sau cưới tình cảm càng tốt, phối ngẫu ngày càng kiếm được tiền, duyên phận sâu dày; tự hóa Lộc thì của đến rồi đi, có tình cảm nhưng khó giữ',
  '化权': 'Hôn nhân thường do chủ động tranh thủ mà có, phối ngẫu nắm quyền quyết định, phần lớn việc do phối ngẫu tự định, cần học cách buông tay; hôn nhân kiểu tranh giành, càng cưỡng cầu càng khó được',
  '化科': 'Xem như tiểu Lộc, có thể chung sống hòa hợp với phối ngẫu, có duyên quý nhân, lợi cho yêu đương cưới hỏi; Khoa ở Phu Thê chủ phối ngẫu có danh tiếng hoặc kỹ năng chuyên môn',
  '化忌': 'Mắc nợ hôn nhân, cưới sớm ly sớm, khuyên cưới muộn hoặc không cưới; phối ngẫu có lời oán trách bản thân; Hóa Kỵ xung cung Phu Thê càng hung — điềm sinh ly tử biệt',
};

// ─── 合盘核心方法论 ─────────────────────────────────────────

export const HEMING_METHODOLOGY = `
## Khung phân tích cốt lõi khi xem hợp đôi (tổng hợp hệ thống Nghê Hải Hạ + Tử Vi Đẩu Số Toàn Thư)

### I. Nguyên tắc xem song cung (cách đoán hôn nhân quan trọng nhất của Nghê Hải Hạ)

**Khẩu quyết cốt lõi: 「看婚姻，光看夫妻宫，大错特错，一定要同时看福德宫。」 (Xem hôn nhân mà chỉ xem cung Phu Thê là sai bét, nhất định phải xem cùng lúc cung Phúc Đức.)**

- **Cung Phu Thê**: xem tính chất sao, ngoại hình, tính cách, kiểu tương tác của phối ngẫu
- **Cung Phúc Đức**: đại diện cho tình cảm sâu xa của vợ chồng, hôn nhân có bền lâu hay không
- **Ví dụ của Nghê sư**: “有人夫妻宫很好，福德宫很烂，散！夫妻要散。” (Có người cung Phu Thê rất tốt mà cung Phúc Đức rất tệ — tan! Vợ chồng sẽ tan.)

**Vì vậy khi xem hợp đôi phải phân tích cùng lúc của cả hai bên: cung Mệnh + cung Phu Thê + cung Phúc Đức**

---

### II. Tiêu chuẩn "trời tác hợp"

**Mức hợp cao nhất (trời tác hợp)**:
- Chính tinh cung Phu Thê của bên A = chính tinh cung Mệnh của bên B
- Chính tinh cung Phu Thê của bên B = chính tinh cung Mệnh của bên A
- Hai bên tương ứng lẫn nhau thì là một đôi mệnh định

**Lương phối bậc hai**:
- Chính tinh cung Phu Thê của một bên = chính tinh cung Mệnh của bên kia (tương ứng một chiều)
- Ngũ hành tính sao cung Mệnh hai bên tương sinh (như mệnh Mộc phối mệnh Thổ, mệnh Thổ phối mệnh Thủy)
- Đại hạn hai bên cùng đi vận vượng

**Tổ hợp điềm xấu**:
- Hai bên Hóa Kỵ xung cung Mệnh của nhau (oan gia của nhau)
- Hóa Kỵ của một bên phi nhập cung Phu Thê bên kia (gây tổn thương hôn nhân cho bên kia)
- Cung Phu Thê của cả hai đều có sát nặng, không có cát tinh

---

### III. Năm bước xem hợp đôi đầy đủ

**Bước 1: Đánh giá nền tảng mệnh cách hai bên**
- Cách cục cung Mệnh hai bên có xứng đôi không (cùng loại hay bổ sung)
- Trọng điểm: phối hợp tính sao của cung Mệnh + Thân cung + cung Phúc Đức
- Cảnh giác: cả hai đều là cách Sát Phá Lang (hai hổ tranh nhau); hoặc một mạnh một yếu chênh lệch quá xa

**Bước 2: Đối chiếu cung Phu Thê**
- Chính tinh cung Phu Thê bên A → có ứng với sao ở cung Mệnh / tam hợp của bên B không?
- Chính tinh cung Phu Thê bên B → có ứng với sao ở cung Mệnh / tam hợp của bên A không?
- Trạng thái Tứ Hóa trong cung Phu Thê mỗi bên (Hóa Lộc / Hóa Kỵ ảnh hưởng lớn nhất)

**Bước 3: Phân tích tinh tượng Thái Dương, Thái Âm**
- Nữ mệnh: Thái Dương đại diện người chồng; Thái Dương miếu vượng = vượng phu, lạc hãm Hóa Kỵ = khắc phu
- Nam mệnh: Thái Âm đại diện người vợ; Thái Âm miếu vượng = vợ đẹp hiền, Hóa Kỵ = mẹ chồng nàng dâu bất hòa
- Trạng thái hai sao này trên lá số hai bên ảnh hưởng trực tiếp đến chất lượng hôn nhân

**Bước 4: Đối chiếu phi hóa Tứ Hóa (kỹ pháp nâng cao)**
- Can năm sinh bên A → tìm các sao Tứ Hóa → xem các sao này rơi vào cung nào trên lá số bên B
  - Hóa Lộc phi nhập cung Mệnh / cung Tài Bạch bên B: giúp ích tích cực cho bên B
  - Hóa Kỵ phi nhập cung Phu Thê bên B: gây tổn thương hôn nhân cho bên B
  - Hóa Kỵ phi nhập cung Mệnh bên B: bản thân gây áp lực cho đối phương
- Can năm sinh bên B → phân tích phi hóa ngược lại cho bên A
- Tạo thành "đối chiếu phi hóa", phán đoán "loại duyên phận" hai chiều

**Bước 5: Phân tích đồng bộ Đại hạn**
- Đại hạn hiện tại của hai bên có cùng vận vượng không: cùng vượng = thời điểm tốt nhất, cùng suy = cùng đối mặt thử thách
- Một bên vượng một bên suy: cần có ý thức cân bằng trạng thái hai bên
- Đào hoa tinh tụ ở tam hợp Lưu niên: năm đó là thời điểm tốt để cưới

---

### IV. Phán đoán loại duyên phận

| Loại duyên | Đặc điểm |
|---------|------|
| Hóa Lộc dẫn động | Chính duyên, tình yêu thật, tình cảm ngọt ngào suôn sẻ |
| Hóa Quyền dẫn động | Tình cảm do chủ động tranh thủ, có sức căng, có bên chủ đạo |
| Hóa Khoa dẫn động | Duyên chung sống hòa hợp, tôn trọng nhau, kiểu bạc đầu giai lão |
| Hóa Kỵ dẫn động | Nghịch duyên / oan gia, hành hạ nhau mà khó rời, cần tu hành mới hóa giải |
| Hai bên Hóa Kỵ lẫn nhau | Kiểu "oan gia ngõ hẹp", tình cảm mãnh liệt mà đau khổ song hành, kiểu nợ kiếp trước |

---

### V. Ba tầng phán đoán thời điểm cưới

**Tầng 1: Cách cục lá số gốc**
- Cung Phu Thê không có sát: nên cưới sớm
- Cung Phu Thê có sát không có cát: nên cưới muộn (nam trên 30, nữ trên 27)
- Vũ Khúc, Liêm Trinh, Thất Sát, Phá Quân ở cung Phu Thê: đều khuyên cưới muộn

**Tầng 2: Đại hạn**
- Cung Phu Thê của Đại hạn nhiều cát tinh: mười năm đó có cơ hội kết hôn
- Cung Phu Thê của Đại hạn Hóa Kỵ: mười năm đó tình cảm bị cản trở

**Tầng 3: Lưu niên**
- Hồng Loan, Thiên Hỷ nhập cung Mệnh hoặc cung Phu Thê: năm đó chuyện tình duyên có động
- Cung Lưu niên rơi vào cung Phu Thê: năm đó hôn nhân là trọng điểm
- Đào hoa tinh hội tụ ở tam hợp Lưu niên: năm đó nhiều cơ hội tình cảm

---

### VI. Tình huống kết hôn theo từng cung

| Cung Lưu niên | Tình huống kết hôn |
|---------|---------|
| Cung Phu Thê | Tình cảm phát triển bình thường rồi kết hôn |
| Cung Mệnh | Bản thân chủ động tấn công rồi kết hôn |
| Cung Tử Tức | Cưới vì có con (có bầu trước cưới sau) |
| Cung Điền Trạch | Cưới vì gia đình, nhà cửa |
| Cung Phụ Mẫu | Theo lệnh cha mẹ, do bề trên giới thiệu |

---

### VII. Dấu hiệu cụ thể của khắc phu / khắc thê

**Mệnh khắc phu (không theo nghĩa truyền thống) — định nghĩa của Nghê sư**:
> “克夫的女孩子，就是太太在前面走，先生在后面满头大汗提着大包小包付钱，好不容易等到车，先生还要帮太太开门。这叫克夫。” (Cô gái khắc phu là vợ đi phía trước, chồng mồ hôi nhễ nhại xách túi lớn túi nhỏ đi sau trả tiền, khó khăn lắm mới đợi được xe, chồng còn phải mở cửa cho vợ. Như thế gọi là khắc phu.)
> “旺夫，一个太太完全让先生没有后顾之忧。” (Vượng phu là người vợ khiến chồng hoàn toàn không phải lo lắng việc nhà.)

**Dấu hiệu cụ thể**:
- Cung Phu Thê có Liêm Trinh + Tham Lang / Phá Quân / Thất Sát (tổ hợp tam hung)
- Thái Dương lạc hãm Hóa Kỵ (nữ mệnh)
- Thái Âm Hóa Kỵ (nam mệnh)
- Cung Phu Thê tụ đủ tứ sát không có cát tinh
- Quả Tú, Cô Thần nhập cung Mệnh hoặc cung Phu Thê
- Cung Phúc Đức Phá Quân hãm + Liêm Trinh bình (cách "làm mộ dưới nước")

---

### VIII. Xem hợp đôi khi hợp tác sự nghiệp

**Các cung tham chiếu chính**:
- Cung Quan Lộc: tính sao cung sự nghiệp hai bên có tương thích không
- Cung Huynh Đệ (cung Nô Bộc): đại diện quan hệ hùn hạp
- Cung Phúc Đức: có cùng chia ngọt sẻ bùi được không

**Điềm tốt khi hợp tác sự nghiệp**:
- Cung Mệnh hai bên bổ sung nhau (một bên mưu tính, một bên hành động)
- Hóa Lộc cung Quan Lộc của một bên phi nhập cung Quan Lộc bên kia
- Cung Huynh Đệ có Lộc Tồn, không bị Hóa Kỵ xung

**Điềm xấu khi hợp tác sự nghiệp**:
- Hóa Kỵ hai bên xung cung Quan Lộc của nhau
- Hóa Kỵ cung Mệnh đối phương phi nhập cung Tài Bạch của mình (đối phương làm hao tiền của mình)
- Cự Môn ở cung Huynh Đệ / Nô Bộc — Nghê sư: “巨门在朋友宫，代表跟朋友合伙会朋友变仇人” (Cự Môn ở cung bạn bè nghĩa là hùn hạp với bạn thì bạn hóa thù)

---

### IX. Loại tương hợp tình cảm (đoán nhanh độ tương thích mệnh cách)

| Tổ hợp hai bên | Độ tương thích | Giải thích |
|---------|-------|------|
| Tử Vi + Thiên Phủ | ★★★★★ | Đế tinh gặp kho tài, thành tựu cho nhau, ổn định nhất |
| Thiên Tướng + bất kỳ sao nào | ★★★★ | Ấn tinh phò tài, Thiên Tướng thích nghi tốt |
| Thiên Lương + Thiên Đồng | ★★★★ | Chín chắn và ôn hòa bổ sung nhau, kiểu bạc đầu giai lão |
| Thái Dương + Thái Âm | ★★★★ | Nhật Nguyệt cùng sáng, bổ sung kinh điển, âm dương điều hòa |
| Thất Sát + Thất Sát | ★★ | Hai hổ tranh nhau, lửa lớn, mâu thuẫn nhiều |
| Phá Quân + Phá Quân | ★★ | Song Phá, phá hoại lẫn nhau, hôn nhân bất ổn |
| Liêm Trinh + Thất Sát / Phá Quân | ★ | Hai trong tổ hợp tam hung, rủi ro sinh ly tử biệt cao nhất |
| Sát Phá Lang + Cơ Nguyệt Đồng Lương | ★★★ | Động tĩnh bổ sung nhưng cần mài giũa, một bên khai phá một bên giữ thành |
| Tử Phá + Liêm Phủ | ★★★★ | Cách cục tương xứng, hút nhau |
| Vũ Khúc + Thiên Đồng | ★★★ | Cương nhu tương tế, Vũ Khúc thu liễm gặp Thiên Đồng ôn hòa, bổ sung được cho nhau |

---

### X. Tổng hợp danh ngôn cốt lõi về hợp đôi của Nghê Hải Hạ

1. **“看婚姻，光看夫妻宫，大错特错，一定要同时看福德宫。”** (Xem hôn nhân mà chỉ xem cung Phu Thê là sai bét, nhất định phải xem cùng lúc cung Phúc Đức.)
2. **“廉贞贪狼/廉贞破军在夫妻宫，不管男命女命，非生离即死别。”** (Liêm Trinh Tham Lang / Liêm Trinh Phá Quân ở cung Phu Thê, bất kể nam hay nữ, không sinh ly thì tử biệt.)
3. **“廉贞七杀——半路埋尸；廉贞破军——水中做冢；廉贞贪狼——横夭夭折。”** (Liêm Trinh Thất Sát — giữa đường chôn xác; Liêm Trinh Phá Quân — làm mộ dưới nước; Liêm Trinh Tham Lang — chết yểu bất ngờ.)
4. **“太阳化忌，上不见父，下不见子，中不见夫。”** (Thái Dương Hóa Kỵ, trên không thấy cha, dưới không thấy con, giữa không thấy chồng — nữ mệnh trong mười năm ấy phối ngẫu gặp tai họa lớn.)
5. **“男人的命，最怕太阴化忌，婆媳不和，太太跟妈妈一定不和。”** (Mệnh đàn ông sợ nhất Thái Âm Hóa Kỵ: mẹ chồng nàng dâu bất hòa, vợ với mẹ nhất định không hợp.)
6. **“旺夫，一个太太完全让先生没有后顾之忧；克夫是感情太好，完全以对方为主。”** (Vượng phu là người vợ khiến chồng hoàn toàn không phải lo lắng việc nhà; khắc phu là tình cảm quá tốt, hoàn toàn lấy đối phương làm chủ.)
7. **“巨门在朋友宫，跟朋友合伙会朋友变仇人。”** (Cự Môn ở cung bạn bè, hùn hạp với bạn thì bạn hóa thù.)
8. **“如果你娶个太太是七杀入命，那你差不多毁了一半了，很累啊，草木皆兵。”** (Nếu anh lấy người vợ Thất Sát nhập Mệnh thì gần như hỏng một nửa rồi, mệt lắm, lúc nào cũng như có giặc.)
`;

// ─── 婚姻判断辅助表 ─────────────────────────────────────────

export const MARRIAGE_STARS_BRIEF: Record<string, string> = {
  '红鸾': 'Chính duyên tình ái; nhập Mệnh, Thân chủ động thành hôn; Lưu niên gặp Hồng Loan thì năm đó tình duyên có động',
  '天喜': 'Hỷ sự hôn nhân, cùng Hồng Loan dẫn động nhau, chủ việc vui sắp đến',
  '天姚': 'Đào hoa tài nghệ, cơ hội tình cảm; trong tình duyên gặp Thiên Diêu dễ có cuộc gặp lãng mạn',
  '咸池': 'Đào hoa mạnh, chú ý rối ren tình cảm; gặp Tham Lang thì đào hoa vượng nhất',
  '孤辰': 'Sao cô khắc; nam mệnh nhập Mệnh chủ độc lập tốt, nhưng nhập cung Phu Thê chủ duyên mỏng',
  '寡宿': 'Sao cô khắc; nữ mệnh nhập Mệnh hoặc Phu Thê, chủ hôn nhân không thuận, gần ít xa nhiều',
  '天哭': 'Cô khắc hình thương; nhập cung Phu Thê chủ phối ngẫu gặp tai họa lớn',
  '天虚': 'Sao hao hụt; nhập cung Phu Thê chủ tình cảm hao mòn',
  '天巫': 'Cưới muộn, di sản, tôn giáo; nhập cung Phu Thê chủ cưới muộn là tốt, cưới sớm nhiều trắc trở',
};

export const HEMING_SCORE_CRITERIA = {
  '五星': 'Cung Phu Thê hai bên phản chiếu nhau, trời tác hợp; Tứ Hóa bổ trợ lẫn nhau, Đại hạn cùng đi vận vượng, cung Phúc Đức hai bên đều cát',
  '四星': 'Cung Phu Thê một bên ứng với cung Mệnh bên kia, Tứ Hóa chủ yếu là Lộc, Khoa; nền tảng tình cảm vững chắc',
  '三星': 'Mệnh cách xứng nhau nhưng mỗi bên đều có góc cạnh, cần mài giũa; về lâu dài ổn định',
  '二星': 'Cung Phu Thê mỗi bên đều có sát tinh, Hóa Kỵ có xung, tình cảm thăng trầm lớn, cần hai bên chủ động vun đắp',
  '一星': 'Hung tinh tụ ở cung Phu Thê, hoặc tổ hợp tam hung của Liêm Trinh; rủi ro sinh ly tử biệt cao',
};

/**
 * Hiển thị địa danh (tỉnh / thành / quận huyện Trung Quốc) bằng âm Hán-Việt.
 *
 * Tên trong lib/ziwei/cities.ts là KHÓA tra cứu (BirthForm so `p.name === form.province`,
 * lịch sử và link chia sẻ lưu nguyên chuỗi) nên không đổi; chỉ bọc bằng viPlace khi hiển thị.
 *
 * API: viPlace(name) — nhận tên tỉnh ('广东省'), tên thành ('深圳'), nhãn ghép '地级市·区县',
 * kèm chú thích trong ngoặc ('抚远（中国最东）'). Chữ không có trong bảng giữ nguyên.
 */

/** Âm Hán-Việt cho mọi chữ xuất hiện trong lib/ziwei/cities.ts (định dạng 'chữ âm|chữ âm|...'). */
const HAN_VIET_RAW = [
  '七 Thất|万 Vạn|三 Tam|上 Thượng|丘 Khâu|东 Đông|中 Trung|丰 Phong|临 Lâm|丹 Đan|丽 Lệ|义 Nghĩa',
  '乌 Ô|乐 Lạc|九 Cửu|乡 Hương|云 Vân|五 Ngũ|亚 Á|京 Kinh|亭 Đình|亳 Bạc|什 Thập|仁 Nhân',
  '仔 Tử|仙 Tiên|令 Lệnh|伊 Y|伦 Luân|余 Dư|佛 Phật|作 Tác|佳 Giai|依 Y|保 Bảo|信 Tín',
  '儋 Đam|元 Nguyên|充 Sung|克 Khắc|六 Lục|兰 Lan|关 Quan|兴 Hưng|内 Nội|冈 Cương|农 Nông|凉 Lương',
  '则 Tắc|别 Biệt|勒 Lặc|包 Bao|化 Hóa|北 Bắc|区 Khu|十 Thập|华 Hoa|南 Nam|博 Bác|卫 Vệ',
  '原 Nguyên|厦 Hạ|县 Huyện|双 Song|口 Khẩu|古 Cổ|可 Khả|台 Đài|合 Hợp|吉 Cát|同 Đồng|名 Danh',
  '吐 Thổ|吕 Lã|吴 Ngô|吾 Ngô|周 Chu|呼 Hô|和 Hòa|咸 Hàm|哈 Cáp|唐 Đường|商 Thương|喀 Khách',
  '善 Thiện|嘉 Gia|嘴 Chủy|四 Tứ|回 Hồi|园 Viên|固 Cố|国 Quốc|图 Đồ|圳 Quyến|坊 Phường|坝 Bá',
  '坡 Pha|坪 Bình|坻 Để|垫 Điếm|城 Thành|埠 Phụ|基 Cơ|堰 Yển|塔 Tháp|壁 Bích|壮 Tráng|夏 Hạ',
  '多 Đa|大 Đại|天 Thiên|太 Thái|头 Đầu|奉 Phụng|威 Uy|娄 Lâu|子 Tử|孜 Tư|孝 Hiếu|宁 Ninh',
  '安 An|宏 Hoành|定 Định|宜 Nghi|宝 Bảo|宣 Tuyên|家 Gia|宾 Tân|宿 Túc|密 Mật|察 Sát|寿 Thọ',
  '封 Phong|尔 Nhĩ|尾 Vĩ|屏 Bình|屯 Đồn|山 Sơn|岗 Cương|岛 Đảo|岩 Nham|岭 Lĩnh|岳 Nhạc|岸 Ngạn',
  '峡 Hiệp|峪 Dục|峰 Phong|崇 Sùng|川 Xuyên|州 Châu|左 Tả|巫 Vu|巴 Ba|市 Thị|布 Bố|常 Thường',
  '干 Can|平 Bình|广 Quảng|庄 Trang|庆 Khánh|库 Khố|底 Để|店 Điếm|康 Khang|廊 Lang|延 Diên|建 Kiến',
  '开 Khai|张 Trương|彦 Ngạn|彭 Bành|彰 Chương|徐 Từ|德 Đức|徽 Huy|忠 Trung|忻 Hân|怀 Hoài|怒 Nộ',
  '恩 Ân|惠 Huệ|感 Cảm|成 Thành|房 Phòng|扬 Dương|承 Thừa|投 Đầu|抚 Phủ|拉 Lạp|指 Chỉ|掖 Dịch',
  '揭 Yết|攀 Phàn|政 Chính|文 Văn|斯 Tư|新 Tân|方 Phương|施 Thi|族 Tộc|无 Vô|日 Nhật|昆 Côn',
  '昌 Xương|明 Minh|星 Tinh|春 Xuân|昭 Chiêu|晋 Tấn|普 Phổ|景 Cảnh|曲 Khúc|最 Tối|朔 Sóc|朝 Triều',
  '木 Mộc|本 Bản|来 Lai|杨 Dương|杭 Hàng|松 Tùng|林 Lâm|果 Quả|枝 Chi|枣 Táo|架 Giá|柔 Nhu',
  '柱 Trụ|柳 Liễu|树 Thụ|栗 Lật|株 Chu|格 Cách|桂 Quế|桃 Đào|桥 Kiều|梁 Lương|梅 Mai|梧 Ngô',
  '楚 Sở|楞 Lăng|榆 Du|武 Vũ|毕 Tất|水 Thủy|永 Vĩnh|氹 Đãng|汇 Hối|汉 Hán|汕 Sán|江 Giang',
  '池 Trì|汾 Phần|沂 Nghi|沈 Thẩm|沙 Sa|沟 Câu|沧 Thương|河 Hà|治 Trị|泉 Tuyền|波 Ba|泰 Thái',
  '泸 Lô|泽 Trạch|洛 Lạc|津 Tân|洱 Nhĩ|洲 Châu|济 Tế|浙 Chiết|浦 Phố|浩 Hạo|浮 Phù|海 Hải',
  '涪 Phù|淀 Điến|淄 Truy|淖 Náo|淮 Hoài|深 Thâm|清 Thanh|渝 Du|渠 Cừ|渡 Độ|温 Ôn|渭 Vị',
  '港 Cảng|湖 Hồ|湘 Tương|湛 Trạm|湾 Loan|源 Nguyên|溪 Khê|滁 Trừ|滨 Tân|漯 Tháp|漳 Chương|潍 Duy',
  '潜 Tiềm|潭 Đàm|潮 Triều|潼 Đồng|澄 Trừng|澎 Bành|澳 Áo|濮 Bộc|烟 Yên|焦 Tiêu|照 Chiếu|版 Bản',
  '牡 Mẫu|特 Đặc|犁 Lê|玉 Ngọc|玛 Mã|环 Hoàn|珠 Châu|理 Lý|琼 Quỳnh|璧 Bích|甘 Cam|田 Điền',
  '界 Giới|番 Phiên|疆 Cương|白 Bạch|百 Bách|皇 Hoàng|益 Ích|盐 Diêm|盘 Bàn|盟 Minh|省 Tỉnh|眉 Mi',
  '石 Thạch|碚 Bội|神 Thần|福 Phúc|秀 Tú|秦 Tần|竹 Trúc|綦 Kỳ|红 Hồng|纳 Nạp|绍 Thiệu|绥 Tuy',
  '维 Duy|绵 Miên|聊 Liêu|肃 Túc|肇 Triệu|肥 Phì|胡 Hồ|自 Tự|舒 Thư|舟 Chu|色 Sắc|节 Tiết',
  '芜 Vu|芝 Chi|芦 Lô|花 Hoa|苏 Tô|苗 Miêu|茂 Mậu|荆 Kinh|荣 Vinh|莆 Bồ|莞 Hoản|莲 Liên',
  '菏 Hà|萍 Bình|营 Doanh|萨 Tát|葫 Hồ|蒙 Mông|蓟 Kế|藏 Tạng|虹 Hồng|蚌 Bạng|行 Hành|衡 Hành',
  '衢 Cù|襄 Tương|西 Tây|许 Hứa|谷 Cốc|贝 Bối|贡 Cống|贤 Hiền|贵 Quý|贺 Hạ|资 Tư|赣 Cám',
  '赤 Xích|足 Túc|路 Lộ|辰 Thần|边 Biên|辽 Liêu|达 Đạt|迁 Thiên|迈 Mại|运 Vận|远 Viễn|连 Liên',
  '迪 Địch|通 Thông|遂 Toại|遵 Tuân|邢 Hình|那 Na|邯 Hàm|邵 Thiệu|郑 Trịnh|郭 Quách|郴 Sâm|郸 Đan',
  '都 Đô|鄂 Ngạc|酉 Dậu|酒 Tửu|里 Lý|重 Trùng|金 Kim|钦 Khâm|铁 Thiết|铜 Đồng|银 Ngân|锡 Tích',
  '锦 Cẩm|镇 Trấn|长 Trường|门 Môn|闵 Mẫn|阜 Phụ|防 Phòng|阳 Dương|阿 A|陀 Đà|陇 Lũng|陕 Thiểm',
  '陵 Lăng|隆 Long|随 Tùy|雄 Hùng|雅 Nhã|青 Thanh|靖 Tĩnh|静 Tĩnh|鞍 An|音 Âm|韶 Thiều|顶 Đỉnh',
  '顺 Thuận|饶 Nhiêu|香 Hương|马 Mã|驻 Trú|高 Cao|鲁 Lỗ|鸡 Kê|鸭 Áp|鹤 Hạc|鹰 Ưng|黄 Hoàng',
  '黑 Hắc|黔 Kiềm|齐 Tề|龙 Long',
].join('|');

const HAN_VIET: Record<string, string> = {};
for (const pair of HAN_VIET_RAW.split('|')) {
  const [ch, reading] = pair.split(' ');
  if (ch && reading) HAN_VIET[ch] = reading;
}

/** Tên quen dùng trong tiếng Việt, ưu tiên hơn phiên âm từng chữ. */
const PLACE_OVERRIDES: Record<string, string> = {
  北京市: 'Thành phố Bắc Kinh', 天津市: 'Thành phố Thiên Tân', 上海市: 'Thành phố Thượng Hải',
  重庆市: 'Thành phố Trùng Khánh',
  内蒙古自治区: 'Khu tự trị Nội Mông Cổ', 广西壮族自治区: 'Khu tự trị dân tộc Choang Quảng Tây',
  西藏自治区: 'Khu tự trị Tây Tạng', 宁夏回族自治区: 'Khu tự trị dân tộc Hồi Ninh Hạ',
  新疆维吾尔自治区: 'Khu tự trị dân tộc Duy Ngô Nhĩ Tân Cương',
  香港特别行政区: 'Đặc khu hành chính Hồng Kông', 澳门特别行政区: 'Đặc khu hành chính Ma Cao',
  台湾省: 'Đài Loan',
  香港: 'Hồng Kông', 澳门: 'Ma Cao', 台湾: 'Đài Loan', 中国: 'Trung Quốc',
};

const NOTE_OVERRIDES: Record<string, string> = {
  中国最东: 'cực đông Trung Quốc', 中国最西: 'cực tây Trung Quốc',
  中国最南: 'cực nam Trung Quốc', 中国最北: 'cực bắc Trung Quốc',
};

function transliterate(name: string): string {
  const parts: string[] = [];
  let pending = '';
  for (const ch of name) {
    const r = HAN_VIET[ch];
    if (r) {
      if (pending) { parts.push(pending); pending = ''; }
      parts.push(r);
    } else {
      pending += ch;
    }
  }
  if (pending) parts.push(pending);
  return parts.join(' ');
}

function placeCore(name: string): string {
  const s = name.trim();
  if (!s) return name;
  if (PLACE_OVERRIDES[s]) return PLACE_OVERRIDES[s];
  if (s.endsWith('省')) return `Tỉnh ${transliterate(s.slice(0, -1))}`;
  return transliterate(s);
}

/** Tên địa danh hiển thị bằng Hán-Việt; idempotent với chuỗi không chứa chữ Hán. */
export function viPlace(name: string | undefined | null): string {
  if (!name) return name ?? '';
  if (!/[\u3400-\u9fff]/.test(name)) return name;
  // Nhãn ghép 「地级市·区县」
  if (name.includes('·')) return name.split('·').map((p) => viPlace(p)).join(' · ');
  const m = name.match(/^(.*?)[（(](.*)[）)]$/);
  if (m) {
    const note = NOTE_OVERRIDES[m[2]] ?? transliterate(m[2]);
    return `${placeCore(m[1])} (${note})`;
  }
  return placeCore(name);
}

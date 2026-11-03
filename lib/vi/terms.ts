/**
 * Bảng thuật ngữ Tử Vi Đẩu Số zh -> vi dùng chung cho lớp hiển thị.
 *
 * Nguyên tắc:
 *   - Engine (iztro zh-CN + lib/ziwei) vẫn dùng chữ Hán làm khóa logic. File này CHỈ dùng
 *     để hiển thị; không bao giờ đưa kết quả dịch ngược vào so khớp/tra bảng.
 *   - Mọi hàm đều idempotent: chuỗi không nhận ra (kể cả chuỗi đã là tiếng Việt) được trả
 *     nguyên vẹn, nên bọc hai lần cũng không sao. Riêng viText: chỉ khi có ít nhất một thuật
 *     ngữ được thay thì mới chuẩn hóa khoảng trắng / dấu câu toàn khổ; không khớp gì thì trả
 *     nguyên chuỗi đầu vào.
 *   - Có cả biến thể phồn thể (sinh tự động từ bảng giản thể bên dưới).
 *
 * API công khai (giữ ổn định):
 *   viTerm, viStar, viPalace, viPalaceFull, viBrightness, viSihua, viSihuaShort,
 *   viStem, viBranch, viGanzhi, viShichen, viWuxingJu, viText, VI_TERMS.
 */

// ─── Thiên can / Địa chi ─────────────────────────────────────────

const STEM_VI: Record<string, string> = {
  甲: 'Giáp', 乙: 'Ất', 丙: 'Bính', 丁: 'Đinh', 戊: 'Mậu',
  己: 'Kỷ', 庚: 'Canh', 辛: 'Tân', 壬: 'Nhâm', 癸: 'Quý',
};

const BRANCH_VI: Record<string, string> = {
  子: 'Tý', 丑: 'Sửu', 寅: 'Dần', 卯: 'Mão', 辰: 'Thìn', 巳: 'Tỵ',
  午: 'Ngọ', 未: 'Mùi', 申: 'Thân', 酉: 'Dậu', 戌: 'Tuất', 亥: 'Hợi',
};

const STEM_ORDER = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCH_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// ─── Sao ─────────────────────────────────────────────────────────

const MAJOR_STAR_VI: Record<string, string> = {
  紫微: 'Tử Vi', 天机: 'Thiên Cơ', 太阳: 'Thái Dương', 武曲: 'Vũ Khúc',
  天同: 'Thiên Đồng', 廉贞: 'Liêm Trinh', 天府: 'Thiên Phủ', 太阴: 'Thái Âm',
  贪狼: 'Tham Lang', 巨门: 'Cự Môn', 天相: 'Thiên Tướng', 天梁: 'Thiên Lương',
  七杀: 'Thất Sát', 破军: 'Phá Quân',
};

const MINOR_STAR_VI: Record<string, string> = {
  // Lục cát / lục sát / Lộc Mã
  文昌: 'Văn Xương', 文曲: 'Văn Khúc', 左辅: 'Tả Phù', 右弼: 'Hữu Bật',
  天魁: 'Thiên Khôi', 天钺: 'Thiên Việt', 禄存: 'Lộc Tồn', 天马: 'Thiên Mã',
  擎羊: 'Kình Dương', 陀罗: 'Đà La', 火星: 'Hỏa Tinh', 铃星: 'Linh Tinh',
  地空: 'Địa Không', 地劫: 'Địa Kiếp',
  // Tạp diệu (iztro zh-CN + engine bổ sung)
  红鸾: 'Hồng Loan', 天喜: 'Thiên Hỷ', 天刑: 'Thiên Hình', 天姚: 'Thiên Diêu',
  劫杀: 'Kiếp Sát', 天空: 'Thiên Không', 解神: 'Giải Thần', 阴煞: 'Âm Sát',
  天官: 'Thiên Quan', 天福: 'Thiên Phúc', 天哭: 'Thiên Khốc', 天虚: 'Thiên Hư',
  龙池: 'Long Trì', 凤阁: 'Phượng Các', 孤辰: 'Cô Thần', 寡宿: 'Quả Tú',
  蜚廉: 'Phi Liêm', 破碎: 'Phá Toái', 台辅: 'Thai Phụ', 封诰: 'Phong Cáo',
  天巫: 'Thiên Vu', 天月: 'Thiên Nguyệt', 三台: 'Tam Thai', 八座: 'Bát Tọa',
  恩光: 'Ân Quang', 天贵: 'Thiên Quý', 天才: 'Thiên Tài', 天寿: 'Thiên Thọ',
  截空: 'Triệt Không', 旬中: 'Tuần Trung', 旬空: 'Tuần Không', 空亡: 'Không Vong',
  截路: 'Triệt Lộ', 月德: 'Nguyệt Đức', 天伤: 'Thiên Thương', 天使: 'Thiên Sứ',
  天厨: 'Thiên Trù', 副旬: 'Phó Tuần', 副截: 'Phó Triệt', 年解: 'Niên Giải',
  // Trường sinh thập nhị thần
  长生: 'Trường Sinh', 沐浴: 'Mộc Dục', 冠带: 'Quan Đới', 临官: 'Lâm Quan',
  帝旺: 'Đế Vượng', 衰: 'Suy', 病: 'Bệnh', 死: 'Tử', 墓: 'Mộ', 绝: 'Tuyệt',
  胎: 'Thai', 养: 'Dưỡng',
  // Bác sĩ thập nhị thần
  博士: 'Bác Sĩ', 力士: 'Lực Sĩ', 青龙: 'Thanh Long', 小耗: 'Tiểu Hao',
  将军: 'Tướng Quân', 奏书: 'Tấu Thư', 飞廉: 'Phi Liêm', 喜神: 'Hỷ Thần',
  病符: 'Bệnh Phù', 大耗: 'Đại Hao', 伏兵: 'Phục Binh', 官府: 'Quan Phủ',
  // Tuế tiền thập nhị thần
  岁建: 'Tuế Kiến', 晦气: 'Hối Khí', 丧门: 'Tang Môn', 贯索: 'Quán Sách',
  官符: 'Quan Phù', 岁破: 'Tuế Phá', 龙德: 'Long Đức', 白虎: 'Bạch Hổ',
  天德: 'Thiên Đức', 吊客: 'Điếu Khách',
  // Tướng tiền thập nhị thần
  将星: 'Tướng Tinh', 攀鞍: 'Phan An', 岁驿: 'Tuế Dịch', 息神: 'Tức Thần',
  华盖: 'Hoa Cái', 劫煞: 'Kiếp Sát', 灾煞: 'Tai Sát', 天煞: 'Thiên Sát',
  指背: 'Chỉ Bối', 咸池: 'Hàm Trì', 月煞: 'Nguyệt Sát', 亡神: 'Vong Thần',
};

/** Tên rút gọn một chữ dùng trong sao vận/lưu (运魁, 流禄, 月羊...). */
const SHORT_STAR_VI: Record<string, string> = {
  魁: 'Khôi', 钺: 'Việt', 昌: 'Xương', 曲: 'Khúc', 鸾: 'Loan',
  喜: 'Hỷ', 禄: 'Lộc', 羊: 'Kình', 陀: 'Đà', 马: 'Mã', 解: 'Giải',
};
const FLOW_PREFIX_VI: Record<string, string> = {
  运: 'Vận', 流: 'Lưu', 年: 'Niên', 月: 'Nguyệt', 日: 'Nhật', 时: 'Thời',
};
const FLOW_STAR_VI: Record<string, string> = {};
for (const [p, pv] of Object.entries(FLOW_PREFIX_VI)) {
  for (const [s, sv] of Object.entries(SHORT_STAR_VI)) {
    if (p === '年' && s !== '解') continue; // iztro chỉ có 年解
    FLOW_STAR_VI[p + s] = `${pv} ${sv}`;
  }
}

// ─── Cung ────────────────────────────────────────────────────────

/** Khóa không có chữ 宫 (dạng iztro zh-CN), riêng 命宫/身宫 giữ nguyên. */
const PALACE_VI: Record<string, string> = {
  命宫: 'Mệnh', 兄弟: 'Huynh Đệ', 夫妻: 'Phu Thê', 子女: 'Tử Tức',
  财帛: 'Tài Bạch', 疾厄: 'Tật Ách', 迁移: 'Thiên Di', 仆役: 'Nô Bộc',
  交友: 'Nô Bộc', 奴仆: 'Nô Bộc', 官禄: 'Quan Lộc', 事业: 'Quan Lộc',
  田宅: 'Điền Trạch', 福德: 'Phúc Đức', 父母: 'Phụ Mẫu', 相貌: 'Phụ Mẫu',
  身宫: 'Thân', 来因: 'Lai Nhân',
};

// ─── Độ sáng / Tứ Hóa / Ngũ hành ────────────────────────────────

const BRIGHTNESS_VI: Record<string, string> = {
  庙: 'Miếu', 旺: 'Vượng', 得: 'Đắc', 利: 'Lợi', 平: 'Bình', 不: 'Bất',
  闲: 'Nhàn', 陷: 'Hãm', 地: 'Địa',
};

const SIHUA_SHORT_VI: Record<string, string> = {
  禄: 'Lộc', 权: 'Quyền', 科: 'Khoa', 忌: 'Kỵ',
};

const WUXING_VI: Record<string, string> = {
  金: 'Kim', 木: 'Mộc', 水: 'Thủy', 火: 'Hỏa', 土: 'Thổ',
};

const WUXING_JU_VI: Record<string, string> = {
  水二局: 'Thủy nhị cục', 木三局: 'Mộc tam cục', 金四局: 'Kim tứ cục',
  土五局: 'Thổ ngũ cục', 火六局: 'Hỏa lục cục',
};

// ─── Thuật ngữ chung ────────────────────────────────────────────

const GENERAL_VI: Record<string, string> = {
  四化: 'Tứ Hóa', 自化: 'Tự hóa', 飞星: 'Phi tinh', 生年四化: 'Tứ Hóa năm sinh',
  对宫: 'cung đối', 三方四正: 'Tam phương tứ chính', 三方: 'tam phương', 四正: 'tứ chính',
  大限: 'Đại hạn', 小限: 'Tiểu hạn', 童限: 'Đồng hạn', 流年: 'Lưu niên',
  流月: 'Lưu nguyệt', 流日: 'Lưu nhật', 流时: 'Lưu thời', 运限: 'vận hạn',
  格局: 'Cách cục', 五行局: 'Ngũ hành cục', 命主: 'Mệnh chủ', 身主: 'Thân chủ',
  十二神: 'Thập nhị thần', 长生十二神: 'Trường sinh thập nhị thần',
  博士十二神: 'Bác sĩ thập nhị thần', 岁前十二神: 'Tuế tiền thập nhị thần',
  将前十二神: 'Tướng tiền thập nhị thần',
  命盘: 'lá số', 排盘: 'lập lá số', 合盘: 'xem hợp đôi',
  真太阳时: 'giờ mặt trời thật', 早子时: 'giờ Tý sớm', 晚子时: 'giờ Tý muộn',
  时辰: 'giờ', 闰月: 'tháng nhuận', 农历: 'âm lịch', 公历: 'dương lịch',
  阳历: 'dương lịch', 阴历: 'âm lịch',
  倪海厦: 'Nghê Hải Hạ', 倪师: 'Nghê sư', 天纪: 'Thiên Kỷ', 地纪: 'Địa Kỷ', 人纪: 'Nhân Kỷ',
  紫微斗数: 'Tử Vi Đẩu Số', 紫微斗数全书: 'Tử Vi Đẩu Số Toàn Thư',
  紫微斗数全集: 'Tử Vi Đẩu Số Toàn Tập', 骨髓赋: 'Cốt Tủy Phú',
  主星: 'chính tinh', 正曜: 'chính diệu', 辅星: 'phụ tinh', 煞星: 'sát tinh',
  吉星: 'cát tinh', 杂曜: 'tạp diệu', 空宫: 'Vô chính diệu',
  阳男: 'Dương Nam', 阴男: 'Âm Nam', 阳女: 'Dương Nữ', 阴女: 'Âm Nữ',
  男: 'Nam', 女: 'Nữ',
  四柱: 'Tứ trụ', 八字: 'Bát tự', 干支: 'can chi', 天干: 'Thiên can', 地支: 'Địa chi',
  宫干: 'can cung', 纳音: 'Nạp âm', 五行: 'Ngũ hành',
  // Danh mục người nổi tiếng (FamousPerson.category là khóa union)
  商业: 'Kinh doanh', 文艺: 'Văn nghệ', 历史: 'Lịch sử', 体育: 'Thể thao', 科技: 'Công nghệ',
};

// ─── Biến thể phồn thể ──────────────────────────────────────────

/** Giản -> phồn cho các chữ xuất hiện trong khóa ở trên. */
const SIMP_TO_TRAD: Record<string, string> = {
  宫: '宮', 迁: '遷', 仆: '僕', 财: '財', 禄: '祿', 阳: '陽', 机: '機', 贞: '貞',
  阴: '陰', 贪: '貪', 门: '門', 杀: '殺', 军: '軍', 辅: '輔', 马: '馬', 罗: '羅',
  铃: '鈴', 钺: '鉞', 权: '權', 庙: '廟', 红: '紅', 鸾: '鸞', 龙: '龍', 凤: '鳳',
  阁: '閣', 华: '華', 盖: '蓋', 岁: '歲', 驿: '驛', 丧: '喪', 贯: '貫', 书: '書',
  飞: '飛', 将: '將', 长: '長', 带: '帶', 临: '臨', 养: '養', 绝: '絕', 诰: '誥',
  贵: '貴', 寿: '壽', 伤: '傷', 厨: '廚', 虚: '虛', 运: '運', 时: '時', 历: '曆',
  农: '農', 闰: '閏', 盘: '盤', 数: '數', 赋: '賦', 纪: '紀', 厦: '廈', 师: '師',
  吊: '弔', 灾: '災', 气: '氣', 闲: '閒', 对: '對', 杂: '雜', 侠: '俠', 诸: '諸',
};

function toTraditional(s: string): string {
  let out = '';
  for (const ch of s) out += SIMP_TO_TRAD[ch] ?? ch;
  return out;
}

function withTraditional(map: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = { ...map };
  for (const [k, v] of Object.entries(map)) {
    const t = toTraditional(k);
    if (t !== k && !(t in out)) out[t] = v;
  }
  return out;
}

// ─── Bảng hợp nhất ──────────────────────────────────────────────

const STAR_ALL = withTraditional({ ...MAJOR_STAR_VI, ...MINOR_STAR_VI, ...FLOW_STAR_VI });
const PALACE_ALL = withTraditional(PALACE_VI);
const BRIGHTNESS_ALL = withTraditional(BRIGHTNESS_VI);
const SIHUA_SHORT_ALL = withTraditional(SIHUA_SHORT_VI);

const SIHUA_FULL: Record<string, string> = {};
for (const [k, v] of Object.entries(SIHUA_SHORT_VI)) SIHUA_FULL['化' + k] = `Hóa ${v}`;

const GANZHI_VI: Record<string, string> = {};
for (const s of STEM_ORDER) {
  for (const b of BRANCH_ORDER) GANZHI_VI[s + b] = `${STEM_VI[s]} ${BRANCH_VI[b]}`;
}

const SHICHEN_VI: Record<string, string> = {};
for (const b of BRANCH_ORDER) SHICHEN_VI[b + '时'] = `giờ ${BRANCH_VI[b]}`;

/** Dạng có hậu tố 宫 (兄弟宫 ...) dùng làm nhãn: cùng bản dịch ngắn. */
const PALACE_SUFFIX_LABEL: Record<string, string> = {};
/** Dạng có hậu tố 宫 trong văn xuôi (viText): 'cung X'. */
const PALACE_SUFFIX_PROSE: Record<string, string> = { 命宫: 'cung Mệnh', 身宫: 'Thân cung' };
for (const [k, v] of Object.entries(PALACE_VI)) {
  if (k.endsWith('宫')) continue;
  PALACE_SUFFIX_LABEL[k + '宫'] = v;
  PALACE_SUFFIX_PROSE[k + '宫'] = `cung ${v}`;
}

/**
 * Toàn bộ thuật ngữ zh -> vi (gồm cả từ một chữ). Dùng cho tra cứu chính xác.
 * Chỉ đọc; đừng sửa tại chỗ.
 */
export const VI_TERMS: Readonly<Record<string, string>> = Object.freeze(withTraditional({
  ...STEM_VI,
  ...BRANCH_VI,
  ...WUXING_VI,
  ...BRIGHTNESS_VI,
  ...GANZHI_VI,
  ...SHICHEN_VI,
  ...WUXING_JU_VI,
  ...GENERAL_VI,
  ...SIHUA_FULL,
  ...PALACE_SUFFIX_LABEL,
  ...PALACE_VI,
  身宫: 'Thân cung',
  ...MAJOR_STAR_VI,
  ...MINOR_STAR_VI,
  ...FLOW_STAR_VI,
}));

// ─── API tra cứu ─────────────────────────────────────────────────

/** Dịch một thuật ngữ đã biết; không có thì trả nguyên chuỗi. */
export function viTerm(zh: string): string {
  if (!zh) return zh;
  return VI_TERMS[zh] ?? VI_TERMS[zh.trim()] ?? zh;
}

/** Tên sao (chính tinh, phụ tinh, tạp diệu, thập nhị thần, sao vận/lưu). */
export function viStar(zh: string): string {
  if (!zh) return zh;
  return STAR_ALL[zh] ?? VI_TERMS[zh] ?? zh;
}

/**
 * Tên cung, dạng ngắn: '命宫' -> 'Mệnh', '兄弟' / '兄弟宫' -> 'Huynh Đệ',
 * '仆役' / '交友' / '交友宫' -> 'Nô Bộc', '身宫' -> 'Thân'.
 */
export function viPalace(zh: string): string {
  if (!zh) return zh;
  const s = zh.trim();
  if (PALACE_ALL[s]) return PALACE_ALL[s];
  const bare = s.replace(/[宫宮]$/, '');
  return PALACE_ALL[bare] ?? zh;
}

/** Tên cung đầy đủ: '命宫' -> 'cung Mệnh', '财帛' -> 'cung Tài Bạch', '身宫' -> 'Thân cung'. */
export function viPalaceFull(zh: string): string {
  const short = viPalace(zh);
  if (short === zh) return zh;
  const bare = zh.trim().replace(/[宫宮]$/, '');
  if (bare === '身') return 'Thân cung';
  return `cung ${short}`;
}

/** Độ sáng: 庙 Miếu, 旺 Vượng, 得 Đắc, 利 Lợi, 平 Bình, 不 Bất, 闲 Nhàn, 陷 Hãm, 地 Địa. */
export function viBrightness(zh: string | undefined | null): string {
  if (!zh) return zh ?? '';
  return BRIGHTNESS_ALL[zh] ?? zh;
}

/** Tứ Hóa dạng đầy đủ: '禄' hoặc '化禄' -> 'Hóa Lộc'. */
export function viSihua(zh: string | undefined | null): string {
  if (!zh) return zh ?? '';
  const k = zh.replace(/^化/, '');
  const short = SIHUA_SHORT_ALL[k];
  return short ? `Hóa ${short}` : zh;
}

/** Tứ Hóa dạng ngắn (nhãn trên lá số): '禄' / '化禄' -> 'Lộc'. */
export function viSihuaShort(zh: string | undefined | null): string {
  if (!zh) return zh ?? '';
  const k = zh.replace(/^化/, '');
  return SIHUA_SHORT_ALL[k] ?? zh;
}

/** Thiên can: nhận chữ Hán ('甲') hoặc chỉ số 0-9. */
export function viStem(zh: string | number): string {
  if (typeof zh === 'number') return STEM_VI[STEM_ORDER[((zh % 10) + 10) % 10]];
  return STEM_VI[zh] ?? zh;
}

/** Địa chi: nhận chữ Hán ('子') hoặc chỉ số 0-11 (0 = Tý). */
export function viBranch(zh: string | number): string {
  if (typeof zh === 'number') return BRANCH_VI[BRANCH_ORDER[((zh % 12) + 12) % 12]];
  return BRANCH_VI[zh] ?? zh;
}

/** Can chi hai chữ: '甲子' -> 'Giáp Tý'. */
export function viGanzhi(zh: string): string {
  return GANZHI_VI[zh] ?? zh;
}

/** Canh giờ: '子时' -> 'giờ Tý'; '晚子时' -> 'giờ Tý muộn'. */
export function viShichen(zh: string): string {
  return SHICHEN_VI[zh] ?? GENERAL_VI[zh] ?? zh;
}

/** Ngũ hành cục: '水二局' -> 'Thủy nhị cục'. */
export function viWuxingJu(zh: string): string {
  return WUXING_JU_VI[zh] ?? zh;
}

// ─── viText: thay thuật ngữ trong chuỗi dài ─────────────────────

/**
 * Từ điển cho viText: chỉ các khóa >= 2 chữ (từ một chữ như 不/平/子/病 quá mơ hồ
 * trong văn xuôi). Riêng ghép có ngữ cảnh rõ (化禄, 甲子, 子时, 运禄...) đều >= 2 chữ.
 *
 * Loại thêm các khóa là từ thường trong văn xuôi Trung (天才 = thiên tài, 博士 = tiến sĩ,
 * 将军 = tướng quân, 天使 = thiên thần, 破碎 = vỡ vụn, 长生 = trường thọ, 事业 = sự nghiệp,
 * 交友 = kết bạn). Chúng vẫn tra được bằng viStar / viPalace / viTerm khi biết đúng loại;
 * dạng có hậu tố 宫 (交友宫, 事业宫) vẫn nằm trong bảng vì không mơ hồ.
 */
const TEXT_AMBIGUOUS = new Set(
  ['天才', '博士', '将军', '天使', '破碎', '长生', '事业', '交友'].flatMap((k) => [k, toTraditional(k)]),
);
const TEXT_DICT: Record<string, string> = {};
for (const [k, v] of Object.entries({ ...VI_TERMS, ...withTraditional(PALACE_SUFFIX_PROSE) })) {
  if ([...k].length >= 2 && !TEXT_AMBIGUOUS.has(k)) TEXT_DICT[k] = v;
}
const TEXT_MAX_LEN = Math.max(...Object.keys(TEXT_DICT).map((k) => [...k].length));

const FULLWIDTH_PUNCT: Record<string, string> = {
  '，': ', ', '。': '. ', '、': ', ', '：': ': ', '；': '; ', '！': '! ', '？': '? ',
  '（': ' (', '）': ') ', '「': '“', '」': '”', '『': '‘', '』': '’', '《': '“', '》': '”',
  '·': ' · ', '～': '~', '—': '—',
};

const CJK_RE = /[㐀-鿿豈-﫿]/;
const WORDISH_RE = /[\p{L}\p{N}]/u;

/**
 * Thay mọi thuật ngữ đã biết bên trong một chuỗi dài (ưu tiên khớp dài nhất), thêm khoảng
 * trắng giữa các từ tiếng Việt kề nhau và chuẩn hóa dấu câu toàn khổ.
 * Phần chữ Hán không có trong bảng được giữ nguyên. Không có thuật ngữ nào khớp → trả
 * nguyên chuỗi đầu vào (không chuẩn hóa gì).
 */
export function viText(s: string | undefined | null): string {
  if (!s) return s ?? '';
  const chars = [...s];
  const pieces: { text: string; translated: boolean }[] = [];
  let i = 0;
  while (i < chars.length) {
    const ch = chars[i];
    if (!CJK_RE.test(ch)) {
      pieces.push({ text: FULLWIDTH_PUNCT[ch] ?? ch, translated: false });
      i++;
      continue;
    }
    let hit: string | undefined;
    let len = 0;
    for (let n = Math.min(TEXT_MAX_LEN, chars.length - i); n >= 2; n--) {
      const cand = chars.slice(i, i + n).join('');
      const v = TEXT_DICT[cand];
      if (v !== undefined) { hit = v; len = n; break; }
    }
    if (hit !== undefined) {
      pieces.push({ text: hit, translated: true });
      i += len;
    } else {
      pieces.push({ text: ch, translated: false });
      i++;
    }
  }

  let out = '';
  let prev: { text: string; translated: boolean } | undefined;
  for (const p of pieces) {
    if (prev && (prev.translated || p.translated)) {
      const last = [...prev.text].pop() ?? '';
      const first = [...p.text][0] ?? '';
      if (WORDISH_RE.test(last) && WORDISH_RE.test(first)) out += ' ';
    }
    out += p.text;
    prev = p;
  }
  if (!pieces.some((p) => p.translated)) return s;
  return out
    .replace(/ {2,}/g, ' ')
    .replace(/ ([,.;:!?)”’])/g, '$1')
    .replace(/([(“‘]) /g, '$1')
    .trim();
}

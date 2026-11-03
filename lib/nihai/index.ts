/**
 * 倪海厦 天纪 / 地纪 / 人纪 — 统一导出
 *
 * 倪海厦（1954-2012），美国汉唐中医学院创办人，
 * 当代少见的「命、相、卜、山、医」五术兼备之旷世奇人。
 *
 * 三纪体系：
 *   天纪 —— 上知天文（紫微斗数、易经、堪舆、推命、面相、测字）
 *   地纪 —— 下知地理（国家地理志、风水与国运）
 *   人纪 —— 中知人事（针灸、黄帝内经、神农本草经、伤寒论、金匮要略）
 */

export * from './types';
export { TIANJI_MODULES, HEXAGRAMS, FENGSHUI_ENTRIES, TIANJI_EPISODES, TIANJI_QUOTES, TIANJI_STATS } from './tianji';
export { RENJI_MODULES, ACU_EXPERIENCES, TRANS_NEEDLING, HANTANG_FORMULAS, CLASSIC_FORMULAS, RENJI_STATS } from './renji';
export { DIJI_MODULES, DIJI_STATS } from './diji';

/** 倪海厦完整传记 */
export const NI_HAIXIA_BIO = {
  name: 'Nghê Hải Hạ',
  nameVariant: 'Nghê Hải Hạ (倪海夏)',
  alias: 'Phạm Vũ Long',
  birth: 'Ngày 1 tháng 1 năm 1954',
  death: 'Ngày 31 tháng 1 năm 2012',
  birthPlace: 'Thành phố Đài Bắc',
  ancestry: 'Thụy An, Chiết Giang',
  family: 'Gia đình bảy anh chị em, ông là con thứ năm',
  education: 'Khoa Chính trị, Đại học Đông Ngô',
  title: 'Người sáng lập Học viện Đông y Hán Đường tại Mỹ',
  titles: [
    'Kỳ nhân hiếm có kiêm thông ngũ thuật Mệnh, Tướng, Bốc, Sơn, Y',
    'Viện trưởng Học viện Đông y Hán Đường tại Mỹ',
    'Giáo sư hướng dẫn tiến sĩ tại Đại học Đông y dược California (Mỹ)',
    'Ủy viên cao cấp nhất Ủy ban Đông y thuộc Sở Y tế bang Florida (2000–2003)',
    'Ủy viên kiêm Phó Chủ tịch Ủy ban Châm cứu bang Florida',
    'Người kế thừa hiện đại của phái Kinh phương',
    'Người sáng lập hệ thống giảng dạy Thiên Kỷ, Nhân Kỷ',
    'Người nhận giải thưởng Hoa kiều ưu tú ở hải ngoại',
  ],
  /** 师承关系 */
  teachers: [
    { name: 'Chu Tả Vũ', background: 'Danh y gia truyền bốn đời ở Bắc Kinh, sau năm 1949 chuyển sang Đài Loan', subject: 'Châm cứu', period: '1977-1981' },
    { name: 'Từ Tế Dân', background: 'Danh y Thượng Hải gốc Giang Tô', subject: 'Châm cứu', period: 'Thập niên 1970' },
    { name: 'Truyền thừa Khương Tá Cảnh', background: 'Nhà kinh phương thụ nghiệp Tào Dĩnh Phủ', subject: 'Kinh phương', period: 'Thời gian học việc ở hiệu thuốc Bắc tại Cơ Long' },
  ],
  /** 核心理念 */
  corePhilosophy: [
    'Đại đạo chí giản — phi tinh bay tới bay lui quá phức tạp, không làm cái đó',
    'Cung Mệnh là gốc, tam phương là dụng',
    'Nỗ lực con người + điều chỉnh địa lý > vận mệnh bẩm sinh (2/3 > 1/3)',
    'Đông y là y học vật lý, phân tích cơ thể người từ góc độ vật lý',
    'Biện chứng chứ không biện bệnh — Đông y xem thể chứng chứ không xem tên bệnh',
    'Kinh phương một thang biết hiệu, hai thang khỏi bệnh',
    'Không muốn văn hóa Trung Hoa thất truyền, nên đã dạy rất nhiều học trò',
    'Xem mệnh là một môn triết học bàn về quả',
    'Văn tự chỉ là con thuyền, chân lý mới là bờ bên kia',
  ],
  /** 人生大事记 */
  timeline: [
    { year: '1954', event: 'Sinh tại thành phố Đài Bắc, nguyên quán Thụy An, Chiết Giang' },
    { year: '1970s', event: 'Thời trung học dùng "Y Tông Kim Giám" chữa khỏi chứng đau bụng kinh cho chị thứ hai, từ đó quyết chí học y' },
    { year: '1977-1981', event: 'Học châm cứu với thầy thuốc Chu Tả Vũ' },
    { year: '1978', event: 'Phục vụ quân ngũ tại Bộ Quân y Mã Tổ, được gọi là "thần y Mã Tổ" khi mới 24 tuổi' },
    { year: '1979', event: 'Sau khi xuất ngũ dùng bí danh "Phạm Vũ Long" bắt đầu nghề xem mệnh, xem tướng' },
    { year: '1980', event: 'Di cư sang Mỹ' },
    { year: '1988', event: 'Mở "Lớp Thiên văn Địa lý" ở đường Kim Sơn Nam, Đài Bắc, truyền dạy Tử Vi Đẩu Số và phong thủy Dương trạch' },
    { year: '1991', event: 'Trở thành châm cứu sư có đăng ký tại bang Florida, Mỹ' },
    { year: '1993', event: 'Chọn khu đất cho Học viện Đông y Hán Đường tại Merritt Island, Florida' },
    { year: '1994', event: 'Hoàn thành ghi hình loạt trước tác "Thiên Kỷ", tổng cộng 24 tập' },
    { year: '1995', event: 'Sáng lập Học viện Đông y Hán Đường' },
    { year: '2000-2003', event: 'Giữ chức Ủy viên cao cấp nhất Ủy ban Đông y thuộc Sở Y tế bang Florida' },
    { year: '2004', event: 'Mở lớp giảng dạy Đông y "Nhân Kỷ" tại Đài Bắc' },
    { year: '2005', event: 'Phát hành DVD giảng dạy loạt "Nhân Kỷ"' },
    { year: '2007', event: 'Bắt đầu viết "Địa Kỷ"' },
    { year: '2010', event: 'Thành lập phòng khám Đông y kinh phương Hán Đường Đài Bắc; được mời diễn giảng trọn ngày tại Diễn đàn Phù Dương lần thứ ba' },
    { year: '2011', event: 'Thành lập Trung y quán kinh phương Hán Đường Thâm Quyến' },
    { year: '2012', event: 'Ngày 31 tháng 1 qua đời tại Đài Bắc do suy tim phổi, hưởng thọ 59 tuổi' },
  ],
  /** 著作体系 */
  publications: {
    originalBooks8: ['Hoàng Đế Nội Kinh Tố Vấn', 'Hoàng Đế Nội Kinh', 'Thần Nông Bản Thảo Kinh', 'Châm cứu', 'Thương Hàn Luận', 'Kim Quỹ', 'Nhân Gian Đạo', 'Thiên Cơ Đạo · Địa Mạch Đạo'],
    totalBooks: '26–44 cuốn (gồm giáo trình bản chú giải, toàn tập y án, tinh giải huyệt vị…)',
    hantangFormulas: '100 phương Hán Đường',
    classicFormulas: '259 phương kinh điển',
    medicalCases: 'Toàn tập y án 7 cuốn',
    totalVideoHours: 'Hơn 200 giờ',
  },
  /** 三纪体系 */
  sanJi: {
    tianji: {
      name: 'Thiên Kỷ',
      meaning: 'Trên biết thiên văn',
      content: 'Tử Vi Đẩu Số, 64 quẻ Kinh Dịch, Kham Dư học, Suy mệnh học, Tướng mặt học, thuật Chiết tự',
      recordYear: 1994,
      episodes: 24,
      hdEpisodes: 83,
      hoursPerEpisode: 2,
      totalHours: 48,
      books: ['Thiên Cơ Đạo', 'Nhân Gian Đạo', 'Địa Mạch Đạo', '64 quẻ Dịch đồ'],
      schools: ['Phái Tam Hợp (Tử Vi Đẩu Số)', 'Phái Tượng Số (Kinh Dịch)', 'Phái Cửu Tinh (Kham Dư)', 'Phái Hà Lạc Số Lý (Suy mệnh)'],
      structure: 'Giờ đầu giảng mệnh học, giờ sau giảng Kinh Dịch',
    },
    renji: {
      name: 'Nhân Kỷ',
      meaning: 'Giữa biết nhân sự',
      content: 'Châm Cứu Đại Thành (44 tập), Hoàng Đế Nội Kinh (20 tập), Thần Nông Bản Thảo Kinh (46 tập), Thương Hàn Luận, Kim Quỹ Yếu Lược (20 tập)',
      completionYear: '2004-2005',
      totalLessons: 'Hơn 150 tập',
      learningOrder: 'Châm cứu → Hoàng Đế Nội Kinh → Thần Nông Bản Thảo Kinh → Thương Hàn Luận → Kim Quỹ Yếu Lược',
      acuExperience: 215,
      transNeedling: 31,
      hantangFormulas: 100,
    },
    diji: {
      name: 'Địa Kỷ',
      meaning: 'Dưới biết địa lý',
      content: 'Địa lý chí các quốc gia (chưa hoàn thành)',
      status: 'Sự nghiệp dang dở của Nghê sư',
      note: 'Vốn định viết sau tuổi 60, nhưng qua đời năm 2012',
      startYear: 2007,
      existingContent: 'Phần Kham Dư học trong khóa Thiên Kỷ + di cảo do hậu nhân chỉnh lý',
    },
  },
  /** 人格特征（键保持中文，值为越南语） */
  personality: {
    算命风格: 'Đoán mệnh thẳng thừng dứt khoát, không chừa đường lui ("thiết khẩu trực đoán")',
    音乐爱好: 'Thích nhất bài "Hotel California" của ban nhạc Eagles',
    生活技能: 'Nấu ăn giặt giũ việc gì cũng thạo, tay nghề làm bánh bột ai cũng khen',
    工作态度: 'Đầu giường quanh năm để sẵn giấy bút, gặp bệnh khó thì khấn nguyện tiên sư',
    睡眠: 'Nhiều năm liền mỗi đêm ngủ chưa đến ba tiếng',
    患者评价: 'Thường được bệnh nhân Mỹ gọi là "hy vọng cuối cùng (The last hope)"',
  },
  /** 传人选拔标准 */
  discipleStandards: [
    'Tâm tính tốt',
    'Cá tính mạnh',
    'Có chính kiến vững',
    'Óc quan sát nhạy bén',
    'Dám phê phán lý luận sai lầm',
  ],
};

/** 三纪导航 */
export const SANJI_CATEGORIES = [
  { key: 'tianji' as const, name: 'Thiên Kỷ', nameEn: 'Tian Ji', icon: '⊙', meaning: 'Trên biết thiên văn', color: '#d4a843', href: '/tianji' },
  { key: 'diji' as const, name: 'Địa Kỷ', nameEn: 'Di Ji', icon: '⊞', meaning: 'Dưới biết địa lý', color: '#6b8a5e', href: '/diji' },
  { key: 'renji' as const, name: 'Nhân Kỷ', nameEn: 'Ren Ji', icon: '⊕', meaning: 'Giữa biết nhân sự', color: '#8b6b9e', href: '/renji' },
] as const;

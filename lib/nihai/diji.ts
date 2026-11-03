/**
 * 地纪 — 倪海厦地理风水体系数据库
 *
 * 「下知地理」—— 地之纪，是地理志的体系化研究。
 * 倪海厦原计划60岁后著述，利用天文地理知识与医学素养
 * 重新编写各国地理志，研究国家人性、物产与其风水地理的关系。
 *
 * 倪师于2012年辞世，地纪未能完成，为「倪师未竟之业」。
 * 现有内容来自天纪课程中的堪舆学部分以及后人整理的遗稿。
 */

import type { NiModule } from './types';

// ─── 地纪模块 ────────────────────────────────────────────
export const DIJI_MODULES: NiModule[] = [
  {
    id: 'dj-guojiadili',
    category: 'diji',
    name: 'Địa lý chí các quốc gia',
    nameEn: 'National Geography',
    subtitle: 'Sự nghiệp dang dở của Nghê sư · Nghiên đọc di cảo',
    description: 'Nghê sư dự định dùng kiến thức phong thủy địa lý để giải đọc ảnh hưởng của môi trường địa lý mỗi nước đến tính cách quốc dân, sản vật tài nguyên và sự thịnh suy của quốc vận. Đây là tâm nguyện lớn mà Nghê sư chưa kịp hoàn thành.',
    details: [
      'Địa Kỷ là phần được dự định hoàn thành sau cùng trong ba hệ thống trước tác lớn của Nghê Hải Hạ, vốn định bắt đầu viết sau tuổi 60.',
      'Ý tưởng cốt lõi là dùng kiến thức phong thủy địa lý để viết lại địa lý chí của các nước, áp dụng thuật Kham Dư truyền thống ở tầm vĩ mô quốc gia.',
      'Hướng nghiên cứu gồm: vị trí địa lý, núi sông của một quốc gia đã hun đúc tính cách quốc dân ra sao; mối quan hệ giữa sản vật tài nguyên và cục diện phong thủy; mối liên hệ giữa thịnh suy lịch sử và biến đổi địa lý.',
      'Nghê sư qua đời năm 2012, Địa Kỷ chỉ để lại những ý tưởng ban đầu và nền tảng lý luận Kham Dư trong khóa Thiên Kỷ. Những tia lửa tư tưởng quý giá này đáng để hậu học chỉnh lý và truyền thừa.',
    ],
    references: [
      'Phần Kham Dư học trong "Thiên Kỷ" (天纪) của Nghê Hải Hạ',
      'Ý tưởng về địa lý chí trong các bài giảng của Nghê Hải Hạ',
    ],
    keywords: ['Địa Kỷ', 'Địa lý quốc gia', 'Phong thủy', 'Địa lý chí', 'Quốc vận', 'Sản vật', 'Nhân tính', 'Kham Dư'],
    icon: '⊞',
    status: 'preview',
    order: 1,
    slug: 'geography',
    chapters: [
      {
        id: 'dj-dl-01',
        title: 'Ý tưởng về Địa Kỷ',
        subtitle: 'Tâm nguyện và bản thiết kế của Nghê sư',
        description: 'Ý tưởng tổng thể của Nghê sư về Địa Kỷ — dùng kiến thức phong thủy địa lý để giải đọc vận mệnh quốc gia.',
        keyPoints: [
          'Dự định viết sau tuổi 60 (Nghê sư sinh năm 1954)',
          'Dung hợp kiến thức thiên văn, địa lý với tố dưỡng y học',
          'Viết lại địa lý chí của các nước',
          'Nghiên cứu mối quan hệ giữa nhân tính, sản vật và phong thủy địa lý',
        ],
        quotes: ['我想在六十岁以后，利用我的天文地理知识与医学素养来重新写过地理志'],
        quotesVi: ['Tôi muốn sau tuổi sáu mươi sẽ dùng kiến thức thiên văn, địa lý và tố dưỡng y học của mình để viết lại địa lý chí'],
        order: 1,
      },
      {
        id: 'dj-dl-02',
        title: 'Địa lý và nhân tính',
        subtitle: 'Đất nào nuôi người nấy',
        description: 'Các môi trường địa lý khác nhau hun đúc nên tính cách dân tộc và đặc trưng văn hóa khác nhau như thế nào.',
        keyPoints: [
          'Khác biệt tính cách giữa dân tộc miền núi và dân tộc đồng bằng',
          'Ảnh hưởng của sự phân bố hệ thống sông ngòi đến văn minh nông nghiệp',
          'Quan hệ giữa đới khí hậu với thể chất, tính cách con người',
          'Nơi phong thủy tốt ắt có hiền nhân xuất hiện',
        ],
        order: 2,
      },
    ],
  },
  {
    id: 'dj-kanyu-theory',
    category: 'diji',
    name: 'Cơ sở lý luận Kham Dư',
    nameEn: 'Feng Shui Theory',
    subtitle: 'Kham Dư học trong Thiên Kỷ · Chỉnh lý lý luận',
    description: 'Chỉnh lý từ phần lý luận Kham Dư học trong khóa Thiên Kỷ, làm nền tảng lý luận cho Địa Kỷ. Bao gồm các lý thuyết cốt lõi như Loan Đầu, Lý Khí, Dương trạch.',
    details: [
      'Tuy Địa Kỷ chưa thành sách riêng, nhưng khóa Thiên Kỷ đã chứa nội dung lý luận Kham Dư phong phú.',
      'Những lý luận này là khung nền của Địa Kỷ, bao quát phương pháp phân tích phong thủy từ vi mô (nhà ở) đến vĩ mô (thành phố, quốc gia).',
      'Nghê sư theo phái Cửu Tinh (dòng Dương Cứu Bần), coi trọng ngang nhau Loan Đầu và Lý Khí.',
      'Phần nội dung này có thể xem là "dự khoa lý luận" của Địa Kỷ, cung cấp phương pháp luận cho việc nghiên cứu địa lý chí quốc gia về sau.',
    ],
    school: 'Phái Cửu Tinh (dòng Dương Cứu Bần)',
    references: [
      '"Thiên Kỷ · Địa Mạch Đạo" (天纪·地脉道) của Nghê Hải Hạ',
      'Điển tịch phong thủy của Dương Cứu Bần (杨救贫)',
    ],
    keywords: ['Kham Dư', 'Lý luận phong thủy', 'Loan Đầu', 'Lý Khí', 'Phái Cửu Tinh', 'Dương Cứu Bần', 'Dương trạch', 'Âm trạch'],
    icon: '◫',
    status: 'active',
    order: 2,
    slug: 'kanyu-theory',
    chapters: [
      {
        id: 'dj-kt-01',
        title: 'Loan Đầu học',
        subtitle: 'Phán đoán hình núi thế nước',
        description: 'Quan sát hình dạng, hướng đi của núi, chiều chảy của nước và các địa mạo tự nhiên để phán đoán cát hung phong thủy.',
        keyPoints: [
          'Long mạch: thế đi và khí mạch của dãy núi',
          'Huyệt vị: vị trí tốt nhất để tàng phong tụ khí',
          'Sa thủ: thế núi hai bên trái phải ôm lấy huyệt',
          'Thủy khẩu: phương vị dòng nước vào và ra',
        ],
        order: 1,
      },
      {
        id: 'dj-kt-02',
        title: 'Lý Khí học',
        subtitle: 'Suy tính cát hung theo phương vị',
        description: 'Dùng la bàn đo phương vị, kết hợp lý luận Cửu Tinh phi bố, Bát Sát Hoàng Tuyền… để suy tính cát hung.',
        keyPoints: [
          'Cách sử dụng la bàn',
          'Nguyên lý Cửu Tinh phi bố',
          'Phương vị cấm kỵ Bát Sát Hoàng Tuyền',
          'Phương vị cát lợi Tam Cát Lục Tú',
        ],
        order: 2,
      },
      {
        id: 'dj-kt-03',
        title: 'Ứng dụng Dương trạch',
        subtitle: 'Thực hành phong thủy cho môi trường cư trú',
        description: 'Phương pháp thực hành áp dụng lý luận Kham Dư vào việc chọn và bố trí nhà ở.',
        keyPoints: [
          'Nguyên tắc chọn tọa hướng nhà',
          'Sắp xếp phương vị các khu chức năng trong nhà',
          'Phán đoán cát hung của môi trường xung quanh',
          'Phương pháp hóa giải phong thủy xấu',
        ],
        order: 3,
      },
    ],
  },
  {
    id: 'dj-yigao',
    category: 'diji',
    name: 'Di cảo và hậu học',
    nameEn: 'Legacy & Continuation',
    subtitle: 'Hậu bối bổ chú · Truyền lửa tiếp nối',
    description: 'Chỉnh lý những lời giảng rời rạc của Nghê sư về Địa Kỷ, phần bổ chú nghiên cứu của học trò hậu bối, cùng sự mở rộng hiện đại của tư tưởng Địa Kỷ.',
    details: [
      'Tuy Nghê sư chưa hoàn thành chuyên khảo Địa Kỷ, nhưng trong khóa Thiên Kỷ và nhiều dịp khác đã nhiều lần nhắc đến ý tưởng và trọng điểm của Địa Kỷ.',
      'Học trò hậu bối và các nhà nghiên cứu đã dựa vào lời giảng và di cảo của Nghê sư để chỉnh lý, bổ chú ở mức độ nhất định.',
      'Tư tưởng Địa Kỷ có giá trị tham khảo quan trọng trong nghiên cứu phong thủy hiện đại, quy hoạch đô thị, khoa học môi trường.',
      'Mô-đun này nhằm thu thập, chỉnh lý mọi tư liệu tản mát liên quan đến Địa Kỷ, làm nền tảng cho nghiên cứu về sau.',
    ],
    references: [
      'Bản ghi bài giảng của Nghê Hải Hạ',
      'Ghi chép và nghiên cứu của học trò hậu bối',
    ],
    keywords: ['Di cảo', 'Hậu học', 'Bổ chú', 'Truyền thừa', 'Ứng dụng hiện đại'],
    icon: '⊟',
    status: 'coming',
    order: 3,
    slug: 'legacy',
    chapters: [
      {
        id: 'dj-yg-01',
        title: 'Ngữ lục Địa Kỷ của Nghê sư',
        subtitle: 'Tư tưởng Địa Kỷ rải rác trong các khóa học',
        description: 'Trích lục những luận thuật quan trọng của Nghê sư về Địa Kỷ từ các khóa Thiên Kỷ, Nhân Kỷ.',
        keyPoints: [
          'Động cơ sáng tác và kế hoạch của Địa Kỷ',
          'Quan sát về môi trường địa lý các nước',
          'Luận thuật về quan hệ giữa phong thủy và quốc vận',
          'Mối liên hệ giữa Địa Kỷ với Thiên Kỷ, Nhân Kỷ',
        ],
        quotes: [
          '人事的努力加上地理上的调整，一定能大于先天的命运',
          '2/3大于1/3——人事+地理=2/3，先天命运=1/3',
        ],
        quotesVi: [
          'Nỗ lực của con người cộng với sự điều chỉnh về địa lý nhất định có thể lớn hơn vận mệnh bẩm sinh',
          '2/3 lớn hơn 1/3 — nhân sự + địa lý = 2/3, vận mệnh bẩm sinh = 1/3',
        ],
        order: 1,
      },
    ],
  },
];

// ─── 统计 ────────────────────────────────────────────────
export const DIJI_STATS = {
  totalModules: DIJI_MODULES.length,
  totalChapters: DIJI_MODULES.reduce((sum, m) => sum + m.chapters.length, 0),
  status: 'Sự nghiệp dang dở của Nghê sư · Hậu bối tiếp tục chỉnh lý',
  note: 'Nghê Hải Hạ vốn định viết Địa Kỷ sau tuổi 60, nhưng qua đời năm 2012; Địa Kỷ chỉ để lại ý tưởng và nền tảng lý luận',
};

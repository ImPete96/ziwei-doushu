/**
 * 《紫微斗数全书》— 核心精选
 *
 * 公版（明代罗洪先编）
 * 是紫微斗数最系统的古籍，强调宫位关系与四化，全本约 10 万字。
 */

import type { Book } from '../types';

export const ziWeiQuanShu: Book = {
  title: 'Tử Vi Đẩu Số Toàn Thư (紫微斗数全书)',
  slug: 'quanshu',
  dynasty: 'Đời Minh',
  author: 'La Hồng Tiên (罗洪先) biên soạn',
  intro: 'Cổ thư có hệ thống nhất của Tử Vi Đẩu Số, nhấn mạnh mối quan hệ giữa mười hai cung và Tứ Hóa. Là giáo trình chính của người học Tử Vi từ đời Thanh trở về sau.',
  wordCount: 100000,
  chapters: [
    {
      title: 'Luận mười hai cung · cung Mệnh (十二宫论·命宫)',
      subtitle: 'Gốc rễ của việc xem số',
      paragraphs: [
        {
          id: 'qs-1-1',
          idx: 1,
          text: '命宫者，一身之根本，万事之枢纽。命宫定，则一生格局定。看命宫先看主星，次看辅煞，再看四化与三方四正之会照。',
          translation: 'Cung Mệnh là gốc rễ của một thân, là then chốt của vạn sự. Cung Mệnh định thì cách cục một đời định. Xem cung Mệnh trước xem chính tinh, kế xem phụ tinh và sát tinh, rồi xem Tứ Hóa cùng sự hội chiếu của tam phương tứ chính.',
        },
        {
          id: 'qs-1-2',
          idx: 2,
          text: '命宫主星庙旺，主先天优势，做事事半功倍；落陷则主先天劣势，但反主大成——落陷之人有"不甘"二字推动，反能爆发出庙旺命格做不到的逆袭。',
          translation: 'Chính tinh cung Mệnh Miếu Vượng chủ có ưu thế bẩm sinh, làm việc một vốn bốn lời; lạc Hãm thì chủ bất lợi bẩm sinh, nhưng trái lại có thể đại thành — người có sao lạc Hãm được hai chữ "không cam" thúc đẩy, ngược lại có thể bùng nổ lội ngược dòng mà mệnh cách Miếu Vượng không làm được.',
        },
        {
          id: 'qs-1-3',
          idx: 3,
          text: '命宫见六吉星（左辅右弼文昌文曲天魁天钺），主一生贵人不绝；命宫见六煞星（擎羊陀罗火星铃星地空地劫），主多波折磨砺，但若能忍过，反成大器。',
          translation: 'Cung Mệnh gặp lục cát tinh (Tả Phù, Hữu Bật, Văn Xương, Văn Khúc, Thiên Khôi, Thiên Việt), chủ một đời quý nhân không dứt; cung Mệnh gặp lục sát tinh (Kình Dương, Đà La, Hỏa Tinh, Linh Tinh, Địa Không, Địa Kiếp), chủ nhiều sóng gió rèn giũa, nhưng nếu nhẫn nại vượt qua được thì trái lại thành đại khí.',
        },
      ],
    },
    {
      title: 'Luận mười hai cung · cung Tài Bạch (十二宫论·财帛宫)',
      subtitle: 'Chỗ của nguồn tài',
      paragraphs: [
        {
          id: 'qs-2-1',
          idx: 1,
          text: '财帛宫主一生之财源、收入、理财方式。财帛宫主星不同，赚钱方式各异：紫微在财主官财，武曲在财主商财，太阴在财主田宅财，巨门在财主口才财。',
          translation: 'Cung Tài Bạch chủ nguồn tài, thu nhập và cách quản lý tiền bạc của một đời. Chính tinh cung Tài Bạch khác nhau thì cách kiếm tiền cũng khác: Tử Vi ở Tài Bạch chủ tiền từ quan chức, Vũ Khúc ở Tài Bạch chủ tiền từ buôn bán, Thái Âm ở Tài Bạch chủ tiền từ nhà đất, Cự Môn ở Tài Bạch chủ tiền từ tài ăn nói.',
        },
        {
          id: 'qs-2-2',
          idx: 2,
          text: '财帛宫化禄入命，主财源广进；财帛宫化忌，主财来财去；财帛宫见禄存，主稳定积累；财帛宫遇空劫，主财耗虚名。',
          translation: 'Cung Tài Bạch Hóa Lộc nhập Mệnh, chủ tài nguyên rộng mở; cung Tài Bạch Hóa Kỵ, chủ tiền đến rồi tiền đi; cung Tài Bạch gặp Lộc Tồn, chủ tích lũy ổn định; cung Tài Bạch gặp Không Kiếp, chủ hao tài, hư danh.',
        },
      ],
    },
    {
      title: 'Luận mười hai cung · cung Quan Lộc (十二宫论·官禄宫)',
      subtitle: 'Gốc của sự nghiệp',
      paragraphs: [
        {
          id: 'qs-3-1',
          idx: 1,
          text: '官禄宫主事业、地位、社会成就。官禄宫主星不同，事业方向各异：紫微在官宜大平台高位，太阳在官宜公务名声，武曲在官宜金融实业，廉贞在官宜文武兼备。',
          translation: 'Cung Quan Lộc chủ sự nghiệp, địa vị, thành tựu xã hội. Chính tinh cung Quan Lộc khác nhau thì hướng sự nghiệp cũng khác: Tử Vi ở Quan Lộc nên ở vị trí cao trên nền tảng lớn, Thái Dương ở Quan Lộc nên làm công vụ, theo danh tiếng, Vũ Khúc ở Quan Lộc nên làm tài chính, thực nghiệp, Liêm Trinh ở Quan Lộc nên kiêm cả văn lẫn võ.',
        },
        {
          id: 'qs-3-2',
          idx: 2,
          text: '官禄宫化权入命，主能独当一面；化禄入官，主财从职业来；化忌入官，主职场波折。',
          translation: 'Cung Quan Lộc Hóa Quyền nhập Mệnh, chủ có thể một mình đảm đương một phương; Hóa Lộc nhập Quan Lộc, chủ tiền đến từ nghề nghiệp; Hóa Kỵ nhập Quan Lộc, chủ sóng gió nơi công sở.',
        },
      ],
    },
    {
      title: 'Luận mười hai cung · cung Phu Thê (十二宫论·夫妻宫)',
      subtitle: 'Khí chất người phối ngẫu',
      paragraphs: [
        {
          id: 'qs-4-1',
          idx: 1,
          text: '夫妻宫主配偶气质、婚姻状态。夫妻宫紫微主配偶端庄威权，宜迟婚；夫妻宫贪狼主配偶多情，桃花重；夫妻宫天梁主配偶成熟稳重，年长。',
          translation: 'Cung Phu Thê chủ khí chất người phối ngẫu và tình trạng hôn nhân. Cung Phu Thê có Tử Vi chủ người phối ngẫu đoan trang, có uy quyền, nên kết hôn muộn; cung Phu Thê có Tham Lang chủ người phối ngẫu đa tình, đào hoa nặng; cung Phu Thê có Thiên Lương chủ người phối ngẫu chín chắn điềm đạm, lớn tuổi hơn.',
        },
        {
          id: 'qs-4-2',
          idx: 2,
          text: '夫妻宫化忌冲命，主婚姻多波折。夫妻宫见六煞，需特别注意感情之磨砺。夫妻宫见六吉，主配偶贵人。',
          translation: 'Cung Phu Thê Hóa Kỵ xung Mệnh, chủ hôn nhân nhiều sóng gió. Cung Phu Thê gặp lục sát, cần đặc biệt lưu ý những thử thách trong tình cảm. Cung Phu Thê gặp lục cát, chủ người phối ngẫu là quý nhân.',
        },
      ],
    },
    {
      title: 'Luận Tứ Hóa (四化论)',
      subtitle: 'Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ',
      paragraphs: [
        {
          id: 'qs-5-1',
          idx: 1,
          text: '四化为命盘之精华——化禄主财、化权主势、化科主名、化忌主病。四化所在宫位，决定一生重大事件之节点。',
          translation: 'Tứ Hóa là tinh hoa của lá số — Hóa Lộc chủ tài, Hóa Quyền chủ thế, Hóa Khoa chủ danh, Hóa Kỵ chủ bệnh. Cung có Tứ Hóa quyết định các mốc sự kiện lớn trong một đời.',
        },
        {
          id: 'qs-5-2',
          idx: 2,
          text: '生年四化为本命四化，永远固定；倪师强调四化星不动，只看大限流年走到何处。北派飞星派之自化、宫干飞化、来因宫等，倪师不主张使用。',
          translation: 'Tứ Hóa năm sinh là Tứ Hóa bản mệnh, cố định vĩnh viễn; Nghê sư nhấn mạnh sao Tứ Hóa không di động, chỉ xem Đại hạn, Lưu niên đi tới đâu. Các phép Tự hóa, phi hóa theo can cung, Lai nhân cung… của phái Phi tinh (Bắc phái), Nghê sư không chủ trương sử dụng.',
        },
        {
          id: 'qs-5-3',
          idx: 3,
          text: '化禄入命三方四正：财源稳定，缘分广，能力可变现。化禄入夫妻：婚姻甜蜜。化禄入官禄：事业财源相应。',
          translation: 'Hóa Lộc nhập tam phương tứ chính của Mệnh: tài nguyên ổn định, duyên phận rộng, năng lực có thể biến thành của cải. Hóa Lộc nhập Phu Thê: hôn nhân ngọt ngào. Hóa Lộc nhập Quan Lộc: sự nghiệp và nguồn tài tương ứng nhau.',
        },
        {
          id: 'qs-5-4',
          idx: 4,
          text: '化忌入命三方四正：一生有深刻功课，宜面对而非逃避。化忌入夫妻：婚姻多磨砺。化忌入官禄：事业多波折，但磨练后反成专业人才。',
          translation: 'Hóa Kỵ nhập tam phương tứ chính của Mệnh: một đời có bài học sâu sắc, nên đối mặt chứ không né tránh. Hóa Kỵ nhập Phu Thê: hôn nhân nhiều thử thách. Hóa Kỵ nhập Quan Lộc: sự nghiệp nhiều sóng gió, nhưng sau khi rèn giũa trái lại thành nhân tài chuyên môn.',
        },
      ],
    },
    {
      title: 'Cách Cơ Nguyệt Đồng Lương (机月同梁格)',
      subtitle: 'Số ổn định tích lũy',
      paragraphs: [
        {
          id: 'qs-6-1',
          idx: 1,
          text: '天机太阴天同天梁四星齐入命三方四正，称机月同梁格。文质彬彬、聪慧善谋，最适合公职、学术、文艺、医疗、服务等需稳定累积的行业。',
          translation: 'Bốn sao Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương cùng vào tam phương tứ chính của Mệnh gọi là cách Cơ Nguyệt Đồng Lương. Nho nhã lịch thiệp, thông minh giỏi mưu tính, hợp nhất với công chức, học thuật, văn nghệ, y tế, dịch vụ — những ngành cần ổn định tích lũy.',
        },
        {
          id: 'qs-6-2',
          idx: 2,
          text: '机月同梁作吏人——古云此格者宜担任公职、行政文书工作，安稳一生。再会昌曲化科，主名声远播。最忌煞星过多，则反主多变难安。',
          translation: '"Cơ Nguyệt Đồng Lương tác lại nhân" (Cơ Nguyệt Đồng Lương làm quan lại) — người xưa nói người có cách này nên làm công chức, công việc hành chính văn thư, một đời an ổn. Nếu lại hội Xương Khúc, Hóa Khoa thì chủ danh tiếng vang xa. Kỵ nhất sát tinh quá nhiều, khi đó trái lại chủ nhiều biến động, khó yên.',
        },
      ],
    },
    {
      title: 'Cách Song Lộc triều viên (双禄朝垣格)',
      subtitle: 'Giàu sánh Đào Chu',
      paragraphs: [
        {
          id: 'qs-7-1',
          idx: 1,
          text: '化禄与禄存同会命宫三方四正，称双禄朝垣格。古云"双禄朝垣，富比陶朱"，主一生不愁财，多有正财横财兼得。',
          translation: 'Hóa Lộc và Lộc Tồn cùng hội ở tam phương tứ chính cung Mệnh gọi là cách Song Lộc triều viên. Người xưa nói "Song Lộc triều viên, giàu sánh Đào Chu" (Đào Chu Công, tức Phạm Lãi), chủ một đời không lo tiền bạc, thường được cả chính tài lẫn hoạnh tài.',
        },
        {
          id: 'qs-7-2',
          idx: 2,
          text: '双禄朝垣最忌空劫——空劫一冲，则双禄成虚名。需见左辅右弼或文昌文曲，方为正格。',
          translation: 'Song Lộc triều viên kỵ nhất Không Kiếp — Không Kiếp vừa xung thì song Lộc thành hư danh. Cần gặp Tả Phù, Hữu Bật hoặc Văn Xương, Văn Khúc mới là chính cách.',
        },
      ],
    },
  ],
};

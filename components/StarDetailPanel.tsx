'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { Star } from '@/lib/ziwei/types';
import { STAR_DESCRIPTIONS } from '@/lib/ziwei/constants';
import { viPalaceFull, viSihua, viStar } from '@/lib/vi/terms';

interface StarDetailPanelProps {
  star: Star | null;
  palaceName?: string;
  onClose: () => void;
}

// 倪海厦体系各星详细解读（参考顾祥弘《飞星紫微斗数全书》及南北山人《紫微斗数全书》）
const STAR_DETAIL: Record<string, {
  niHaixia: string;
  /** 古书原文（保留中文原文） */
  classical: string;
  /** 古书原文的越南语译文 */
  classicalVi: string;
  bestPalace: string;
  worstPalace: string;
  career: string;
  relationship: string;
  wealth: string;
  health: string;
}> = {
  '紫微': {
    niHaixia: 'Nghê sư cho rằng Tử Vi là sao hoàng đế; người Tử Vi thủ Mệnh có khí chất cô ngạo, thích ở một mình, không thích bị người khác quản. Tử Vi cần Tả Phù, Hữu Bật giáp hai bên mới phát huy được khí chất đế vương, nếu không chỉ là cô quân, giàu mà không sang. Tử Vi ở Thìn, Tuất là tốt nhất, cùng Thiên Phủ tạo thành cách song tinh, tài quan song mỹ, có thể xuất tướng nhập tướng. Tử Vi sợ nhất Hỏa Tinh, Linh Tinh, Kình Dương, Đà La đồng cung; thêm sát thì cô quý, có quyền mà không có tiền.',
    classical: '古诀：「紫微帝座临命主尊贵，统领众星，坐命者主权威显达。」南北山人注：「紫微守命于辰位，财官双美，出将入相，位至三公；子宫安命者，富贵不耐久，日后不美。」',
    classicalVi: 'Cổ quyết: «Tử Vi đế tọa lâm Mệnh chủ tôn quý, thống lĩnh các sao, người thủ Mệnh chủ quyền uy hiển đạt.» Nam Bắc Sơn Nhân chú: «Tử Vi thủ Mệnh ở Thìn, tài quan song mỹ, xuất tướng nhập tướng, quan đến tam công; an Mệnh ở Tý thì phú quý không bền, về sau không đẹp.»',
    bestPalace: 'Mệnh (Thìn, Tuất), Quan Lộc',
    worstPalace: 'Tật Ách, Phu Thê',
    career: 'Chính trường, quản lý cấp cao, tự khởi nghiệp; bẩm sinh có khí chất đế vương, hợp vị trí lãnh đạo tự đứng một mình một cõi',
    relationship: 'Bị động trong tình cảm, lòng tự tôn cao, cần đối phương chủ động; có khuynh hướng cô độc, kết hôn muộn thì tốt',
    wealth: 'Tài vận ổn định, giữ của giỏi hơn tiến thủ; ở Thìn, Tuất tài quan song mỹ, hợp nhất đầu tư kiểu tích lũy',
    health: 'Thuộc Thổ, chú ý tỳ vị, hệ tiêu hóa. Kỵ làm việc quá sức, nên giữ nếp sinh hoạt điều độ',
  },
  '天机': {
    niHaixia: 'Nghê sư nói Thiên Cơ là sao tham mưu, thông minh nhất trong các sao, nhưng thông minh lộ ra ngoài thì hại thân. Thiên Cơ Hóa Kỵ là phiền nhất, ứng với câu khôn quá hóa dại. Thiên Cơ thuộc Mộc, linh hoạt hay biến; thủ Mệnh thì tư duy nhanh nhạy nhưng thường nhiều mưu ít quyết, phải rời quê đi xa mới phát triển; ứng biến tùy cơ là đặc điểm lớn nhất.',
    classical: '古诀：「为人生精滑，自好作经营，天机星属木，商买皆多机见，离宗必远亲，机谋必远离亲。」南北山人注：「天机居庙旺地，主人生精明，善策划；居陷地则暗淡，人人皆从商为业。」',
    classicalVi: 'Cổ quyết: «Làm người tinh khôn lanh lợi, ưa tự kinh doanh; Thiên Cơ thuộc Mộc, buôn bán đều có nhiều cơ kiến, rời tông ắt xa người thân.» Nam Bắc Sơn Nhân chú: «Thiên Cơ ở đất Miếu, Vượng chủ người tinh minh, giỏi hoạch định; ở đất Hãm thì ảm đạm, phần nhiều làm nghề buôn bán.»',
    bestPalace: 'Mệnh (cung Mão), Quan Lộc',
    worstPalace: 'Phu Thê',
    career: 'Chuyên gia kỹ thuật, mưu sĩ, nhà nghiên cứu, CNTT, hoạch định; dùng đầu óc hơn dùng tay chân, hợp rời quê lập nghiệp',
    relationship: 'Tình cảm hay thay đổi, suy nghĩ quá nhiều, khó chuyên nhất; nên kết hôn muộn, sau khi cưới cần học cách buông bớt lo nghĩ',
    wealth: 'Kiếm tiền bằng trí tuệ và kỹ năng, không giỏi giữ của; theo nghề chuyên môn kỹ thuật thì tài vận ổn định',
    health: 'Thuộc Mộc, chú ý gan mật, hệ thần kinh. Tâm tư quá nặng dễ mất ngủ, nên tập tĩnh tâm, thiền định',
  },
  '太阳': {
    niHaixia: 'Nghê sư cho rằng Thái Dương là sao của chủ nghĩa đại nam nhân; từ Mão đến Ngọ là nhập Miếu, quang minh chính đại; sau Ngọ dần lạc Hãm. Người Thái Dương thủ Mệnh hào phóng, trọng thể diện; hợp mệnh nam, mệnh nữ thì quá mạnh mẽ. Thái Dương đại diện cho cha và bề trên; ở cung Mệnh chủ tính cách hướng ngoại, cởi mở, thích được mọi người chú ý, hợp nhất với công chức hoặc sự nghiệp công chúng. Lạc Hãm thì trước siêng sau lười, cô quả lao lực.',
    classical: '古诀：「太阳居午为入庙，光辉大放，主贵显，男命最佳；落陷则孤寡劳碌，先勤后懒。」南北山人注：「太阳在午宫守命，财官双美，出将入相；辰位安命，中年财官变美，乙年生人遇凶亦大利。」',
    classicalVi: 'Cổ quyết: «Thái Dương ở Ngọ là nhập Miếu, rực rỡ huy hoàng, chủ quý hiển, mệnh nam tốt nhất; lạc Hãm thì cô quả lao lực, trước siêng sau lười.» Nam Bắc Sơn Nhân chú: «Thái Dương thủ Mệnh ở Ngọ, tài quan song mỹ, xuất tướng nhập tướng; an Mệnh ở Thìn, trung niên tài quan trở nên tốt, người sinh năm Ất gặp hung cũng đại lợi.»',
    bestPalace: 'Mệnh (Mão đến Ngọ), Quan Lộc',
    worstPalace: 'Phu Thê (mệnh nữ), Tật Ách',
    career: 'Công chức, chính trường, quản lý, quan hệ công chúng, giáo dục, truyền thông; thích đứng trước đám đông, hợp sự nghiệp công chúng',
    relationship: 'Mệnh nam có duyên nhưng đa tình; mệnh nữ độc lập, mạnh mẽ, hôn nhân cần thời gian hòa hợp, nên tìm người dịu dàng chu đáo',
    wealth: 'Tài vận nhờ nỗ lực, hào phóng ưa giúp người, không giỏi tích lũy; nhập Miếu tài vận vượng, lạc Hãm tài vận thăng trầm',
    health: 'Thuộc Hỏa, chú ý tim, mắt. Ở vị trí lạc Hãm dễ làm việc quá sức, cần nghỉ ngơi đầy đủ',
  },
  '武曲': {
    niHaixia: 'Nghê sư xem Vũ Khúc là chủ tinh Tài Bạch, cứng rắn không chịu khuất, sợ nhất cô khắc. Người Vũ Khúc thủ Mệnh ý chí kiên định, hợp tài chính, quản lý tiền bạc, nhưng tình cảm quá thẳng, dễ làm tổn thương người khác. Vũ Khúc Hóa Kỵ cần cẩn thận tai nạn, huyết quang. Vũ Khúc ở Thìn, Tuất, Sửu, Mùi đắc Vượng địa, đồng cung với Thất Sát thành cách Tướng tài, là cách cục tài phú rất tốt.',
    classical: '古诀：「武曲属金，刚强之性，一生多刑克；守命于旺地，出将入相。」南北山人注：「武曲守命，三方四正俱吉，财官双美，武职加辅弼昌曲，亦主大贵；与七杀同宫，为将财格，主大富。」',
    classicalVi: 'Cổ quyết: «Vũ Khúc thuộc Kim, tính cương cường, một đời nhiều hình khắc; thủ Mệnh ở Vượng địa thì xuất tướng nhập tướng.» Nam Bắc Sơn Nhân chú: «Vũ Khúc thủ Mệnh, Tam phương tứ chính đều cát, tài quan song mỹ; võ chức thêm Phụ Bật Xương Khúc cũng chủ đại quý; đồng cung với Thất Sát là cách Tướng tài, chủ đại phú.»',
    bestPalace: 'Mệnh (Thìn, Tuất, Sửu, Mùi), Tài Bạch, Quan Lộc',
    worstPalace: 'Phu Thê',
    career: 'Tài chính, quân đội cảnh sát, kế toán, kỹ thuật công trình; năng lực thực thi rất mạnh, hợp lĩnh vực cần khí phách và quyết đoán',
    relationship: 'Tình cảm thẳng thắn, thiếu lãng mạn, cần bạn đời dịu dàng bổ trợ, kỵ cô khắc trong tình cảm',
    wealth: 'Bản mệnh là tài tinh, tài vận rất mạnh, khả năng quản lý tiền bạc vượt trội; ở Thìn, Tuất tài quan song mỹ',
    health: 'Thuộc Kim, chú ý phổi, hệ hô hấp, răng. Khi Hóa Kỵ cần đề phòng tai nạn, huyết quang',
  },
  '天同': {
    niHaixia: 'Nghê sư nói Thiên Đồng là phúc tinh, cũng là sao lười nhất. Thiên Đồng thủ Mệnh thích hưởng phúc, không thích cạnh tranh, hợp công việc ổn định. Thiên Đồng đồng cung với Thiên Lương là tốt nhất, vừa hưởng phúc vừa có bảo đảm. Thiên Đồng Hóa Lộc là Hóa Lộc đẹp nhất, chủ một đời cơm áo không lo, vui vẻ thong dong. Thiên Đồng kỵ lạc Hãm, lạc Hãm thì giảm phúc, cần hóa giải với hung tinh.',
    classical: '古诀：「天同为福德之星，坐命者享福有余，主一生逍遥自在，不必劳苦。」南北山人注：「天同守命，三方无煞，一生快乐，衣食丰足；加吉星则富贵双全，为人温和，多人缘。」',
    classicalVi: 'Cổ quyết: «Thiên Đồng là sao phúc đức, người thủ Mệnh hưởng phúc có thừa, chủ một đời tiêu dao tự tại, không phải lao khổ.» Nam Bắc Sơn Nhân chú: «Thiên Đồng thủ Mệnh, Tam phương không sát, một đời vui vẻ, cơm áo đầy đủ; thêm cát tinh thì phú quý song toàn, làm người ôn hòa, nhiều nhân duyên.»',
    bestPalace: 'Mệnh, Phúc Đức',
    worstPalace: 'Quan Lộc',
    career: 'Dịch vụ, giải trí, ẩm thực, văn nghệ; môi trường nhẹ nhàng vui vẻ là hợp nhất, kỵ cạnh tranh áp lực cao',
    relationship: 'Tình cảm ôn hòa, không chủ động, dễ bị động chấp nhận; hôn nhân khá ổn định, tính cách dễ chịu, dễ gần',
    wealth: 'Tài vận không nổi bật, dựa vào lương ổn định, không giỏi đầu cơ; cơm áo không lo nhưng khó đại phú',
    health: 'Thuộc Thủy, chú ý thận, bàng quang. Thể chất khá yếu, nên vận động vừa phải, giữ tâm thái thoải mái',
  },
  '廉贞': {
    niHaixia: 'Nghê sư cho rằng Liêm Trinh là thứ đào hoa, tài hoa dồi dào nhưng tình cảm phức tạp. Liêm Trinh Hóa Kỵ rất hung, ứng với kiện tụng, tù tội, tai nạn. Liêm Trinh đồng cung với Thiên Tướng thì hóa hung thành cát, thành cách hành chính ấn thụ. Liêm Trinh ngũ hành thuộc Hỏa, tính cương liệt, một đời nhiều thăng trầm, tài nghệ xuất chúng; nếu giữ được chính đạo thì có thể thành đại khí.',
    classical: '古诀：「廉贞为次桃花，才华横溢，感情多波折；廉相同宫，化凶为吉，成行政印绶格，可掌权柄。」南北山人注：「廉贞守命，见吉星则才华出众，化忌则官司缠身，主血光之灾，须防。」',
    classicalVi: 'Cổ quyết: «Liêm Trinh là thứ đào hoa, tài hoa dồi dào, tình cảm nhiều sóng gió; Liêm Tướng đồng cung, hóa hung thành cát, thành cách hành chính ấn thụ, có thể nắm quyền bính.» Nam Bắc Sơn Nhân chú: «Liêm Trinh thủ Mệnh, gặp cát tinh thì tài hoa xuất chúng; Hóa Kỵ thì kiện tụng đeo bám, chủ tai huyết quang, cần đề phòng.»',
    bestPalace: 'Quan Lộc (đi cùng Thiên Tướng), Mệnh (khi Hóa Lộc)',
    worstPalace: 'Mệnh (khi Hóa Kỵ), Phu Thê',
    career: 'Nghệ thuật, giải trí, pháp luật, công chức (đi cùng Thiên Tướng); tài nghệ xuất chúng, nên giữ nghề chính đáng mới bền lâu',
    relationship: 'Nhiều đào hoa, tình cảm phức tạp, dễ vướng rắc rối tình cảm; nên kết hôn muộn, chọn bạn đời vững vàng',
    wealth: 'Tài vận thăng trầm, kiếm tiền bằng tài nghệ; khi Hóa Kỵ đề phòng tranh chấp tài chính và rủi ro pháp lý',
    health: 'Thuộc Hỏa, chú ý tim, máu, gan. Khi Hóa Kỵ đề phòng tai nạn và phẫu thuật, lưu ý huyết quang',
  },
  '天府': {
    niHaixia: 'Nghê sư nói Thiên Phủ là sao kho tiền, sao giữ thành quả; không chủ động phát tài nhưng giữ được của. Người Thiên Phủ thủ Mệnh vững vàng thận trọng, mệnh nữ tốt nhất, có thể vượng phu hưng gia. Thiên Phủ thích nhất Tử Vi đồng cung hoặc chiếu, tạo thành cách song tinh, tài quan song mỹ. Thiên Phủ sợ Không Kiếp giáp; gặp Không Kiếp thì kho tiền cạn đáy, không giữ được của.',
    classical: '古诀：「天府为财库之星，守命者稳重保守，主积财旺家；女命逢之，能旺夫益子，家道兴隆。」南北山人注：「天府守命，三方吉聚，财官双美，富贵安康；遇空劫，则财库破漏，难以积财。」',
    classicalVi: 'Cổ quyết: «Thiên Phủ là sao tài khố, người thủ Mệnh vững vàng thận trọng, chủ tích của vượng nhà; mệnh nữ gặp thì vượng phu ích tử, gia đạo hưng long.» Nam Bắc Sơn Nhân chú: «Thiên Phủ thủ Mệnh, Tam phương hội cát, tài quan song mỹ, phú quý an khang; gặp Không Kiếp thì kho tiền rò rỉ, khó tích của.»',
    bestPalace: 'Mệnh, Tài Bạch, Điền Trạch',
    worstPalace: 'Thiên Di',
    career: 'Quản lý hành chính, tài chính, bảo hiểm, bất động sản; cầu ổn định không mạo hiểm, hợp nghề giữ thành quả',
    relationship: 'Tình cảm ổn định, chăm lo gia đình, là bạn đời tốt; coi trọng cảm giác an toàn và bảo đảm kinh tế của gia đình',
    wealth: 'Tài vận rất tốt, khả năng giữ của mạnh, hợp nhất đầu tư tích lũy và mua sắm bất động sản',
    health: 'Thuộc Thổ, chú ý tỳ vị, tiêu hóa. Thể chất vững, nên giữ ăn uống và sinh hoạt điều độ',
  },
  '太阴': {
    niHaixia: 'Nghê sư cho rằng Thái Âm là tài tinh, lợi cho mệnh nữ, cũng là sao đại diện cho mẹ và vợ của mệnh nam. Thái Âm nhập Miếu thì tài vận rất tốt, ở đất Hãm thì tài vận bị trở ngại. Thái Âm Hóa Kỵ cần chú ý chuyện của người thân là nữ. Thái Âm ở Hợi, Tý nhập Miếu, ánh sáng chiếu trọn, chủ tao nhã tinh tế, tình cảm phong phú, coi trọng thế giới nội tâm và đời sống tinh thần.',
    classical: '古诀：「太阴为财星，利女命；亥子入庙，光辉全照，财运极旺；午位落陷，忧郁多情，财运平淡。」南北山人注：「太阴守命，入庙者财富优厚，女命尤佳；落陷者需努力方能致富，情感细腻。」',
    classicalVi: 'Cổ quyết: «Thái Âm là tài tinh, lợi mệnh nữ; Hợi Tý nhập Miếu, ánh sáng chiếu trọn, tài vận cực vượng; ở Ngọ lạc Hãm, u uất đa tình, tài vận bình thường.» Nam Bắc Sơn Nhân chú: «Thái Âm thủ Mệnh, nhập Miếu thì giàu có sung túc, mệnh nữ càng tốt; lạc Hãm cần nỗ lực mới giàu được, tình cảm tinh tế.»',
    bestPalace: 'Mệnh (Hợi, Tý), Tài Bạch',
    worstPalace: 'Mệnh (Ngọ, đất Hãm)',
    career: 'Tài chính, ngân hàng, bất động sản, nghệ thuật, giáo dục; tinh tế kiên nhẫn, hợp nghề cần cảm thẩm mỹ và sự dịu dàng',
    relationship: 'Tình cảm dịu dàng tinh tế, coi trọng cảm nhận nội tâm, cần mối quan hệ ổn định có cảm giác an toàn',
    wealth: 'Nhập Miếu tài vận cực vượng, lạc Hãm thì cần nỗ lực; quản lý tiền cẩn thận, giỏi tích lũy, không giỏi mạo hiểm',
    health: 'Thuộc Thủy, chú ý thận, tử cung (mệnh nữ). Cảm xúc dao động ảnh hưởng sức khỏe, nên giữ tâm trạng thư thái',
  },
  '贪狼': {
    niHaixia: 'Nghê sư nói Tham Lang là sao đa tài đa nghệ nhất, đào hoa nặng nhất. Tham Lang Hóa Lộc nhập Mệnh thì sức hút tỏa khắp, ai gặp cũng mến. Tham Lang là sao phát muộn, sau trung niên mới thật sự phát đạt. Tham Lang ở Dần, Thân nhập Miếu là tốt nhất, đào hoa vượng, tài nghệ vượt trội; Hóa Lộc thì tài vận đại phát, nhưng gặp Không Kiếp thì một đời nhiều sóng gió, khó tụ tài.',
    classical: '古诀：「贪狼发福亨通，多才多艺，桃花最重；然难过三十岁，晚发者众。落陷遇煞反吉，此系贪狼落陷之理。」南北山人注：「贪狼守命，遇吉则福禄多寿，发福亨通；但久后不得善终，故宜修身养德，方可善终。」',
    classicalVi: 'Cổ quyết: «Tham Lang phát phúc hanh thông, đa tài đa nghệ, đào hoa nặng nhất; song khó qua tuổi ba mươi, người phát muộn nhiều. Lạc Hãm gặp sát trái lại thành cát, đó là lý của Tham Lang lạc Hãm.» Nam Bắc Sơn Nhân chú: «Tham Lang thủ Mệnh, gặp cát thì phúc lộc thọ nhiều, phát phúc hanh thông; nhưng lâu về sau khó được chết lành, nên tu thân dưỡng đức mới có thể trọn vẹn.»',
    bestPalace: 'Mệnh (Hóa Lộc), Phúc Đức, Thiên Di',
    worstPalace: 'Tật Ách',
    career: 'Nghệ thuật, giải trí, quan hệ công chúng, bán hàng, phong thủy ngũ thuật; dựa vào quan hệ và tài nghệ, kiểu người đa tài đa nghệ',
    relationship: 'Đào hoa cực vượng, tình cảm đa dạng; nên kết hôn muộn, sau khi cưới cần kiềm chế đào hoa mới bạc đầu bên nhau',
    wealth: 'Kiếm tiền nhờ quan hệ và tài nghệ, tài vận trung vãn niên mới ổn; Hóa Lộc thì nguồn tiền rộng mở, thời trẻ nên giữ ổn định',
    health: 'Thuộc Mộc (kiêm Thủy), chú ý gan, thận. Đào hoa quá vượng dễ hao tổn tinh lực, nên tiết chế điều dưỡng',
  },
  '巨门': {
    niHaixia: 'Nghê sư cho rằng Cự Môn là sao thị phi miệng lưỡi, nhưng Hóa Lộc, Hóa Quyền thì chuyển cát, thành cách kiếm tiền bằng tài ăn nói. Người Cự Môn thủ Mệnh đa nghi, giỏi biện luận, hợp luật sư, giáo viên, bán hàng. Cự Môn kỵ nhất Hóa Kỵ, chủ thị phi miệng lưỡi không dứt, thậm chí dẫn đến kiện tụng. Cự Môn ở Tý, Ngọ khá tốt, ăn nói giỏi, chủ lập thân bằng lời nói.',
    classical: '古诀：「巨门为暗曜，主口舌是非；化禄权则转为以口才谋生，主富贵。」南北山人注：「巨门守命，逢化禄权，以口舌为业者大吉；化忌则口舌连累，官司缠身，需谨慎言语。」',
    classicalVi: 'Cổ quyết: «Cự Môn là ám diệu, chủ thị phi miệng lưỡi; Hóa Lộc, Quyền thì chuyển thành mưu sinh bằng khẩu tài, chủ phú quý.» Nam Bắc Sơn Nhân chú: «Cự Môn thủ Mệnh, gặp Hóa Lộc, Quyền, người lấy miệng lưỡi làm nghề thì đại cát; Hóa Kỵ thì miệng lưỡi liên lụy, kiện tụng đeo bám, cần thận trọng lời nói.»',
    bestPalace: 'Quan Lộc (Hóa Lộc, Quyền), Mệnh (Tý, Ngọ)',
    worstPalace: 'Phu Thê, Tật Ách (Hóa Kỵ)',
    career: 'Luật sư, giáo viên, bán hàng, người dẫn chương trình, chuyên gia đàm phán; khẩu tài là năng lực cạnh tranh cốt lõi',
    relationship: 'Đa nghi đa lự, dễ nghĩ quá nhiều; giao tiếp là then chốt của hôn nhân, cần chọn bạn đời kiên nhẫn',
    wealth: 'Kiếm tiền bằng khẩu tài và kỹ năng chuyên môn; Hóa Lộc thì tài vận khá tốt, Hóa Kỵ đề phòng tranh chấp tài chính do miệng lưỡi',
    health: 'Thuộc Thủy, chú ý thận, tai, khoang miệng. Lo nghĩ nhiều dễ hại thân, nên học cách thư giãn giảm áp lực',
  },
  '天相': {
    niHaixia: 'Nghê sư nói Thiên Tướng là sao ấn thụ, phụ trách việc hành chính sự vụ. Người Thiên Tướng thủ Mệnh khuôn phép đúng mực, hợp công chức hành chính. Thiên Tướng cần nhất có sao mạnh đi kèm mới phát huy, một mình thủ Mệnh thì khá bình thường. Thiên Tướng thích nhất Liêm Trinh đi cùng, thành cách Liêm Tướng, có thể nắm đại quyền hành chính; sợ nhất Phá Quân đồng cung, thành cách Hình Kỵ giáp Ấn, chủ hung hiểm.',
    classical: '古诀：「天相为印绶之星，主行政庶务；廉相同宫，化凶为吉，掌行政大权。」南北山人注：「天相守命，中规中矩，适合公职；得廉贞相配，可成国家栋梁；破军同守，则刑克难免。」',
    classicalVi: 'Cổ quyết: «Thiên Tướng là sao ấn thụ, chủ việc hành chính sự vụ; Liêm Tướng đồng cung, hóa hung thành cát, nắm đại quyền hành chính.» Nam Bắc Sơn Nhân chú: «Thiên Tướng thủ Mệnh, khuôn phép đúng mực, hợp công chức; được Liêm Trinh phối hợp có thể thành rường cột quốc gia; Phá Quân cùng thủ thì khó tránh hình khắc.»',
    bestPalace: 'Quan Lộc, Mệnh (đi cùng Liêm Trinh)',
    worstPalace: 'Tài Bạch, Mệnh (đi cùng Phá Quân thì thành Hình Kỵ giáp Ấn)',
    career: 'Công chức, quản lý hành chính, thư ký, trợ lý; giỏi vai trò hỗ trợ, cần sao mạnh dẫn đường',
    relationship: 'Tình cảm ổn định, trung hậu thật thà, là bạn đời tốt nhưng cần đối phương định hướng',
    wealth: 'Tài vận bình ổn, tích lũy nhờ lương, không hợp đầu tư mạo hiểm; quản lý tiền kiểu giữ thành quả là hợp nhất',
    health: 'Thuộc Thủy, chú ý thận, hệ bạch huyết. Thể chất trung bình, nên giữ thói quen sinh hoạt điều độ',
  },
  '天梁': {
    niHaixia: 'Nghê sư cho rằng Thiên Lương là ấm tinh, có thể che chở người khác, cũng đại diện cho y dược, tôn giáo. Người Thiên Lương thủ Mệnh có duyên với bề trên, thời trẻ nhiều gian nan, tuổi già hưởng phúc. Thiên Lương sợ nhất Hóa Kỵ, ứng với bề trên hoặc sức khỏe có vấn đề. Thiên Lương đồng cung với Thái Dương là tốt nhất, Nhật Nguyệt tịnh minh, quý nhân che chở, một đời có quý nhân giúp đỡ, cuối cùng được bình an.',
    classical: '古诀：「天梁为荫星，主庇荫保护；坐命者有长辈缘，早年受磨练，晚年享清福。」南北山人注：「天梁守命，须逢吉星方能发达；遇太阳同宫，日月并明，主贵显，一生多贵人相助。」',
    classicalVi: 'Cổ quyết: «Thiên Lương là ấm tinh, chủ che chở bảo hộ; người thủ Mệnh có duyên với bề trên, thời trẻ chịu rèn luyện, tuổi già hưởng thanh phúc.» Nam Bắc Sơn Nhân chú: «Thiên Lương thủ Mệnh, phải gặp cát tinh mới phát đạt; gặp Thái Dương đồng cung, Nhật Nguyệt tịnh minh, chủ quý hiển, một đời nhiều quý nhân giúp đỡ.»',
    bestPalace: 'Mệnh, Phụ Mẫu, Phúc Đức',
    worstPalace: 'Mệnh (khi Hóa Kỵ), Tài Bạch',
    career: 'Y tế, tôn giáo, pháp luật, công tác xã hội, từ thiện; thích giúp người, có lòng che chở mọi người',
    relationship: 'Tình cảm thường với người chênh lệch tuổi khá lớn, hoặc duyên đến muộn; cần kiên nhẫn chờ đợi mới gặp lương duyên',
    wealth: 'Tài vận nhờ quý nhân giúp đỡ, thời trẻ tài vận không tốt, tuổi già mới vững; nên giữ, không nên xông pha',
    health: 'Thuộc Thổ, chú ý tỳ vị, xương khớp. Cần coi trọng chăm sóc sức khỏe tuổi già, nên phòng ngừa điều dưỡng sớm',
  },
  '七杀': {
    niHaixia: 'Nghê sư nói Thất Sát là sao tướng quân, quả quyết, xung lực mạnh, nhưng có tính cô khắc. Thất Sát thủ Mệnh phải có phụ tinh hóa giải tính cô, nếu không duyên lục thân mỏng. Thất Sát đồng cung với Vũ Khúc là cách Tướng tài, rất tốt. Thất Sát sợ nhất Trúc La tam hạn (Dương Đà Hỏa Linh cùng chiếu), chủ đại hung, phải đề phòng tai nạn. Thất Sát Hóa Lộc thì trái lại thành cát, có thể thành bậc đại tướng.',
    classical: '古诀：「七杀为将军之星，果决冲劲强；守命者孤克性重，六亲缘薄。」南北山人注：「七杀守命，三合吉聚则大贵；遇竹罗三限（羊陀火铃），主大凶，防意外之灾，防刑克。」',
    classicalVi: 'Cổ quyết: «Thất Sát là sao tướng quân, quả quyết, xung lực mạnh; người thủ Mệnh tính cô khắc nặng, duyên lục thân mỏng.» Nam Bắc Sơn Nhân chú: «Thất Sát thủ Mệnh, Tam hợp hội cát thì đại quý; gặp Trúc La tam hạn (Dương Đà Hỏa Linh), chủ đại hung, đề phòng tai họa bất ngờ, đề phòng hình khắc.»',
    bestPalace: 'Mệnh (có phụ tinh), Quan Lộc',
    worstPalace: 'Phu Thê, Phụ Mẫu',
    career: 'Quân đội cảnh sát, khởi nghiệp, giao dịch tài chính, lĩnh vực tự đứng một mình một cõi; cần quyết đoán nhanh và khí phách',
    relationship: 'Tình cảm cô khắc, khó tìm bạn đời phù hợp; cần người bao dung được cá tính mạnh, nên kết hôn muộn',
    wealth: 'Tài vận dao động lớn, có cơ hội đại phú nhưng cũng lên xuống thất thường; đồng cung Vũ Khúc thành cách Tướng tài đại quý',
    health: 'Thuộc Kim, chú ý phổi, đại tràng. Tính nóng nảy dễ hại thân, nên học cách kiểm soát cảm xúc và tu thân',
  },
  '破军': {
    niHaixia: 'Nghê sư nói Phá Quân là sao giỏi phá cũ lập mới nhất, cũng là một trong những sao cô khắc nhất. Phá Quân Hóa Lộc mới trở nên tốt, ứng với phá rồi mới lập. Phá Quân thủ Mệnh duyên lục thân mỏng nhưng năng lực khai sáng cực mạnh. Phá Quân hợp nhất với cải cách, đổi mới; khi Hóa Lộc tài vận chuyển vượng, một phá một lập, cuối cùng thành tựu sự nghiệp.',
    classical: '古诀：「破军为最能破旧立新之星，坐命者孤克，六亲缘薄，然开创能力超强；化禄后破而后立，可成大业。」南北山人注：「破军守命，一生多波折；化禄者，破财之后方能重建，财运终归好转，主晚年成就。」',
    classicalVi: 'Cổ quyết: «Phá Quân là sao giỏi phá cũ lập mới nhất, người thủ Mệnh cô khắc, duyên lục thân mỏng, nhưng năng lực khai sáng vượt trội; Hóa Lộc thì phá rồi mới lập, có thể thành đại nghiệp.» Nam Bắc Sơn Nhân chú: «Phá Quân thủ Mệnh, một đời nhiều sóng gió; người Hóa Lộc, sau khi phá tài mới xây dựng lại được, tài vận rốt cuộc chuyển tốt, chủ thành tựu tuổi già.»',
    bestPalace: 'Quan Lộc (Hóa Lộc), Thiên Di',
    worstPalace: 'Phu Thê, Phụ Mẫu',
    career: 'Sự nghiệp khai sáng, quân đội cảnh sát, cải cách, quản lý thay đổi; hợp công việc tiên phong không ngừng mở lĩnh vực mới',
    relationship: 'Tình cảm nhiều sóng gió, hợp tan bất định, duyên lục thân mỏng; cần chọn bạn đời độc lập và bao dung',
    wealth: 'Tài vận lên xuống lớn, Hóa Lộc thì chuyển tốt; chỉ giữ thì tài lui, phải không ngừng mở cục diện mới mới tích được của',
    health: 'Thuộc Thủy, chú ý thận, bàng quang, hệ sinh dục. Thể chất thất thường, nên giữ thói quen vận động đều đặn',
  },
};

const levelConfig = {
  major: { label: 'Chính tinh', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  lucky: { label: 'Cát tinh', color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
  sha:   { label: 'Sát tinh', color: 'text-red-400 border-red-500/30 bg-red-500/10' },
  minor: { label: 'Tạp diệu', color: 'text-slate-400 border-slate-500/25 bg-slate-500/10' },
};

const siHuaColors: Record<string, string> = {
  '禄': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  '权': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  '科': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  '忌': 'text-red-400 bg-red-500/10 border-red-500/30',
};

export default function StarDetailPanel({ star, palaceName, onClose }: StarDetailPanelProps) {
  const desc = star ? STAR_DESCRIPTIONS[star.name] : null;
  const detail = star ? STAR_DETAIL[star.name] : null;
  const typeConfig = star ? levelConfig[star.type] : null;

  return (
    <AnimatePresence>
      {star && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="card-glass rounded-xl overflow-hidden"
        >
          {/* 标题栏 */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--t-border)' }}>
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="text-xl font-bold" style={{ color: 'var(--t-gold)' }}>{viStar(star.name)}</span>
              {typeConfig && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${typeConfig.color}`}>
                  {typeConfig.label}
                </span>
              )}
              {star.siHua && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${siHuaColors[star.siHua] || ''}`}>
                  {viSihua(star.siHua)}
                </span>
              )}
            </div>
            <button onClick={onClose} className="transition-colors text-lg leading-none" style={{ color: 'var(--t-faint)' }}>×</button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto max-h-[560px]">
            {/* 基本信息 */}
            {desc && (
              <div className="flex flex-wrap gap-1.5">
                {[
                  `Ngũ hành · ${desc.element}`,
                  `Tính chất · ${desc.nature}`,
                  ...(palaceName ? [`Vị trí · ${viPalaceFull(palaceName)}`] : []),
                  ...(star.brightness ? [star.brightness === 'bright' ? 'Miếu Vượng' : star.brightness === 'dim' ? 'Lạc Hãm' : 'Bình hòa'] : []),
                ].map(tag => (
                  <div key={tag} className="text-[10px] px-2 py-1 rounded-full"
                    style={{
                      border: '1px solid var(--t-border)',
                      color: tag === 'Miếu Vượng' ? '#eab308' : tag === 'Lạc Hãm' ? '#ef4444' : 'var(--t-text2)',
                    }}>
                    {tag}
                  </div>
                ))}
              </div>
            )}

            {/* 关键词 */}
            {desc && (
              <div>
                <div className="text-[10px] tracking-widest mb-1.5" style={{ color: 'var(--t-faint)' }}>Đặc tính tinh diệu</div>
                <div className="flex flex-wrap gap-1.5">
                  {desc.keywords.split('·').map(k => (
                    <span key={k} className="text-[11px] px-2 py-0.5 rounded-full"
                      style={{ color: 'var(--t-gold)', border: '1px solid rgba(212,168,67,0.2)', background: 'rgba(212,168,67,0.06)' }}>
                      {k.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 古书原文 */}
            {detail && (
              <div className="rounded-xl p-3" style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.12)' }}>
                <div className="text-[10px] tracking-widest mb-1.5 flex items-center gap-1" style={{ color: 'var(--t-gold)', opacity: 0.7 }}>
                  Nguyên văn cổ thư
                </div>
                <p lang="zh-Hans" className="text-[11px] leading-relaxed italic" style={{ color: 'var(--t-gold)', opacity: 0.8 }}>{detail.classical}</p>
                <p lang="vi" className="text-[11px] leading-relaxed mt-1.5 pl-2" style={{ color: 'var(--t-text2)', borderLeft: '2px solid rgba(212,168,67,0.3)' }}>{detail.classicalVi}</p>
              </div>
            )}

            {/* 倪海厦解读 */}
            {detail && (
              <>
                <div>
                  <div className="text-[10px] tracking-widest mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--t-faint)' }}>
                    <span className="w-3 h-px inline-block" style={{ background: 'var(--t-border-acc)' }} />
                    Lời giải của thầy Nghê Hải Hạ
                    <span className="w-3 h-px inline-block" style={{ background: 'var(--t-border-acc)' }} />
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--t-text2)' }}>{detail.niHaixia}</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: 'Hướng sự nghiệp', value: detail.career, icon: '◈' },
                    { label: 'Đặc điểm tình cảm', value: detail.relationship, icon: '♡' },
                    { label: 'Phân tích tài vận', value: detail.wealth, icon: '◆' },
                    { label: 'Lưu ý sức khỏe', value: detail.health, icon: '☯' },
                  ].map(item => (
                    <div key={item.label} className="card-inner rounded-lg p-3">
                      <div className="text-[10px] mb-1 flex items-center gap-1" style={{ color: 'var(--t-faint)' }}>
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-[10px] p-2.5 rounded-lg" style={{ border: '1px solid rgba(74,222,128,0.15)', background: 'rgba(74,222,128,0.05)' }}>
                    <div className="text-emerald-500 mb-0.5 font-medium">Cung tốt nhất</div>
                    <div className="text-emerald-500/70">{detail.bestPalace}</div>
                  </div>
                  <div className="text-[10px] p-2.5 rounded-lg" style={{ border: '1px solid rgba(248,113,113,0.15)', background: 'rgba(248,113,113,0.05)' }}>
                    <div className="text-red-500 mb-0.5 font-medium">Cung cần lưu ý</div>
                    <div className="text-red-500/70">{detail.worstPalace}</div>
                  </div>
                </div>
              </>
            )}

            {/* 辅星/煞星说明 */}
            {!detail && star.type !== 'major' && (
              <div className="text-xs leading-relaxed" style={{ color: 'var(--t-text2)' }}>
                {star.type === 'lucky' && (
                  <>
                    {star.name === '文昌' && 'Văn Xương nhập cung, chủ học hành thi cử thuận lợi, giấy tờ ấn tín có lợi, hợp công việc liên quan đến chữ nghĩa. Cổ quyết: «Văn Xương khoa giáp, chủ văn chương hiển đạt, gặp thi ắt đỗ.»'}
                    {star.name === '文曲' && 'Văn Khúc nhập cung, chủ tài nghệ xuất chúng, ăn nói giỏi, giỏi diễn đạt, thiên phú nghệ thuật mạnh. Cổ quyết: «Văn Khúc là sao tài nghệ, văn võ song toàn, khẩu tài hơn người.»'}
                    {star.name === '左辅' && 'Tả Phù nhập cung, chủ có quý nhân giúp đỡ, có người nâng đỡ, việc của cung này được ủng hộ thiện ý. Cổ quyết: «Tả Phù là sao trợ lực, thủ Mệnh thì nhiều quý nhân, gặp hung hóa cát.»'}
                    {star.name === '右弼' && 'Hữu Bật nhập cung, chủ có quý nhân giúp đỡ, phần nhiều là quý nhân nữ, việc của cung này có người hỗ trợ. Cổ quyết: «Hữu Bật là sao âm trợ, nhiều quý nhân nữ, hóa hiểm thành an.»'}
                    {star.name === '天魁' && 'Thiên Khôi nhập cung, chủ quý nhân của người sinh ban ngày, nhiều quý nhân nam, có sức gặp hung hóa cát. Cổ quyết: «Thiên Khôi là Thiên Ất quý nhân, gặp ắt có quý nhân phù trì.»'}
                    {star.name === '天钺' && 'Thiên Việt nhập cung, chủ quý nhân của người sinh ban đêm, nhiều quý nhân nữ, tăng thêm khí cát tường. Cổ quyết: «Thiên Việt là Ngọc Đường quý nhân, chủ âm trợ, nhiều quý nhân nữ.»'}
                    {star.name === '禄存' && 'Lộc Tồn nhập cung, chủ tài lộc giữ thành quả, cung này có tài khí nhưng thuộc kiểu tài vận bảo thủ. Cổ quyết: «Lộc Tồn là sao tài lộc, chủ giữ của có thừa, vào tiền vững chắc.»'}
                    {star.name === '天马' && 'Thiên Mã nhập cung, chủ bôn ba biến động, cầu tài trong động, nên chủ động ra tay, không nên ôm cây đợi thỏ. Cổ quyết: «Thiên Mã chủ động, gặp Lộc thì tài lộc song toàn, sinh tài trong động.»'}
                  </>
                )}
                {star.type === 'sha' && (
                  <>
                    {star.name === '地空' && 'Địa Không nhập cung, chủ việc của cung này có cảm giác hụt hẫng, tinh thần hao tán, nên chú ý sức khỏe tâm lý. Cổ quyết: «Địa Không chủ hư hao, nhập cung Mệnh thì tinh thần nhiều mơ hồ, phải phòng mộng tưởng viển vông.»'}
                    {star.name === '地劫' && 'Địa Kiếp nhập cung, chủ việc của cung này có tổn thất bất ngờ, tiền của cần thận trọng, đề phòng tiểu nhân. Cổ quyết: «Địa Kiếp chủ kiếp tài, nhập cung Mệnh thì tài vận bị tổn, phòng mất mát bất ngờ.»'}
                    {star.name === '火星' && 'Hỏa Tinh nhập cung, chủ việc của cung này nóng vội bốc đồng, cảm xúc dao động, nhưng gặp Tham Lang thì trái lại thành cát. Cổ quyết: «Hỏa Tinh chủ nóng nảy, nhưng gặp Tham Lang đồng cung lại thành cách Hỏa Tham, chủ bạo phát.»'}
                    {star.name === '铃星' && 'Linh Tinh nhập cung, chủ việc của cung này có trở ngại ngầm, phòng tiểu nhân sau lưng, mọi việc nên kín đáo. Cổ quyết: «Linh Tinh chủ ám sát, nhập Mệnh thì nhiều kẻ thù ngầm, phải phòng thị phi sau lưng.»'}
                    {star.name === '擎羊' && 'Kình Dương nhập cung, chủ hình khắc, việc của cung này nhiều trắc trở, có tai huyết quang hoặc tai nạn. Cổ quyết: «Kình Dương là sao hình khắc, nhập cung Mệnh thì nhiều hình khắc, phải phòng tai nạn huyết quang.»'}
                    {star.name === '陀罗' && 'Đà La nhập cung, chủ thị phi đeo bám, việc của cung này dây dưa không dứt, mọi việc nên chuẩn bị sớm. Cổ quyết: «Đà La chủ thị phi trì trệ, nhập cung Mệnh thì làm việc chậm chạp, phải phòng dây dưa không rõ ràng.»'}
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

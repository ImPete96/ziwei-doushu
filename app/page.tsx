'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useTheme, type Theme } from '@/components/ThemeProvider';

// ─── 滚动入场 wrapper ────────────────────────────────────
function FadeIn({
  children, delay = 0, y = 28, className = '',
}: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function WeakBoundary({ line }: { line: string }) {
  // 之前的版本有 1px 实线 + 12px 渐变阴影，主题切换时形成清晰横线很硬。
  // 改为更柔和的 24px 渐变 + 低 opacity，section 衔接更自然。
  return (
    <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
      style={{ background: `linear-gradient(to bottom, ${line}, transparent)`, opacity: 0.45 }} />
  );
}

// ─── 主星数据 ────────────────────────────────────────────
const STARS = [
  { name: 'Tử Vi' }, { name: 'Thiên Cơ' }, { name: 'Thái Dương' }, { name: 'Vũ Khúc' },
  { name: 'Thiên Đồng' }, { name: 'Liêm Trinh' }, { name: 'Thiên Phủ' }, { name: 'Thái Âm' },
  { name: 'Tham Lang' }, { name: 'Cự Môn' }, { name: 'Thiên Tướng' }, { name: 'Thiên Lương' },
  { name: 'Thất Sát' }, { name: 'Phá Quân' },
];

// ─── 功能模块 ────────────────────────────────────────────
const FEATURES = [
  {
    tag: 'Hệ thống lập lá số',
    title: 'Tử Vi Đẩu Số\nchính tông Nghê Hải Hạ',
    subtitle: 'Không phải bản giản lược, tuân thủ nghiêm ngặt truyền thừa của thầy Nghê Hải Hạ',
    points: [
      'Lập lá số theo Ngũ hành cục nạp âm, không dùng thuật toán giản lược trên mạng',
      'Cung Mệnh đếm nghịch theo giờ sinh, Thân cung đếm thuận theo giờ sinh, bám sát quy tắc giảng dạy',
      'Mười bốn chính tinh và Tứ Hóa phi tinh suy diễn theo phép gốc, cấu trúc đầy đủ, có thể kiểm chứng',
    ],
  },
  {
    tag: 'Trình bày lá số',
    title: 'Đủ mười bốn chính tinh\nTứ Hóa phi tinh',
    subtitle: 'Cấu trúc rõ ràng, nhìn một lần là thấy trục chính và trọng điểm',
    points: [
      'Mười bốn chính tinh an đủ vào cung, quan hệ giữa các chính tinh rõ ràng, dễ đọc',
      'Phụ tinh và sát tinh hiển thị cùng màn hình, không bỏ sót thông tin then chốt',
      'Phân cấp độ sáng Miếu, Vượng, Lợi, Hãm để nhận ra mạnh yếu ngay',
      'Bấm vào bất kỳ chính tinh nào để xem lời giải chi tiết của thầy Nghê Hải Hạ về sao đó',
    ],
  },
  {
    tag: 'Luận giải AI',
    title: 'Luận lá số chuyên sâu\nkhông chỉ để tính',
    subtitle: 'Kho tri thức hệ Nghê Hải Hạ × Claude AI',
    points: [
      'Phân tích mệnh cách: xuất phát từ chính tinh cung Mệnh, kết hợp Tam phương tứ chính, đưa ra nhận định toàn diện về tính cách và cách cục đời người',
      'Luận giải sáu phương diện: hướng sự nghiệp, tình cảm hôn nhân, cách kiếm tiền, sức khỏe, quan hệ gia đình, duyên con cái',
      'Theo dõi Đại hạn, Lưu niên: trọng điểm Đại hạn 10 năm hiện tại, gợi ý cụ thể và lời khuyên hành động theo cung Lưu niên năm nay',
      'Hỏi thêm tự do: hỏi thẳng về lá số của bạn, như «Năm nay có nên đổi việc không», «Khi nào vận cưới hỏi tốt nhất»',
    ],
  },
  {
    tag: 'Nhận diện cách cục',
    title: 'Tự động phát hiện\ncách cục lá số',
    subtitle: 'Từ tổ hợp tinh diệu tìm ra điều đã định trong mệnh bạn',
    points: [
      'Tự động nhận diện 11 cách cục kinh điển: Tử Phủ đồng cung, Sát Phá Tham, Cơ Nguyệt Đồng Lương, Liêm Tướng, Vũ Khúc Thất Sát…',
      'Phát hiện chính xác các cách đặc biệt như Phụ Bật giáp Mệnh, Nhật Nguyệt giáp Mệnh, kèm lời giải chuẩn theo hệ Nghê Hải Hạ',
      'Tự động đánh dấu trường hợp Tứ Hóa nhập cung Mệnh, cung Thiên Di, nhắc những chủ đề đời người cần lưu tâm',
      'Cách cục được xếp theo mức cát hung, giúp bạn thấy ngay ưu thế và thử thách trong lá số',
    ],
  },
];

// ─── 倪海厦核心教义 ──────────────────────────────────────
const NI_TEACHINGS = [
  {
    title: 'Lấy cung Mệnh làm gốc, Tam phương làm dụng',
    body: 'Nghê sư luôn nhấn mạnh: xem mệnh trước hết phải xem cung Mệnh. Chính tinh cung Mệnh quyết định cách cục cơ bản và tính cách bẩm sinh của một người, còn Tam phương (Tài Bạch, Quan Lộc, Thiên Di) quyết định «đất dụng võ» của người đó. Bốn cung liên động mới là bức tranh đời người trọn vẹn.',
  },
  {
    title: 'Mượn sao cung đối, không thể xem nhẹ',
    body: 'Chỗ độc đáo của Nghê sư là coi trọng «cung đối». Cung nào vô chính diệu thì phải mượn tinh diệu cung đối để luận; đối diện cung Mệnh là cung Thiên Di, hai cung ảnh hưởng lẫn nhau — đây là điểm then chốt mà nhiều người mới học hay bỏ qua.',
  },
  {
    title: 'Tứ Hóa mới là bàn tay của vận mệnh',
    body: 'Tinh diệu chỉ là nền tảng, Tứ Hóa (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ) mới là then chốt quyết định vận tốt xấu. Cùng một ngôi sao, có Hóa Lộc hay có Hóa Kỵ thì quỹ đạo đời người có thể khác hẳn. Nghê sư nhắc đi nhắc lại: không xem Tứ Hóa thì lá số mới giải được một nửa.',
  },
  {
    title: 'Đại hạn mười năm, vận thế có nhịp',
    body: 'Nghê sư chia đời người thành 12 Đại hạn, mỗi Đại hạn 10 năm. Ông cho rằng ở những cung Đại hạn khác nhau, cơ duyên của con người hoàn toàn khác nhau. Biết mình đang đi Đại hạn nào, cung đó có những sao gì, mới thật sự nắm được vận thế hiện tại.',
  },
];

// ─── 主题色彩 helper ─────────────────────────────────────
// Màu trang chủ lấy từ token CSS (globals.css) nên tự đổi theo giao diện giấy / đêm;
// tham số theme giữ lại để không phải sửa các chỗ gọi.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useColors(theme: Theme) {
  const ink = 'var(--t-text)';
  const seal = 'var(--t-gold)';
  const line = 'var(--t-border)';
  const card = 'var(--t-card)';
  return {
    bgBase: 'var(--t-bg)',
    navBg: 'var(--t-bg)',
    navBorder: line,
    // giữ dạng gradient vì tiêu đề dùng background-clip: text
    goldGrad: `linear-gradient(${ink}, ${ink})`,
    goldSolid: seal,
    goldLine: 'var(--t-border-acc)',
    tagText: 'var(--t-text2)',
    textPrimary: ink,
    textSecond: 'var(--t-text2)',
    textMuted: 'var(--t-faint)',
    textFaint: 'var(--t-faint)',
    accent: 'var(--t-star)',
    accentSoft: 'var(--t-surface)',
    cardBg: card,
    cardBorder: line,
    cardShadow: 'none',
    featureBg: card,
    featureBord: line,
    glowTint: 'transparent',
    glowBlue: 'transparent',
    glowPurple: 'transparent',
    niBg: card,
    niBorder: line,
    niDivider: line,
    niCardBg: card,
    niCardBord: line,
    niCardShadow: 'none',
    starBg: card,
    starBorder: line,
    starText: 'var(--t-text2)',
    ctaBg: seal,
    ctaText: 'var(--t-bg)',
    footerText: 'var(--t-faint)',
    scrollLine: line,
    scrollText: 'var(--t-faint)',
    altSection: 'var(--t-surface)',
    quoteBg: card,
  };
}

// ─── 四化简介数据 ─────────────────────────────────────────
const SIHUA_BRIEF: Record<string, { attr: string; brief: string }> = {
  'Hóa Lộc': { attr: 'Cát hóa · Gia tăng', brief: 'Phúc tinh đến cung, chủ tài vận và phúc khí tăng thêm. Việc của cung đó thuận lợi, năng lực được tăng cường; là hóa tinh được ưa chuộng nhất trong lá số.' },
  'Hóa Quyền': { attr: 'Cát hóa · Quyền uy', brief: 'Sao quyền lực đến cung, chủ khả năng nắm quyền và lãnh đạo. Cung đó chủ mạnh mẽ, quyết đoán; ưa nhập cung Quan Lộc và cung Mệnh, chủ thực quyền trong sự nghiệp.' },
  'Hóa Khoa': { attr: 'Cát hóa · Danh dự', brief: 'Sao khoa danh đến cung, chủ danh tiếng và duyên quý nhân. Cung đó chủ văn danh và vận thi cử, có quý nhân nâng đỡ; hợp học thuật, thi cử và nơi công chúng.' },
  'Hóa Kỵ': { attr: 'Hung hóa · Trở ngại', brief: 'Sao kiếp số đến cung, chủ chấp niệm và trở ngại. Cung đó cần đặc biệt lưu ý; bài học đời người của cung ấy sẽ là thử thách quan trọng.' },
};

// ─── 主星简介数据 ─────────────────────────────────────────
const STAR_BRIEF: Record<string, { attr: string; brief: string }> = {
  'Tử Vi': { attr: 'Thổ · Đế tinh', brief: 'Thiên hoàng quý tinh, thống ngự các sao. Người Tử Vi thủ Mệnh có khí chất cô ngạo, chủ quyền uy hiển đạt, bẩm sinh có khí chất lãnh đạo, hợp vị trí lãnh đạo tự đứng một mình một cõi.' },
  'Thiên Cơ': { attr: 'Mộc · Trí tuệ tinh', brief: 'Ích thọ tinh, chủ mưu trí và biến động. Thông minh lanh lợi, giỏi trù tính, tâm tư tinh tế; hợp làm hoạch định, cố vấn, kỹ thuật.' },
  'Thái Dương': { attr: 'Hỏa · Chủ Quan Lộc', brief: 'Chủ tinh Quan Lộc, chủ danh dự và danh vọng. Hào phóng rộng lượng, coi trọng hình ảnh trước công chúng; lợi quan trường và công chức, mạnh ở mệnh nam, nhập Miếu thì quang minh lỗi lạc.' },
  'Vũ Khúc': { attr: 'Kim · Chủ Tài Bạch', brief: 'Chủ tinh Tài Bạch, chủ tài chính và quyết đoán. Ý chí kiên định, hành động quả cảm; hợp tài chính, ngân hàng, quân đội cảnh sát. Là sao cô khắc, lợi kết hôn muộn.' },
  'Thiên Đồng': { attr: 'Thủy · Phúc tinh', brief: 'Chủ tinh Phúc Đức, chủ hưởng thụ và nhân duyên. Tính tình ôn hòa, nhân duyên rất tốt, chú trọng chất lượng cuộc sống, tình cảm tinh tế, vận tuổi già tốt.' },
  'Liêm Trinh': { attr: 'Hỏa · Tài nghệ tinh', brief: 'Thứ đào hoa tinh, chủ tài nghệ và tình dục. Tài hoa xuất chúng, tình cảm phong phú; hợp nghệ thuật, chính trường, đa tài đa nghệ nhưng cần phòng thị phi đào hoa.' },
  'Thiên Phủ': { attr: 'Thổ · Tài khố tinh', brief: 'Chủ tinh Nam Đẩu, chủ kho tiền và tích lũy. Vững vàng thận trọng, giỏi quản lý tiền bạc; là lực lượng ổn định của lá số, hợp quản lý tài chính và hành chính.' },
  'Thái Âm': { attr: 'Thủy · Chủ Điền Trạch', brief: 'Chủ tinh Điền Trạch, chủ của cải và sự nhu hòa. Tinh tế dịu dàng, cảm nhận nhạy bén, mệnh nữ càng tốt; lợi bất động sản và tích lũy, hợp văn nghệ hoặc ngành dịch vụ.' },
  'Tham Lang': { attr: 'Mộc Thủy · Đào hoa', brief: 'Đào hoa tinh, chủ dục vọng và tài nghệ. Đa tài đa nghệ, ham muốn mạnh, giao tiếp năng động; hợp nghệ thuật, quan hệ công chúng, kinh doanh, nhân duyên rất tốt.' },
  'Cự Môn': { attr: 'Thủy · Thị phi tinh', brief: 'Ám tinh, chủ khẩu tài và thị phi. Ăn nói xuất chúng, tư duy biện luận mạnh; hợp luật sư, giáo dục, truyền thông, cần đề phòng thị phi miệng lưỡi, lập thân bằng tài biện luận.' },
  'Thiên Tướng': { attr: 'Thủy · Ấn tinh', brief: 'Ấn tinh, chủ phò tá và ấn thụ. Giỏi điều phối, coi trọng lễ nghi, chính trực giữ phép; hợp làm tham mưu, hành chính, pháp luật, vận quý nhân tốt.' },
  'Thiên Lương': { attr: 'Thổ · Ấm tinh', brief: 'Ấm tinh, chủ già dặn và che chở. Chính trực vững vàng, lòng từ bi lớn, được trời phù hộ; hợp y tế, công tác xã hội, tôn giáo.' },
  'Thất Sát': { attr: 'Kim Hỏa · Tướng tinh', brief: 'Tướng tinh, chủ cương liệt và khai sáng. Tính cách cương nghị, hành động mạnh, dám thử thách; hợp khởi nghiệp, quân đội cảnh sát, ngành cạnh tranh, gặp hung hóa cát.' },
  'Phá Quân': { attr: 'Thủy · Hao tinh', brief: 'Hao tinh, chủ biến động và khai phá. Dám đột phá, không ngại thay đổi, cả đời nhiều biến động nhưng có khí phách; hợp công việc tiên phong, đi con đường người khác chưa đi.' },
};

// ─── 功能视觉装饰 ────────────────────────────────────────
function FeatureVisual({ index, colors: c }: { index: number; colors: ReturnType<typeof useColors> }) {
  if (index === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5">
        <div className="grid grid-cols-4 gap-1.5 w-72 mx-auto">
          {Array.from({ length: 16 }).map((_, i) => {
            const isCenter = [5, 6, 9, 10].includes(i);
            const isActive = [0, 3, 12, 15].includes(i);
            return (
              <motion.div key={i}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="h-14 rounded-sm flex items-center justify-center text-xs transition-all duration-300"
                style={{
                  border: `1px solid ${isActive ? c.goldLine : c.cardBorder}`,
                  background: isCenter ? 'transparent' : isActive ? c.starBg : c.featureBg,
                  color: isActive ? c.goldSolid : c.textFaint,
                  opacity: isCenter ? 0 : 1,
                }}>
                {isActive ? '★' : ''}
              </motion.div>
            );
          })}
        </div>
        <p className="text-[10px] tracking-widest transition-colors duration-300"
          style={{ color: c.textFaint }}>Phép lập lá số Nghê Hải Hạ</p>
      </div>
    );
  }

  if (index === 1) {
    const [sel, setSel] = useState<string | null>(null);
    const selInfo = sel ? (STAR_BRIEF[sel] ?? SIHUA_BRIEF[sel] ?? null) : null;
    return (
      <div className="flex flex-col gap-4 h-full justify-center">
        {[
          { group: 'Chòm Tử Vi', stars: ['Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Liêm Trinh'] },
          { group: 'Chòm Thiên Phủ', stars: ['Thiên Phủ', 'Thái Âm', 'Tham Lang', 'Cự Môn', 'Thiên Tướng', 'Thiên Lương', 'Thất Sát', 'Phá Quân'] },
        ].map(group => (
          <div key={group.group}>
            <div className="text-[11px] tracking-widest mb-2 transition-colors duration-300"
              style={{ color: c.textFaint }}>{group.group}</div>
            <div className="flex flex-wrap gap-1.5">
              {group.stars.map(s => (
                <motion.button key={s}
                  onClick={() => setSel(sel === s ? null : s)}
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="text-xs px-2 py-1 rounded-md cursor-pointer"
                  style={{
                    border: `1px solid ${sel === s ? c.goldSolid : c.goldLine}`,
                    color: c.goldSolid,
                    background: sel === s ? `${c.goldLine}30` : 'transparent',
                    fontWeight: sel === s ? 600 : 400,
                  }}>
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
        <div>
          <div className="text-[11px] tracking-widest mb-2 transition-colors duration-300"
            style={{ color: c.textFaint }}>Tứ Hóa phi tinh</div>
          <div className="flex gap-2 flex-wrap">
            {[['Hóa Lộc', 'var(--t-lu)'], ['Hóa Quyền', 'var(--t-quan)'], ['Hóa Khoa', 'var(--t-ke)'], ['Hóa Kỵ', 'var(--t-ji)']].map(([label, color]) => (
              <motion.button key={label}
                onClick={() => setSel(sel === label ? null : label)}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="text-xs px-2.5 py-1 rounded-md cursor-pointer"
                style={{
                  border: `1px solid ${color}`,
                  color,
                  background: sel === label ? `${color.replace('0.7', '0.15')}` : 'transparent',
                  fontWeight: sel === label ? 600 : 400,
                }}>
                {label}
              </motion.button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {selInfo && (
            <motion.div key={sel}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl p-4 mt-1.5"
              style={{ border: `1px solid ${c.goldLine}`, background: c.featureBg }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-semibold" style={{ color: c.goldSolid }}>{sel}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ color: c.tagText, border: `1px solid ${c.goldLine}` }}>{selInfo.attr}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: c.textSecond }}>{selInfo.brief}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (index === 2) {
    const msgs = [
      { role: 'user', text: 'Vận sự nghiệp năm nay của tôi thế nào?' },
      { role: 'ai', text: 'Cung Mệnh có Thiên Cơ Hóa Lộc, Đại hạn năm nay đi cung Quan Lộc, Tam phương có Tả Phù trợ giúp, sự nghiệp có quý nhân nâng đỡ, nên chủ động mở rộng…' },
      { role: 'user', text: 'Khi nào vận tình cảm tốt nhất?' },
    ];
    return (
      <div className="flex flex-col gap-2 h-full justify-center">
        {msgs.map((m, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%] text-[11px] px-3 py-2 rounded-lg leading-relaxed"
              style={{
                border: `1px solid ${m.role === 'user' ? c.goldLine : c.cardBorder}`,
                background: m.role === 'user' ? c.starBg : c.featureBg,
                color: m.role === 'user' ? c.goldSolid : c.textSecond,
              }}>
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (index === 3) {
    const patterns = [
      { name: 'Cách Sát Phá Tham', desc: 'Mệnh khai sáng, tiến thủ', ok: true },
      { name: 'Cách Liêm Tướng',   desc: 'Cách hành chính, ấn thụ', ok: true },
      { name: 'Hóa Kỵ nhập Mệnh', desc: 'Cần lưu tâm chủ đề tâm lý', ok: false },
    ];
    return (
      <div className="flex flex-col gap-3 h-full justify-center">
        {patterns.map((p, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
            style={{
              border: `1px solid ${p.ok ? 'color-mix(in srgb, var(--t-sel) 25%, transparent)' : 'color-mix(in srgb, var(--t-sha) 30%, transparent)'}`,
              background: p.ok ? 'color-mix(in srgb, var(--t-sel) 5%, transparent)' : 'color-mix(in srgb, var(--t-sha) 5%, transparent)',
            }}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: p.ok ? 'var(--t-sel)' : 'var(--t-sha)' }} />
            <div>
              <div className="text-[11px] font-medium"
                style={{ color: p.ok ? 'var(--t-lucky)' : 'var(--t-sha)' }}>{p.name}</div>
              <div className="text-[10px]" style={{ color: c.textMuted }}>{p.desc}</div>
            </div>
          </motion.div>
        ))}
        <div className="text-[9px] mt-2 tracking-wider text-center" style={{ color: c.textFaint }}>
          Tự động nhận diện 11 cách cục kinh điển
        </div>
      </div>
    );
  }

  return null;
}

// ─── 主页 ─────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = useColors(theme);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });

  // 把 body / html 背景同步到 home 主题色，消除半透明 nav 透出 #fafaf9 的色差
  // useLayoutEffect 保证在浏览器绘制前同步更新，避免与根 div 的 transition 不同步
  useLayoutEffect(() => {
    document.documentElement.style.background = c.bgBase;
    document.body.style.background = c.bgBase;
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, [c.bgBase]);

  return (
    <div style={{ background: c.bgBase, transition: 'background 0.35s ease' }} className="overflow-x-hidden">
      {/* 致用户公告——首次访问全屏覆盖，关闭后才进入首页 */}



      {/* ══ HERO ══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[82svh] lg:min-h-[92vh] flex flex-col items-center justify-center px-6 z-10 pb-24 pt-10">
        <div style={{ maxWidth: '960px' }} className="text-center w-full mx-auto mt-10">
          {/* Một lần hiện duy nhất khi tải trang; không nhãn trang trí, không chữ gradient */}
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}>
            <h1 className="font-bold leading-none mb-6" style={{ fontSize: 'clamp(48px, 9vw, 116px)', color: c.textPrimary }}>
              Lá Số Tử Vi
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10" style={{ color: c.textSecond }}>
              Lập lá số Tử Vi Đẩu Số theo hệ Nghê Hải Hạ từ ngày giờ và nơi sinh của bạn,
              rồi đọc luận giải từng cung, từng đại hạn bằng AI.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="flex flex-col items-center gap-4">
            <motion.button
              whileHover={{ y: -2, filter: 'brightness(1.06)' }} whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/chart')}
              className="px-10 py-3.5 font-semibold text-base rounded-md"
              style={{ background: c.ctaBg, color: c.ctaText }}>
              Lập lá số ngay
            </motion.button>
          </motion.div>

          {/* 十四主星 */}
          <motion.div initial={false} animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.8 }}
            className="mt-12 grid grid-cols-4 sm:grid-cols-7 gap-1.5 max-w-[720px] mx-auto">
            {STARS.map((star, i) => (
              <motion.div key={star.name}
                initial={false} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.05 + i * 0.03, duration: 0.35 }}
                className="flex items-center justify-center px-2 py-1 rounded-full whitespace-nowrap"
                style={{ background: c.starBg, border: `1px solid ${c.starBorder}` }}>
                <span className="text-[11px] tracking-wide" style={{ color: c.starText }}>{star.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </section>

      {/* ══ 哲学引言 ══════════════════════════════════════ */}
      <section className="relative z-10 overflow-hidden min-h-[82svh] lg:min-h-[92vh] flex items-center" style={{ padding: '72px 24px' }}>
        <WeakBoundary line={c.navBorder} />
        {/* Dải chàm đêm cho câu dẫn: cùng một màu ở cả hai giao diện */}
        <div className="absolute inset-0" style={{ background: '#1B2340' }} />
        <FadeIn className="relative mx-auto text-center w-full" y={20}>
          <div className="space-y-3" style={{ maxWidth: '840px', margin: '0 auto' }}>
            {[
              { text: 'Ý nghĩa của việc nhìn trước vận mệnh', size: 'clamp(17px, 2.2vw, 28px)', color: '#C3C9DC', delay: 0.1 },
              { text: 'không nằm ở việc biết trước tương lai', size: 'clamp(19px, 2.6vw, 32px)', color: '#D5DAE8', delay: 0.25 },
              { text: 'mà ở việc không ngừng hiểu chính mình', size: 'clamp(21px, 3vw, 40px)', color: '#E2E6F0', delay: 0.34 },
            ].map((line, i) => (
              <motion.p key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: line.delay }}
                style={{ fontSize: line.size, color: line.color, fontWeight: 400 }}>
                {line.text}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="font-display font-bold"
              style={{ fontSize: 'clamp(22px, 3.4vw, 48px)', lineHeight: 1.35, color: '#F2A08F' }}>
              để rồi tự viết nên kịch bản cuộc đời mình
            </motion.p>
          </div>
        </FadeIn>
      </section>

      {/* ══ 功能详解 ══════════════════════════════════════ */}
      <section className="relative z-10">
        {FEATURES.map((feature, i) => (
          <div key={i}
            className={`flex items-center px-6 md:px-10 lg:px-14 py-20 md:py-24 ${i <= 2 ? 'min-h-[82svh] lg:min-h-[92vh]' : ''}`}
            style={{ background: i % 2 === 1 ? c.altSection : 'transparent' }}>
            <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
              <div className={`grid grid-cols-1 ${i % 2 === 0 ? 'lg:grid-cols-[0.45fr_0.55fr]' : 'lg:grid-cols-[0.55fr_0.45fr]'} gap-10 lg:gap-16 items-start ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                {/* 文字区 */}
                <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <FadeIn delay={0}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px w-8" style={{ background: c.goldLine }} />
                    </div>
                  </FadeIn>
                  <FadeIn delay={0.1}>
                    <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold leading-tight mb-5 tracking-tight`}
                      style={{
                        fontSize: i < 2 ? 'clamp(36px, 4vw, 56px)' : 'clamp(30px, 3.5vw, 48px)',
                        whiteSpace: 'pre-line',
                      }}>
                      {feature.title}
                    </h2>
                  </FadeIn>
                  <FadeIn delay={0.2}>
                    <p className="text-base mb-8 leading-relaxed" style={{ color: c.textSecond }}>{feature.subtitle}</p>
                  </FadeIn>
                  <div className="space-y-4">
                    {feature.points.map((point, j) => (
                      <FadeIn key={j} delay={0.25 + j * 0.08}>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-2 w-1 h-1 rounded-full" style={{ background: c.goldSolid, opacity: 0.6 }} />
                          <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>{point}</p>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
                {/* 视觉装饰区 */}
                <div className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <FadeIn delay={0.15}>
                    <div className="relative rounded-2xl overflow-hidden p-8 md:p-12"
                      style={{
                        border: `1px solid ${c.featureBord}`,
                        background: c.featureBg,
                        minHeight: i <= 1 ? '540px' : i === 2 ? '460px' : '320px',
                        boxShadow: c.cardShadow,
                      }}>
                      <FeatureVisual index={i} colors={c} />
                    </div>
                  </FadeIn>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ══ 天·地·人 三分理论 ════════════════════════════ */}
      <section className="relative z-10 flex items-center px-6 md:px-10 lg:px-14 py-20"
        style={{ background: c.altSection, minHeight: '82svh' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
          <FadeIn>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-6">
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-5 tracking-tight`}
                style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                Thiên · Địa · Nhân
              </h2>
              <p className="max-w-2xl mx-auto text-sm leading-relaxed" style={{ color: c.textSecond }}>
                Quan niệm cốt lõi về vận mệnh của thầy Nghê Hải Hạ: vận mệnh chưa bao giờ là toàn bộ cuộc đời.<br />
                Ông chia các lực ảnh hưởng đến đời người thành ba phương diện quan trọng ngang nhau.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {[
              { glyph: 'Thiên', label: 'Vận mệnh tiên thiên', pct: '⅓', color: c.goldSolid, borderColor: c.goldLine, desc: 'Điều Tử Vi Đẩu Số hé lộ là cách cục lá số tiên thiên của một người — sự bố trí tinh diệu, Ngũ hành cục, chính tinh cung Mệnh do thời điểm sinh quyết định. Đó chỉ là một phần ba vận mệnh, là nền của đời người chứ không phải toàn cảnh.', sub: 'Lá số · Tinh diệu · Ngũ hành' },
              { glyph: 'Địa', label: 'Môi trường địa lý', pct: '⅓', color: 'var(--t-star)', borderColor: c.cardBorder, desc: 'Môi trường địa lý, thành phố, quốc gia, phong thủy nơi bạn sống, cho đến gia cảnh và cấu trúc xã hội, cùng tạo nên phương diện thứ hai của vận mệnh. Cùng một lá số, sinh ở nơi khác nhau, cơ duyên có thể khác nhau một trời một vực.', sub: 'Vùng đất · Phong thủy · Môi trường' },
              { glyph: 'Nhân', label: 'Lòng người, ý niệm', pct: '⅓', color: 'var(--t-lucky)', borderColor: c.cardBorder, desc: 'Ý chí, tâm thái, lựa chọn và hành động của mỗi người mới là sức mạnh chủ động nhất để thay đổi vận mệnh. Nghê sư nhấn mạnh: hiểu lá số là để sống tốt hơn, chứ không phải ngồi chờ số phận an bài. Tự tinh tấn là cách phá cục mạnh nhất.', sub: 'Ý chí · Lựa chọn · Hành động' },
            ].map((item, i) => (
              <FadeIn key={item.glyph} delay={0.1 + i * 0.12}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.1 }}
                  className="rounded-2xl p-7 h-full flex flex-col"
                  style={{ background: c.cardBg, border: `1px solid ${item.borderColor}`, boxShadow: c.cardShadow }}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="text-4xl font-bold leading-none" style={{ color: item.color }}>{item.glyph}</div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: item.color }}>{item.pct}</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-0.5" style={{ color: item.color }}>{item.label}</div>
                    <div className="text-[10px] tracking-wider" style={{ color: c.textMuted }}>{item.sub}</div>
                  </div>
                  <div className="h-px mb-4" style={{ background: item.borderColor }} />
                  <p className="text-xs leading-relaxed flex-1" style={{ color: c.textSecond }}>{item.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <div className="mt-10 text-center">
              <p className="text-sm leading-relaxed" style={{ color: c.textSecond }}>
                <span lang="zh-Hans">「命运不是人生的全部，加上地理位置和人念，才是。」</span>
              </p>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: c.textMuted }}>
                «Vận mệnh không phải là toàn bộ cuộc đời; cộng thêm vị trí địa lý và ý niệm con người, mới là toàn bộ.»
              </p>
              <p className="mt-2 text-[10px] tracking-widest" style={{ color: c.tagText }}>— Nghê Hải Hạ</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ 倪海厦介绍 ════════════════════════════════════ */}
      <section className="relative z-10 flex items-center px-6 md:px-10 lg:px-14 py-20" style={{ minHeight: '82svh' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
          <FadeIn>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-6">
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-6 tracking-tight`}
                style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                Thầy Nghê Hải Hạ
              </h2>
              <p className="max-w-2xl mx-auto leading-relaxed text-sm" style={{ color: c.textSecond }}>
                Một trong những bậc thầy Đông y và thuật số có ảnh hưởng nhất giới người Hoa đương đại<br />
                Người sáng lập Học viện Đông y Hán Đường tại Mỹ · Để lại hai hệ thống giảng dạy «Nhân Kỷ» và «Thiên Kỷ»
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl p-8 md:p-10 mb-8"
              style={{ border: `1px solid ${c.niBorder}`, background: c.niBg, boxShadow: c.cardShadow }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Sinh năm', value: '1954', sub: 'Đài Loan' },
                  { label: 'Mất năm', value: '2012', sub: 'Ngày 31/1 · Hưởng thọ 58' },
                  { label: 'Truyền thừa', value: 'Tử Vi Đẩu Số', sub: 'Đông y Kinh phương · Kinh Dịch' },
                ].map(item => (
                  <div key={item.label} className="text-center rounded-xl px-4 py-3"
                    style={{ border: `1px solid ${c.niDivider}`, background: 'var(--t-card)' }}>
                    <div className="text-[13px] mb-1" style={{ color: c.textFaint }}>{item.label}</div>
                    <div className="text-2xl font-semibold mb-0.5" style={{ color: c.goldSolid }}>{item.value}</div>
                    <div className="text-[11px]" style={{ color: c.textMuted }}>{item.sub}</div>
                  </div>
                ))}
              </div>
              <div className="h-px mb-8" style={{ background: c.niDivider }} />
              <div className="space-y-4 text-sm leading-relaxed max-w-3xl mx-auto" style={{ color: c.textSecond }}>
                <p>
                  <strong style={{ color: c.goldSolid }}>Tiểu sử</strong>:{' '}
                  Ông Nghê Hải Hạ (1954–2012) sinh tại Đài Loan, thuở trẻ theo học nhiều danh y Đông y, chuyên nghiên cứu phái Kinh phương (truyền thừa «Thương Hàn Luận»).
                  Trung niên sang Mỹ hành nghề y, sáng lập <strong>Học viện Đông y Hán Đường</strong>, suốt hơn hai mươi năm truyền dạy có hệ thống Đông y và thuật số truyền thống.
                  Ông mất tại Đài Loan ngày 31 tháng 1 năm 2012 vì ung thư gan, hưởng thọ 58 tuổi.
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Hệ thống giảng dạy</strong>:{' '}
                  Nghê sư hệ thống hóa sở học cả đời thành hai loạt bài giảng công khai.
                  <strong>«Nhân Kỷ»</strong> gồm «Châm Cứu Đại Thành», «Thần Nông Bản Thảo Kinh», «Hoàng Đế Nội Kinh», «Thương Hàn Luận», «Kim Quỹ Yếu Lược» —
                  đây là «kỷ cương của người», đặt nền con đường học Đông y trọn vẹn;
                  <strong>«Thiên Kỷ»</strong> gồm Tử Vi Đẩu Số và «Kinh Dịch» — đây là «kỷ cương của trời», thành quả hệ thống hóa việc nghiên cứu thuật số.
                  Hai phần hợp lại là truyền thừa trọn vẹn nhất Nghê sư để lại cho đời sau.
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Lập trường Tử Vi</strong>:{' '}
                  Về Tử Vi Đẩu Số, Nghê sư thuộc rõ <strong>Nam phái Tam hợp</strong>, chủ trương «lấy cung Mệnh làm gốc, lấy Tam phương tứ chính làm dụng, lấy Tứ Hóa làm cương».
                  Trong khóa «Thiên Kỷ» ông nói rõ: <em lang="zh-Hans">「飞星（四化）飞来飞去太复杂，不搞这个，毕竟大道至简」</em> (<em>Phi tinh (Tứ Hóa) bay qua bay lại quá phức tạp, không làm cái này, dù sao đại đạo chí giản</em>) —
                  lập trường này phân biệt rõ ông với phái Phi tinh rườm rà.
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Thái độ học thuật</strong>:{' '}
                  Nghê sư phản đối học thuộc lòng khẩu quyết một cách máy móc, nhấn mạnh «hiểu nguyên lý hơn học thuộc», «logic kiểm chứng được hơn huyền học bí ẩn».
                  Thái độ ấy đưa Tử Vi Đẩu Số từ một hệ thống khép kín truyền riêng thầy trò thành hệ thống tri thức hiện đại có hệ thống, kiểm chứng được và học được.
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Ảnh hưởng đương đại</strong>:{' '}
                  Video bài giảng của Nghê sư lan truyền rộng trên Bilibili, YouTube và nhiều nền tảng lớn, được thế hệ mới yêu mệnh lý và Đông y xem là bài nhập môn bắt buộc.
                  Ông không chỉ là người truyền thừa Tử Vi Đẩu Số mà còn là một trong những nhân vật then chốt đưa mệnh lý truyền thống và Đông y vào hệ thống tri thức hiện đại.
                </p>
                <p style={{ fontSize: '11px', color: c.textMuted, fontStyle: 'italic', marginTop: '12px' }}>
                  Mọi lời luận giải trên nền tảng này được biên soạn dựa trên giáo trình công khai «Thiên Kỷ» của Nghê sư, bản đời Minh của «Tử Vi Đẩu Số Toàn Thư» và các cổ thư phái Tam hợp truyền thống,
                  chỉ mang tính tham khảo về văn hóa và phát triển bản thân. Bản thân Nghê sư không có bất kỳ liên hệ thương mại nào với nền tảng này.
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NI_TEACHINGS.map((teaching, i) => (
              <FadeIn key={i} delay={0.1 + i * 0.08}>
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.1 }}
                  className="rounded-xl p-6 h-full"
                  style={{ border: `1px solid ${c.niCardBord}`, background: c.niCardBg, boxShadow: c.niCardShadow }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mt-0.5"
                      style={{ borderColor: c.goldLine }}>
                      <span className="text-[9px]" style={{ color: c.goldSolid }}>{i + 1}</span>
                    </div>
                    <h3 className="text-sm font-medium leading-relaxed" style={{ color: c.goldSolid }}>{teaching.title}</h3>
                  </div>
                  <p className="text-xs leading-relaxed pl-8" style={{ color: c.textSecond }}>{teaching.body}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-40 px-6 text-center" style={{ background: c.altSection }}>
        <FadeIn>
          <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-8 tracking-tight leading-tight`}
            style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
            Lá số Tử Vi của bạn<br />đang chờ được luận giải
          </h2>
          <p className="text-sm mb-10 max-w-md mx-auto leading-relaxed" style={{ color: c.textSecond }}>
            Nhập năm, tháng, ngày, giờ sinh, vài giây là có lá số của riêng bạn<br />
            rồi AI sẽ luận giải chuyên sâu theo hệ Nghê Hải Hạ
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/chart')}
            className="px-10 py-3.5 font-semibold text-base rounded-md"
            style={{ background: c.ctaBg, color: c.ctaText }}>
            Lập lá số miễn phí
          </motion.button>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <motion.a
              href="/knowledge"
              className="text-[15px] underline underline-offset-4"
              style={{ color: c.goldSolid }}>
              Kho kiến thức 14 chính tinh
            </motion.a>
            <motion.a
              href="/library"
              className="text-[15px] underline underline-offset-4"
              style={{ color: c.goldSolid }}>
              Thư viện cổ thư
            </motion.a>
          </div>
        </FadeIn>
      </section>

    </div>
  );
}

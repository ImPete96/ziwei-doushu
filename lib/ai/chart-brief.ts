import 'server-only';
import type { ZiweiChart, Palace, Star, SiHua } from '../ziwei/types';
import { detectPatterns } from '../ziwei/patterns';
import { getLiuNianSiHua, getSiHuaByStem, getYearBranchIndex } from '../ziwei/sihua';
import {
  viStar, viPalaceFull, viBrightness, viSihua, viStem, viBranch, viWuxingJu, viTerm,
} from '../vi/terms';

/**
 * Tóm tắt lá số thành văn bản tiếng Việt để đưa cho mô hình AI làm căn cứ luận giải.
 * Chỉ dùng dữ liệu do engine an sao tính ra; không đưa họ tên hay ngày dương lịch
 * (không cần cho luận giải, tránh gửi dữ liệu cá nhân thừa).
 */

const SIHUA_ORDER: SiHua[] = ['禄', '权', '科', '忌'];

function starLabel(s: Star): string {
  const parts = [viStar(s.name)];
  if (s.brightnessRaw) parts.push(`(${viBrightness(s.brightnessRaw)})`);
  if (s.siHua) parts.push(`[${viSihua(s.siHua)}]`);
  return parts.join(' ');
}

function siHuaLine(transforms: Partial<Record<SiHua, string>>): string {
  return SIHUA_ORDER
    .filter((h) => transforms[h])
    .map((h) => `${viSihua(h)}: ${viStar(transforms[h]!)}`)
    .join(', ');
}

function palaceLine(chart: ZiweiChart, p: Palace): string {
  const head = [`${viPalaceFull(p.name)} — ${viStem(p.stem)} ${viBranch(p.branch)}`];
  if (p.daXianAge) head.push(`đại hạn ${p.daXianAge[0]}–${p.daXianAge[1]} tuổi`);
  if (p.branch === chart.shenGongBranch) head.push('Thân cư');
  if (p.isCurrentDaXian) head.push('đại hạn hiện tại');

  const byType = (t: Star['type']) => p.stars.filter((s) => s.type === t).map(starLabel);
  const lines = [`- ${head.join(' · ')}`];
  const major = byType('major');
  if (major.length) {
    lines.push(`  Chính tinh: ${major.join(', ')}`);
  } else {
    const borrowed = p.borrowedStars?.map(viStar).join(', ');
    lines.push(`  Vô chính diệu${borrowed ? ` (mượn cung đối: ${borrowed})` : ''}`);
  }
  for (const [t, label] of [['lucky', 'Cát tinh'], ['sha', 'Sát tinh'], ['minor', 'Tạp diệu']] as const) {
    const stars = byType(t);
    if (stars.length) lines.push(`  ${label}: ${stars.join(', ')}`);
  }
  if (p.selfSihua?.length) {
    lines.push(`  Tự hóa: ${p.selfSihua.map((m) => `${viStar(m.starName)} tự ${viSihua(m.siHua)}`).join(', ')}`);
  }
  return lines.join('\n');
}

export function buildChartBrief(chart: ZiweiChart, viewYear: number): string {
  const { birthInfo, lunarInfo } = chart;
  const out: string[] = [];

  const lunarMonth = Math.abs(lunarInfo.lunarMonth);
  out.push('## Thông tin chung');
  out.push(`- Giới tính: ${birthInfo.gender === 'male' ? 'Nam' : 'Nữ'}${chart.yinYangGender ? ` (${viTerm(chart.yinYangGender)})` : ''}`);
  out.push(`- Năm sinh âm lịch: ${viStem(lunarInfo.yearStem)} ${viBranch(lunarInfo.yearBranch)}; ngày ${lunarInfo.lunarDay} tháng ${lunarInfo.isLeapMonth ? 'nhuận ' : ''}${lunarMonth}; giờ ${viBranch(birthInfo.hour)}`);
  if (birthInfo.unknownTime) {
    out.push('- LƯU Ý: người hỏi không rõ giờ sinh, lá số tạm lập theo giờ Tý. Cung Mệnh, Thân và các sao an theo giờ có thể sai; hãy nói rõ điều này và ưu tiên những nhận định không phụ thuộc giờ (Tứ Hóa năm sinh, sao an theo năm).');
  }
  out.push(`- Cục: ${viWuxingJu(chart.wuxingJuName)}`);
  if (chart.mingZhu || chart.shenZhu) {
    out.push(`- Mệnh chủ: ${chart.mingZhu ? viStar(chart.mingZhu) : '?'}; Thân chủ: ${chart.shenZhu ? viStar(chart.shenZhu) : '?'}`);
  }
  out.push(`- Cung Mệnh tại ${viBranch(chart.mingGongBranch)}, Thân cung tại ${viBranch(chart.shenGongBranch)}`);
  out.push(`- Tuổi mụ hiện tại: ${chart.currentAge}`);

  const natal: Partial<Record<SiHua, string>> = {};
  for (const p of chart.palaces) for (const s of p.stars) if (s.siHua) natal[s.siHua] = s.name;
  out.push(`- Tứ Hóa năm sinh (can ${viStem(lunarInfo.yearStem)}): ${siHuaLine(natal)}`);

  out.push('', '## 12 cung (độ sáng trong ngoặc tròn, Tứ Hóa năm sinh trong ngoặc vuông)');
  const sorted = [...chart.palaces].sort((a, b) =>
    (a.branch - chart.mingGongBranch + 12) % 12 - (b.branch - chart.mingGongBranch + 12) % 12);
  for (const p of sorted) out.push(palaceLine(chart, p));

  out.push('', '## Vận hạn');
  const dx = chart.daXians[chart.currentDaXianIndex];
  if (dx) {
    const dxPalace = chart.palaces.find((p) => p.branch === dx.palaceBranch);
    // Tứ Hóa đại hạn theo can của cung đại hạn (như TimeNav / ChartBoard hiển thị)
    const stem = dxPalace?.stem ?? dx.stemIndex;
    out.push(`- Đại hạn hiện tại: ${dx.startAge}–${dx.endAge} tuổi, tại ${dxPalace ? viPalaceFull(dxPalace.name) : viBranch(dx.palaceBranch)}${stem !== undefined ? ` (can ${viStem(stem)})` : ''}`);
    if (stem !== undefined) out.push(`  Tứ Hóa đại hạn: ${siHuaLine(getSiHuaByStem(stem))}`);
  }
  const ln = getLiuNianSiHua(viewYear);
  out.push(`- Lưu niên ${viewYear} (${viStem(ln.stemIndex)} ${viBranch(getYearBranchIndex(viewYear))}): Tứ Hóa ${siHuaLine(ln.transforms)}`);
  out.push(`- Các đại hạn: ${chart.daXians.map((d) => `${d.startAge}–${d.endAge} ${viBranch(d.palaceBranch)}`).join('; ')}`);

  const patterns = detectPatterns(chart);
  if (patterns.length) {
    out.push('', '## Cách cục engine nhận diện');
    for (const pt of patterns) {
      // Bỏ câu trích nguyên văn chữ Hán (mô tả đã kèm bản dịch trong ngoặc), trong ngoặc kép
      // cong hoặc thẳng; chữ Hán lẻ còn sót thì bỏ luôn
      const plain = pt.description
        .replace(/[“"][^”"]*[㐀-鿿][^”"]*[”"]\s*/g, '')
        .replace(/[㐀-鿿]+/g, '');
      const desc = plain.length > 300 ? `${plain.slice(0, 300)}…` : plain;
      out.push(`- ${pt.name} [${pt.level}]: ${desc}`);
    }
  }
  return out.join('\n');
}

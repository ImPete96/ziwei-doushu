'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart, Palace, Star } from '@/lib/ziwei/types';
import PalaceCell, { TEXT_HALO } from './PalaceCell';
import TimeNav, { type TimeView, getYearStemIndex, buildSiHuaOverlay } from './TimeNav';
import { viBranch, viGanzhi, viPalaceFull, viSihua, viStar, viStem, viTerm, viWuxingJu } from '@/lib/vi/terms';
import { nayinVi } from '@/lib/vi/nayin';

interface ChartBoardProps {
  chart: ZiweiChart;
  onStarSelect?: (star: Star, palace: Palace) => void;
  onPalaceSelect?: (palace: Palace) => void;
  onSiHuaClick?: (starName: string, siHua: string, view: TimeView) => void;
}

const BRANCH_GRID_POS: Record<number, [number, number]> = {
  5: [1, 1], 6: [1, 2], 7: [1, 3], 8: [1, 4],
  4: [2, 1], 9: [2, 4],
  3: [3, 1], 10: [3, 4],
  2: [4, 1], 1: [4, 2], 0: [4, 3], 11: [4, 4],
};

// 每个地支宫位在网格中的中心坐标（百分比）
const BRANCH_SVG_POS: Record<number, [number, number]> = {
  5: [12.5, 12.5], 6: [37.5, 12.5], 7: [62.5, 12.5], 8: [87.5, 12.5],
  4: [12.5, 37.5],                                      9: [87.5, 37.5],
  3: [12.5, 62.5],                                     10: [87.5, 62.5],
  2: [12.5, 87.5], 1: [37.5, 87.5], 0: [62.5, 87.5], 11: [87.5, 87.5],
};

// 绕盘面顺时针排列（用于三方四正四边形排序）
const CLOCKWISE_INDEX: Record<number, number> = {
  5: 0, 6: 1, 7: 2, 8: 3,
  9: 4, 10: 5,
  11: 6, 0: 7, 1: 8, 2: 9,
  3: 10, 4: 11,
};

function sortClockwise(branches: number[]): number[] {
  return [...branches].sort((a, b) => CLOCKWISE_INDEX[a] - CLOCKWISE_INDEX[b]);
}

/** 三方四正：本宫 + 对宫 + 两个三合宫 */
function getSanFangSiZheng(branch: number): [number, number, number, number] {
  return [
    branch,
    (branch + 6) % 12,   // 对宫
    (branch + 4) % 12,   // 三合1
    (branch + 8) % 12,   // 三合2
  ];
}

const ANIMATION_ORDER = [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4];

// ── Tuần / Triệt: kiểu lá số Việt đặt nhãn trên ranh giới giữa hai cung ──
// Engine an mỗi cặp thành hai sao ở hai cung liền nhau (旬空 + 副旬, 截空 + 副截).
const BORDER_PAIRS = [
  { label: 'Triệt', names: ['截空', '副截'] },
  { label: 'Tuần', names: ['旬空', '副旬'] },
] as const;

type Edge = 'top' | 'bottom' | 'left' | 'right';
interface BorderMark { label: 'Tuần' | 'Triệt'; host: number; edge: Edge }

const EDGE_STYLE: Record<Edge, React.CSSProperties> = {
  right: { right: 0, top: '50%', transform: 'translate(50%, -50%)' },
  left: { left: 0, top: '50%', transform: 'translate(-50%, -50%)' },
  bottom: { bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' },
  top: { top: 0, left: '50%', transform: 'translate(-50%, -50%)' },
};

const BORDER_MARK_COLOR: Record<BorderMark['label'], React.CSSProperties> = {
  Triệt: { color: 'var(--t-sha)', border: '1px solid var(--t-sha)' },
  Tuần: { color: 'var(--t-text2)', border: '1px solid var(--t-text2)' },
};

/**
 * Tìm cặp cung Tuần / Triệt liền nhau và gắn nhãn vào cung vẽ sau (theo ANIMATION_ORDER),
 * để nhãn tràn sang ranh giới mà không bị ô bên cạnh (vẽ sau) che mất.
 * Cặp không liền nhau thì giữ nguyên sao trong danh sách như cũ.
 */
function findBorderMarks(chart: ZiweiChart): { marks: BorderMark[]; hidden: Set<string> } {
  const marks: BorderMark[] = [];
  const hidden = new Set<string>();
  for (const { label, names } of BORDER_PAIRS) {
    const branches = names.map(n => chart.palaces.find(p => p.stars.some(s => s.name === n))?.branch);
    if (branches[0] === undefined || branches[1] === undefined) continue;
    const [a, b] = branches as [number, number];
    const [ra, ca] = BRANCH_GRID_POS[a];
    const [rb, cb] = BRANCH_GRID_POS[b];
    if (Math.abs(ra - rb) + Math.abs(ca - cb) !== 1) continue;
    const host = ANIMATION_ORDER.indexOf(a) > ANIMATION_ORDER.indexOf(b) ? a : b;
    const other = host === a ? b : a;
    const [rh, ch] = BRANCH_GRID_POS[host];
    const [ro, co] = BRANCH_GRID_POS[other];
    const edge: Edge = co > ch ? 'right' : co < ch ? 'left' : ro > rh ? 'bottom' : 'top';
    marks.push({ label, host, edge });
    names.forEach(n => hidden.add(n));
  }
  return { marks, hidden };
}

export default function ChartBoard({ chart, onStarSelect, onPalaceSelect, onSiHuaClick }: ChartBoardProps) {
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [timeView, setTimeView] = useState<TimeView>('mingpan');
  const [liunianYear, setLiunianYear] = useState<number>(new Date().getFullYear());

  const palaceMap: Record<number, Palace> = {};
  chart.palaces.forEach(p => { palaceMap[p.branch] = p; });
  const borderMarks = findBorderMarks(chart);

  // 计算当前叠加四化数据（大限或流年）
  const currentDx = chart.daXians[chart.currentDaXianIndex];
  const overlayData: Record<string, string> = (() => {
    if (timeView === 'daxian' && currentDx) {
      const dxPalace = chart.palaces.find(p => p.branch === currentDx.palaceBranch);
      if (dxPalace) return buildSiHuaOverlay(dxPalace.stem);
    }
    if (timeView === 'liunian') {
      return buildSiHuaOverlay(getYearStemIndex(liunianYear));
    }
    return {};
  })();
  const overlayLabel = timeView === 'daxian' ? 'Hạn' : timeView === 'liunian' ? 'Năm' : undefined;

  const handlePalaceClick = (branch: number) => {
    const isDeselecting = selectedBranch === branch;
    setSelectedBranch(prev => prev === branch ? null : branch);
    if (!isDeselecting) {
      const palace = palaceMap[branch];
      if (palace) onPalaceSelect?.(palace);
    }
  };

  // 三方四正
  const sanFangBranches = selectedBranch !== null ? getSanFangSiZheng(selectedBranch) : null;
  const sanFangSet = sanFangBranches ? new Set(sanFangBranches) : null;

  return (
    <div className="w-full select-none">
      {/* 时间导航轴 */}
      <TimeNav
        chart={chart}
        view={timeView}
        liunianYear={liunianYear}
        onViewChange={setTimeView}
        onYearChange={setLiunianYear}
      />

      {/* 命盘标题 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-3"
      >
        <h2 className="text-[17px] tracking-[0.05em] font-semibold" style={{ color: 'var(--t-gold)' }}>
          {chart.birthInfo.name ? `${chart.birthInfo.name} · ` : ''}Lá số Tử Vi Đẩu Số
        </h2>
      </motion.div>

      {/* 4x4 命盘网格（含 SVG 叠加层） */}
      <div
        className="grid rounded-xl overflow-hidden relative"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, auto)',
          gap: '1px',
          background: 'var(--t-border)',
          border: '1px solid var(--t-border)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
        }}
      >
        {ANIMATION_ORDER.map((branch, i) => {
          const [row, col] = BRANCH_GRID_POS[branch];
          const palace = palaceMap[branch];
          if (!palace) return null;
          // 外层只铺底色（不定位，画在连线下面）；内层 z-index 1 承载文字，盖在连线上面
          return (
            <div key={branch} style={{ gridRow: row, gridColumn: col, background: 'var(--t-bg)' }}>
              <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
              <PalaceCell
                palace={palace}
                onClick={() => handlePalaceClick(branch)}
                onStarClick={(star) => onStarSelect?.(star, palace)}
                isSelected={selectedBranch === branch}
                isSanFang={!!(sanFangSet?.has(branch) && selectedBranch !== branch)}
                delay={i * 0.04}
                overlayStarSiHua={Object.keys(overlayData).length > 0 ? overlayData : undefined}
                overlayLabel={overlayLabel}
                onSiHuaClick={(starName, siHua) => onSiHuaClick?.(starName, siHua, timeView)}
                hideStars={borderMarks.hidden}
              />
              {borderMarks.marks.filter(m => m.host === branch).map(m => (
                <span
                  key={m.label}
                  title={m.label === 'Triệt' ? 'Triệt lộ không vong' : 'Tuần trung không vong'}
                  className="absolute text-[12px] font-semibold leading-none px-2 py-1 rounded-full whitespace-nowrap pointer-events-auto"
                  style={{ ...EDGE_STYLE[m.edge], zIndex: 2, background: 'var(--t-bg)', ...BORDER_MARK_COLOR[m.label] }}
                >
                  {m.label}
                </span>
              ))}
              </div>
            </div>
          );
        })}

        {/* 中央信息区：同样拆成底色层 + 文字层，让连线从文字下面穿过 */}
        <div style={{ gridRow: '2 / 4', gridColumn: '2 / 4', background: 'var(--t-bg)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center justify-center p-2 sm:p-4 gap-2 sm:gap-3 min-w-0 h-full"
          style={{ position: 'relative', zIndex: 1, textShadow: TEXT_HALO }}
        >
          {/* Thiên bàn kiểu lá số Việt: âm dương, nạp âm, cục, Mệnh/Thân chủ, tứ trụ, ngày sinh */}
          {(() => {
            const L = chart.lunarInfo;
            const b = chart.birthInfo;
            const pillars = L.fourPillarsLunar ?? L.fourPillars;
            const o = b.origInput;
            const solar = o
              ? `${o.day}/${o.month}/${o.year}${b.unknownTime ? '' : ` · ${String(o.clockHour).padStart(2, '0')}:${String(o.clockMinute).padStart(2, '0')}`}`
              : `${b.day}/${b.month}/${b.year}`;
            return (
              <div className="text-center text-[13px] leading-relaxed space-y-0.5" style={{ color: 'var(--t-text2)' }}>
                <div className="text-[14px] font-medium" style={{ color: 'var(--t-text)' }}>
                  {chart.yinYangGender ? viTerm(chart.yinYangGender) : (b.gender === 'male' ? 'Nam' : 'Nữ')}
                  {' · '}{viStem(L.yearStem)} {viBranch(L.yearBranch)}
                </div>
                <div>Nạp âm <span style={{ color: 'var(--t-gold)' }}>{nayinVi(L.yearStem, L.yearBranch)}</span></div>
                <div>
                  Mệnh <span style={{ color: 'var(--t-gold)' }}>{viBranch(chart.mingGongBranch)}</span>
                  {' · '}Thân <span style={{ color: 'var(--t-shen)' }}>{viBranch(chart.shenGongBranch)}</span>
                  {' · '}<span style={{ color: 'var(--t-gold)' }}>{viWuxingJu(chart.wuxingJuName)}</span>
                </div>
                {(chart.mingZhu || chart.shenZhu) && (
                  <div>
                    Mệnh chủ <span style={{ color: 'var(--t-text)' }}>{chart.mingZhu ? viStar(chart.mingZhu) : '–'}</span>
                    {' · '}Thân chủ <span style={{ color: 'var(--t-text)' }}>{chart.shenZhu ? viStar(chart.shenZhu) : '–'}</span>
                  </div>
                )}
                {pillars && (
                  <div className="text-[12px]" style={{ color: 'var(--t-faint)' }}>
                    Tứ trụ: {pillars.map(viGanzhi).join(' · ')}
                  </div>
                )}
                <div className="text-[12px] font-mono" style={{ color: 'var(--t-faint)' }}>
                  ÂL {L.lunarDay}/{L.isLeapMonth ? 'nhuận ' : ''}{Math.abs(L.lunarMonth)}/{L.lunarYear} · DL {solar}
                </div>
              </div>
            );
          })()}

          {chart.currentDaXianIndex >= 0 && (() => {
            const dx = chart.daXians[chart.currentDaXianIndex];
            return (
              <div className="rounded-lg px-3 py-2 text-center"
                style={{ background: 'color-mix(in srgb, var(--t-purple) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--t-purple) 45%, transparent)', color: 'var(--t-purple)' }}>
                <div className="text-[12px] mb-0.5">Đại hạn hiện tại</div>
                <div className="text-[15px] font-semibold tabular-nums">{dx.startAge}–{dx.endAge} tuổi</div>
                <div className="text-[12px]">{viPalaceFull(dx.palaceName)}</div>
              </div>
            );
          })()}

        </motion.div>
        </div>

        {/* ── 三方四正 SVG 连线（绝对定位在 grid 内部，受 overflow:hidden 裁切） ── */}
        <AnimatePresence>
          {sanFangBranches !== null && (
            <motion.div
              key={`sf-${selectedBranch}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none"
              style={{
                position: 'absolute',
                inset: 0,
                // 在宫位底色之上、文字层（zIndex 1）之下
                zIndex: 0,
              }}
            >
              <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: 'block' }}
              >
                {(() => {
                  // 三角形（三方）+ 一条直线（对宫）
                  const p0 = BRANCH_SVG_POS[sanFangBranches[0]]; // 本宫
                  const p1 = BRANCH_SVG_POS[sanFangBranches[1]]; // 对宫
                  const p2 = BRANCH_SVG_POS[sanFangBranches[2]]; // 三合1
                  const p3 = BRANCH_SVG_POS[sanFangBranches[3]]; // 三合2
                  const dash = "6,5";
                  const stroke = "color-mix(in srgb, var(--t-sel) 80%, transparent)";
                  const sw = "1.75";
                  return (
                    <>
                      {/* 对宫直线：本宫 ↔ 对宫（穿过中心） */}
                      <line
                        x1={`${p0[0]}%`} y1={`${p0[1]}%`}
                        x2={`${p1[0]}%`} y2={`${p1[1]}%`}
                        stroke={stroke} strokeWidth={sw}
                        strokeDasharray={dash} strokeLinecap="round"
                      />
                      {/* 三合三角形：本宫 → 三合1 → 三合2 → 本宫 */}
                      <line
                        x1={`${p0[0]}%`} y1={`${p0[1]}%`}
                        x2={`${p2[0]}%`} y2={`${p2[1]}%`}
                        stroke={stroke} strokeWidth={sw}
                        strokeDasharray={dash} strokeLinecap="round"
                      />
                      <line
                        x1={`${p2[0]}%`} y1={`${p2[1]}%`}
                        x2={`${p3[0]}%`} y2={`${p3[1]}%`}
                        stroke={stroke} strokeWidth={sw}
                        strokeDasharray={dash} strokeLinecap="round"
                      />
                      <line
                        x1={`${p3[0]}%`} y1={`${p3[1]}%`}
                        x2={`${p0[0]}%`} y2={`${p0[1]}%`}
                        stroke={stroke} strokeWidth={sw}
                        strokeDasharray={dash} strokeLinecap="round"
                      />
                      {/* 四个宫位中心标记点 */}
                      {[p0, p1, p2, p3].map((p, i) => (
                        <circle
                          key={i}
                          cx={`${p[0]}%`} cy={`${p[1]}%`}
                          r="3"
                          fill="var(--t-sel)" opacity={i === 0 ? 1 : 0.6}
                        />
                      ))}
                    </>
                  );
                })()}
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 图例 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-3 flex items-center justify-center gap-2 text-[12px] flex-wrap"
      >
        {[
          { h: '化禄', c: 'var(--t-lu)' },
          { h: '化权', c: 'var(--t-quan)' },
          { h: '化科', c: 'var(--t-ke)' },
          { h: '化忌', c: 'var(--t-ji)' },
        ].map(({ h, c }) => (
          <span key={h} className="border px-2 py-0.5 rounded-full font-medium"
            style={{ color: c, borderColor: `color-mix(in srgb, ${c} 45%, transparent)` }}>{viSihua(h)}</span>
        ))}
        <span style={{ color: 'var(--t-lucky)' }}>Cát tinh</span>
        <span style={{ color: 'var(--t-sha)' }}>Sát tinh</span>
        <span className="px-1.5 py-0.5 rounded-full" style={{ color: 'var(--t-faint)', border: '1px solid var(--t-border)' }}>
          Bấm vào cung để xem Tam phương tứ chính
        </span>
        <span className="w-full text-center" style={{ color: 'var(--t-faint)' }}>
          Độ sáng: M Miếu · V Vượng · Đ Đắc · L Lợi · B Bình · Bt Bất · H Hãm
        </span>
      </motion.div>
    </div>
  );
}

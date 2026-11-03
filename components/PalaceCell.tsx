'use client';
import { motion } from 'framer-motion';
import type { Palace, Star } from '@/lib/ziwei/types';
import { viBranch, viBrightness, viPalace, viSihuaShort, viStar, viStem } from '@/lib/vi/terms';
import clsx from 'clsx';

interface PalaceCellProps {
  palace: Palace;
  onClick?: () => void;
  onStarClick?: (star: Star) => void;
  isSelected?: boolean;
  isSanFang?: boolean;
  delay?: number;
  /** 叠加四化：星名 → 四化类型（'禄'/'权'/'科'/'忌'） */
  overlayStarSiHua?: Record<string, string>;
  /** 叠加标签：'年'（流年）或 '限'（大限） */
  overlayLabel?: string;
  /** 点击叠加四化 badge 回调 */
  onSiHuaClick?: (starName: string, siHua: string) => void;
  /** Sao không liệt kê trong ô (Tuần / Triệt đã vẽ trên ranh giới cung) */
  hideStars?: Set<string>;
}

export const TEXT_HALO = '0 0 2px var(--t-bg), 0 0 3px var(--t-bg), 0 0 5px var(--t-bg)';

/** Độ sáng viết tắt kiểu lá số Việt; chữ đầy đủ hiện khi rê chuột */
export const BRIGHTNESS_ABBR: Record<string, string> = {
  庙: 'M', 旺: 'V', 得: 'Đ', 利: 'L', 平: 'B', 不: 'Bt', 闲: 'N', 陷: 'H', 地: 'Đa',
};

const Brightness = ({ raw, className }: { raw?: string; className?: string }) =>
  raw && BRIGHTNESS_ABBR[raw] ? (
    <span title={viBrightness(raw)} className={clsx('ml-0.5 font-normal opacity-70', className)}>
      ({BRIGHTNESS_ABBR[raw]})
    </span>
  ) : null;

const SIHUA_STYLES: Record<string, string> = {
  '禄': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  '权': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  '科': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  '忌': 'text-red-400 bg-red-500/10 border-red-500/30',
};

const SiHuaBadge = ({
  siHua,
  overlay,
  label,
  onClick,
}: {
  siHua: string;
  overlay?: boolean;
  label?: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center text-[8px] px-1 rounded-full border leading-none py-px font-bold ml-0.5 flex-shrink-0 whitespace-nowrap',
        SIHUA_STYLES[siHua],
        overlay && 'border-dashed opacity-80',
        onClick && 'cursor-pointer hover:opacity-100',
      )}
      onClick={onClick}
    >
      {overlay && label && <span className="mr-0.5 opacity-70">{label}</span>}
      {viSihuaShort(siHua)}
    </span>
  );
};

export default function PalaceCell({
  palace, onClick, onStarClick, isSelected, isSanFang, delay = 0,
  overlayStarSiHua, overlayLabel, onSiHuaClick, hideStars,
}: PalaceCellProps) {
  const { branch, stem, name, daXianAge, isCurrentDaXian, isMingGong, isShenGong } = palace;
  const ganzhi = `${viStem(stem)} ${viBranch(branch)}`;

  const stars = hideStars ? palace.stars.filter(s => !hideStars.has(s.name)) : palace.stars;
  const majorStars = stars.filter(s => s.type === 'major');
  const luckyStars = stars.filter(s => s.type === 'lucky');
  const shaStars = stars.filter(s => s.type === 'sha');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      onClick={onClick}
      className="relative flex flex-col p-1 sm:p-1.5 cursor-pointer transition-all duration-200 h-full min-w-0 overflow-hidden"
      style={{
        minHeight: '90px',
        // Quầng màu nền quanh chữ: đường Tam phương đi bên dưới không cắt ngang nét chữ
        textShadow: TEXT_HALO,
        background: isCurrentDaXian
          ? 'rgba(147,51,234,0.08)'
          : isSelected
          ? 'rgba(37,99,235,0.18)'
          : isSanFang
          ? 'rgba(37,99,235,0.09)'
          : isMingGong
          ? 'rgba(212,168,67,0.04)'
          // trong suốt: ChartBoard đã tô nền ở lớp dưới, để đường Tam phương hiện ra dưới chữ
          : 'transparent',
        boxShadow: isCurrentDaXian
          ? 'inset 3px 0 0 rgba(147,51,234,0.5)'
          : isSelected
          ? 'inset 0 0 0 1.5px rgba(37,99,235,0.7)'
          : isSanFang
          ? 'inset 0 0 0 1px rgba(37,99,235,0.4)'
          : 'none',
      }}
    >
      {/* 宫名行 */}
      <div className="flex flex-wrap items-center gap-x-1 mb-0.5">
        <span className={clsx('text-[9px] sm:text-[10px] font-medium leading-tight',
          isMingGong ? 'text-amber-500' : isShenGong ? 'text-sky-500' : ''
        )}
          style={!isMingGong && !isShenGong ? { color: 'var(--t-faint)' } : undefined}
        >
          {viPalace(name)}
        </span>
        {isMingGong && (
          <span className="text-[7px] text-amber-500/80 border border-amber-500/30 px-0.5 rounded leading-tight whitespace-nowrap">Mệnh</span>
        )}
        {isShenGong && (
          <span className="text-[7px] text-sky-500/80 border border-sky-500/30 px-0.5 rounded leading-tight whitespace-nowrap">Thân</span>
        )}
      </div>

      {/* 干支 + 大限年龄（越南文宫名较长，年龄从右上角绝对定位移到这一行，避免与宫名重叠） */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-1 mb-1 text-[8px] sm:text-[9px]">
        <span className="font-mono" style={{ color: 'var(--t-faint)', opacity: 0.75 }}>{ganzhi}</span>
        {daXianAge && (
          <span className={clsx('font-mono tabular-nums', isCurrentDaXian ? 'text-purple-400' : '')}
            style={!isCurrentDaXian ? { color: 'var(--t-faint)', opacity: 0.75 } : undefined}
          >
            {daXianAge[0]}–{daXianAge[1]}
          </span>
        )}
      </div>

      {/* 主星 */}
      <div className="flex flex-col gap-0.5 flex-1">
        {majorStars.length === 0 && (
          <span className="text-[9px] sm:text-[10px] italic leading-tight" style={{ color: 'var(--t-faint)', opacity: 0.6 }}>Vô chính diệu</span>
        )}
        {majorStars.map((star) => {
          const overlaySiHua = overlayStarSiHua?.[star.name];
          return (
            <div
              key={star.name}
              className="flex flex-wrap items-center"
              onClick={e => { e.stopPropagation(); onStarClick?.(star); }}
            >
              <span className={clsx(
                'text-[11px] sm:text-[13px] leading-tight font-bold tracking-tight cursor-pointer hover:brightness-125 transition-all',
                star.brightness === 'bright' ? 'text-amber-300' : star.brightness === 'dim' ? 'text-amber-700/80' : 'text-amber-500',
              )}>
                {viStar(star.name)}
                <Brightness raw={star.brightnessRaw} className="text-[9px] sm:text-[10px]" />
              </span>
              {star.siHua && <SiHuaBadge siHua={star.siHua} />}
              {overlaySiHua && (
                <SiHuaBadge
                  siHua={overlaySiHua}
                  overlay
                  label={overlayLabel}
                  onClick={e => {
                    e.stopPropagation();
                    onSiHuaClick?.(star.name, overlaySiHua);
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 吉星 */}
      {luckyStars.length > 0 && (
        <div className="flex flex-wrap gap-x-1 mt-0.5">
          {luckyStars.map(s => {
            const overlaySiHua = overlayStarSiHua?.[s.name];
            return (
              <span key={s.name} className="inline-flex flex-wrap items-center text-[8px] sm:text-[9px] text-sky-500/70 leading-tight">
                {viStar(s.name)}
                <Brightness raw={s.brightnessRaw} />
                {s.siHua && <SiHuaBadge siHua={s.siHua} />}
                {overlaySiHua && (
                  <SiHuaBadge
                    siHua={overlaySiHua}
                    overlay
                    label={overlayLabel}
                    onClick={e => {
                      e.stopPropagation();
                      onSiHuaClick?.(s.name, overlaySiHua);
                    }}
                  />
                )}
              </span>
            );
          })}
        </div>
      )}

      {/* 煞星 */}
      {shaStars.length > 0 && (
        <div className="flex flex-wrap gap-x-1">
          {shaStars.map(s => (
            <span key={s.name} className="text-[8px] sm:text-[9px] text-red-500/60 leading-tight">
              {viStar(s.name)}<Brightness raw={s.brightnessRaw} />{s.siHua && <SiHuaBadge siHua={s.siHua} />}
            </span>
          ))}
        </div>
      )}

    </motion.div>
  );
}

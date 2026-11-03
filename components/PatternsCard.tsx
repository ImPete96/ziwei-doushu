'use client';
import { motion } from 'framer-motion';
import type { Pattern } from '@/lib/ziwei/patterns';
import { viPalace } from '@/lib/vi/terms';

// Màu chữ đặc theo token (đủ tương phản ở cả hai giao diện) + nhãn chữ, không chỉ dựa vào màu
const LEVEL: Record<Pattern['level'], { label: string; color: string }> = {
  excellent: { label: 'Rất tốt', color: 'var(--t-gold)' },
  good: { label: 'Tốt', color: 'var(--t-lucky)' },
  neutral: { label: 'Trung tính', color: 'var(--t-text2)' },
  caution: { label: 'Cần lưu ý', color: 'var(--t-sha)' },
};

/** Bỏ câu trích nguyên văn chữ Hán trong mô tả (đã có nghĩa tiếng Việt đi kèm) */
const plain = (s: string) => s.replace(/[“"][^”"]*[㐀-鿿][^”"]*[”"]\s*/g, '');

/** Danh sách cách cục engine nhận diện; dữ liệu lấy từ /api/patterns vì patterns.ts chỉ chạy trên máy chủ */
export default function PatternsCard({ patterns }: { patterns: Pattern[] }) {
  if (patterns.length === 0) return null;

  return (
    <motion.section
      aria-labelledby="cach-cuc-title"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card-glass rounded-xl p-5"
    >
      <h2 id="cach-cuc-title" className="text-[15px] font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--t-gold)' }}>
        Cách cục trong lá số
        <span className="text-[13px] font-normal ml-auto" style={{ color: 'var(--t-faint)' }}>{patterns.length} cách</span>
      </h2>
      <div className="space-y-3">
        {patterns.map((p, i) => {
          const lv = LEVEL[p.level];
          return (
            <div key={`${p.name}-${i}`} className="rounded-lg p-3" style={{ border: '1px solid var(--t-border)' }}>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[15px] font-semibold" style={{ color: lv.color }}>{p.name}</span>
                <span className="text-[12px] px-2 py-0.5 rounded-full border" style={{ color: lv.color, borderColor: 'currentColor' }}>{lv.label}</span>
                <span className="text-[12px] ml-auto" style={{ color: 'var(--t-faint)' }}>
                  {p.palaces.slice(0, 2).map(viPalace).join(' · ')}
                </span>
              </div>

              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>{plain(p.description)}</p>

              {p.conditions && (
                <div className="mt-2 space-y-0.5 text-[13px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>
                  {p.conditions.required.length > 0 && (
                    <div><span className="font-medium" style={{ color: 'var(--t-gold)' }}>Điều kiện</span> · {p.conditions.required.join('; ')}</div>
                  )}
                  {p.conditions.bonus && p.conditions.bonus.length > 0 && (
                    <div><span className="font-medium" style={{ color: 'var(--t-lu)' }}>Điểm cộng</span> · {p.conditions.bonus.join('; ')}</div>
                  )}
                  {p.conditions.breaking && p.conditions.breaking.length > 0 && (
                    <div><span className="font-medium" style={{ color: 'var(--t-sha)' }}>Phá cách</span> · {p.conditions.breaking.join('; ')}</div>
                  )}
                </div>
              )}

              {p.source && (
                <div className="text-[12px] mt-1.5" style={{ color: 'var(--t-faint)' }}>Xuất xứ · {p.source}</div>
              )}
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}

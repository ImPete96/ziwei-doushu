'use client';
import { useState } from 'react';
import BirthForm from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import InsightPanel from '@/components/InsightPanel';
import StarDetailPanel from '@/components/StarDetailPanel';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart, Palace, Star } from '@/lib/ziwei/types';

/**
 * Trang lá số: form ngày giờ sinh → bàn 12 cung (ChartBoard) + bảng luận giải AI (InsightPanel).
 * Bấm tên sao mở bảng chi tiết sao phía trên bảng luận giải; bấm cung chọn cung để xem
 * Tam phương tứ chính và hiện nút "Luận cung này".
 */
export default function ChartPage() {
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [selectedStar, setSelectedStar] = useState<{ star: Star; palace: Palace } | null>(null);

  // ── 未起盘：展示出生信息表单 ──
  if (!chart) {
    return (
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: 'var(--t-text)' }}>Lập lá số Tử Vi Đẩu Số</h1>
        <p style={{ color: 'var(--t-text2)', marginBottom: 32, fontSize: 15, lineHeight: 1.7 }}>
          Nhập ngày giờ và nơi sinh để xem lá số 12 cung, Tứ Hóa và vận hạn theo hệ Nghê Hải Hạ, kèm luận giải bằng AI.
        </p>
        <BirthForm onSubmit={(info: BirthInfo) => setChart(generateChart(info))} />
      </main>
    );
  }

  // ── 已起盘：命盘 + 解读 ──
  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px' }}>
      <button
        type="button"
        onClick={() => { setChart(null); setSelectedPalace(null); setSelectedStar(null); }}
        className="rounded-lg text-[14px]"
        style={{ marginBottom: 16, padding: '6px 14px', border: '1px solid var(--t-border)', color: 'var(--t-text2)' }}
      >
        ← Lập lá số mới
      </button>

      {chart.birthInfo.unknownTime && (
        <p role="note" className="rounded-lg px-4 py-2.5 text-[14px]" style={{ border: '1px solid var(--t-border-acc)', color: 'var(--t-text2)' }}>
          Bạn chưa nhập giờ sinh nên lá số đang <strong style={{ color: 'var(--t-gold)' }}>tạm lập theo giờ Tý</strong>.
          Vị trí cung Mệnh và nhiều sao phụ thuộc giờ sinh, nên hãy coi kết quả là tham khảo.
        </p>
      )}

      {/* 本命 / 大限 / 流年切换由 ChartBoard 自带的 TimeNav 负责，这里不再重复渲染 */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]"
        style={{
          gap: 20, marginTop: 16, alignItems: 'start',
        }}
      >
        <ChartBoard
          chart={chart}
          onPalaceSelect={setSelectedPalace}
          onStarSelect={(star, palace) => setSelectedStar({ star, palace })}
        />
        <div className="flex flex-col gap-4 min-w-0">
          {selectedStar && (
            <StarDetailPanel
              star={selectedStar.star}
              palaceName={selectedStar.palace.name}
              onClose={() => setSelectedStar(null)}
            />
          )}
          <InsightPanel chart={chart} selectedPalace={selectedPalace} />
        </div>
      </div>
    </main>
  );
}

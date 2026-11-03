'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BirthForm, { type BirthFormState } from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import InsightPanel from '@/components/InsightPanel';
import StarDetailPanel from '@/components/StarDetailPanel';
import PatternsCard from '@/components/PatternsCard';
import ShareModal from '@/components/ShareModal';
import { generateChart } from '@/lib/ziwei/algorithm';
import { formToBirthInfo, formToSearchParams, searchParamsToForm } from '@/lib/ziwei/share';
import { useHistory } from '@/lib/ziwei/history';
import type { Pattern } from '@/lib/ziwei/patterns';
import type { BirthInfo, ZiweiChart, Palace, Star } from '@/lib/ziwei/types';

/**
 * Trang lá số: form ngày giờ sinh → bàn 12 cung (ChartBoard) + bảng luận giải AI (InsightPanel).
 * Thông tin sinh nằm trên URL (không kèm họ tên) để tải lại / gửi link vẫn ra đúng lá số;
 * các lá số đã lập lưu ở localStorage (lib/ziwei/history.ts) để mở lại nhanh.
 */
export default function ChartPage() {
  // useSearchParams cần Suspense khi dựng sẵn trang
  return (
    <Suspense fallback={null}>
      <ChartPageInner />
    </Suspense>
  );
}

/** URL không chứa họ tên: link có thể bị chia sẻ hoặc nằm trong lịch sử trình duyệt */
function chartQuery(form: BirthFormState): string {
  const p = formToSearchParams(form);
  p.delete('n');
  return p.toString();
}

function chartFromForm(form: BirthFormState): ZiweiChart {
  const info = formToBirthInfo(form);
  return generateChart(form.unknownTime ? { ...info, unknownTime: true } : info);
}

function ChartPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { history, save, remove } = useHistory();

  const [form, setForm] = useState<BirthFormState | null>(null);
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [editing, setEditing] = useState(false);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [selectedStar, setSelectedStar] = useState<{ star: Star; palace: Palace } | null>(null);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const lastForm = useRef<BirthFormState | null>(null);

  // Mở từ link /chart?y=…: dựng lại lá số từ URL (link cũ không có g= thì coi như chưa đủ, hiện form)
  useEffect(() => {
    const parsed = searchParamsToForm(new URLSearchParams(searchParams.toString()));
    if (!parsed || !searchParams.get('g')) {
      setChart(null);
      setForm(null);
      return;
    }
    const f = parsed as BirthFormState;
    try {
      setChart(chartFromForm(f));
      setForm(prev => (prev && chartQuery(prev) === chartQuery(f) ? prev : f)); // giữ họ tên vừa nhập
      setEditing(false);
    } catch {
      setChart(null);
    }
    setSelectedPalace(null);
    setSelectedStar(null);
  }, [searchParams]);

  // Cách cục tính trên máy chủ (lib/ziwei/patterns.ts là server-only)
  useEffect(() => {
    setPatterns([]);
    if (!chart) return;
    const ctrl = new AbortController();
    fetch('/api/patterns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chart: { birthInfo: { ...chart.birthInfo, name: undefined } } }),
      signal: ctrl.signal,
    })
      .then(r => (r.ok ? r.json() : { patterns: [] }))
      .then(d => setPatterns(d.patterns ?? []))
      .catch(() => { /* không có cách cục thì thôi */ });
    return () => ctrl.abort();
  }, [chart]);

  const handleSubmit = (info: BirthInfo) => {
    const f = lastForm.current;
    if (!f) { setChart(generateChart(info)); return; }
    save(f);
    setForm(f);
    setChart(generateChart(info));
    setEditing(false);
    router.push(`/chart?${chartQuery(f)}`, { scroll: false });
  };

  const shareUrl = typeof window !== 'undefined' && form ? `${window.location.origin}/chart?${chartQuery(form)}` : '';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { setShareOpen(true); }
  };

  const formView = (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: 'var(--t-text)' }}>
        {editing ? 'Sửa thông tin lá số' : 'Lập lá số Tử Vi Đẩu Số'}
      </h1>
      <p style={{ color: 'var(--t-text2)', marginBottom: 24, fontSize: 15, lineHeight: 1.7 }}>
        Nhập ngày giờ và nơi sinh để xem lá số 12 cung, Tứ Hóa và vận hạn theo hệ Nghê Hải Hạ, kèm luận giải bằng AI.
      </p>

      {!editing && history.length > 0 && (
        <section aria-labelledby="gan-day" className="mb-6">
          <h2 id="gan-day" className="text-[14px] font-medium mb-2" style={{ color: 'var(--t-text2)' }}>Lá số gần đây</h2>
          <ul className="flex flex-wrap gap-2">
            {history.slice(0, 6).map(h => (
              <li key={h.id} className="flex items-center rounded-full text-[13px]" style={{ border: '1px solid var(--t-border)' }}>
                <button type="button" className="pl-3 pr-2 py-1" style={{ color: 'var(--t-text)' }}
                  onClick={() => { setForm(h.form); router.push(`/chart?${chartQuery(h.form)}`); }}>
                  {h.label}
                </button>
                <button type="button" aria-label={`Xóa ${h.label} khỏi danh sách`} className="pr-3 pl-1 py-1" style={{ color: 'var(--t-faint)' }}
                  onClick={() => remove(h.id)}>×</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <BirthForm
        key={editing ? 'edit' : 'new'}
        initialData={editing && form ? form : undefined}
        onFormSave={f => { lastForm.current = f; }}
        onSubmit={handleSubmit}
      />
      {editing && (
        <button type="button" onClick={() => setEditing(false)} className="mt-4 text-[14px] underline underline-offset-2" style={{ color: 'var(--t-text2)' }}>
          Quay lại lá số
        </button>
      )}
    </main>
  );

  if (!chart || editing) return formView;

  const chartKey = JSON.stringify({ ...chart.birthInfo, name: undefined });
  const toolBtn = 'rounded-lg text-[14px] px-3.5 py-1.5';
  const toolStyle = { border: '1px solid var(--t-border)', color: 'var(--t-text2)' };

  return (
    <main className="mx-auto px-4 py-6" style={{ maxWidth: 1320 }}>
      <h1 className="sr-only">Lá số Tử Vi{form?.name ? ` của ${form.name}` : ''}</h1>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button type="button" className={toolBtn} style={toolStyle} onClick={() => setEditing(true)}>Sửa thông tin</button>
        <button type="button" className={toolBtn} style={toolStyle} onClick={() => router.push('/chart')}>Lập lá số mới</button>
        <span className="ml-auto flex gap-2">
          <button type="button" className={toolBtn} style={toolStyle} onClick={copyLink} disabled={!shareUrl}>
            {copied ? 'Đã sao chép link' : 'Sao chép link'}
          </button>
          <button type="button" className={toolBtn} style={toolStyle} onClick={() => setShareOpen(true)} disabled={!form}>Lưu ảnh</button>
        </span>
      </div>

      {chart.birthInfo.unknownTime && (
        <p role="note" className="rounded-lg px-4 py-2.5 mb-4 text-[14px]" style={{ border: '1px solid var(--t-border-acc)', color: 'var(--t-text2)' }}>
          Bạn chưa nhập giờ sinh nên lá số đang <strong style={{ color: 'var(--t-gold)' }}>tạm lập theo giờ Tý</strong>.
          Vị trí cung Mệnh và nhiều sao phụ thuộc giờ sinh, nên hãy coi kết quả là tham khảo.
        </p>
      )}

      {/* Máy tính: bảng luận giải dính bên phải, cuộn riêng, ô hỏi ghim đáy. Màn hẹp: xếp dưới bàn lá số. */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] gap-5 items-start">
        <div className="flex flex-col gap-5 min-w-0">
          <ChartBoard
            key={chartKey}
            chart={chart}
            onPalaceSelect={setSelectedPalace}
            onStarSelect={(star, palace) => setSelectedStar({ star, palace })}
          />
          <PatternsCard patterns={patterns} />
        </div>
        <div className="flex flex-col gap-4 min-w-0 h-[80vh] lg:h-[calc(100dvh-88px)] lg:sticky lg:top-[72px]">
          {selectedStar && (
            <div className="shrink-0 max-h-[45%] overflow-y-auto rounded-xl">
              <StarDetailPanel
                star={selectedStar.star}
                palaceName={selectedStar.palace.name}
                onClose={() => setSelectedStar(null)}
              />
            </div>
          )}
          <div className="flex-1 min-h-0">
            {/* key theo lá số: chuyển sang lá số khác (Back/Forward) thì bảng luận giải bắt đầu lại */}
            <InsightPanel key={chartKey} chart={chart} selectedPalace={selectedPalace} />
          </div>
        </div>
      </div>

      {form && (
        <ShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          shareUrl={shareUrl}
          chart={chart}
          birth={{ year: form.year, month: form.month, day: form.day, hour: form.clockHour, minute: form.clockMinute, gender: form.gender, city: form.city || form.province }}
        />
      )}
    </main>
  );
}

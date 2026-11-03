'use client';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BirthCountry, BirthInfo } from '@/lib/ziwei/types';
import { SHICHEN } from '@/lib/ziwei/constants';
import { useTheme } from '@/components/ThemeProvider';
import { PROVINCES } from '@/lib/ziwei/cities';
import { formToBirthInfo, formSolarTime, formCountry, vnProvinceRequired, vnProvinceRequiredMessage } from '@/lib/ziwei/share';
import { VN_PROVINCES, canonicalVnPlace, findVnProvince, resolveVnPlace } from '@/lib/ziwei/vn-places';
import { formatUtcOffset } from '@/lib/ziwei/vn-timezone';
import { viBranch } from '@/lib/vi/terms';
import { viPlace } from '@/lib/vi/places';

export interface BirthFormState {
  name: string;
  year: string;
  month: string;
  day: string;
  clockHour: string;
  clockMinute: string;
  unknownTime: boolean;
  province: string;
  city: string;
  longitude: number;
  gender: 'male' | 'female';
  /** Vắng = Trung Quốc (dữ liệu cũ, link chia sẻ cũ lưu tên tỉnh chữ Hán). Form mới mặc định Việt Nam. */
  country?: BirthCountry;
}

/** Kinh độ giữ chỗ khi chọn Việt Nam mà chưa chọn tỉnh — không dùng để hiệu chỉnh (formSolarTime). */
const VN_PLACEHOLDER_LONGITUDE = 105;

interface BirthFormProps {
  onSubmit: (info: BirthInfo) => void;
  loading?: boolean;
  initialData?: Partial<BirthFormState>;
  onFormSave?: (data: BirthFormState) => void;
  /** 隐藏内部「立即起盘」按钮（合盘等场景由父级统一触发） */
  hideSubmit?: boolean;
}

/** 检查日期是否合法 */
function isValidDate(y: number, m: number, d: number): boolean {
  if (!y || !m || !d) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export default function BirthForm({ onSubmit, loading, initialData, onFormSave, hideSubmit }: BirthFormProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [form, setForm] = useState<BirthFormState>({
    name: initialData?.name ?? '',
    year: initialData?.year ?? '',
    month: initialData?.month ?? '',
    day: initialData?.day ?? '',
    clockHour: initialData?.clockHour ?? '8',
    clockMinute: initialData?.clockMinute ?? '0',
    unknownTime: initialData?.unknownTime ?? false,
    province: initialData?.province ?? '',
    city: initialData?.city ?? '',
    longitude: initialData?.longitude ?? 120,
    gender: initialData?.gender ?? 'male',
    // Dữ liệu cũ có ngày sinh / nơi sinh mà không có country → Trung Quốc; form trống → Việt Nam
    country: initialData?.country ?? (initialData?.year || initialData?.province ? 'CN' : 'VN'),
  });
  const isVN = formCountry(form) === 'VN';

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  // Giới tính không chọn sẵn: chỉ coi là đã chọn khi dữ liệu cũ truyền vào có giới tính hoặc người dùng bấm
  const [genderChosen, setGenderChosen] = useState(Boolean(initialData?.gender));

  // 表单状态变化时实时同步给父级（合盘等场景下父级靠这个收集双方数据）
  useEffect(() => {
    onFormSave?.({ ...form });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const cityList = useMemo(() => {
    if (isVN) return [];
    const prov = PROVINCES.find(p => p.name === form.province);
    return prov ? prov.cities : [];
  }, [form.province, isVN]);
  const vnProvince = isVN ? findVnProvince(form.province) : undefined;
  // Tên tỉnh cũ (dữ liệu / link trước 1/7/2025) → hiển thị theo đơn vị mới + mục con «X (cũ)»
  const vnSelected = isVN ? canonicalVnPlace(form.province, form.city) : undefined;

  // Một implementation duy nhất (lib/ziwei/share.ts) cho canh giờ hiển thị và BirthInfo khi lập lá số
  const solar = useMemo(() => formSolarTime(form), [form]);
  const branch = solar.branch;

  const correctionMin = Math.round(solar.correctionMinutes);
  const vnZoneLabel = solar.zone
    ? (solar.zone.localMeanTime ? 'giờ trung bình địa phương (chưa có giờ chuẩn)' : `${formatUtcOffset(solar.zone)} · kinh tuyến chuẩn ${Number((solar.meridian ?? 105).toFixed(3))}°E`)
    : 'UTC+7 · kinh tuyến chuẩn 105°E (chọn đủ ngày sinh để xác định múi giờ lịch sử)';
  const vnZoneWarning = solar.zone && solar.zone.offsetMinutes !== 420
    ? `⚠ ${solar.zone.note ?? 'Giai đoạn này Việt Nam không dùng UTC+7'} — giờ bạn nhập được hiểu theo ${formatUtcOffset(solar.zone)}.`
    : '';
  const vnTransitionWarning = solar.zone?.transition === 'ambiguous'
    ? `⚠ Giờ này lặp lại hai lần do đồng hồ được lùi lại; hệ thống hiểu theo lần đầu (${formatUtcOffset(solar.zone)}).`
    : solar.zone?.transition === 'nonexistent'
      ? `⚠ Giờ này không có trên đồng hồ do được vặn nhanh lúc đổi múi giờ; hệ thống hiểu theo ${formatUtcOffset(solar.zone)} (trước khi đổi).`
      : '';
  const shichenInfo = SHICHEN[branch];

  // ─── 校验逻辑 ───────────────────────────────────────────
  const y = parseInt(form.year) || 0;
  const m = parseInt(form.month) || 0;
  const d = parseInt(form.day) || 0;

  const errors = {
    year: !form.year ? 'Vui lòng chọn năm sinh'
      : y < 1900 || y > 2026 ? 'Năm hợp lệ: 1900–2026'
      : '',
    month: !form.month ? 'Vui lòng chọn tháng' : '',
    day: !form.day ? 'Vui lòng chọn ngày'
      : form.year && form.month && !isValidDate(y, m, d) ? `Tháng ${m} không có ngày ${d}`
      : '',
    // Việt Nam trước 13/6/1975: múi giờ khác theo miền → phải biết nơi sinh (và khu vực, nếu tỉnh mới vắt qua sông Bến Hải)
    province: vnProvinceRequired(form) ? vnProvinceRequiredMessage(form) : '',
    gender: genderChosen ? '' : 'Vui lòng chọn giới tính',
  };
  const hasError = Object.values(errors).some(Boolean);

  // ─── 完成度（用于进度条） ────────────────────────────────
  const steps = [
    !!form.year && !!form.month && !!form.day && !errors.year && !errors.month && !errors.day,
    isVN ? !!form.province : !!form.province && !!form.city,
    form.unknownTime || (!!form.clockHour && !!form.clockMinute),
    genderChosen,
  ];
  const completedSteps = steps.filter(Boolean).length;

  // ─── Summary chip：全部必填完成后显示 ───────────────────
  const showSummary = steps[0] && steps[2] && !hasError;
  const summaryText = showSummary
    ? [
        `${d}/${m}/${y}`,
        viPlace(form.city || form.province),
        form.unknownTime ? 'Không rõ giờ sinh' : `giờ ${viBranch(branch)}`,
        genderChosen ? (form.gender === 'male' ? 'Nam' : 'Nữ') : '',
      ].filter(Boolean).join(' · ')
    : '';

  const handleCountry = (country: BirthCountry) => {
    if (country === formCountry(form)) return;
    setForm({ ...form, country, province: '', city: '', longitude: country === 'VN' ? VN_PLACEHOLDER_LONGITUDE : 120 });
  };

  const handleProvince = (prov: string) => {
    if (isVN) {
      setForm({ ...form, province: prov, city: '', longitude: findVnProvince(prov)?.longitude ?? VN_PLACEHOLDER_LONGITUDE });
      return;
    }
    const provData = PROVINCES.find(p => p.name === prov);
    const firstCity = provData?.cities[0];
    setForm({ ...form, province: prov, city: firstCity?.name || '', longitude: firstCity?.longitude ?? 120 });
  };

  const handleCity = (cityName: string) => {
    if (isVN) {
      const province = vnSelected?.province ?? form.province;
      setForm({ ...form, province, city: cityName, longitude: resolveVnPlace(province, cityName)?.longitude ?? VN_PLACEHOLDER_LONGITUDE });
      return;
    }
    const prov = PROVINCES.find(p => p.name === form.province);
    const cityData = prov?.cities.find(c => c.name === cityName);
    setForm({ ...form, city: cityName, longitude: cityData?.longitude ?? 120 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({ year: true, month: true, day: true });
    if (hasError) return;
    onFormSave?.({ ...form });
    // 统一走 lib/ziwei/share.ts 的转换：它负责晚子时换日（23:00–23:59 按次日排盘）。
    // 在这里手拼 BirthInfo 会绕过这条规则，使 /chart 与 /heming 对同一份输入排出相差一天的盘。
    // Cờ «không rõ giờ» gắn ở đây chứ không trong formToBirthInfo: hàm đó phải giữ nguyên đầu ra
    // (test đối chiếu từng trường với bản gốc), cờ chỉ dùng để trang lá số và AI nói rõ là giả định giờ Tý.
    const info = formToBirthInfo(form);
    onSubmit(form.unknownTime ? { ...info, unknownTime: true } : info);
  };

  // ─── 样式变量 ────────────────────────────────────────────
  const bg = isDark ? 'rgba(8,16,40,0.85)' : 'rgba(255,255,255,0.92)';
  const border = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(200,160,60,0.2)';
  // 暗色模式标签提亮：从 rgba(74,112,144,1) → rgba(180,200,225,0.9)
  const labelClr = isDark ? 'rgba(180,200,225,0.9)' : 'rgba(120,80,10,0.55)';
  const inputBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,252,240,0.8)';
  const inputBorder = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(200,160,60,0.25)';
  // 输入文字提亮：从 #c8d8f0 → #e8eef8
  const inputClr = isDark ? '#e8eef8' : '#2a1a00';
  const focusBorder = isDark ? 'rgba(212,168,67,0.5)' : 'rgba(180,120,20,0.5)';
  const errorClr = isDark ? '#f87171' : '#dc2626';
  const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,250,235,0.7)';
  const panelBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(200,160,60,0.2)';
  const goldText = isDark ? '#d4a843' : '#7a5008';
  const summaryBg = isDark ? 'rgba(37,99,235,0.12)' : 'rgba(37,99,235,0.07)';
  const summaryBorder = isDark ? 'rgba(37,99,235,0.35)' : 'rgba(37,99,235,0.25)';
  const summaryClr = isDark ? 'rgba(147,197,253,0.9)' : 'rgba(37,99,235,0.85)';

  const inputStyle = {
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    color: inputClr,
    borderRadius: '14px',
    padding: '10px 14px',
    fontSize: '13px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
  } as React.CSSProperties;

  const errorInputStyle = { ...inputStyle, borderColor: errorClr };

  function FieldError({ msg }: { msg: string }) {
    return (
      <AnimatePresence>
        {msg && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18 }}
            style={{ color: errorClr, fontSize: '11px', marginTop: '4px' }}
          >
            ✕ {msg}
          </motion.p>
        )}
      </AnimatePresence>
    );
  }

  const showErr = (field: string) => touched[field] || submitAttempted;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: bg, border: `1px solid ${border}`, borderRadius: '24px', padding: '28px', backdropFilter: 'blur(20px)' }}
    >
      {/* 标题 */}
      <h3 style={{ color: goldText, fontSize: '12px', letterSpacing: '0.2em', textAlign: 'center', marginBottom: '20px', fontWeight: 500 }}>
        ── Nhập ngày giờ sinh ──
      </h3>

      {/* ── 进度条 ── */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
        {steps.map((done, i) => (
          <motion.div
            key={i}
            animate={{ background: done ? (isDark ? '#d4a843' : '#b07820') : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(200,160,60,0.15)') }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1, height: '2px', borderRadius: '2px' }}
          />
        ))}
      </div>

      {/* ── 性别：đặt đầu form, không chọn sẵn (chọn nhầm Nam/Nữ là sai chiều đại hạn) ── */}
      <div style={{ marginBottom: '20px' }}>
        <div aria-hidden style={{ display: 'block', fontSize: '13px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>Giới tính</div>
        <div role="radiogroup" aria-label="Giới tính" style={{ display: 'flex', gap: '10px' }}>
          {(['male', 'female'] as const).map(g => {
            const active = genderChosen && form.gender === g;
            const isMale = g === 'male';
            const accent = isMale ? '37,99,235' : '225,29,72';
            return (
              <motion.button
                key={g}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => { setForm({ ...form, gender: g }); setGenderChosen(true); }}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '14px',
                  fontSize: '13px',
                  fontWeight: 500,
                  border: `1px solid ${active ? `rgba(${accent},0.6)` : inputBorder}`,
                  background: active ? `rgba(${accent},0.08)` : inputBg,
                  color: active ? `rgba(${accent},0.9)` : (isDark ? 'rgba(190,205,225,0.7)' : 'rgba(100,80,40,0.4)'),
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              >
                {isMale ? '♂ Nam' : '♀ Nữ'}
              </motion.button>
            );
          })}
        </div>
        <FieldError msg={submitAttempted ? errors.gender : ''} />
      </div>

      {/* ── 姓名 ── */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>Họ tên (không bắt buộc)</label>
        <input
          type="text"
          placeholder="Nhập họ tên"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = focusBorder; }}
          onBlur={e => { e.target.style.borderColor = inputBorder; }}
        />
      </div>

      {/* ── 出生日期 ── */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>Ngày sinh (dương lịch)</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          <div>
            <select
              value={form.year}
              onChange={e => { setForm({ ...form, year: e.target.value }); setTouched(t => ({ ...t, year: true })); }}
              style={showErr('year') && errors.year ? errorInputStyle : inputStyle}
              required
            >
              <option value="">Năm</option>
              {Array.from({ length: 127 }, (_, i) => 2026 - i).map(yr => (
                <option key={yr} value={String(yr)}>{yr}</option>
              ))}
            </select>
            <FieldError msg={showErr('year') ? errors.year : ''} />
          </div>
          <div>
            <select
              value={form.month}
              onChange={e => { setForm({ ...form, month: e.target.value }); setTouched(t => ({ ...t, month: true })); }}
              style={showErr('month') && errors.month ? errorInputStyle : inputStyle}
              required
            >
              <option value="">Tháng</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(mo => (
                <option key={mo} value={String(mo)}>Tháng {mo}</option>
              ))}
            </select>
            <FieldError msg={showErr('month') ? errors.month : ''} />
          </div>
          <div>
            <select
              value={form.day}
              onChange={e => { setForm({ ...form, day: e.target.value }); setTouched(t => ({ ...t, day: true })); }}
              style={showErr('day') && errors.day ? errorInputStyle : inputStyle}
              required
            >
              <option value="">Ngày</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(dy => (
                <option key={dy} value={String(dy)}>Ngày {dy}</option>
              ))}
            </select>
            <FieldError msg={showErr('day') ? errors.day : ''} />
          </div>
        </div>
      </div>

      {/* ── 出生地点 ── */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>Quốc gia nơi sinh</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }} role="radiogroup" aria-label="Quốc gia nơi sinh">
          {([['VN', 'Việt Nam'], ['CN', 'Trung Quốc']] as const).map(([c, label]) => {
            const active = formCountry(form) === c;
            return (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => handleCountry(c)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  border: `1px solid ${active ? focusBorder : inputBorder}`,
                  background: active ? (isDark ? 'rgba(212,168,67,0.1)' : 'rgba(180,120,20,0.08)') : inputBg,
                  color: active ? goldText : (isDark ? 'rgba(190,205,225,0.7)' : 'rgba(100,80,40,0.5)'),
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>Nơi sinh (dùng để hiệu chỉnh giờ mặt trời thật)</label>
        {isVN ? (
          <div style={{ display: 'grid', gridTemplateColumns: vnProvince?.localities ? '1fr 1fr' : '1fr', gap: '8px' }}>
            <select
              value={vnSelected?.province ?? form.province}
              onChange={e => handleProvince(e.target.value)}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = focusBorder; }}
              onBlur={e => { e.target.style.borderColor = inputBorder; }}
            >
              <option value="">Tỉnh / Thành phố (34 đơn vị từ 1/7/2025)</option>
              {VN_PROVINCES.map(p => (
                <option key={p.name} value={p.name}>{p.name}{p.formerProvinces.length > 1 ? ` (gồm ${p.formerProvinces.join(', ')} cũ)` : ''}</option>
              ))}
            </select>
            {vnProvince?.localities && (
              <select
                value={vnSelected?.city ?? form.city}
                onChange={e => handleCity(e.target.value)}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = focusBorder; }}
                onBlur={e => { e.target.style.borderColor = inputBorder; }}
              >
                <option value="">Khu vực: {vnProvince.capital} (trung tâm hành chính)</option>
                {vnProvince.localities.map(l => (
                  <option key={l.name} value={l.name}>{l.name}{l.seat ? ` · ${l.seat}` : ''}</option>
                ))}
              </select>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <select
              value={form.province}
              onChange={e => handleProvince(e.target.value)}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = focusBorder; }}
              onBlur={e => { e.target.style.borderColor = inputBorder; }}
            >
              <option value="">Tỉnh / Thành phố trực thuộc</option>
              {PROVINCES.map(p => (
                <option key={p.name} value={p.name}>{viPlace(p.name)}</option>
              ))}
            </select>
            <select
              value={form.city}
              onChange={e => handleCity(e.target.value)}
              disabled={!form.province}
              style={{ ...inputStyle, opacity: form.province ? 1 : 0.45 }}
              onFocus={e => { e.target.style.borderColor = focusBorder; }}
              onBlur={e => { e.target.style.borderColor = inputBorder; }}
            >
              <option value="">{form.province ? 'Thành phố' : 'Chọn tỉnh trước'}</option>
              {cityList.map(c => (
                <option key={c.name} value={c.name}>{viPlace(c.name)}</option>
              ))}
            </select>
          </div>
        )}
        {/* Hiện ngay khi đã có ngày sinh (cả ở /heming, nơi form không có nút lập lá số riêng) */}
        <FieldError msg={errors.province} />
        <AnimatePresence mode="wait">
          {isVN && solar.place ? (
            <motion.div
              key="vn-location-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: '10px', color: isDark ? 'rgba(180,210,235,0.85)' : 'rgba(100,70,10,0.5)', marginTop: '5px' }}
            >
              <p>
                {solar.place.name}{solar.place.seat ? ` (${solar.place.seat})` : ''} · Kinh độ {solar.place.longitude.toFixed(2)}°E · {vnZoneLabel} · Hiệu chỉnh {correctionMin > 0 ? '+' : ''}{correctionMin} phút
              </p>
              {vnZoneWarning && <p style={{ color: isDark ? '#fbbf24' : '#b45309', marginTop: '3px' }}>{vnZoneWarning}</p>}
              {vnTransitionWarning && <p style={{ color: isDark ? '#fbbf24' : '#b45309', marginTop: '3px' }}>{vnTransitionWarning}</p>}
            </motion.div>
          ) : isVN ? (
            <motion.p
              key="vn-location-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: '10px', color: isDark ? 'rgba(165,185,210,0.7)' : 'rgba(140,100,20,0.45)', marginTop: '5px' }}
            >
              * Sinh từ 13/6/1975 trở đi mà chưa chọn nơi sinh thì không hiệu chỉnh giờ mặt trời thật (canh giờ tính thẳng theo giờ đồng hồ đã nhập); sinh trước mốc này bắt buộc chọn nơi sinh. Nên chọn tỉnh/thành để tự động hiệu chỉnh theo kinh độ và múi giờ Việt Nam lúc sinh.
            </motion.p>
          ) : form.province ? (
            <motion.p
              key="location-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: '10px', color: isDark ? 'rgba(180,210,235,0.85)' : 'rgba(100,70,10,0.5)', marginTop: '5px' }}
            >
              {form.city ? viPlace(form.city) : '(hãy chọn thành phố)'} · Kinh độ {form.longitude.toFixed(1)}°E · Giờ Bắc Kinh UTC+8, kinh tuyến chuẩn 120°E · Chênh lệch {correctionMin > 0 ? '+' : ''}{correctionMin} phút
            </motion.p>
          ) : (
            <motion.p
              key="location-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: '10px', color: isDark ? 'rgba(165,185,210,0.7)' : 'rgba(140,100,20,0.45)', marginTop: '5px' }}
            >
              * Nghê Hải Hạ luận mệnh theo giờ mặt trời thật; nên điền nơi sinh để tự động hiệu chỉnh canh giờ
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── 出生时间 ── */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>{isVN ? 'Giờ sinh (giờ đồng hồ tại Việt Nam lúc sinh)' : 'Giờ sinh (giờ Bắc Kinh, UTC+8)'}</label>
        <div style={{ borderRadius: '14px', padding: '12px', background: panelBg, border: `1px solid ${panelBorder}`, opacity: form.unknownTime ? 0.45 : 1, pointerEvents: form.unknownTime ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            <select
              value={form.clockHour}
              onChange={e => setForm({ ...form, clockHour: e.target.value })}
              style={inputStyle}
            >
              {Array.from({ length: 24 }, (_, i) => i).map(h => (
                <option key={h} value={String(h)}>{h.toString().padStart(2, '0')} giờ</option>
              ))}
            </select>
            <select
              value={form.clockMinute}
              onChange={e => setForm({ ...form, clockMinute: e.target.value })}
              style={inputStyle}
            >
              {Array.from({ length: 60 }, (_, i) => i).map(min => (
                <option key={min} value={String(min)}>{min.toString().padStart(2, '0')} phút</option>
              ))}
            </select>
          </div>
          {/* 真太阳时结果 */}
          <div style={{ textAlign: 'center', padding: '4px 0' }}>
            <span style={{ fontSize: '10px', color: isDark ? 'rgba(170,195,220,0.75)' : 'rgba(140,100,20,0.5)' }}>Giờ mặt trời thật → </span>
            <span style={{ fontSize: '15px', color: goldText, fontWeight: 600, letterSpacing: '0.04em' }}>
              giờ {viBranch(branch)}
            </span>
            {shichenInfo && (
              <span style={{ fontSize: '10px', color: isDark ? 'rgba(170,195,220,0.75)' : 'rgba(140,100,20,0.5)', marginLeft: '4px' }}>
                ({shichenInfo.range})
              </span>
            )}
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={form.unknownTime}
            onChange={e => setForm({ ...form, unknownTime: e.target.checked })}
            style={{ width: '14px', height: '14px', borderRadius: '4px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '13px', color: labelClr }}>
            Không biết giờ sinh (lá số sẽ tạm lập theo giờ Tý, kết quả kém chính xác)
          </span>
        </label>
      </div>

      {/* ── 确认信息 Summary Chip ── */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto', marginBottom: 12 }}
            exit={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div style={{
              background: summaryBg,
              border: `1px solid ${summaryBorder}`,
              borderRadius: '12px',
              padding: '9px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '12px', color: summaryClr }}>✓</span>
              <span style={{ fontSize: '11px', color: summaryClr, letterSpacing: '0.03em', flex: 1 }}>
                {summaryText}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 提交按钮 ── */}
      {!hideSubmit && <motion.button
        type="submit"
        disabled={loading}
        whileHover={loading ? {} : { scale: 1.01 }}
        whileTap={loading ? {} : { scale: 0.98 }}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '16px',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          background: loading
            ? (isDark ? 'rgba(212,168,67,0.15)' : 'rgba(180,120,20,0.15)')
            : (isDark
              ? 'linear-gradient(135deg, rgba(180,130,40,0.9), rgba(240,200,80,0.9))'
              : 'linear-gradient(135deg, #9a6210, #c88020)'),
          color: loading ? (isDark ? 'rgba(212,168,67,0.4)' : 'rgba(120,80,10,0.4)') : (isDark ? '#08080a' : '#fff8e8'),
          boxShadow: loading ? 'none' : (isDark ? '0 4px 20px rgba(212,168,67,0.2)' : '0 4px 16px rgba(140,100,20,0.25)'),
          transition: 'all 0.2s',
        }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }}
            />
            Đang lập lá số Tử Vi…
          </span>
        ) : 'Lập lá số ngay · Giải mã vận mệnh'}
      </motion.button>}
    </motion.form>
  );
}

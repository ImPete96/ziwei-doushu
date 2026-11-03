/**
 * 排盘流派配置 — 9 类排盘流派开关 + 默认值 + 持久化
 *
 * 数据源：按通行口径整理（详见 docs/school-alignment.md）
 *
 * 用户在 chart 页设置面板切换，立即重新排盘
 */

import type { BrightnessSchool } from './school-data';

// ─── 9 类流派配置 ───────────────────────────────────────────────────────

/** 1. 14 主星亮度表 */
export type BrightnessSchoolOption = 'default' | BrightnessSchool;

/** 2. 庚年四化（5 种变体）*/
export type GengYearSihua =
  | 'GYWYT'   // 阳武阴同（主流默认口径，与 iztro 一致）
  | 'GYWTY'   // 阳武同阴（科忌互换说）
  | 'GYWFT'   // 阳武府同
  | 'GYWFX'   // 阳武府相
  | 'GYWTX';  // 阳武同相

/** 3. 安天马 */
export type TianmaSchool = 'year-branch' | 'month-branch';

/** 4. 安天空 */
export type TiankongSchool = 'normal' | 'shun-jia-shi';

/** 5. 截空旬空 */
export type JiekongSchool = 'single' | 'double' | 'zhanyan';

/** 6. 安魁钺 */
export type KuiyueSchool = 'qs1' | 'qs2' | 'zhong-yiming' | 'network';

/** 7. 安天使天伤 */
export type TianshiTianshangSchool = 'normal' | 'zhongzhou';

/** 8. 安长生十二神 */
export type ChangshengSchool = 'yin-yang-shun-ni' | 'shui-tu' | 'huo-tu';

/** 9. 晚子时处理 */
export type LateZishi =
  | 'next-day'           // 视为次日（主流默认口径 + 我们当前）
  | 'current-day'        // 视为当日（倪师派）
  | 'all-current'        // 日柱当日时柱当日（八字）
  | 'day-cur-time-next'; // 日柱当日时柱次日（八字）

/** 10. 闰月处理（用户反馈：倪师派要求闰月归下月）*/
export type LeapMonth =
  | 'split'         // 分半（前 15 天归上月，后 15 天归下月）— ★我们默认 = 主流排盘默认口径「月中分界」（2026-09-05 150 组金标准盘对照：9 张闰月后半月盘唯此口径逐星全同）
  | 'next-month'    // 整月归下月（倪师派：闰四月当五月）
  | 'prev-month'    // 整月当本月普通月（闰四月当四月）— 可选口径「视为本月」；早先 2.6 万盘验证针对的是另一套参照引擎，与金标准盘默认口径不一致
  | 'origin-month'; // 不调整（闰四月仍标闰月，iztro fixLeap=false）

// ─── 完整配置对象 ──────────────────────────────────────────────────────

export interface SchoolConfig {
  brightnessSchool: BrightnessSchoolOption;
  gengYearSihua: GengYearSihua;
  tianmaSchool: TianmaSchool;
  tiankongSchool: TiankongSchool;
  jiekongSchool: JiekongSchool;
  kuiyueSchool: KuiyueSchool;
  tianshiTianshang: TianshiTianshangSchool;
  changshengSchool: ChangshengSchool;
  lateZishi: LateZishi;
  leapMonth: LeapMonth;
}

/** 默认配置 = 对齐主流排盘默认口径（辅星六煞杂曜+四化+运限 穷举零差异；闰月口径=整月归本月）*/
/**
 * ★ 2026-09-05 默认闰月口径 prev-month → split：150 组金标准盘对照，随机 100 盘 0 排星差异，
 * 唯一系统性差异是 9 张闰月后半月盘——金标准盘默认「月中分界」(split)，Metis 旧默认整月归本月；切 split 后逐星全同。
 * 站长 2026-09-05 拍板改默认。algorithm / school-patches / yunxian-palace 的兜底默认都引用这一个常量，别再各写字面量。
 */
export const DEFAULT_LEAP_MONTH: LeapMonth = 'split';

/** 四个合法闰月口径，供运行时校验（引擎对非法 policy 抛 RangeError，分享链接解析在到达引擎前回落默认）。 */
const LEAP_MONTH_VALUES: readonly LeapMonth[] = ['split', 'prev-month', 'next-month', 'origin-month'];

export const SCHOOL_DEFAULT_CONFIG: SchoolConfig = {
  brightnessSchool: 'default',           // = 《斗数全书》（algorithm.ts 把 'default' 当 QS 用，对齐主流排盘默认口径，10-20 改）
  gengYearSihua: 'GYWYT',                // 阳武阴同
  tianmaSchool: 'year-branch',           // 依据年支
  tiankongSchool: 'normal',              // 常规
  jiekongSchool: 'double',               // 正副双星
  kuiyueSchool: 'qs1',                   // 斗数全书歌诀理解1
  tianshiTianshang: 'normal',            // 常规
  changshengSchool: 'yin-yang-shun-ni',  // 区分阴阳顺逆
  lateZishi: 'next-day',                 // 视为次日
  leapMonth: DEFAULT_LEAP_MONTH,         // 闰月分半（主流排盘默认口径「月中分界」，150 组金标准盘对照验证）
};

// ─── localStorage 持久化 key ───────────────────────────────────────────
export const SCHOOL_CONFIG_LS_KEY = 'ziwei-school-config-v1';
/** 2026-09-05 闰月默认 prev-month→split 的一次性迁移标记（见 loadSchoolConfig） */
export const SCHOOL_LEAP_MIGRATED_KEY = 'ziwei-school-leap-split-migrated';

/**
 * ★ 2026-10-20 键名统一改名：早期版本存在 `ziwei-<旧名>-config-v1` / `ziwei-<旧名>-leap-split-migrated`。
 * 新键还没有时，把旧键里的流派配置（认 brightnessSchool 字段）与闰月迁移标记搬过来、删掉旧键；只认这两种形状，不碰别的键。
 */
function migrateLegacyKeys(): void {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k) keys.push(k); }
    if (localStorage.getItem(SCHOOL_CONFIG_LS_KEY) === null) {
      for (const k of keys) {
        if (k === SCHOOL_CONFIG_LS_KEY || !/^ziwei-[a-z]+-config-v1$/.test(k)) continue;
        const raw = localStorage.getItem(k);
        let parsed: unknown = null;
        try { parsed = raw ? JSON.parse(raw) : null; } catch { /* 不是流派配置 */ }
        if (!parsed || typeof parsed !== 'object' || !('brightnessSchool' in parsed)) continue;
        localStorage.setItem(SCHOOL_CONFIG_LS_KEY, raw as string);
        localStorage.removeItem(k);
        break;
      }
    }
    for (const k of keys) {
      if (k === SCHOOL_LEAP_MIGRATED_KEY || !/^ziwei-[a-z]+-leap-split-migrated$/.test(k)) continue;
      if (localStorage.getItem(SCHOOL_LEAP_MIGRATED_KEY) === null) localStorage.setItem(SCHOOL_LEAP_MIGRATED_KEY, localStorage.getItem(k) ?? '1');
      localStorage.removeItem(k);
    }
  } catch { /* localStorage 被禁：照旧走默认 */ }
}

/**
 * 读 localStorage 配置（安全 fallback 到默认）
 * 浏览器端调用，服务端返回默认
 */
export function loadSchoolConfig(): SchoolConfig {
  if (typeof window === 'undefined') return SCHOOL_DEFAULT_CONFIG;
  migrateLegacyKeys();
  try {
    const raw = localStorage.getItem(SCHOOL_CONFIG_LS_KEY);
    if (!raw) return SCHOOL_DEFAULT_CONFIG;
    const parsed = JSON.parse(raw) as Partial<SchoolConfig>;
    // ★ 2026-09-05 一次性迁移：旧默认 prev-month 是被整份存进 localStorage 的（抽屉存完整配置），分不清「默认」还是「手选」；
    //   而旧选项本身就标着「默认」，选它的人要的也是对齐默认口径 → 统一迁到新默认 split，只迁一次（迁移标记），之后再手选 prev-month 就尊重
    if (parsed.leapMonth === 'prev-month' && !localStorage.getItem(SCHOOL_LEAP_MIGRATED_KEY)) {
      parsed.leapMonth = DEFAULT_LEAP_MONTH;
      try { localStorage.setItem(SCHOOL_LEAP_MIGRATED_KEY, '1'); localStorage.setItem(SCHOOL_CONFIG_LS_KEY, JSON.stringify({ ...SCHOOL_DEFAULT_CONFIG, ...parsed })); } catch { /* noop */ }
    }
    return normalizeBrightness({ ...SCHOOL_DEFAULT_CONFIG, ...parsed });
  } catch {
    return SCHOOL_DEFAULT_CONFIG;
  }
}

/**
 * ★ 2026-10-18 默认项与它底层的那张表只留一项（站长：两项排出来一样，别并排摆）。
 * ★ 2026-10-20 默认改成《斗数全书》（主流排盘默认口径，见 algorithm.ts setBrightnessSchool），归并方向随之改：
 *   手选 QS（本机存的、分享链接 bs=QS）一律当默认，勾落在「《斗数全书》派（默认）」；
 *   XD2 不再归并——它现在是单独一项「现代修正 v2」，手选了就尊重。
 *   10-18 到 10-20 之间被归成 'default' 的老 XD2 选择分不出来，随默认一起变成全书（站长定：跟默认口径走）。
 */
function normalizeBrightness(cfg: SchoolConfig): SchoolConfig {
  return cfg.brightnessSchool === 'QS' ? { ...cfg, brightnessSchool: 'default' } : cfg;
}

/** 保存配置到 localStorage */
export function saveSchoolConfig(cfg: SchoolConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SCHOOL_CONFIG_LS_KEY, JSON.stringify(cfg));
  } catch { /* localStorage 满或被禁 */ }
}

/** 重置为默认 */
export function resetSchoolConfig(): void {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(SCHOOL_CONFIG_LS_KEY); } catch { /* noop */ }
}

// ─── 配置 → URL query 双向转换（用于分享带流派的命盘）────────────────────

/**
 * 流派 URL 参数 key 全集 — 与 configToParams 输出一一对应，10 类配置 10 个 key。
 *
 * ★ 2026-06-12 修「分享链接丢闰月口径」：chart 页此前两处手写 key 数组判断
 *   「URL 是否带流派参数」，都漏了 'lm'（闰月归属）——用户改成 next-month 后分享，
 *   对方打开 ?lm=next-month 被无视、按默认闰月口径排出不同的盘。
 *   今后判断一律复用本常量；configToParams 加字段时必须同步加这里。
 */
export const SCHOOL_PARAM_KEYS = ['bs', 'gys', 'tm', 'tk', 'jk', 'ky', 'tst', 'cs', 'lz', 'lm'] as const;

/** SchoolConfig → URL params（紧凑形式：?bs=qs&sh=GYWTY...）*/
export function configToParams(cfg: SchoolConfig): Record<string, string> {
  const out: Record<string, string> = {};
  if (cfg.brightnessSchool !== 'default') out.bs = cfg.brightnessSchool;
  if (cfg.gengYearSihua !== 'GYWYT') out.gys = cfg.gengYearSihua;
  if (cfg.tianmaSchool !== 'year-branch') out.tm = cfg.tianmaSchool;
  if (cfg.tiankongSchool !== 'normal') out.tk = cfg.tiankongSchool;
  if (cfg.jiekongSchool !== 'double') out.jk = cfg.jiekongSchool;
  if (cfg.kuiyueSchool !== 'qs1') out.ky = cfg.kuiyueSchool;
  if (cfg.tianshiTianshang !== 'normal') out.tst = cfg.tianshiTianshang;
  if (cfg.changshengSchool !== 'yin-yang-shun-ni') out.cs = cfg.changshengSchool;
  if (cfg.lateZishi !== 'next-day') out.lz = cfg.lateZishi;
  if (cfg.leapMonth !== DEFAULT_LEAP_MONTH) out.lm = cfg.leapMonth;   // 老分享链接不带 lm 的，现按新默认 split 解析（与主流排盘默认口径一致）
  return out;
}

/** URLSearchParams → SchoolConfig（缺省字段用默认值填充）*/
export function paramsToConfig(params: URLSearchParams): SchoolConfig {
  return normalizeBrightness({
    brightnessSchool: (params.get('bs') as BrightnessSchoolOption) || SCHOOL_DEFAULT_CONFIG.brightnessSchool,
    gengYearSihua: (params.get('gys') as GengYearSihua) || SCHOOL_DEFAULT_CONFIG.gengYearSihua,
    tianmaSchool: (params.get('tm') as TianmaSchool) || SCHOOL_DEFAULT_CONFIG.tianmaSchool,
    tiankongSchool: (params.get('tk') as TiankongSchool) || SCHOOL_DEFAULT_CONFIG.tiankongSchool,
    jiekongSchool: (params.get('jk') as JiekongSchool) || SCHOOL_DEFAULT_CONFIG.jiekongSchool,
    kuiyueSchool: (params.get('ky') as KuiyueSchool) || SCHOOL_DEFAULT_CONFIG.kuiyueSchool,
    tianshiTianshang: (params.get('tst') as TianshiTianshangSchool) || SCHOOL_DEFAULT_CONFIG.tianshiTianshang,
    changshengSchool: (params.get('cs') as ChangshengSchool) || SCHOOL_DEFAULT_CONFIG.changshengSchool,
    lateZishi: (params.get('lz') as LateZishi) || SCHOOL_DEFAULT_CONFIG.lateZishi,
    // 分享链接的 lm 可能是任意字符串（老链接/手改 URL）；引擎现在对非法 policy 抛
    // RangeError，这里先校验，坏值回落默认口径，别让一张坏链接崩掉整页。
    leapMonth: LEAP_MONTH_VALUES.includes(params.get('lm') as LeapMonth)
      ? (params.get('lm') as LeapMonth)
      : SCHOOL_DEFAULT_CONFIG.leapMonth,
  });
}

// ─── UI 显示用：每个开关的所有选项 + 中文标签 ──────────────────────────

export const SCHOOL_OPTIONS = {
  // ★ 2026-06-17 统一格式(用户要求):每组【默认项】固定排第一,且 desc 统一以「默认 · xxx」开头
  brightnessSchool: [
    // ★ 10-20 默认项 = 《斗数全书》（主流排盘默认口径「星曜亮度依据斗数全书」），底层就是 QS 表，所以不再另列 QS
    { value: 'default', label: 'Phái Đẩu Số Toàn Thư', desc: 'Mặc định · trùng với mặc định của các phần mềm lập lá số phổ biến' },
    { value: 'XD2', label: 'Hiệu chỉnh hiện đại v2', desc: 'Bảng độ sáng hiệu đính hiện đại (bản thứ hai)' },
    { value: 'XD1', label: 'Hiệu chỉnh hiện đại v1', desc: 'Bảng độ sáng hiệu đính hiện đại (bản thứ nhất)' },
    { value: 'ZZ', label: 'Phái Trung Châu', desc: 'Lý thuyết phái Trung Châu' },
  ],
  gengYearSihua: [
    { value: 'GYWYT', label: 'Dương Vũ Âm Đồng', desc: 'Mặc định · trùng với iztro / số đông' },
    { value: 'GYWTY', label: 'Dương Vũ Đồng Âm', desc: 'Thuyết hoán đổi Khoa – Kỵ' },
    { value: 'GYWFT', label: 'Dương Vũ Phủ Đồng' },
    { value: 'GYWFX', label: 'Dương Vũ Phủ Tướng' },
    { value: 'GYWTX', label: 'Dương Vũ Đồng Tướng' },
  ],
  tianmaSchool: [
    { value: 'year-branch', label: 'Theo chi năm', desc: 'Mặc định · an Thiên Mã theo chi năm' },
    { value: 'month-branch', label: 'Theo chi tháng' },
  ],
  tiankongSchool: [
    { value: 'normal', label: 'Cách an thông thường', desc: 'Mặc định · an Thiên Không theo cách thông thường' },
    { value: 'shun-jia-shi', label: 'Thuận cộng giờ sinh' },
  ],
  jiekongSchool: [
    { value: 'double', label: 'Song tinh chính – phó', desc: 'Mặc định · dùng cả sao chính và sao phó' },
    { value: 'single', label: 'Đơn tinh thông thường' },
    { value: 'zhanyan', label: 'Phái Chiêm Nghiệm' },
  ],
  kuiyueSchool: [
    { value: 'qs1', label: 'Đẩu Số Toàn Thư – cách hiểu 1', desc: 'Mặc định · cách hiểu thứ nhất về ca quyết Toàn Thư' },
    { value: 'qs2', label: 'Đẩu Số Toàn Thư – cách hiểu 2', desc: 'Chỉ khác với người sinh năm Canh, Tân, Nhâm, Quý' },
    { value: 'zhong-yiming', label: 'Cách an theo sách của ông Chung Nghĩa Minh' },
    { value: 'network', label: 'Cách an lưu truyền trên mạng' },
  ],
  tianshiTianshang: [
    { value: 'normal', label: 'Cách an thông thường', desc: 'Mặc định · Thân cung ±5 vị trí' },
    { value: 'zhongzhou', label: 'Cách an phái Trung Châu', desc: 'Hoán đổi theo tháng sinh chẵn/lẻ × giới tính' },
  ],
  changshengSchool: [
    { value: 'yin-yang-shun-ni', label: 'Phân âm dương thuận nghịch', desc: 'Mặc định · khởi Trường Sinh theo âm dương thuận nghịch' },
    { value: 'shui-tu', label: 'Thủy Thổ đồng Trường Sinh', desc: 'Điểm khởi Thổ ngũ cục = điểm khởi Thủy nhị cục (Thân)' },
    { value: 'huo-tu', label: 'Hỏa Thổ đồng Trường Sinh', desc: 'Điểm khởi Thổ ngũ cục = điểm khởi Hỏa lục cục (Dần)' },
  ],
  lateZishi: [
    { value: 'next-day', label: 'Tính sang ngày hôm sau', desc: 'Mặc định · cách làm phổ biến' },
    { value: 'current-day', label: 'Tính là ngày hôm đó', desc: 'Phái Nghê sư' },
    { value: 'all-current', label: 'Trụ ngày hôm đó / trụ giờ hôm đó (Bát tự)' },
    { value: 'day-cur-time-next', label: 'Trụ ngày hôm đó / trụ giờ hôm sau (Bát tự)' },
  ],
  // ★ 2026-06-17 全站约定:每组默认选项一律排第一；去「天机」二字(避商标侵权)
  // ★ 2026-09-05 默认改为分半：主流排盘默认口径「月中分界」，150 组金标准盘对照唯此口径逐星全同
  leapMonth: [
    { value: 'split', label: 'Chia đôi', desc: 'Mặc định · "lấy giữa tháng làm ranh giới", trùng với mặc định của các phần mềm lập lá số phổ biến (15 ngày đầu tính vào tháng này / 15 ngày sau tính sang tháng sau; đã đối chiếu 150 lá số)' },
    { value: 'prev-month', label: 'Tính là tháng này', desc: 'Cả tháng tư nhuận được lập như tháng tư thường' },
    { value: 'next-month', label: 'Tính sang tháng sau', desc: 'Phái Nghê sư (cả tháng tư nhuận được lập như tháng năm)' },
    { value: 'origin-month', label: 'Giữ tháng nhuận', desc: 'Không điều chỉnh, tháng tư nhuận vẫn ghi là tháng nhuận' },
  ],
} as const;

/** 10 类配置的中文标签（用于 UI 标题）*/
export const SCHOOL_LABELS: Record<keyof SchoolConfig, string> = {
  brightnessSchool: 'Bảng độ sáng tinh diệu',
  gengYearSihua: 'Tứ Hóa năm Canh',
  tianmaSchool: 'An Thiên Mã',
  tiankongSchool: 'An Thiên Không',
  jiekongSchool: 'An Triệt Không, Tuần Không',
  kuiyueSchool: 'An Khôi Việt',
  tianshiTianshang: 'An Thiên Sứ, Thiên Thương',
  changshengSchool: 'Trường sinh thập nhị thần',
  lateZishi: 'Giờ Tý muộn',
  leapMonth: 'Quy thuộc tháng nhuận',
};

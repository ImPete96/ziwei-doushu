'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import type { TimeView } from './TimeNav';
import { viPalaceFull, viSihua, viStar } from '@/lib/vi/terms';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  hidden?: boolean; // don't show user bubble for auto/topic messages
  /** Tin báo lỗi: không gửi lại cho AI, có nút Thử lại */
  error?: boolean;
}

type ApiMessage = { role: 'user' | 'assistant'; content: string };

/** Lịch sử gửi cho API: bỏ tin báo lỗi và tin trả lời rỗng (lượt bị dừng trước khi có chữ) */
function toApiMessages(msgs: Message[]): ApiMessage[] {
  return msgs.filter(m => !m.error && m.content.trim()).map(m => ({ role: m.role, content: m.content }));
}

interface SelectedSiHua {
  starName: string;
  siHua: string;
  view: TimeView;
}

interface InsightPanelProps {
  chart: ZiweiChart;
  selectedPalace?: Palace | null;
  selectedSiHua?: SelectedSiHua | null;
}

const TOPICS = [
  { key: 'overview',     label: 'Mệnh cách' },
  { key: 'love',        label: 'Tình cảm' },
  { key: 'career',      label: 'Sự nghiệp' },
  { key: 'wealth',      label: 'Tài vận' },
  { key: 'health',      label: 'Sức khỏe' },
  { key: 'personality', label: 'Tính cách' },
] as const;

// Prompt ẩn gửi cho AI: yêu cầu trả lời bằng tiếng Việt, giữ cú pháp **【Tiêu đề】** để AiContent tách mục.
const TOPIC_PROMPTS: Record<string, string> = {
  overview: `Hãy viết phần tổng quan mệnh cách bằng tiếng Việt, theo cấu trúc sau:

**【Định tính mệnh cách】**
Một câu khái quát cách cục cốt lõi của lá số và khí chất của mệnh chủ.

**【Luận chính tinh】**
Đặc tính cốt lõi của chính tinh cung Mệnh, dẫn lời hoặc quan điểm của Nghê Hải Hạ.

**【Tam phương tứ chính】**
Phân tích liên động ba cung Tài Bạch, Quan Lộc, Thiên Di và cách cục tổng thể.

**【Đại hạn hiện tại】**
Chiều hướng vận thế của Đại hạn hiện tại và những việc đáng lưu tâm nhất.

**【Ưu thế và lưu ý】**
Ưu thế bẩm sinh trong lá số, cùng các rủi ro hoặc bài học cần lưu ý.`,

  love: `Hãy phân tích chuyên sâu vận tình cảm hôn nhân bằng tiếng Việt, theo cấu trúc sau:

**【Cách cục tình cảm】**
Một câu định tính mệnh cách về tình cảm.

**【Phân tích cung Phu Thê】**
Chính tinh, Tứ Hóa của cung Phu Thê và lời giải cụ thể theo hệ Nghê Hải Hạ.

**【Liên động Tam phương】**
Ảnh hưởng của các cung liên quan đến tình cảm.

**【Vận tình cảm Đại hạn hiện tại】**
Chiều hướng tình cảm và các mốc then chốt trong 10 năm hiện tại.

**【Lời khuyên thực tế】**
Lời khuyên tình cảm cụ thể, khả thi.`,

  career: `Hãy phân tích chuyên sâu vận sự nghiệp bằng tiếng Việt, theo cấu trúc sau:

**【Cách cục sự nghiệp】**
Một câu định tính mệnh cách sự nghiệp, nên làm công hay nên khởi nghiệp.

**【Phân tích cung Quan Lộc】**
Chính tinh, Tứ Hóa của cung Quan Lộc và nhận định của Nghê sư về cách phối hợp này.

**【Liên động cung Tài Bạch】**
Quan hệ giữa tài vận và sự nghiệp, phân tích nguồn tiền.

**【Vận sự nghiệp Đại hạn hiện tại】**
Chiều hướng sự nghiệp trong 10 năm hiện tại.

**【Lời khuyên thực tế】**
Hướng đi, ngành nghề và chiến lược phù hợp.`,

  wealth: `Hãy phân tích chuyên sâu tài vận bằng tiếng Việt, theo cấu trúc sau:

**【Cách cục tài vận】**
Một câu định tính kiểu tài vận, là tài chủ động hay tài bị động.

**【Phân tích cung Tài Bạch】**
Chính tinh, Tứ Hóa của cung Tài Bạch, nguồn của cải và cách tiền lưu chuyển.

**【Cung Điền Trạch (kho tiền)】**
Phân tích khả năng tích lũy và vận bất động sản.

**【Tài vận Đại hạn hiện tại】**
Chiều hướng tài vận hiện tại và các điểm cần lưu ý.

**【Lời khuyên quản lý tài chính】**
Lời khuyên tài chính cụ thể.`,

  health: `Hãy phân tích vận sức khỏe bằng tiếng Việt, theo cấu trúc sau:

**【Chính tinh cung Tật Ách】**
Tinh diệu cung Tật Ách và ý nghĩa về sức khỏe.

**【Rủi ro chính】**
Kết hợp lý thuyết Tý Ngọ lưu chú của Nghê Hải Hạ, phân tích các nguy cơ sức khỏe chính và bộ phận cần chú ý.

**【Xu hướng sức khỏe theo Đại hạn】**
Xu hướng sức khỏe hiện tại và các giai đoạn then chốt.

**【Lời khuyên phòng ngừa】**
Các điểm cần chú ý cụ thể và hướng dưỡng sinh.`,

  personality: `Hãy phân tích chuyên sâu đặc điểm tính cách bằng tiếng Việt, theo cấu trúc sau:

**【Tính cách theo chính tinh cung Mệnh】**
Đặc điểm tính cách cốt lõi của chính tinh cung Mệnh, dẫn lời Nghê sư.

**【Tổng hợp tính cách Tam phương】**
Ảnh hưởng của ba cung Tài Bạch, Quan Lộc, Thiên Di đến tính cách, phác họa toàn cảnh.

**【Kiểu quan hệ với người khác】**
Cách tương tác với người khác, phong cách đối nhân xử thế.

**【Ưu thế và bài học đời người】**
Ưu thế bẩm sinh, cùng những bài học đời người cần đối diện.`,
};

const PALACE_ROLES: Record<string, string> = {
  '命宫':   'bản thân, tính cách, cách cục tiên thiên',
  '兄弟宫': 'quan hệ anh em, người cộng sự',
  '夫妻宫': 'quan hệ tình cảm, tình trạng hôn nhân',
  '子女宫': 'duyên con cái, quan hệ cấp dưới',
  '财帛宫': 'nguồn tài vận, cách kiếm thu nhập',
  '疾厄宫': 'sức khỏe thể chất, tai nạn',
  '迁移宫': 'cơ hội khi ra ngoài, cục diện giao tế',
  '交友宫': 'vòng bạn bè, quý nhân, tiểu nhân',
  '官禄宫': 'thành tựu sự nghiệp, địa vị xã hội',
  '田宅宫': 'bất động sản, môi trường gia đình',
  '福德宫': 'hưởng thụ tinh thần, phúc phần nội tâm',
  '父母宫': 'quan hệ cha mẹ, giấy tờ khế ước',
};

/** Render AI markdown: **【Title】** → gold header, **bold** → strong */
function AiContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        // Model nhỏ hay thêm "### " trước tiêu đề **【…】**
        const sectionMatch = line.trim().match(/^(?:#+\s*)?\*\*【(.+?)】\*\*$/);
        if (sectionMatch) {
          return (
            <div key={i} className="pt-3 pb-0.5 first:pt-0">
              <span className="text-[14px] font-semibold tracking-wide" style={{ color: 'var(--t-gold)' }}>
                【{sectionMatch[1]}】
              </span>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-1" />;
        const parts = line.split(/\*\*(.+?)\*\*/);
        return (
          <div key={i} className="text-[15px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>
            {parts.map((part, j) =>
              j % 2 === 0
                ? part
                : <strong key={j} className="font-medium" style={{ color: 'var(--t-text)' }}>{part}</strong>
            )}
          </div>
        );
      })}
      {streaming && (
        <span
          className="inline-block w-1.5 h-3 ml-0.5 animate-pulse rounded-sm align-middle"
          style={{ background: 'var(--t-gold)', opacity: 0.6 }}
        />
      )}
    </div>
  );
}

export default function InsightPanel({ chart, selectedPalace, selectedSiHua }: InsightPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string>('overview');
  const messagesRef = useRef<Message[]>([]); // always-current copy for closures
  const loadingRef = useRef(false);
  const autoLoaded = useRef(false);
  const [pendingPalace, setPendingPalace] = useState<Palace | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const lastSiHuaKey = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep refs in sync
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-generate 命格总览 on mount
  useEffect(() => {
    if (autoLoaded.current) return;
    autoLoaded.current = true;
    sendMessage(TOPIC_PROMPTS.overview, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Chọn cung chỉ hiện nút "Luận cung này"; người dùng bấm mới gọi AI (tránh tốn lượt khi chỉ xem Tam phương)
  useEffect(() => {
    setPendingPalace(selectedPalace ?? null);
  }, [selectedPalace]);

  // Đồng hồ chờ: model chạy trên máy có thể mất vài phút trước khi ra chữ đầu tiên
  useEffect(() => {
    if (!loading) { setElapsed(0); return; }
    const started = Date.now();
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(id);
  }, [loading]);

  const analyzePalace = (palace: Palace) => {
    if (loadingRef.current) return;
    setPendingPalace(null);
    const majorStars = palace.stars.filter(s => s.type === 'major');
    const starDesc = majorStars.length > 0
      ? majorStars.map(s => `${viStar(s.name)}${s.siHua ? ' ' + viSihua(s.siHua) : ''}`).join(', ')
      : 'vô chính diệu (mượn sao cung đối)';
    // iztro 宫名除命宫外不带「宫」字，两种写法都查
    const role = PALACE_ROLES[palace.name] ?? PALACE_ROLES[`${palace.name}宫`] ?? '';
    const palaceVi = viPalaceFull(palace.name);

    const prompt = `Hãy phân tích trọng điểm 【${palaceVi}】${role ? ` (chủ quản: ${role})` : ''}, chính tinh của cung là ${starDesc}. Trả lời bằng tiếng Việt, theo cấu trúc sau:

**【Định tính cung vị】**
Ý nghĩa của ${palaceVi} trong lá số và nhận định tổng thể về cách phối hợp tinh diệu này.

**【Luận chính tinh】**
Lời giải theo hệ Nghê Hải Hạ về chính tinh ở cung này, dẫn quan điểm cụ thể.

**【Liên động Tam phương tứ chính】**
Ảnh hưởng của các cung Tam phương tứ chính đến cung này.

**【Lời khuyên thực tế】**
Lời khuyên cụ thể dựa trên cung này.`;

    sendMessage(prompt, true);
  };

  // 注入四化飞化分析
  useEffect(() => {
    if (!selectedSiHua) return;
    const key = `${selectedSiHua.starName}-${selectedSiHua.siHua}-${selectedSiHua.view}`;
    if (key === lastSiHuaKey.current) return;
    lastSiHuaKey.current = key;

    // 找出该星所在宫位
    const palaceOfStar = chart.palaces.find(p =>
      p.stars.some(s => s.name === selectedSiHua.starName)
    );
    const palaceName = palaceOfStar ? viPalaceFull(palaceOfStar.name) : 'cung chưa xác định';
    const viewLabel = selectedSiHua.view === 'daxian' ? 'Đại hạn' : 'Lưu niên';
    const starVi = viStar(selectedSiHua.starName);
    const huaVi = viSihua(selectedSiHua.siHua);

    const prompt = `Hãy phân tích ảnh hưởng phi hóa của 【${viewLabel}: ${starVi} ${huaVi}】. Trả lời bằng tiếng Việt, theo cấu trúc sau:

**【Ý nghĩa cơ bản của ${huaVi}】**
Ý nghĩa cốt lõi của ${huaVi} trong hệ Nghê Hải Hạ, và ý nghĩa đặc biệt của ${starVi} ${huaVi}.

**【Ảnh hưởng cung rơi vào】**
${starVi} ${huaVi} rơi vào 【${palaceName}】, lĩnh vực cung này chủ quản chịu ảnh hưởng gì, Nghê sư giải thế nào.

**【Đường phi hóa Tam phương tứ chính】**
Sau khi ${huaVi} nhập ${palaceName}, ảnh hưởng liên động đến Tam phương tứ chính (cung đối, hai cung tam hợp).

**【Ảnh hưởng vận thế hiện tại】**
Trong chiều thời gian ${viewLabel}, ảnh hưởng cụ thể của ${huaVi} này đến vận thế gần đây của mệnh chủ.

**【Lời khuyên thực tế】**
Lời khuyên cụ thể, làm được, dựa trên Tứ Hóa này.`;

    sendMessage(prompt, true);
  }, [selectedSiHua]); // eslint-disable-line react-hooks/exhaustive-deps

  const streamResponse = async (apiMessages: ApiMessage[]) => {
    const controller = new AbortController();
    abortRef.current = controller;
    let started = false;
    let serverError = false;
    let assistantText = '';
    const show = (content: string) => setMessages(prev => {
      const updated = [...prev];
      updated[updated.length - 1] = { role: 'assistant', content };
      return updated;
    });
    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Máy chủ chỉ cần ngày giờ sinh để an lại lá số; không gửi họ tên
        body: JSON.stringify({ chart: { birthInfo: { ...chart.birthInfo, name: undefined } }, messages: apiMessages }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      started = true;

      // Ghép theo dòng: một sự kiện SSE có thể bị cắt giữa hai lần đọc
      const handle = (line: string) => {
        if (!line.startsWith('data: ')) return;
        const data = line.slice(6);
        if (data === '[DONE]') return;
        try {
          const obj = JSON.parse(data) as { delta?: { text?: string }; error?: boolean };
          assistantText += obj.delta?.text ?? '';
          if (obj.error) serverError = true;
          show(assistantText);
        } catch { /* skip */ }
      };
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf('\n')) >= 0) {
          handle(buffer.slice(0, nl));
          buffer = buffer.slice(nl + 1);
        }
      }
      handle(buffer + decoder.decode());
      // Máy chủ báo lỗi bằng một sự kiện có error: true → đánh dấu tin để hiện nút Thử lại
      if (serverError) {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: assistantText, error: true };
          return updated;
        });
      }
    } catch (e) {
      if (controller.signal.aborted) {
        if (started) show(assistantText ? `${assistantText}\n\n(Đã dừng.)` : '(Đã dừng.)');
      } else {
        console.error('[InsightPanel]', e);
        const errorMsg: Message = { role: 'assistant', content: 'Chưa luận giải được lúc này. Bạn thử lại nhé.', error: true };
        setMessages(prev => (started ? [...prev.slice(0, -1), errorMsg] : [...prev, errorMsg]));
      }
    } finally {
      abortRef.current = null;
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const stopStreaming = () => abortRef.current?.abort();

  /** Bỏ tin báo lỗi cuối và gửi lại đúng lịch sử trước đó */
  const retry = () => {
    if (loadingRef.current) return;
    const kept = messagesRef.current.filter(m => !m.error);
    messagesRef.current = kept;
    setMessages(kept);
    loadingRef.current = true;
    setLoading(true);
    streamResponse(toApiMessages(kept));
  };

  const sendMessage = (text: string, hidden = false) => {
    if (!text.trim() || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const userMsg: Message = { role: 'user', content: text, hidden };
    // Capture current messages synchronously via ref (avoids stale closure)
    const apiMessages = toApiMessages([...messagesRef.current, userMsg]);

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    streamResponse(apiMessages);
  };

  const handleTopicClick = (topicKey: string) => {
    if (loadingRef.current) return;
    setActiveTopic(topicKey);
    sendMessage(TOPIC_PROMPTS[topicKey], true);
  };

  const handleSend = () => {
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden card-glass">

      {/* ── Topic buttons ── */}
      <div className="flex-shrink-0 px-2 pt-2.5 pb-2" style={{ borderBottom: '1px solid var(--t-border)' }}>
        {/* Nhãn tiếng Việt dài hơn bản gốc, 6 cột trong khung ~380px sẽ dính chữ: luôn 2 hàng × 3 */}
        <div className="grid grid-cols-3 gap-1">
          {TOPICS.map(t => {
            const isActive = activeTopic === t.key;
            return (
              <button
                key={t.key}
                onClick={() => handleTopicClick(t.key)}
                aria-disabled={loading}
                aria-pressed={isActive}
                className={`py-1.5 px-0.5 text-[12px] leading-tight font-medium rounded-lg transition-all duration-150 whitespace-nowrap ${loading ? 'opacity-40 cursor-not-allowed' : ''}`}
                style={{
                  background: isActive ? 'rgba(212,168,67,0.12)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(212,168,67,0.3)' : 'var(--t-border)'}`,
                  color: isActive ? 'var(--t-gold)' : 'var(--t-faint)',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Messages ── */}
      <div ref={scrollRef} role="log" aria-busy={loading} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            if (msg.role === 'user' && msg.hidden) return null;

            if (msg.role === 'user') {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div
                    className="max-w-[85%] rounded-xl px-3 py-2 text-[14px] leading-relaxed"
                    style={{
                      background: 'rgba(212,168,67,0.08)',
                      border: '1px solid rgba(212,168,67,0.18)',
                      color: 'var(--t-gold)',
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              );
            }

            // Assistant message
            const isLastMsg = i === messages.length - 1;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className="text-[11px] tracking-widest mb-2 flex items-center gap-1.5"
                  style={{ color: 'var(--t-faint)' }}
                >
                  <span style={{ color: 'var(--t-gold)', opacity: 0.4 }}>✦</span>
                  Luận giải mệnh lý
                </div>
                <AiContent text={msg.content} streaming={loading && isLastMsg} />
                {msg.error && isLastMsg && !loading && (
                  <button
                    type="button"
                    onClick={retry}
                    className="mt-2 px-3 py-1.5 rounded-lg text-[13px] font-medium"
                    style={{ border: '1px solid var(--t-border-acc)', color: 'var(--t-gold)' }}
                  >
                    Thử lại
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Đang chờ chữ đầu tiên: tin cuối chưa phải câu trả lời có nội dung */}
        {loading && !(messages.at(-1)?.role === 'assistant' && messages.at(-1)?.content) && (
          <div className="flex items-center gap-3 py-2" style={{ color: 'var(--t-faint)' }}>
            <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--t-gold)' }} />
            <span className="text-[14px]">
              Đang luận giải… {elapsed > 0 && <span className="tabular-nums">{elapsed}s</span>}
              {elapsed >= 20 && <span className="block text-[12px] mt-0.5">Model chạy trên máy có thể mất vài phút.</span>}
            </span>
          </div>
        )}
      </div>

      {/* aria-live tách riêng: báo trạng thái ngắn thay vì đọc từng chữ đang chạy */}
      <div className="sr-only" aria-live="polite">{loading ? 'Đang luận giải' : messages.length > 0 ? 'Đã luận giải xong' : ''}</div>

      {/* ── Cung đang chọn: chỉ luận khi người dùng bấm ── */}
      {pendingPalace && (
        <div className="flex-shrink-0 flex items-center justify-between gap-2 px-3 py-2" style={{ borderTop: '1px solid var(--t-border)' }}>
          <span className="text-[13px]" style={{ color: 'var(--t-text2)' }}>
            Đang chọn <strong style={{ color: 'var(--t-gold)' }}>{viPalaceFull(pendingPalace.name)}</strong>
          </span>
          <button
            type="button"
            onClick={() => analyzePalace(pendingPalace)}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg text-[13px] font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'rgba(212,168,67,0.15)', border: '1px solid var(--t-border-acc)', color: 'var(--t-gold)' }}
          >
            Luận cung này
          </button>
        </div>
      )}

      {/* ── Input ── */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2" style={{ borderTop: '1px solid var(--t-border)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            aria-label="Câu hỏi thêm cho AI"
            placeholder="Hỏi thêm, ví dụ: năm nay có nên đổi việc không?"
            disabled={loading}
            className="flex-1 rounded-lg px-3 py-2 text-[14px] transition-colors"
            style={{
              background: 'var(--t-card)',
              border: '1px solid var(--t-border)',
              color: 'var(--t-text)',
            }}
          />
          {loading ? (
            <button
              type="button"
              onClick={stopStreaming}
              className="px-3 py-2 rounded-lg text-[14px] font-medium transition-all"
              style={{ border: '1px solid var(--t-border)', color: 'var(--t-text2)' }}
            >
              Dừng
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-3 py-2 rounded-lg text-[14px] font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: 'rgba(212,168,67,0.15)',
                border: '1px solid rgba(212,168,67,0.25)',
                color: 'var(--t-gold)',
              }}
            >
              Hỏi
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import type { TimeView } from './TimeNav';
import { useLanguage } from '@/components/LanguageProvider';
interface Message {
  role: 'user' | 'assistant';
  content: string;
  hidden?: boolean; // don't show user bubble for auto/topic messages
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
  { key: 'overview',     labelVi: 'Mệnh Cách',   labelZh: '命格' },
  { key: 'love',        labelVi: 'Tình Duyên',  labelZh: '感情' },
  { key: 'career',      labelVi: 'Sự Nghiệp',   labelZh: '事业' },
  { key: 'wealth',      labelVi: 'Tài Lộc',     labelZh: '财运' },
  { key: 'health',      labelVi: 'Sức Khỏe',    labelZh: '健康' },
  { key: 'personality', labelVi: 'Tính Cách',   labelZh: '性格' },
] as const;
const TOPIC_PROMPTS: Record<string, string> = {
  overview: `请生成命格总览，按以下结构输出：

**【命格定性】**
用一句话概括这个命盘的核心格局与命主气质。

**【主星解读】**
命宫主星的核心特质，引用倪海厦原话或观点。

**【三方四正】**
财、官、迁三宫的联动分析及整体格局。

**【当前大限】**
当下大限运势方向与最值得关注的事项。

**【优势与注意】**
命盘天赋优势，以及需要注意的风险或功课。`,

  love: `请深度分析感情婚姻运，按以下结构输出：

**【感情格局】**
一句话定性感情命格。

**【夫妻宫分析】**
夫妻宫主星、四化，以及倪海厦体系的具体解读。

**【三方联动】**
相关宫位对感情的影响。

**【当前大限感情运】**
当下10年感情走向与关键节点。

**【实际建议】**
具体可行的感情建议。`,

  career: `请深度分析事业运，按以下结构输出：

**【事业格局】**
一句话定性事业命格，宜任职或宜创业。

**【官禄宫分析】**
官禄宫主星、四化，以及倪师对这种配置的判断。

**【财帛宫联动】**
财运与事业的关系，财路来源分析。

**【当前大限事业运】**
当下10年事业走向。

**【实际建议】**
适合的方向、行业与策略。`,

  wealth: `请深度分析财运，按以下结构输出：

**【财运格局】**
一句话定性财运模式，是主动财还是被动财。

**【财帛宫分析】**
财帛宫主星、四化，财富来源与流动模式。

**【田宅宫（财库）】**
积蓄能力与不动产运势分析。

**【当前大限财运】**
当下财运走向与注意事项。

**【理财建议】**
具体的财务建议。`,

  health: `请分析健康运势，按以下结构输出：

**【疾厄宫主星】**
疾厄宫星曜与健康含义。

**【主要风险】**
结合倪海厦子午流注理论，分析主要健康隐患与需关注的部位。

**【大限健康走势】**
当下健康趋势与关键时间段。

**【预防建议】**
具体注意事项与养生方向。`,

  personality: `请深度解析性格特质，按以下结构输出：

**【命宫主星性格】**
命宫主星的核心性格特质，引用倪师原话。

**【三方性格综合】**
财、官、迁三宫对性格的影响，全貌描绘。

**【人际关系模式】**
与他人互动方式、待人处世风格。

**【优势与人生课题】**
天赋优势，以及需要面对的人生功课。`,
};
const TOPIC_PROMPTS_VI: Record<string, string> = {
  overview: `Vui lòng phân tích tổng quan mệnh cách, trả lời bằng tiếng Việt theo cấu trúc sau:

**【Tổng Quan Mệnh Cách】**
Tóm lược bằng một câu về cốt cách, khí chất và bố cục nòng cốt của lá số.

**【Luận Giải Chính Tinh】**
Phân tích đặc tính chủ đạo của các sao tọa thủ cung Mệnh, dẫn giải quan điểm luận mệnh của thầy Nghê Hải Hạ.

**【Tam Phương Tứ Chính】**
Mối tương tác giữa ba cung Tài Bạch, Quan Lộc, Thiên Di chiếu về Mệnh và thế cách tổng thể.

**【Vận Hạn Hiện Tại】**
Phương hướng đại hạn hiện tại và những việc quan trọng nhất cần chú ý.

**【Ưu Thế & Lưu Ý】**
Năng khiếu thiên bẩm cùng với những rủi ro hoặc bài học cuộc đời cần lưu tâm.`,

  love: `Vui lòng phân tích chuyên sâu về tình duyên và hôn nhân, trả lời bằng tiếng Việt theo cấu trúc sau:

**【Cốt Cách Tình Duyên】**
Định hình đặc điểm nhân duyên hôn nhân trong một câu.

**【Phân Tích Cung Phu Thê】**
Chính tinh, phụ tinh, tứ hóa tại cung Phu Thê và luận giải thực tế theo hệ thống Nghê Hải Hạ.

**【Tác Động Tam Phương】**
Ảnh hưởng của các cung chiếu (Quan Lộc, Thiên Di, Phúc Đức) đối với hôn nhân tình cảm.

**【Vận Trình Đại Hạn Hiện Tại】**
Xu hướng tình cảm trong 10 năm hiện tại và các mốc thời gian đáng lưu ý.

**【Lời Khuyên Thiết Thực】**
Gợi ý cụ thể, khả thi để xây dựng và duy trì mối quan hệ hòa hợp.`,

  career: `Vui lòng phân tích chuyên sâu về công danh và sự nghiệp, trả lời bằng tiếng Việt theo cấu trúc sau:

**【Định Hướng Sự Nghiệp】**
Đánh giá tính chất sự nghiệp: phù hợp làm chuyên môn/công chức hay khởi nghiệp, tự doanh.

**【Phân Tích Cung Quan Lộc】**
Chính tinh, tứ hóa tại Quan Lộc và nhận định theo góc nhìn Tử Vi truyền thống kết hợp Nghê Hải Hạ.

**【Liên Kết Cung Tài Bạch】**
Mối liên hệ giữa nguồn thu nhập và con đường phát triển sự nghiệp.

**【Vận Trình Sự Nghiệp Đại Hạn】**
Động thái và triển vọng nghề nghiệp trong giai đoạn 10 năm hiện nay.

**【Chiến Lược Hành Động】**
Ngành nghề phù hợp, chiến lược phát triển và điểm cần phòng ngừa.`,

  wealth: `Vui lòng phân tích chuyên sâu về tài lộc và tiền bạc, trả lời bằng tiếng Việt theo cấu trúc sau:

**【Bố Cục Cung Tài】**
Định hình phương thức kiếm tiền: tài chủ động (tự làm, kinh doanh) hay bị động (lương bổng, tích lũy).

**【Phân Tích Cung Tài Bạch】**
Chính tinh, tứ hóa tại Tài Bạch, dòng tiền và cơ chế luân chuyển tài chính.

**【Cung Điền Trạch (Kho Chứa Tài)】**
Khả năng giữ của, năng lực tích lũy và vận may bất động sản.

**【Vận Trình Tài Vận Đại Hạn】**
Xu thế tài chính hiện tại và các lưu ý quản trị rủi ro tiền bạc.

**【Lời Khuyên Tài Chính】**
Chiến lược đầu tư, phân bổ vốn và giữ gìn tài sản.`,

  health: `Vui lòng phân tích sức khỏe và tật ách, trả lời bằng tiếng Việt theo cấu trúc sau:

**【Chính Tinh Cung Tật Ách】**
Sao tọa thủ cung Tật Ách và ý nghĩa đối với thể trạng nguyên khí.

**【Cơ Quan Cần Lưu Tâm】**
Dựa trên lý thuyết Tý Ngọ Lưu Chú và ngũ hành tạng phủ của thầy Nghê Hải Hạ, chỉ rõ bộ phận cơ thể dễ suy yếu.

**【Xu Hướng Vận Hạn Sức Khỏe】**
Diễn biến thể trạng trong đại hạn hiện tại và các giai đoạn cần cẩn trọng.

**【Phương Pháp Phòng Ngừa】**
Thói quen sinh hoạt, chế độ dưỡng sinh và phòng tránh nguy cơ bất ngờ.`,

  personality: `Vui lòng phân tích chuyên sâu về tính cách và tâm lý, trả lời bằng tiếng Việt theo cấu trúc sau:

**【Tâm Tính Cung Mệnh】**
Cốt lõi tính cách theo các sao thủ Mệnh, đối chiếu góc nhìn của thầy Nghê Hải Hạ.

**【Tính Cách Tổng Hợp Tam Phương】**
Sự tác động từ Tài, Quan, Di vẽ nên bức tranh tâm lý đa chiều.

**【Phương Thức Xã Giao Đối Ngoại】**
Cách thức tương tác, ứng xử với mọi người và phong cách xử thế.

**【Điểm Mạnh & Bài Học Tu Dưỡng】**
Sở trường bẩm sinh và những góc khuất tâm tính cần rèn luyện hoàn thiện.`,
};

const PALACE_ROLES_VI: Record<string, string> = {
  '命宫':   'Bản ngã, tính cách, căn cơ tiên thiên',
  '兄弟宫': 'Quan hệ huynh đệ, bạn bè tri kỷ, đối tác',
  '夫妻宫': 'Tình duyên, phối ngẫu, đời sống hôn nhân',
  '子女宫': 'Duyên con cái, hậu bối, cấp dưới',
  '财帛宫': 'Nguồn tài lộc, năng lực kiếm tiền, lưu chuyển dòng vốn',
  '疾厄宫': 'Thể chất, sức khỏe, tạng phủ, tai ương tật bệnh',
  '迁移宫': 'Cơ hội xuất hành, giao tế xã hội, môi trường bên ngoài',
  '交友宫': 'Vòng bạn bè, cấp dưới, quý nhân hoặc tiểu nhân',
  '官禄宫': 'Công danh sự nghiệp, địa vị xã hội, tinh thần làm việc',
  '田宅宫': 'Bất động sản, sản nghiệp gia đình, tài khố tích lũy',
  '福德宫': 'Đời sống tinh thần, phúc phận, nội tâm hưởng thụ',
  '父母宫': 'Quan hệ cha mẹ, trưởng bối, giấy tờ văn bản pháp lý',
};


const PALACE_ROLES: Record<string, string> = {
  '命宫':   '自我、性格、先天格局',
  '兄弟宫': '兄弟关系、合伙人',
  '夫妻宫': '感情关系、婚姻状态',
  '子女宫': '子女缘分、下属关系',
  '财帛宫': '财运来源、收入方式',
  '疾厄宫': '身体健康、意外',
  '迁移宫': '外出机遇、人际格局',
  '交友宫': '朋友圈、贵人、小人',
  '官禄宫': '事业成就、社会地位',
  '田宅宫': '不动产、家庭环境',
  '福德宫': '精神享受、内心福分',
  '父母宫': '父母关系、文书契约',
};

/** Render AI markdown: **【Title】** → gold header, **bold** → strong */
function AiContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        const sectionMatch = line.match(/^\*\*【(.+?)】\*\*$/);
        if (sectionMatch) {
          return (
            <div key={i} className="pt-3 pb-0.5 first:pt-0">
              <span className="text-[11px] font-semibold tracking-wide" style={{ color: 'var(--t-gold)' }}>
                【{sectionMatch[1]}】
              </span>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-1" />;
        const parts = line.split(/\*\*(.+?)\*\*/);
        return (
          <div key={i} className="text-[11px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>
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
  const { locale, tPalace, tStar, tSiHua } = useLanguage();
  const isVi = locale === 'vi';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string>('overview');
  const messagesRef = useRef<Message[]>([]); // always-current copy for closures
  const loadingRef = useRef(false);
  const autoLoaded = useRef(false);
  const lastPalaceBranch = useRef<number | undefined>(undefined);
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

  // Auto-generate overview on mount
  useEffect(() => {
    if (autoLoaded.current) return;
    autoLoaded.current = true;
    const prompt = isVi ? TOPIC_PROMPTS_VI.overview : TOPIC_PROMPTS.overview;
    sendMessage(prompt, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Inject palace analysis when palace selected
  useEffect(() => {
    if (!selectedPalace || selectedPalace.branch === lastPalaceBranch.current) return;
    lastPalaceBranch.current = selectedPalace.branch;

    const majorStars = selectedPalace.stars.filter(s => s.type === 'major');
    if (isVi) {
      const starDesc = majorStars.length > 0
        ? majorStars.map(s => `${tStar(s.name)}${s.siHua ? ' Hóa ' + tSiHua(s.siHua) : ''}`).join(', ')
        : 'Vô chính diệu (mượn chính tinh cung đối chiếu)';
      const role = PALACE_ROLES_VI[selectedPalace.name] ?? '';
      const palaceNameVi = tPalace(selectedPalace.name);

      const prompt = `Vui lòng phân tích trọng điểm cung【${palaceNameVi}】(Chủ quản: ${role}), cung này có chính tinh tọa thủ là ${starDesc}, xuất kết quả bằng tiếng Việt theo cấu trúc sau:

**【Định Tính Cung Vị】**
Ý nghĩa của cung ${palaceNameVi} trên lá số và nhận định tổng thể về sự phối hợp tinh diệu này.

**【Luận Giải Chính Tinh】**
Đặc tính của các sao khi tọa thủ tại cung này theo quan điểm Nghê Hải Hạ.

**【Tam Phương Tứ Chính Chiếu Về】**
Ảnh hưởng của các cung xung chiếu, tam hợp đối với cung vị này.

**【Lời Khuyên Ứng Dụng】**
Những chỉ dẫn thực tế dựa trên cách bố trí của cung này.`;

      sendMessage(prompt, true);
    } else {
      const starDesc = majorStars.length > 0
        ? majorStars.map(s => `${s.name}${s.siHua ? '化' + s.siHua : ''}`).join('、')
        : '空宫（借对宫）';
      const role = PALACE_ROLES[selectedPalace.name] ?? '';

      const prompt = `请重点分析【${selectedPalace.name}】（主管：${role}），该宫主星为${starDesc}，按以下结构输出：

**【宫位定性】**
${selectedPalace.name}在命盘中的意义，以及这种星曜配置的整体判断。

**【主星解读】**
主星在此宫的倪海厦体系解读，引用具体观点。

**【三方四正联动】**
三方四正宫位对此宫的影响。

**【实际建议】**
基于此宫的具体建议。`;

      sendMessage(prompt, true);
    }
  }, [selectedPalace]); // eslint-disable-line react-hooks/exhaustive-deps

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
    const palaceName = palaceOfStar?.name ?? '未知宫位';

    if (isVi) {
      const palaceNameVi = tPalace(palaceName);
      const starNameVi = tStar(selectedSiHua.starName);
      const siHuaVi = tSiHua(selectedSiHua.siHua);
      const viewLabel = selectedSiHua.view === 'daxian' ? 'Đại Hạn' : 'Lưu Niên';

      const prompt = `Vui lòng phân tích ảnh hưởng phi hóa của【${viewLabel} ${starNameVi} Hóa ${siHuaVi}】, trả lời bằng tiếng Việt theo cấu trúc sau:

**【Ý Nghĩa Căn Bản Của Hóa ${siHuaVi}】**
Bản chất Hóa ${siHuaVi} theo hệ thống Nghê Hải Hạ và ý nghĩa đặc thù khi đi cùng ${starNameVi}.

**【Tác Động Khi Đóng Tại Cung Vị】**
${starNameVi} Hóa ${siHuaVi} an tại【${palaceNameVi}】, ảnh hưởng tới lĩnh vực cung này cai quản như thế nào.

**【Đường Đi Tam Phương Tứ Chính】**
Sự lan tỏa và kích hoạt của Hóa ${siHuaVi} tại ${palaceNameVi} đối với các cung đối xung và tam hợp.

**【Ảnh Hưởng Tới Vận Khí】**
Trong chu kỳ ${viewLabel}, biến động này ảnh hưởng trực tiếp thế nào tới vận trình.

**【Lời Khuyên Ứng Biến】**
Hành động cụ thể nên làm để đón cát tránh hung.`;

      sendMessage(prompt, true);
    } else {
      const viewLabel = selectedSiHua.view === 'daxian' ? '大限' : '流年';

      const prompt = `请分析【${viewLabel}${selectedSiHua.starName}化${selectedSiHua.siHua}】的飞化影响，按以下结构输出：

**【化${selectedSiHua.siHua}基本含义】**
化${selectedSiHua.siHua}在倪海厦体系中的核心含义，以及${selectedSiHua.starName}化${selectedSiHua.siHua}的特殊含义。

**【落宫影响】**
${selectedSiHua.starName}化${selectedSiHua.siHua}落在【${palaceName}】，该宫主管的领域受到何种影响，倪师如何解读。

**【三方四正飞化路径】**
化${selectedSiHua.siHua}入${palaceName}后，对其三方四正（对宫、两个三合宫）的联动影响。

**【当前运势影响】**
在${viewLabel}时间维度下，此化${selectedSiHua.siHua}对命主近期运势的具体影响。

**【实际建议】**
基于此四化的具体可操作建议。`;

      sendMessage(prompt, true);
    }
  }, [selectedSiHua]); // eslint-disable-line react-hooks/exhaustive-deps
  const streamResponse = async (apiMessages: { role: 'user' | 'assistant'; content: string }[]) => {
    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart, messages: apiMessages }),
      });
      if (res.status === 404) throw new Error('api-missing');
      if (!res.ok) throw new Error('请求失败');
      if (!res.body) throw new Error('无响应流');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      setMessages(prev => {
        const clean = prev.filter(m =>
          !m.content.includes('Luận giải thất bại') &&
          !m.content.includes('Phiên bản mã nguồn') &&
          !m.content.includes('开源版不含') &&
          !m.content.includes('解读失败')
        );
        return [...clean, { role: 'assistant', content: '' }];
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const delta = JSON.parse(data).delta?.text ?? '';
            assistantText += delta;
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: 'assistant', content: assistantText };
              return updated;
            });
          } catch { /* skip */ }
        }
      }
    } catch (e) {
      const missing = e instanceof Error && e.message === 'api-missing';
      const errorMsg = missing
        ? (isVi
            ? 'Phiên bản mã nguồn mở chưa kèm API luận giải AI (/api/interpret). Cần cấu hình API key trong mã nguồn theo hướng dẫn README. Quá trình an sao và xem lá số hoàn toàn không cần API key.'
            : '开源版不含 AI 解读接口（/api/interpret），需要你自己实现后才能用，详见 README「快速开始」。排盘本身不需要任何 API Key。')
        : (isVi ? 'Luận giải thất bại, vui lòng thử lại sau.' : '解读失败，请稍后重试。');
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const sendMessage = (text: string, hidden = false) => {
    if (!text.trim() || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const userMsg: Message = { role: 'user', content: text, hidden };
    // Capture current messages synchronously via ref (avoids stale closure)
    const apiMessages = [...messagesRef.current, userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    setMessages(prev => {
      const clean = prev.filter(m =>
        !m.content.includes('Luận giải thất bại') &&
        !m.content.includes('Phiên bản mã nguồn') &&
        !m.content.includes('开源版不含') &&
        !m.content.includes('解读失败')
      );
      return [...clean, userMsg];
    });
    setInput('');
    streamResponse(apiMessages);
  };

  const handleTopicClick = (topicKey: string) => {
    if (loadingRef.current) return;
    setActiveTopic(topicKey);
    const prompt = isVi ? (TOPIC_PROMPTS_VI[topicKey] || TOPIC_PROMPTS[topicKey]) : TOPIC_PROMPTS[topicKey];
    sendMessage(prompt, true);
  };

  const handleSend = () => {
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden card-glass">

      {/* ── Topic buttons ── */}
      <div className="flex-shrink-0 px-2 pt-2.5 pb-2" style={{ borderBottom: '1px solid var(--t-border)' }}>
        <div className="grid grid-cols-6 gap-1">
          {TOPICS.map(t => {
            const isActive = activeTopic === t.key;
            return (
              <button
                key={t.key}
                onClick={() => handleTopicClick(t.key)}
                disabled={loading}
                className="py-1.5 text-[10px] font-medium rounded-lg transition-all duration-150 disabled:opacity-40"
                style={{
                  background: isActive ? 'rgba(212,168,67,0.12)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(212,168,67,0.3)' : 'var(--t-border)'}`,
                  color: isActive ? 'var(--t-gold)' : 'var(--t-faint)',
                }}
              >
                {isVi ? t.labelVi : t.labelZh}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">

        {/* Loading state before first message */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3" style={{ color: 'var(--t-gold)', opacity: 0.1 }}>✦</div>
            <p className="text-[10px] animate-pulse" style={{ color: 'var(--t-faint)' }}>
              {isVi ? 'Đang tạo lời luận giải mệnh cách…' : '命格解读生成中…'}
            </p>
          </div>
        )}
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
                    className="max-w-[85%] rounded-xl px-3 py-2 text-[11px]"
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
                  className="text-[9px] tracking-widest mb-2 flex items-center gap-1.5"
                  style={{ color: 'var(--t-faint)' }}
                >
                  <span style={{ color: 'var(--t-gold)', opacity: 0.4 }}>✦</span>
                  {isVi ? 'Luận Giải Mệnh Lý' : '命理解读'}
                </div>
                <AiContent text={msg.content} streaming={loading && isLastMsg} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Input ── */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2" style={{ borderTop: '1px solid var(--t-border)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={isVi ? 'Hỏi thêm chi tiết, ví dụ: Năm nay có nên đổi công việc không?' : '继续追问，如：今年适合换工作吗？'}
            disabled={loading}
            className="flex-1 rounded-lg px-3 py-2 text-[11px] focus:outline-none transition-colors"
            style={{
              background: 'var(--t-card)',
              border: '1px solid var(--t-border)',
              color: 'var(--t-text)',
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-3 py-2 rounded-lg text-[11px] font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(212,168,67,0.15)',
              border: '1px solid rgba(212,168,67,0.25)',
              color: 'var(--t-gold)',
            }}
          >
            {loading ? '…' : (isVi ? 'Hỏi thêm' : '追问')}
          </button>
        </div>
      </div>

    </div>
  );
}

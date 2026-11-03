'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import StarField from '@/components/StarField';
import { useTheme, type Theme } from '@/components/ThemeProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { LanguageToggle } from '@/components/LanguageToggle';
import AnnouncementModal from '@/components/AnnouncementModal';

// ─── 滚动入场 wrapper ────────────────────────────────────
function FadeIn({
  children, delay = 0, y = 28, className = '',
}: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function WeakBoundary({ line }: { line: string }) {
  // 之前的版本有 1px 实线 + 12px 渐变阴影，主题切换时形成清晰横线很硬。
  // 改为更柔和的 24px 渐变 + 低 opacity，section 衔接更自然。
  return (
    <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
      style={{ background: `linear-gradient(to bottom, ${line}, transparent)`, opacity: 0.45 }} />
  );
}

// ─── 主题切换按钮 ────────────────────────────────────────
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { locale } = useLanguage();
  const isVi = locale === 'vi';
  const isDark = theme === 'dark';
  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      aria-label={isDark ? (isVi ? 'Chuyển sang giao diện sáng' : '切换亮色主题') : (isVi ? 'Chuyển sang giao diện tối' : '切换暗色主题')}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer"
      style={{
        borderColor: isDark ? 'rgba(212,168,67,0.3)' : 'rgba(140,100,20,0.35)',
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,252,242,0.85)',
        transition: 'background 0.35s ease, border-color 0.35s ease',
      }}
    >
      <div className="relative w-10 h-5 rounded-full flex-shrink-0"
        style={{
          background: isDark ? 'rgba(12,24,64,0.95)' : 'rgba(230,195,80,0.55)',
          transition: 'background 0.35s ease',
        }}>
        <motion.div
          animate={{ x: isDark ? 2 : 22 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="absolute top-1 w-3.5 h-3.5 rounded-full"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #b8a050, #e8d090)'
              : 'linear-gradient(135deg, #e89010, #f8d050)',
          }}
        />
      </div>
      <span className="text-[11px] font-medium tracking-wide select-none"
        style={{
          color: isDark ? 'rgba(212,180,100,0.85)' : 'rgba(110,72,8,0.8)',
          transition: 'color 0.35s ease',
        }}>
        {isDark ? (isVi ? 'Tối' : '暗色') : (isVi ? 'Sáng' : '亮色')}
      </span>
    </motion.button>
  );
}

// ─── 主星数据 ────────────────────────────────────────────
const STARS = [
  { name: '紫微', nameVi: 'Tử Vi', titleVi: 'Đế vương chi tinh' },
  { name: '天机', nameVi: 'Thiên Cơ', titleVi: 'Trí tuệ thiện mưu' },
  { name: '太阳', nameVi: 'Thái Dương', titleVi: 'Quang minh lỗi lạc' },
  { name: '武曲', nameVi: 'Vũ Khúc', titleVi: 'Tài tinh cương nghị' },
  { name: '天同', nameVi: 'Thiên Đồng', titleVi: 'Phúc tinh tự tại' },
  { name: '廉贞', nameVi: 'Liêm Trinh', titleVi: 'Tù tinh biến hóa' },
  { name: '天府', nameVi: 'Thiên Phủ', titleVi: 'Tài khố đoan trang' },
  { name: '太阴', nameVi: 'Thái Âm', titleVi: 'Điền trạch nhu mỹ' },
  { name: '贪狼', nameVi: 'Tham Lang', titleVi: 'Đào hoa đa tài' },
  { name: '巨门', nameVi: 'Cự Môn', titleVi: 'Ám tinh biện tài' },
  { name: '天相', nameVi: 'Thiên Tướng', titleVi: 'Ấn tinh phụ tá' },
  { name: '天梁', nameVi: 'Thiên Lương', titleVi: 'Ấm tinh thanh cao' },
  { name: '七杀', nameVi: 'Thất Sát', titleVi: 'Tướng tinh quyết đoán' },
  { name: '破军', nameVi: 'Phá Quân', titleVi: 'Dũng tướng khai sáng' },
];

const STAR_NAME_VI: Record<string, string> = {
  '紫微': 'Tử Vi', '天机': 'Thiên Cơ', '太阳': 'Thái Dương', '武曲': 'Vũ Khúc',
  '天同': 'Thiên Đồng', '廉贞': 'Liêm Trinh', '天府': 'Thiên Phủ', '太阴': 'Thái Âm',
  '贪狼': 'Tham Lang', '巨门': 'Cự Môn', '天相': 'Thiên Tướng', '天梁': 'Thiên Lương',
  '七杀': 'Thất Sát', '破军': 'Phá Quân',
};

const SIHUA_NAME_VI: Record<string, string> = {
  '化禄': 'Hóa Lộc', '化权': 'Hóa Quyền', '化科': 'Hóa Khoa', '化忌': 'Hóa Kỵ',
};

// ─── 功能模块 ────────────────────────────────────────────
const FEATURES = [
  {
    tag: '排盘体系',
    tagVi: 'Hệ thống an sao',
    title: '倪海厦正宗\n紫微斗数',
    titleVi: 'Chính Tông Nghê Hải Hạ\nTử Vi Đẩu Số',
    subtitle: '非简化版，严格遵循倪海厦老师传承',
    subtitleVi: 'Không phải bản rút gọn, tuân thủ nghiêm ngặt truyền thừa thầy Nghê Hải Hạ',
    points: [
      '纳音五行局起盘，不采用网络简化算法',
      '命宫逆数生时、身宫顺数生时，严格对齐教学规则',
      '十四主星与四化飞星按原法推演，结构完整可复核',
    ],
    pointsVi: [
      'An sao Nạp Âm Ngũ Hành Cục chuẩn xác, không dùng thuật toán đơn giản hóa trên mạng',
      'Mệnh Cung nghịch đếm giờ sinh, Thân Cung thuận đếm giờ sinh, chuẩn hóa quy tắc giảng dạy',
      'Mười bốn chính tinh và Tứ Hóa phi tinh suy diễn theo nguyên pháp, kết cấu hoàn chỉnh minh bạch',
    ],
  },
  {
    tag: '命盘呈现',
    tagVi: 'Trình bày lá số',
    title: '完整十四主星\n四化飞星',
    titleVi: 'Đầy đủ 14 Chính Tinh\nvà Tứ Hóa Phi Tinh',
    subtitle: '结构清晰，一眼看懂主轴与重点',
    subtitleVi: 'Cấu trúc sáng rõ, nhận biết trục chính và trọng tâm chỉ trong một ánh nhìn',
    points: [
      '十四主星完整入宫，主星关系清楚可读',
      '辅星与煞星同屏呈现，避免关键信息缺失',
      '庙旺利陷亮度分级，快速识别强弱',
      '点击任意主星即可查看倪海厦老师对该星的详细解读',
    ],
    pointsVi: [
      '14 chính tinh an vị đầy đủ, mối quan hệ tam phương tứ chính trực quan dễ đọc',
      'Phụ tinh và sát tinh hiển thị đồng thời, tránh bỏ sót thông tin mấu chốt',
      'Phân cấp độ sáng Miếu Vượng Lợi Hãm rõ ràng, nhanh chóng nhận diện điểm mạnh yếu',
      'Bấm vào bất kỳ chính tinh nào để xem luận giải chi tiết theo hệ thống thầy Nghê',
    ],
  },
  {
    tag: 'AI 解读',
    tagVi: 'AI Luận giải',
    title: '深度解盘\n不止于算',
    titleVi: 'Luận giải chuyên sâu\nKhông dừng ở tính toán',
    subtitle: '倪海厦体系知识库 × Claude AI',
    subtitleVi: 'Kho tri thức hệ thống Nghê Hải Hạ × Mô hình Claude AI',
    points: [
      '命格分析：从命宫主星出发，结合三方四正，给出全面的性格与人生格局判断',
      '六大维度解读：事业方向、感情婚姻、财运模式、健康注意、家庭关系、子女缘分',
      '大限流年追踪：当前10年大限重点、今年流年宫位的具体提示与行动建议',
      '自由追问：针对你的命盘直接提问，「今年能换工作吗」「什么时候结婚运最好」',
    ],
    pointsVi: [
      'Phân tích mệnh cách: Xuất phát từ Mệnh Cung kết hợp Tam Phương Tứ Chính, luận giải toàn diện tính cách và cục diện cuộc đời',
      'Luận giải 6 phương diện: Định hướng sự nghiệp, hôn nhân tình cảm, tài vận, sức khỏe lưu ý, gia đình, con cái',
      'Theo dõi đại hạn lưu niên: Trọng điểm đại hạn 10 năm hiện tại, cung vị lưu niên năm nay và lời khuyên hành động',
      'Tự do đặt câu hỏi: Đặt câu hỏi trực tiếp cho lá số của bạn như "Năm nay có nên đổi việc?", "Khi nào kết hôn tốt nhất?"',
    ],
  },
  {
    tag: '格局识别',
    tagVi: 'Nhận diện cách cục',
    title: '自动检测\n命盘格局',
    titleVi: 'Tự động nhận diện\nCách cục lá số',
    subtitle: '从星曜组合中发现你的命中注定',
    subtitleVi: 'Khám phá thiên định từ sự hội tụ của các tinh diệu',
    points: [
      '自动识别11种经典格局：紫府同宫、杀破狼格、机月同梁、廉相格、武曲七杀等',
      '辅弼夹命、日月夹命等特殊格局精准检测，并给出倪海厦体系下的标准解读',
      '四化入命宫迁移宫的特殊状况自动标注，提示需关注的人生议题',
      '格局按吉凶等级分层展示，让你一目了然自己命盘中的优势与挑战',
    ],
    pointsVi: [
      'Tự động nhận diện 11 cách cục kinh điển: Tử Phủ Đồng Cung, Sát Phá Lang, Cơ Nguyệt Đồng Lương, Liêm Tướng Cách, Vũ Khúc Thất Sát...',
      'Kiểm tra chính xác cách cục đặc biệt như Tả Hữu Giáp Mệnh, Nhật Nguyệt Giáp Mệnh kèm luận giải tiêu chuẩn Nghê Hải Hạ',
      'Tự động đánh dấu vị trí Tứ Hóa vào Mệnh Cung, Thiên Di Cung nhắc nhở các chủ đề cuộc đời đáng lưu ý',
      'Hiển thị cách cục theo tầng bậc cát hung, giúp bạn nắm bắt ngay lợi thế và thử thách trong lá số',
    ],
  },
];

// ─── 4 大学习板块（hero 后时间轴）──────────────────────────
const SECTIONS = [
  {
    key: 'ziwei',
    name: '紫微',
    nameVi: 'Tử Vi',
    en: 'Zi Wei',
    desc: '14 主星 · 13 宫位 · AI 解读',
    descVi: '14 Chính Tinh · 12 Cung Vị · Luận Giải AI',
    status: 'ready' as const,
    when: '5 月',
    whenVi: 'Tháng 5',
    icon: '◉',
    note: '',
    noteVi: '',
  },
  {
    key: 'tianji',
    name: '天纪',
    nameVi: 'Thiên Kỷ',
    en: 'Tian Ji',
    desc: '紫微 · 周易 · 奇门遁甲',
    descVi: 'Tử Vi · Chu Dịch · Kỳ Môn Độn Giáp',
    status: 'soon' as const,
    when: '6 月',
    whenVi: 'Tháng 6',
    icon: '⊙',
    note: '',
    noteVi: '',
  },
  {
    key: 'diji',
    name: '地纪',
    nameVi: 'Địa Kỷ',
    en: 'Di Ji',
    desc: '倪师未竟之业 · 后辈补注',
    descVi: 'Tâm nguyện dở dang của Nghê Sư · Hậu bối bổ chú',
    status: 'soon' as const,
    when: '6 月',
    whenVi: 'Tháng 6',
    icon: '⊞',
    note: '遗稿研读',
    noteVi: 'Nghiên cứu di cảo',
  },
  {
    key: 'renji',
    name: '人纪',
    nameVi: 'Nhân Kỷ',
    en: 'Ren Ji',
    desc: '内经 · 伤寒 · 金匮 · 针灸',
    descVi: 'Nội Kinh · Thương Hàn · Kim Quỹ · Châm Cứu',
    status: 'soon' as const,
    when: '7 月',
    whenVi: 'Tháng 7',
    icon: '⊕',
    note: '',
    noteVi: '',
  },
];

// ─── 倪海厦核心教义 ──────────────────────────────────────
const NI_TEACHINGS = [
  {
    title: '命宫为本，三方为用',
    titleVi: 'Mệnh Cung làm gốc, Tam Phương làm dụng',
    body: '倪师始终强调，看命必先看命宫。命宫主星决定一个人的基本格局与天生性格，三方（财帛、官禄、迁移）则决定此人的「用武之地」。四宫联动才是完整的人生图景。',
    bodyVi: 'Thầy Nghê luôn nhấn mạnh xem mệnh trước tiên phải xem Mệnh Cung. Chính tinh Mệnh Cung quyết định kết cấu cơ bản và tính cách bẩm sinh, còn Tam Phương (Tài Bạch, Quan Lộc, Thiên Di) quyết định đất dụng võ. Bốn cung liên động mới là bức tranh cuộc đời toàn vẹn.',
  },
  {
    title: '对宫借星，不可忽视',
    titleVi: 'Mượn sao cung đối, không thể xem nhẹ',
    body: '倪师的独到之处在于重视「对宫」。任何宫位若为空宫，必须借对宫星曜来论断，命宫的对面是迁移宫，两者互相影响，这是很多初学者容易忽略的关键。',
    bodyVi: 'Điểm độc đáo của thầy Nghê là hết sức coi trọng cung đối xung. Bất kỳ cung nào nếu vô chính diệu đều phải mượn tinh diệu cung đối để luận đoán. Đối diện Mệnh Cung là Thiên Di Cung, hai cung tương hỗ ảnh hưởng sâu sắc, đây là mấu chốt người mới học rất dễ bỏ qua.',
  },
  {
    title: '四化才是命运的手',
    titleVi: 'Tứ Hóa mới là bàn tay số phận',
    body: '星曜只是基础，四化（化禄、化权、化科、化忌）才是决定运势好坏的关键。同一颗星，有化禄与有化忌，人生轨迹可以截然不同。倪师反复强调：不看四化，命盘只解了一半。',
    bodyVi: 'Tinh diệu chỉ là nền tảng tĩnh, Tứ Hóa (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ) mới là chìa khóa động thái quyết định cát hung. Cùng một ngôi sao, hội Hóa Lộc hay gặp Hóa Kỵ thì quỹ đạo đời người đã rẽ sang hướng khác. Thầy luôn nhắc nhở: Không xem Tứ Hóa thì mới giải lá số được một nửa.',
  },
  {
    title: '大限十年，运势有节',
    titleVi: 'Đại hạn mười năm, vận thế có tiết tấu',
    body: '倪师将人生划分为12个大限，每个大限10年。他认为人在不同的大限宫位，际遇完全不同。了解自己现在走的是哪个大限、该宫位有何星曜，才能真正把握当下的运势。',
    bodyVi: 'Thầy Nghê phân chia đời người thành 12 đại hạn, mỗi đại hạn 10 năm. Con người ở mỗi cung đại hạn khác nhau sẽ có cảnh ngộ và cơ duyên hoàn toàn khác biệt. Hiểu rõ mình đang đi trong đại hạn nào và các tinh diệu tại đó mới có thể nắm chắc thời cơ vận thế trước mắt.',
  },
];

// ─── 主题色彩类型 ─────────────────────────────────────────
export interface ThemeColors {
  bgBase: string;
  navBg: string;
  navBorder: string;
  goldGrad: string;
  goldSolid: string;
  goldLine: string;
  tagText: string;
  textPrimary: string;
  textSecond: string;
  textMuted: string;
  textFaint: string;
  accent: string;
  accentSoft: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  featureBg: string;
  featureBord: string;
  glowTint: string;
  glowBlue: string;
  glowPurple: string;
  niBg: string;
  niBorder: string;
  niDivider: string;
  niCardBg: string;
  niCardBord: string;
  niCardShadow: string;
  starBg: string;
  starBorder: string;
  starText: string;
  ctaBg: string;
  ctaText: string;
  footerText: string;
  scrollLine: string;
  scrollText: string;
  altSection: string;
  quoteBg: string;
}

// ─── 主题色彩 helper ─────────────────────────────────────
function useColors(theme: Theme): ThemeColors {
  const d = theme === 'dark';
  return {
    bgBase:       d ? '#020810'                                : '#f5efe0',
    // nav 用与 bgBase 完全相同的不透明色，避免半透明叠加产生色差带
    navBg:        d ? '#020810'                                : '#f5efe0',
    navBorder:    d ? 'rgba(255,255,255,0.05)'                : 'rgba(160,120,30,0.15)',
    goldGrad:     d ? 'linear-gradient(160deg,#c8993a 0%,#f0d070 40%,#c8993a 70%,#f0c755 100%)'
                    : 'linear-gradient(160deg,#6a4206 0%,#9a6a10 40%,#6a4206 70%,#885010 100%)',
    goldSolid:    d ? '#d4a843'                               : '#8b6410',
    goldLine:     d ? 'rgba(212,168,67,0.4)'                  : 'rgba(140,100,20,0.4)',
    tagText:      d ? 'rgba(212,168,67,0.6)'                  : 'rgba(120,80,10,0.65)',
    // 亮色文字用冷灰系（A 方案核心）：暖底 + 冷字 → 视觉不审美疲劳
    textPrimary:  d ? '#e8eef6'                               : '#1a1d24',
    textSecond:   d ? '#b8c6df'                               : '#3a3f4a',
    textMuted:    d ? '#9db0d0'                               : '#5a6275',
    textFaint:    d ? 'rgba(240,246,255,0.56)'                : '#9da4b3',
    // 冷色 accent（B 方案核心）：呼应暗色 quan 蓝；用于装饰性 glow / 链接 / 高亮
    accent:       d ? '#3a78d4'                               : '#3a5a82',
    accentSoft:   d ? 'rgba(58,120,212,0.18)'                 : 'rgba(58,90,130,0.10)',
    cardBg:       d ? 'rgba(255,255,255,0.05)'                : 'rgba(255,255,255,0.88)',
    cardBorder:   d ? 'rgba(255,255,255,0.10)'                : 'rgba(200,160,60,0.25)',
    cardShadow:   d ? '0 4px 32px rgba(0,0,0,0.5)'           : '0 4px 24px rgba(140,100,20,0.12)',
    featureBg:    d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.75)',
    featureBord:  d ? 'rgba(255,255,255,0.08)'                : 'rgba(200,160,60,0.2)',
    glowTint:     d ? 'rgba(212,168,67,0.07)'                 : 'rgba(180,140,40,0.06)',
    // 亮色 glow 真用蓝/紫——给整体氛围加冷色点缀
    glowBlue:     d ? 'rgba(40,80,160,0.12)'                  : 'rgba(58,90,130,0.06)',
    glowPurple:   d ? 'rgba(120,50,180,0.08)'                 : 'rgba(96,80,140,0.04)',
    niBg:         d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.8)',
    niBorder:     d ? 'rgba(212,168,67,0.2)'                  : 'rgba(180,130,40,0.25)',
    niDivider:    d ? 'rgba(255,255,255,0.08)'                : 'rgba(180,130,40,0.12)',
    niCardBg:     d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.9)',
    niCardBord:   d ? 'rgba(255,255,255,0.08)'                : 'rgba(200,160,60,0.2)',
    niCardShadow: d ? '0 2px 20px rgba(0,0,0,0.4)'           : '0 2px 16px rgba(140,100,20,0.1)',
    starBg:       d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.7)',
    starBorder:   d ? 'rgba(212,168,67,0.22)'                 : 'rgba(160,120,30,0.3)',
    starText:     d ? 'rgba(212,168,67,0.7)'                  : 'rgba(120,80,10,0.7)',
    ctaBg:        d ? 'linear-gradient(135deg,#b8892a,#f0d070,#b8892a)'
                    : 'linear-gradient(135deg,#6a4206,#9a6810,#6a4206)',
    ctaText:      d ? '#08080a'                               : '#f8f3e8',
    footerText:   d ? 'rgba(255,255,255,0.08)'                : '#d0b878',
    scrollLine:   d ? 'rgba(212,168,67,0.3)'                  : 'rgba(140,100,20,0.3)',
    scrollText:   d ? 'rgba(255,255,255,0.12)'                : '#c0a870',
    altSection:   d ? 'rgba(255,255,255,0.02)'                : 'rgba(255,255,255,0.4)',
    quoteBg:      d ? 'rgba(212,168,67,0.04)'                 : 'rgba(255,255,255,0.9)',
  };
}

// ─── 四化简介数据 ─────────────────────────────────────────
const SIHUA_BRIEF: Record<string, { attr: string; attrVi: string; brief: string; briefVi: string }> = {
  '化禄': {
    attr: '吉化·增益',
    attrVi: 'Cát hóa · Tăng ích',
    brief: '福星到宫，主财运与福气增益。所在宫位事物顺遂，能力增强，是命盘中最受欢迎的化星。',
    briefVi: 'Phúc tinh giáng cung, chủ tài vận và phúc khí tăng tiến. Sự việc ở cung vị này thuận buồm xuôi gió, năng lực phát huy mạnh mẽ, là hóa tinh được yêu thích nhất.',
  },
  '化权': {
    attr: '吉化·权威',
    attrVi: 'Cát hóa · Quyền uy',
    brief: '权力星到宫，主掌控与领导力。所在宫位主强势与决断，喜入官禄宫与命宫，主事业上的实权。',
    briefVi: 'Quyền lực tinh giáng cung, chủ kiểm soát và lãnh đạo. Cung tọa chủ thế mạnh và quyết đoán, rất hỷ nhập Quan Lộc và Mệnh Cung, chủ thực quyền trong sự nghiệp.',
  },
  '化科': {
    attr: '吉化·名誉',
    attrVi: 'Cát hóa · Danh dự',
    brief: '科名星到宫，主声誉与贵人缘。所在宫位主文名与考运，有贵人扶持，宜学术、考试与公开场合。',
    briefVi: 'Khoa danh tinh giáng cung, chủ danh tiếng và quý nhân duyên. Cung tọa chủ văn danh, thi cử đỗ đạt, có quý nhân phò trợ, lợi học thuật, khoa bảng và công chúng.',
  },
  '化忌': {
    attr: '凶化·阻碍',
    attrVi: 'Hung hóa · Trở ngại',
    brief: '劫数星到宫，主执念与阻碍。所在宫位需特别关注，该宫人生课题将成为重要考验。',
    briefVi: 'Kiếp số tinh giáng cung, chủ chấp niệm, trắc trở và bài học cuộc đời. Cung vị cần đặc biệt lưu tâm, các chủ đề tại cung này sẽ là thử thách tôi luyện bản thân.',
  },
};

const STAR_BRIEF: Record<string, { attr: string; attrVi: string; brief: string; briefVi: string }> = {
  '紫微': {
    attr: '土·帝王星',
    attrVi: 'Thổ · Đế Vương Tinh',
    brief: '天皇贵星，统御众星。坐命者有孤傲之气，主权威显达，天生具备领导气质，适合独当一面的领导岗位。',
    briefVi: 'Thiên hoàng quý tinh, thống ngự vạn sao. Tọa Mệnh có khí chất uy nghiêm, chủ quyền uy hiển hách, bẩm sinh mang phong thái lãnh đạo, thích hợp vị trí đứng đầu.',
  },
  '天机': {
    attr: '木·智慧星',
    attrVi: 'Mộc · Trí Tuệ Tinh',
    brief: '益寿星，主智谋与变动。聪慧机灵，善于筹谋，心思细腻，宜从事策划、顾问、技术类工作。',
    briefVi: 'Ích thọ chi tinh, chủ mưu lược và biến chuyển. Thông minh lanh lợi, giỏi quyền biến mưu tính, tâm tư tinh tế, thích hợp công tác hoạch định, cố vấn, kỹ thuật.',
  },
  '太阳': {
    attr: '火·官禄主',
    attrVi: 'Hỏa · Quan Lộc Chủ',
    brief: '官禄主星，主声誉与名望。慷慨大度，重视公众形象，利官场与公职，男命力强，入庙时光明磊落。',
    briefVi: 'Quan lộc chủ tinh, chủ danh tiếng và uy tín. Khoan dung độ lượng, trọng hình tượng công chúng, lợi quan trường và chức vụ công, miếu vượng quang minh lỗi lạc.',
  },
  '武曲': {
    attr: '金·财帛主',
    attrVi: 'Kim · Tài Bạch Chủ',
    brief: '财帛主星，主财务与决断。意志坚定，行动果敢，适合财务、金融、军警类职业，孤克之星，利晚婚。',
    briefVi: 'Tài bạch chủ tinh, chủ tài chính và quyết đoán. Ý chí kiên định, hành động quả quyết, hợp ngành tài chính, kinh doanh, quân cảnh; sao có tính cô độc, lợi kết hôn muộn.',
  },
  '天同': {
    attr: '水·福星',
    attrVi: 'Thủy · Phúc Tinh',
    brief: '福德主星，主享乐与人缘。性情温和，人缘极好，注重生活品质，感情细腻，晚年运势佳。',
    briefVi: 'Phúc đức chủ tinh, chủ an lạc và nhân duyên. Tính tình ôn hòa, nhân duyên rất tốt, chú trọng chất lượng cuộc sống, tình cảm tinh tế, hậu vận tốt đẹp.',
  },
  '廉贞': {
    attr: '火·才艺星',
    attrVi: 'Hỏa · Tài Nghệ Tinh',
    brief: '次桃花星，主才艺与情欲。才华出众，感情丰富，适合艺术、政界，多才多艺但需防桃花是非。',
    briefVi: 'Thứ đào hoa tinh, chủ tài nghệ và tình cảm. Tài năng xuất chúng, tình cảm phong phú, phù hợp văn hóa nghệ thuật, chính trường; đa tài đa nghệ song cần phòng thị phi đào hoa.',
  },
  '天府': {
    attr: '土·财库星',
    attrVi: 'Thổ · Tài Khố Tinh',
    brief: '南斗主星，主财库与积蓄。稳重保守，理财能力强，是命盘的稳定力量，适合管理财务与行政。',
    briefVi: 'Nam Đẩu chủ tinh, chủ kho tàng và tích lũy. Điềm đạm cẩn trọng, năng lực quản lý tài chính xuất sắc, là chỗ dựa vững chãi cho lá số, hợp quản lý tài chính và hành chính.',
  },
  '太阴': {
    attr: '水·田宅主',
    attrVi: 'Thủy · Điền Trạch Chủ',
    brief: '田宅主星，主财富与阴柔。细腻温柔，感受力强，女命尤佳，利不动产与积蓄，适合文艺或服务业。',
    briefVi: 'Điền trạch chủ tinh, chủ phú túc và nhu thuận. Tinh tế dịu dàng, nhạy cảm sâu sắc, nữ mệnh càng tốt, lợi bất động sản và tích lũy của cải, hợp nghệ thuật hoặc dịch vụ.',
  },
  '贪狼': {
    attr: '木水·桃花',
    attrVi: 'Mộc Thủy · Đào Hoa',
    brief: '桃花星，主欲望与才艺。多才多艺，欲望旺盛，社交活跃，宜从事艺术、公关、商业，人缘极好。',
    briefVi: 'Đào hoa chi tinh, chủ dục vọng và tài nghệ. Đa tài đa nghệ, nhiều đam mê, giao thiệp rộng rãi, thích hợp nghệ thuật, quan hệ công chúng, thương mại, nhân duyên cực tốt.',
  },
  '巨门': {
    attr: '水·是非星',
    attrVi: 'Thủy · Thị Phi Tinh',
    brief: '暗星，主口才与是非。口才出众，思辨能力强，适合律师、教育、媒体，注意口舌是非，以辩才立身。',
    briefVi: 'Ám tinh, chủ khẩu tài và nghị luận. Hùng biện xuất sắc, tư duy sắc bén, thích hợp luật sư, giáo dục, truyền thông; cẩn trọng thị phi khẩu thiệt, lấy tài biện thuyết lập thân.',
  },
  '天相': {
    attr: '水·印星',
    attrVi: 'Thủy · Ấn Tinh',
    brief: '印星，主辅佐与印绶。善于协调，重视礼节，正直守法，适合幕僚、行政、法律类工作，贵人运佳。',
    briefVi: 'Ấn tinh, chủ phò tá và quyền uy hòa nhã. Giỏi điều phối, coi trọng lễ nghi, chính trực thủ pháp, thích hợp vai trò mưu sĩ, hành chính, tư pháp, vận quý nhân rất vượng.',
  },
  '天梁': {
    attr: '土·荫星',
    attrVi: 'Thổ · Ấm Tinh',
    brief: '荫星，主老成与荫蔽。正直稳重，慈悲心强，老天爷会保佑，适合医疗、社会工作、宗教领域。',
    briefVi: 'Ấm tinh, chủ trường thọ và che chở. Chính trực chín chắn, giàu lòng trắc ẩn, được trời đất chở che hóa giải hoạn nạn, hợp y tế, công tác xã hội, học thuật, tôn giáo.',
  },
  '七杀': {
    attr: '金火·将星',
    attrVi: 'Kim Hỏa · Tướng Tinh',
    brief: '将星，主刚烈与开创。性格刚毅，行动力强，勇于挑战，适合创业、军警、竞争性行业，逢凶化吉。',
    briefVi: 'Tướng tinh, chủ cương nghị và mở đường. Tính cách mạnh mẽ, tính hành động cao, dũng cảm đối mặt thách thức, hợp khởi nghiệp, quân cảnh, ngành cạnh tranh cao, biến hung thành cát.',
  },
  '破军': {
    attr: '水·耗星',
    attrVi: 'Thủy · Hao Tinh',
    brief: '耗星，主变动与开拓。勇于突破，不惧改变，一生变动大但有魄力，适合开拓型工作，走别人没走过的路。',
    briefVi: 'Hao tinh, chủ tiên phong và biến chuyển. Dũng cảm đột phá, không ngại đổi mới, cuộc đời biến động nhưng đầy bản lĩnh, thích hợp công việc khai phá, mở lối đi riêng.',
  },
};

// ─── 功能视觉装饰 ────────────────────────────────────────
function FeatureVisual({ index, colors: c, isVi }: { index: number; colors: ThemeColors; isVi: boolean }) {
  if (index === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5">
        <div className="grid grid-cols-4 gap-1.5 w-72 mx-auto">
          {Array.from({ length: 16 }).map((_, i) => {
            const isCenter = [5, 6, 9, 10].includes(i);
            const isActive = [0, 3, 12, 15].includes(i);
            return (
              <motion.div key={i}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="h-14 rounded-sm flex items-center justify-center text-xs transition-all duration-300"
                style={{
                  border: `1px solid ${isActive ? c.goldLine : c.cardBorder}`,
                  background: isCenter ? 'transparent' : isActive ? c.starBg : c.featureBg,
                  color: isActive ? c.goldSolid : c.textFaint,
                  opacity: isCenter ? 0 : 1,
                }}>
                {isActive ? '★' : ''}
              </motion.div>
            );
          })}
        </div>
        <p className="text-[10px] tracking-widest transition-colors duration-300"
          style={{ color: c.textFaint }}>{isVi ? 'Phương pháp an sao Nghê Hải Hạ' : '倪海厦排盘法'}</p>
      </div>
    );
  }

  if (index === 1) {
    const [sel, setSel] = useState<string | null>(null);
    const selInfo = sel ? (STAR_BRIEF[sel] ?? SIHUA_BRIEF[sel] ?? null) : null;
    return (
      <div className="flex flex-col gap-4 h-full justify-center">
        {[
          { group: isVi ? 'Hệ Tử Vi' : '紫微系', stars: ['紫微', '天机', '太阳', '武曲', '天同', '廉贞'] },
          { group: isVi ? 'Hệ Thiên Phủ' : '天府系', stars: ['天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'] },
        ].map(group => (
          <div key={group.group}>
            <div className="text-[11px] tracking-widest mb-2 transition-colors duration-300"
              style={{ color: c.textFaint }}>{group.group}</div>
            <div className="flex flex-wrap gap-1.5">
              {group.stars.map(s => {
                const displayName = isVi ? (STAR_NAME_VI[s] || s) : s;
                return (
                  <motion.button key={s}
                    onClick={() => setSel(sel === s ? null : s)}
                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="text-xs px-2 py-1 rounded-md cursor-pointer"
                    style={{
                      border: `1px solid ${sel === s ? c.goldSolid : c.goldLine}`,
                      color: c.goldSolid,
                      background: sel === s ? `${c.goldLine}30` : 'transparent',
                      fontWeight: sel === s ? 600 : 400,
                    }}>
                    {displayName}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
        <div>
          <div className="text-[11px] tracking-widest mb-2 transition-colors duration-300"
            style={{ color: c.textFaint }}>{isVi ? 'Tứ Hóa Phi Tinh' : '四化飞星'}</div>
          <div className="flex gap-2 flex-wrap">
            {[['化禄', 'rgba(52,211,153,0.7)'], ['化权', 'rgba(96,165,250,0.7)'], ['化科', 'rgba(250,204,21,0.7)'], ['化忌', 'rgba(248,113,113,0.7)']].map(([label, color]) => {
              const displayLabel = isVi ? (SIHUA_NAME_VI[label] || label) : label;
              return (
                <motion.button key={label}
                  onClick={() => setSel(sel === label ? null : label)}
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="text-xs px-2.5 py-1 rounded-md cursor-pointer"
                  style={{
                    border: `1px solid ${color}`,
                    color,
                    background: sel === label ? `${color.replace('0.7', '0.15')}` : 'transparent',
                    fontWeight: sel === label ? 600 : 400,
                  }}>
                  {displayLabel}
                </motion.button>
              );
            })}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {selInfo && (
            <motion.div key={sel}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl p-4 mt-1.5"
              style={{ border: `1px solid ${c.goldLine}`, background: c.featureBg }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-semibold" style={{ color: c.goldSolid }}>
                  {isVi ? (STAR_NAME_VI[sel!] || SIHUA_NAME_VI[sel!] || sel) : sel}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ color: c.tagText, border: `1px solid ${c.goldLine}` }}>
                  {isVi ? selInfo.attrVi : selInfo.attr}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: c.textSecond }}>
                {isVi ? selInfo.briefVi : selInfo.brief}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (index === 2) {
    const msgs = isVi ? [
      { role: 'user', text: 'Vận trình sự nghiệp năm nay của tôi thế nào?' },
      { role: 'ai', text: 'Mệnh Cung Thiên Cơ Hóa Lộc, năm nay đại hạn đi vào Quan Lộc, tam phương có Tả Phụ tương trợ, sự nghiệp có quý nhân nâng đỡ, thích hợp chủ động mở rộng…' },
      { role: 'user', text: 'Khi nào vận trình tình cảm thăng hoa nhất?' },
    ] : [
      { role: 'user', text: '我今年的事业运势如何？' },
      { role: 'ai', text: '命宫天机化禄，今年大限走官禄宫，三方有左辅相助，事业有贵人提携，适合主动拓展…' },
      { role: 'user', text: '什么时候感情运最好？' },
    ];
    return (
      <div className="flex flex-col gap-2 h-full justify-center">
        {msgs.map((m, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%] text-[11px] px-3 py-2 rounded-lg leading-relaxed"
              style={{
                border: `1px solid ${m.role === 'user' ? c.goldLine : c.cardBorder}`,
                background: m.role === 'user' ? c.starBg : c.featureBg,
                color: m.role === 'user' ? c.goldSolid : c.textSecond,
              }}>
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (index === 3) {
    const patterns = isVi ? [
      { name: 'Sát Phá Lang Cách', desc: 'Mệnh cách khai sáng tiến thủ', ok: true },
      { name: 'Liêm Tướng Cách',   desc: 'Cách cục ấn thụ hành chính', ok: true },
      { name: 'Hóa Kỵ nhập Mệnh', desc: 'Cần chú trọng rèn luyện tâm lý', ok: false },
    ] : [
      { name: '杀破狼格', desc: '开创进取之命', ok: true },
      { name: '廉相格',   desc: '行政印绶之格', ok: true },
      { name: '化忌入命', desc: '需关注心理课题', ok: false },
    ];
    return (
      <div className="flex flex-col gap-3 h-full justify-center">
        {patterns.map((p, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
            style={{
              border: `1px solid ${p.ok ? 'rgba(96,165,250,0.25)' : 'rgba(251,146,60,0.25)'}`,
              background: p.ok ? 'rgba(96,165,250,0.05)' : 'rgba(251,146,60,0.05)',
            }}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: p.ok ? 'rgba(96,165,250,0.6)' : 'rgba(251,146,60,0.6)' }} />
            <div>
              <div className="text-[11px] font-medium"
                style={{ color: p.ok ? 'rgba(147,197,253,0.8)' : 'rgba(253,186,116,0.8)' }}>{p.name}</div>
              <div className="text-[10px]" style={{ color: c.textMuted }}>{p.desc}</div>
            </div>
          </motion.div>
        ))}
        <div className="text-[9px] mt-2 tracking-wider text-center" style={{ color: c.textFaint }}>
          {isVi ? 'Tự động nhận diện 11 cách cục kinh điển' : '自动识别 11 种经典格局'}
        </div>
      </div>
    );
  }

  return null;
}

// ─── 主页 ─────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { locale } = useLanguage();
  const isVi = locale === 'vi';
  const c = useColors(theme);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // 把 body / html 背景同步到 home 主题色，消除半透明 nav 透出 #fafaf9 的色差
  // useLayoutEffect 保证在浏览器绘制前同步更新，避免与根 div 的 transition 不同步
  useLayoutEffect(() => {
    document.documentElement.style.background = c.bgBase;
    document.body.style.background = c.bgBase;
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, [c.bgBase]);

  return (
    <div style={{ background: c.bgBase, transition: 'background 0.35s ease' }} className="overflow-x-hidden">
      {/* 致用户公告——首次访问全屏覆盖，关闭后才进入首页 */}
      <AnnouncementModal />

      <StarField />

      {/* 全局光晕 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowTint} 0%, transparent 70%)` }} />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowBlue} 0%, transparent 70%)` }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowPurple} 0%, transparent 70%)` }} />
      </div>

      {/* ── 顶部导航 ── nav 与 hero 同色（c.bgBase），无 blur 无 border，彻底无色差带 */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 gap-2"
        style={{
          background: c.navBg,
        }}>
        <div className="text-[11px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] font-medium transition-colors duration-300 flex-shrink-0"
          style={{ color: c.goldSolid }}>
          {isVi ? 'TỬ VI ĐẨU SỐ' : '紫微命盘'}
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <LanguageToggle />
          <ThemeToggle />
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/heming')}
            className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
            style={{ border: `1px solid ${c.navBorder}`, color: c.textMuted }}>
            {isVi ? 'Hợp Mệnh' : '合盘'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/chart')}
            className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
            style={{ border: `1px solid ${c.goldLine}`, color: c.goldSolid }}>
            {isVi ? 'Lập Lá Số' : '立即起盘'}
          </motion.button>
        </div>
      </nav>

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[82svh] lg:min-h-[92vh] flex flex-col items-center justify-center px-6 z-10 pb-24 pt-10">
        <motion.div style={{ y: heroY, opacity: heroOpacity, maxWidth: '960px' }} className="text-center w-full mx-auto mt-10">
          {/* 标签行 */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
            <span className="text-[11px] tracking-[0.45em] transition-colors duration-300" style={{ color: c.tagText }}>
              {isVi ? 'TỬ VI ĐẨU SỐ · CHÍNH TÔNG NGHÊ HẢI HẠ' : '紫微斗数 · 倪海厦体系'}
            </span>
            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
          </motion.div>

          {/* 主标题 */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: 'relative', display: 'inline-block' }}>
            <h1
              className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold leading-none mb-5`}
              style={{
                fontSize: 'clamp(56px, 10vw, 124px)',
                letterSpacing: '0.07em',
              }}>
              {isVi ? 'Tử Vi Đẩu Số' : '紫微命盘'}
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-base md:text-lg tracking-[0.18em] mb-2"
            style={{ color: c.textSecond, fontWeight: 500 }}>
            {isVi ? 'Tử Vi mở lối · Thiên Địa Nhân quy tụ · Tôn sư Nghê Hải Hạ' : '紫微为门 · 天地人为路 · 倪海厦为师'}
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="text-xs md:text-sm tracking-[0.3em] mb-6"
            style={{ color: c.textMuted, opacity: 0.85 }}>
            {isVi ? 'AI Luận Giải · Tri Hành Hợp Nhất' : 'AI 答疑 · 知行合一'}
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="text-sm max-w-xl mx-auto leading-relaxed mb-10"
            style={{ color: c.textMuted }}>
            {isVi
              ? 'Nhập ngày tháng năm giờ sinh, an lá số Tử Vi Đẩu Số độc bản — Các chuyên đề Thiên Kỷ, Địa Kỷ, Nhân Kỷ lần lượt ra mắt.'
              : '输入出生年月日时，生成专属紫微斗数命盘 — 后续天纪、地纪、人纪学习模块陆续开放。'}
          </motion.p>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="flex flex-col items-center gap-4">
            <motion.button
              whileHover={{ y: -2, filter: 'brightness(1.06)' }} whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/chart')}
              className="px-12 py-4 font-semibold text-base tracking-widest rounded-full cursor-pointer"
              style={{ background: c.ctaBg, color: c.ctaText }}>
              {isVi ? 'Lập Lá Số Ngay' : '立即起盘'}
            </motion.button>
          </motion.div>

          {/* 十四主星 */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.8 }}
            className="mt-12 grid grid-cols-7 gap-1.5 max-w-[580px] mx-auto">
            {STARS.map((star, i) => (
              <motion.div key={star.name}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.05 + i * 0.03, duration: 0.35 }}
                title={isVi ? `${star.nameVi} - ${star.titleVi}` : star.name}
                className="flex items-center justify-center px-2 py-1 rounded-full cursor-default"
                style={{ background: c.starBg, border: `1px solid ${c.starBorder}` }}>
                <span className="text-[11px] tracking-wide whitespace-nowrap" style={{ color: c.starText }}>
                  {isVi ? star.nameVi : star.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* 上线公告便利贴 — 桌面端绝对定位右侧 */}
        <motion.div
          initial={{ opacity: 0, x: 30, rotate: 0 }}
          animate={{ opacity: 1, x: 0, rotate: -4 }}
          transition={{ delay: 1.4, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute hidden lg:block pointer-events-none"
          style={{
            right: 'clamp(2%, 6vw, 8%)',
            top: '54%',
            maxWidth: '240px',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #fff5e3 0%, #ffe1c0 100%)',
            border: '2px dashed rgba(232,132,62,0.45)',
            borderRadius: '16px',
            padding: '14px 18px',
            boxShadow: '0 8px 24px rgba(196,90,45,0.18), 0 2px 6px rgba(196,90,45,0.1)',
            fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
          }}>
            <div style={{ fontSize: '20px', marginBottom: '6px', lineHeight: 1 }}>🎁</div>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: '#8b3a1a', fontWeight: 500 }}>
              <span style={{ color: '#c45a2d', fontWeight: 700, fontSize: '14px' }}>5/1 — 5/8</span>
              <span> {isVi ? 'Tri ân trải nghiệm' : '限时回馈'}</span>
            </div>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: '#8b3a1a', fontWeight: 500 }}>
              {isVi ? 'Toàn bộ tính năng + Hỏi đáp AI' : '全部功能 + AI 提问'}
              <strong style={{ color: '#c45a2d' }}> {isVi ? 'Miễn phí' : '全免费'}</strong>
            </div>
          </div>
        </motion.div>

        {/* 上线公告便利贴 — 手机端正常流式显示（hero 内容下方居中） */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ delay: 1.4, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="lg:hidden mx-auto mt-8 mb-2 pointer-events-none"
          style={{
            maxWidth: 'min(280px, 84vw)',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #fff5e3 0%, #ffe1c0 100%)',
            border: '2px dashed rgba(232,132,62,0.45)',
            borderRadius: '14px',
            padding: '12px 16px',
            boxShadow: '0 6px 18px rgba(196,90,45,0.16), 0 2px 4px rgba(196,90,45,0.08)',
            fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '18px', marginBottom: '4px', lineHeight: 1 }}>🎁</div>
            <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#8b3a1a', fontWeight: 500 }}>
              <span style={{ color: '#c45a2d', fontWeight: 700, fontSize: '13px' }}>5/1 — 5/8</span>
              <span> {isVi ? 'Tri ân trải nghiệm' : '限时回馈'}</span>
            </div>
            <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#8b3a1a', fontWeight: 500 }}>
              {isVi ? 'Toàn bộ tính năng + AI' : '全部功能 + AI'} <strong style={{ color: '#c45a2d' }}>{isVi ? 'Miễn phí' : '全免费'}</strong>
            </div>
          </div>
        </motion.div>

        {/* 滚动提示（绝对定位，不影响 hero opacity 计算） */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[9px] tracking-[0.4em] uppercase" style={{ color: c.scrollText }}>
            {isVi ? 'Khám phá thêm' : '探索更多'}
          </span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${c.scrollLine}, transparent)` }} />
        </motion.div>
      </section>

      {/* ══ 哲学引言 ══════════════════════════════════════ */}
      <section className="relative z-10 overflow-hidden min-h-[82svh] lg:min-h-[92vh] flex items-center" style={{ padding: '72px 24px' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="absolute inset-0"
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(to bottom, #020810 0%, #020810 6%, #030a18 22%, #0d0820 40%, #0a0618 68%, #030a18 86%, #020810 100%)'
              : 'linear-gradient(to bottom, #f5efe0 0%, #f5efe0 6%, #c08055 18%, #6a2810 32%, #1e0a02 50%, #1e0a02 70%, #6a2810 84%, #f5efe0 100%)',
            transition: 'background 0.4s ease',
          }} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-bold" style={{ fontSize: 'clamp(220px, 38vw, 460px)', color: 'rgba(212,168,67,0.012)', lineHeight: 1, fontFamily: 'serif' }}>命</span>
        </div>
        <FadeIn className="relative mx-auto text-center w-full" y={20}>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, rgba(212,168,67,0.45))' }} />
            <span className="text-[10px] tracking-[0.55em] uppercase" style={{ color: 'rgba(212,168,67,0.5)' }}>
              {isVi ? 'MỆNH · VẬN · QUAN' : '命 · 运 · 观'}
            </span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, rgba(212,168,67,0.45))' }} />
          </div>
          <div className="space-y-3" style={{ maxWidth: '840px', margin: '0 auto' }}>
            {(isVi ? [
              { text: 'Ý nghĩa của việc thấu suốt vận mệnh', size: 'clamp(17px, 2.2vw, 28px)', color: 'rgba(215,228,252,0.72)', delay: 0.1 },
              { text: 'Không phải để dự đoán tương lai', size: 'clamp(21px, 2.6vw, 32px)', color: 'rgba(220,232,250,0.74)', delay: 0.25 },
              { text: 'Mà là để không ngừng thấu hiểu chính mình', size: 'clamp(24px, 3vw, 40px)', color: 'rgba(218,230,248,0.8)', delay: 0.34 },
            ] : [
              { text: '提前窥探命运的意义', size: 'clamp(17px, 2.2vw, 28px)', color: 'rgba(215,228,252,0.72)', delay: 0.1 },
              { text: '不在于预知未来', size: 'clamp(21px, 2.6vw, 32px)', color: 'rgba(220,232,250,0.74)', delay: 0.25 },
              { text: '而在于不断认识自己', size: 'clamp(24px, 3vw, 40px)', color: 'rgba(218,230,248,0.8)', delay: 0.34 },
            ]).map((line, i) => (
              <motion.p key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: line.delay }}
                className="tracking-wider" style={{ fontSize: line.size, color: line.color, fontWeight: 400 }}>
                {line.text}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold`}
              style={{ fontSize: 'clamp(24px, 3.4vw, 48px)', letterSpacing: '0.05em', lineHeight: 1.35 }}>
              {isVi ? 'Cuối cùng tự tay viết nên kịch bản cuộc đời mình' : '最终书写属于自己的人生剧本'}
            </motion.p>
          </div>
        </FadeIn>
      </section>

      {/* ══ 4 大学习板块时间轴 ════════════════════════════ */}
      <section className="relative z-10 py-20 lg:py-24 px-6"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(to bottom, transparent 0%, rgba(184,146,42,0.03) 50%, transparent 100%)'
            : 'linear-gradient(to bottom, transparent 0%, rgba(184,146,42,0.04) 50%, transparent 100%)',
        }}>
        <FadeIn className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
            <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: c.goldSolid, opacity: 0.7 }}>Curriculum</span>
            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
          </div>
          <div className="text-2xl lg:text-3xl font-bold mb-2 tracking-[0.15em]" style={{ color: c.textPrimary }}>
            {isVi ? 'Phương Pháp Nghê Sư · Từng Bước Khai Mở' : '倪师方法论 · 渐次展开'}
          </div>
          <div className="text-xs lg:text-sm tracking-[0.1em]" style={{ color: c.textMuted }}>
            {isVi ? 'Bắt đầu từ Tử Vi, từng bước mở rộng sang Thiên Kỷ / Địa Kỷ / Nhân Kỷ' : '从紫微入门，逐步开放天纪 / 地纪 / 人纪学习模块'}
          </div>
        </FadeIn>

        <div className="max-w-sm lg:max-w-5xl mx-auto relative">
          {/* 横向连接线（仅桌面）*/}
          <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-0.5"
            style={{
              background: `linear-gradient(90deg, ${c.goldSolid} 0%, ${c.goldSolid} 25%, ${c.goldLine} 25%)`,
              opacity: 0.6,
            }} />

          {/* 纵向连接线（仅手机）—— 圆点贴在线上，做"地铁线路图"风格 */}
          <div className="lg:hidden absolute left-7 top-7 bottom-7 w-px -translate-x-1/2"
            style={{
              background: `linear-gradient(180deg, ${c.goldSolid} 0%, ${c.goldSolid} 22%, ${c.goldLine} 22%)`,
              opacity: 0.6,
            }} />

          <div className="flex flex-col gap-5 lg:grid lg:grid-cols-4 lg:gap-4">
            {SECTIONS.map((s, i) => {
              const ready = s.status === 'ready';
              return (
                <motion.div key={s.key}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative flex flex-row lg:flex-col items-center lg:items-center text-left lg:text-center gap-4 lg:gap-0">
                  {/* 节点圆 */}
                  <div className="relative w-14 h-14 shrink-0 rounded-full flex items-center justify-center lg:mb-3"
                    style={{
                      background: ready
                        ? `linear-gradient(135deg, ${c.goldSolid} 0%, ${c.goldSolid}cc 100%)`
                        : (theme === 'dark' ? 'rgba(184,146,42,0.05)' : '#fdf8ee'),
                      border: ready ? 'none' : `2px dashed ${c.goldLine}`,
                      color: ready ? '#fff' : c.textMuted,
                      boxShadow: ready ? `0 4px 16px ${c.goldSolid}55` : 'none',
                    }}>
                    <span className="text-2xl">{s.icon}</span>
                    {ready && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white"
                        style={{ background: '#10b981', boxShadow: '0 2px 6px rgba(16,185,129,0.4)' }}>
                        ✓
                      </div>
                    )}
                  </div>
                  {/* 文字组：手机端右排单列；桌面端居中堆叠 */}
                  <div className="flex-1 lg:flex-none flex flex-col items-start lg:items-center min-w-0">
                    {/* 顶行：时间标签 + 板块名 + note（手机端 inline；桌面端依然分行） */}
                    <div className="flex items-baseline gap-2 lg:flex-col lg:gap-0 lg:mb-1">
                      <div className="text-[10px] tracking-[0.25em] lg:mb-1.5"
                        style={{ color: ready ? '#10b981' : c.textMuted, fontWeight: 500 }}>
                        {isVi ? s.whenVi : s.when}
                      </div>
                      <div className="text-base lg:text-xl font-semibold tracking-[0.15em]"
                        style={{ color: c.textPrimary }}>
                        {isVi ? s.nameVi : s.name}
                      </div>
                      {(isVi ? s.noteVi : s.note) && (
                        <div className="text-[9px] tracking-[0.15em] px-2 py-0.5 rounded-full lg:hidden"
                          style={{
                            color: c.goldSolid,
                            background: theme === 'dark' ? 'rgba(184,146,42,0.1)' : 'rgba(184,146,42,0.08)',
                            border: `1px solid ${c.goldLine}`,
                            opacity: 0.85,
                          }}>
                          {isVi ? s.noteVi : s.note}
                        </div>
                      )}
                    </div>
                    {/* 桌面专属 note（手机已在顶行 inline 展示）*/}
                    {(isVi ? s.noteVi : s.note) && (
                      <div className="hidden lg:block text-[9px] tracking-[0.15em] mb-1.5 px-2 py-0.5 rounded-full"
                        style={{
                          color: c.goldSolid,
                          background: theme === 'dark' ? 'rgba(184,146,42,0.1)' : 'rgba(184,146,42,0.08)',
                          border: `1px solid ${c.goldLine}`,
                          opacity: 0.85,
                        }}>
                        {isVi ? s.noteVi : s.note}
                      </div>
                    )}
                    {/* 简介 */}
                    <div className="text-[11px] lg:text-xs leading-relaxed lg:max-w-[200px] mt-0.5 lg:mt-0"
                      style={{ color: c.textSecond }}>
                      {isVi ? s.descVi : s.desc}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ 功能详解 ══════════════════════════════════════ */}
      <section className="relative z-10">
        {FEATURES.map((feature, i) => (
          <div key={i}
            className={`flex items-center px-6 md:px-10 lg:px-14 py-20 md:py-24 ${i <= 2 ? 'min-h-[82svh] lg:min-h-[92vh]' : ''}`}
            style={{ background: i % 2 === 1 ? c.altSection : 'transparent' }}>
            <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
              <div className={`grid grid-cols-1 ${i % 2 === 0 ? 'lg:grid-cols-[0.45fr_0.55fr]' : 'lg:grid-cols-[0.55fr_0.45fr]'} gap-10 lg:gap-16 items-start ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                {/* 文字区 */}
                <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <FadeIn delay={0}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px w-8" style={{ background: c.goldLine }} />
                      <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: c.tagText }}>
                        {isVi ? feature.tagVi : feature.tag}
                      </span>
                    </div>
                  </FadeIn>
                  <FadeIn delay={0.1}>
                    <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold leading-tight mb-5 tracking-tight`}
                      style={{
                        fontSize: i < 2 ? 'clamp(36px, 4vw, 56px)' : 'clamp(30px, 3.5vw, 48px)',
                        whiteSpace: 'pre-line',
                      }}>
                      {isVi ? feature.titleVi : feature.title}
                    </h2>
                  </FadeIn>
                  <FadeIn delay={0.2}>
                    <p className="text-base mb-8 leading-relaxed" style={{ color: c.textSecond }}>
                      {isVi ? feature.subtitleVi : feature.subtitle}
                    </p>
                  </FadeIn>
                  <div className="space-y-4">
                    {(isVi ? feature.pointsVi : feature.points).map((point, j) => (
                      <FadeIn key={j} delay={0.25 + j * 0.08}>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-2 w-1 h-1 rounded-full" style={{ background: c.goldSolid, opacity: 0.6 }} />
                          <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>{point}</p>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
                {/* 视觉装饰区 */}
                <div className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <FadeIn delay={0.15}>
                    <div className="relative rounded-2xl overflow-hidden p-8 md:p-12"
                      style={{
                        border: `1px solid ${c.featureBord}`,
                        background: c.featureBg,
                        minHeight: i <= 1 ? '540px' : i === 2 ? '460px' : '320px',
                        boxShadow: c.cardShadow,
                      }}>
                      <FeatureVisual index={i} colors={c} isVi={isVi} />
                    </div>
                  </FadeIn>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ══ 天·地·人 三分理论 ════════════════════════════ */}
      <section className="relative z-10 flex items-center px-6 md:px-10 lg:px-14 py-20"
        style={{ background: c.altSection, minHeight: '82svh' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
          <FadeIn>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: c.tagText }}>Ni Haixia · Philosophy</span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-5 tracking-tight`}
                style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                {isVi ? 'Thiên · Địa · Nhân' : '天 · 地 · 人'}
              </h2>
              <p className="max-w-2xl mx-auto text-sm leading-relaxed" style={{ color: c.textSecond }}>
                {isVi ? (
                  <>
                    Quan niệm cốt lõi của thầy Nghê Hải Hạ: Vận mệnh chưa bao giờ là tất cả cuộc đời.<br />
                    Thầy chia các yếu tố ảnh hưởng đời người thành ba chiều kích quan trọng ngang nhau.
                  </>
                ) : (
                  <>
                    倪海厦老师的核心命运观：命运从来不是人生的全部。<br />
                    他将影响人生的力量分为三个同等重要的维度。
                  </>
                )}
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {(isVi ? [
              {
                glyph: '天',
                label: 'Tiên Thiên Vận Mệnh',
                pct: '⅓',
                color: c.goldSolid,
                borderColor: c.goldLine,
                desc: 'Những gì Tử Vi Đẩu Số hé lộ là cục diện tiên thiên của mỗi người — bố cục sao, ngũ hành cục, chính tinh cung Mệnh định bởi giờ sinh. Đây chỉ là một phần ba vận mệnh, là phông nền đời người chứ không phải toàn bộ.',
                sub: 'Mệnh Bàn · Tinh Diệu · Ngũ Hành',
              },
              {
                glyph: '地',
                label: 'Môi Trường Địa Lý',
                pct: '⅓',
                color: 'rgba(96,165,250,0.9)',
                borderColor: 'rgba(96,165,250,0.3)',
                desc: 'Hoàn cảnh địa lý nơi bạn sinh sống, thành phố, quốc gia, phong thủy, cùng với bối cảnh gia đình và môi trường xã hội tạo nên chiều kích thứ hai. Cùng một lá số sinh ở nơi khác nhau thì cảnh ngộ có thể một trời một vực.',
                sub: 'Địa Vực · Phong Thủy · Hoàn Cảnh',
              },
              {
                glyph: '人',
                label: 'Tâm Ý Con Người',
                pct: '⅓',
                color: 'rgba(100,216,139,0.9)',
                borderColor: 'rgba(100,216,139,0.3)',
                desc: 'Ý chí, tâm thái, sự lựa chọn và hành động cá nhân mới là nguồn lực chủ động nhất để xoay chuyển số phận. Thầy Nghê nhấn mạnh: Hiểu lá số là để làm người tốt hơn, chứ không phải ngồi chờ an bài. Tự hoàn thiện chính mình mới là đạo phá cục mạnh mẽ nhất.',
                sub: 'Ý Chí · Chọn Lựa · Hành Động',
              },
            ] : [
              { glyph: '天', label: '先天命运', pct: '⅓', color: c.goldSolid, borderColor: c.goldLine, desc: '紫微斗数所揭示的，是一个人的先天命盘格局——出生时间决定的星曜布局、五行局数、命宫主星。这只是命运的三分之一，是人生的底色，而非全貌。', sub: '命盘 · 星曜 · 五行' },
              { glyph: '地', label: '地理环境', pct: '⅓', color: 'rgba(96,165,250,0.9)', borderColor: 'rgba(96,165,250,0.3)', desc: '你所在的地理环境、城市、国家、风水格局，乃至家庭背景与社会结构，共同构成了命运的第二个维度。同一命盘，生在不同地方，际遇可以天壤之别。', sub: '地域 · 风水 · 环境' },
              { glyph: '人', label: '人心意念', pct: '⅓', color: 'rgba(100,216,139,0.9)', borderColor: 'rgba(100,216,139,0.3)', desc: '个人的意志、心态、选择与行动，才是改变命运最主动的力量。倪师强调：了解命盘是为了更好地做人，而不是坐等命运安排。精进自己，是最强的破局之道。', sub: '意志 · 选择 · 行动' },
            ]).map((item, i) => (
              <FadeIn key={item.glyph} delay={0.1 + i * 0.12}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.1 }}
                  className="rounded-2xl p-7 h-full flex flex-col"
                  style={{ background: c.cardBg, border: `1px solid ${item.borderColor}`, boxShadow: c.cardShadow }}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="text-5xl font-bold leading-none" style={{ color: item.color }}>{item.glyph}</div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: item.color }}>{item.pct}</div>
                      <div className="text-[9px] mt-0.5 tracking-widest" style={{ color: c.textMuted }}>of life</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-0.5" style={{ color: item.color }}>{item.label}</div>
                    <div className="text-[10px] tracking-wider" style={{ color: c.textMuted }}>{item.sub}</div>
                  </div>
                  <div className="h-px mb-4" style={{ background: item.borderColor }} />
                  <p className="text-xs leading-relaxed flex-1" style={{ color: c.textSecond }}>{item.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <div className="mt-10 text-center">
              <p className="text-sm leading-relaxed" style={{ color: c.textSecond }}>
                {isVi ? '「Vận mệnh không phải là tất cả cuộc đời, cộng thêm vị trí địa lý và ý niệm con người mới tạo thành.」' : '「命运不是人生的全部，加上地理位置和人念，才是。」'}
              </p>
              <p className="mt-2 text-[10px] tracking-widest" style={{ color: c.tagText }}>
                {isVi ? '— Nghê Hải Hạ' : '— 倪海厦'}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ 倪海厦介绍 ════════════════════════════════════ */}
      <section className="relative z-10 flex items-center px-6 md:px-10 lg:px-14 py-20" style={{ minHeight: '82svh' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
          <FadeIn>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: c.tagText }}>Master · 1953 – 2012</span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-6 tracking-tight`}
                style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                {isVi ? 'Thầy Nghê Hải Hạ' : '倪海厦老师'}
              </h2>
              <p className="max-w-2xl mx-auto leading-relaxed text-sm" style={{ color: c.textSecond }}>
                {isVi ? (
                  <>
                    Một trong những bậc thầy Đông y và Thuật số có tầm ảnh hưởng sâu rộng nhất đương đại<br />
                    Người sáng lập Học viện Trung y Hán Đường tại Hoa Kỳ · Hai đại hệ thống «Nhân Kỷ» và «Thiên Kỷ» truyền đời
                  </>
                ) : (
                  <>
                    当代华人圈最具影响力的中医与术数大家之一<br />
                    美国汉唐中医学院创办人 ·「人纪」「天纪」两大教学体系传世
                  </>
                )}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl p-8 md:p-10 mb-8"
              style={{ border: `1px solid ${c.niBorder}`, background: c.niBg, boxShadow: c.cardShadow }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {(isVi ? [
                  { label: 'NĂM SINH', value: '1954', sub: 'Đài Loan' },
                  { label: 'TẠ THẾ', value: '2012', sub: '31 tháng 1 · Thọ 58 tuổi' },
                  { label: 'TRUYỀN THỪA', value: 'Tử Vi Đẩu Số', sub: 'Kinh Phương Đông Y · Dịch Kinh' },
                ] : [
                  { label: '生于', value: '1954年', sub: '台湾' },
                  { label: '离世', value: '2012年', sub: '1月31日 · 享年58' },
                  { label: '传承', value: '紫微斗数', sub: '经方中医 · 易经' },
                ]).map(item => (
                  <div key={item.label} className="text-center rounded-xl px-4 py-3"
                    style={{ border: `1px solid ${c.niDivider}`, background: 'rgba(255,255,255,0.02)' }}>
                    <div className="text-[10px] tracking-[0.3em] mb-1" style={{ color: c.textFaint }}>{item.label}</div>
                    <div className="text-2xl font-semibold mb-0.5" style={{ color: c.goldSolid }}>{item.value}</div>
                    <div className="text-[11px]" style={{ color: c.textMuted }}>{item.sub}</div>
                  </div>
                ))}
              </div>
              <div className="h-px mb-8" style={{ background: c.niDivider }} />
              <div className="space-y-4 text-sm leading-relaxed max-w-3xl mx-auto" style={{ color: c.textSecond }}>
                {isVi ? (
                  <>
                    <p>
                      <strong style={{ color: c.goldSolid }}>Tiểu sử</strong>：
                      Thầy Nghê Hải Hạ (1954–2012) sinh tại Đài Loan, thời trẻ thụ giáo nhiều danh sư Đông y, chuyên sâu Kinh Phương phái (truyền thừa Thương Hàn Luận).
                      Tuổi trung niên sang Mỹ hành nghề y, sáng lập <strong>Học viện Trung y Hán Đường</strong> tại Florida, hơn hai mươi năm truyền thụ hệ thống Đông y và thuật số truyền thống.
                      Ngày 31 tháng 1 năm 2012, thầy tạ thế tại Đài Loan, hưởng thọ 58 tuổi.
                    </p>
                    <p>
                      <strong style={{ color: c.goldSolid }}>Hệ thống giảng dạy</strong>：
                      Thầy đúc kết sở học cả đời thành hai chuỗi giảng dạy công khai.
                      <strong>«Nhân Kỷ»</strong> bao quát Châm Cứu Đại Thành, Thần Nông Bản Thảo Kinh, Hoàng Đế Nội Kinh, Thương Hàn Luận, Kim Quỹ Yếu Lược —
                      đây là kỷ cương của Con Người, đặt nền móng y học hoàn chỉnh;
                      <strong>«Thiên Kỷ»</strong> bao quát Tử Vi Đẩu Số và Chu Dịch — đây là kỷ cương của Trời, là thành quả thuật số có hệ thống.
                      Hai bộ kết hợp lại là di sản trọn vẹn nhất thầy để lại cho đời sau.
                    </p>
                    <p>
                      <strong style={{ color: c.goldSolid }}>Quan điểm Tử Vi</strong>：
                      Thầy Nghê trong Tử Vi Đẩu Số kiên định thuộc <strong>Nam phái Tam Hợp</strong>, chủ trương «Lấy Mệnh Cung làm gốc, lấy Tam Phương Tứ Chính làm dụng, lấy Tứ Hóa làm cương lĩnh».
                      Trong khóa học Thiên Kỷ, thầy từng dạy: «<em>Phi tinh Tứ Hóa bay qua bay lại quá phức tạp, không làm điều này, bởi lẽ đại đạo vốn chí giản</em>» —
                      lập trường này phân biệt rõ ràng thầy với các phái Phi Tinh rườm rà.
                    </p>
                    <p>
                      <strong style={{ color: c.goldSolid }}>Thái độ học thuật</strong>：
                      Thầy phản đối học vẹt thuộc lòng khẩu quyết, nhấn mạnh «Hiểu nguyên lý hơn là ghi nhớ máy móc», «Tư duy logic có thể kiểm chứng hơn là huyền học kỳ bí».
                      Thái độ này giúp Tử Vi Đẩu Số từ một hệ thống bí truyền thầy trò trở thành một môn học thuật có hệ thống, minh bạch và có thể kiểm chứng.
                    </p>
                    <p>
                      <strong style={{ color: c.goldSolid }}>Tầm ảnh hưởng đương đại</strong>：
                      Các video bài giảng của thầy Nghê được lan truyền rộng rãi trên Bilibili, YouTube và nhiều nền tảng số, là giáo trình nhập môn bắt buộc của thế hệ nghiên cứu thuật số và Đông y mới.
                      Thầy không chỉ là người kế thừa mà còn là nhân vật then chốt đưa thuật số và Đông y truyền thống hội nhập vào hệ tri thức hiện đại.
                    </p>
                    <p style={{ fontSize: '11px', color: c.textMuted, fontStyle: 'italic', marginTop: '12px' }}>
                      Mọi luận giải trên nền tảng này được tổng hợp từ giáo trình công khai «Thiên Kỷ» của thầy Nghê, bản khắc thời Minh Tử Vi Đẩu Số Toàn Thư và cổ tịch phái Tam Hợp, chỉ mang tính tham khảo văn hóa và phát triển bản thân. Bản thân thầy Nghê và nền tảng không có bất kỳ liên hệ thương mại nào.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong style={{ color: c.goldSolid }}>生平履历</strong>：
                      倪海厦先生（1954–2012）出生于台湾，早年师承多位中医名家，专研经方派（《伤寒论》传承）。
                      中年赴美行医，在美国创立<strong>汉唐中医学院</strong>，二十余年间系统传授中医与传统术数。
                      2012 年 1 月 31 日因肝癌在台湾离世，享年 58 岁。
                    </p>
                    <p>
                      <strong style={{ color: c.goldSolid }}>教学体系</strong>：
                      倪师将毕生所学整理为两大公开教学系列。
                      <strong>「人纪」</strong>涵盖《针灸大成》《神农本草经》《黄帝内经》《伤寒论》《金匮要略》——
                      这是「人之纪」，奠定中医学习的完整路径；
                      <strong>「天纪」</strong>涵盖紫微斗数与《易经》——这是「天之纪」，是术数研究的体系化成果。
                      两者相合，是倪师留给后世最完整的传承。
                    </p>
                    <p>
                      <strong style={{ color: c.goldSolid }}>紫微立场</strong>：
                      倪师在紫微斗数上明确属<strong>南派三合派</strong>，主张「以命宫为本、以三方四正为用、以四化为纲」。
                      他在《天纪》课程中明言：「<em>飞星（四化）飞来飞去太复杂，不搞这个，毕竟大道至简</em>」——
                      这一立场将其与繁琐的飞星派清晰区分。
                    </p>
                    <p>
                      <strong style={{ color: c.goldSolid }}>治学态度</strong>：
                      倪师反对死记硬背口诀，强调「理解原理胜过背诵」「逻辑可复核胜过神秘玄学」。
                      这种态度让紫微斗数从师徒密传的封闭体系，走向系统化、可验证、可学习的现代知识体系。
                    </p>
                    <p>
                      <strong style={{ color: c.goldSolid }}>当代影响</strong>：
                      倪师的讲课视频在 B 站、YouTube 与各大平台广泛流传，是新一代命理与中医爱好者公认的入门必修。
                      他不仅是紫微斗数的传承者，更是把传统命理与中医带入现代知识体系的关键人物之一。
                    </p>
                    <p style={{ fontSize: '11px', color: c.textMuted, fontStyle: 'italic', marginTop: '12px' }}>
                      本平台所有解读基于倪师《天纪》公开教学讲义、《紫微斗数全书》明版、传统三合派古籍整理而成，
                      仅作文化与个人成长参考。倪师本人与本平台无任何商业关联。
                    </p>
                  </>
                )}
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NI_TEACHINGS.map((teaching, i) => (
              <FadeIn key={i} delay={0.1 + i * 0.08}>
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.1 }}
                  className="rounded-xl p-6 h-full"
                  style={{ border: `1px solid ${c.niCardBord}`, background: c.niCardBg, boxShadow: c.niCardShadow }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mt-0.5"
                      style={{ borderColor: c.goldLine }}>
                      <span className="text-[9px]" style={{ color: c.goldSolid }}>{i + 1}</span>
                    </div>
                    <h3 className="text-sm font-medium leading-relaxed" style={{ color: c.goldSolid }}>
                      {isVi ? teaching.titleVi : teaching.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed pl-8" style={{ color: c.textSecond }}>
                    {isVi ? teaching.bodyVi : teaching.body}
                  </p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 合盘入口 ══════════════════════════════════════ */}
      <section className="relative z-10 px-6 md:px-10 lg:px-14 py-20">
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <div className="rounded-2xl p-10 md:p-14 text-center"
            style={{
              background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
              border: `1px solid ${c.cardBorder}`,
              boxShadow: c.cardShadow,
            }}>
            <FadeIn>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background: c.goldLine }} />
                <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: c.tagText }}>Compatibility · Analysis</span>
                <div className="h-px w-8" style={{ background: c.goldLine }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-4 tracking-tight`}
                style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>
                {isVi ? 'Tử Vi Hợp Mệnh' : '紫微合盘'}
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: c.textSecond }}>
                {isVi ? (
                  <>
                    Nhập thông tin ngày sinh của hai người, AI dựa trên hệ thống Nghê Hải Hạ phân tích tương tác Cung Phu Thê, độ tương hợp Mệnh Cung và Tam Phương Tứ Chính,<br className="hidden md:block" />
                    đưa ra mức độ hòa hợp tình cảm, khả năng cộng sự kinh doanh và gợi ý tương tác tốt nhất.
                  </>
                ) : (
                  <>
                    输入两个人的出生信息，AI 基于倪海厦体系分析夫妻宫互参、命宫兼容性与三方四正交互，<br className="hidden md:block" />
                    给出感情匹配度、合伙可行性与最佳相处建议。
                  </>
                )}
              </p>
              <div className="flex justify-center gap-3 flex-wrap mb-6">
                {(isVi ? [
                  'Phân tích hòa hợp tình cảm', 'Đánh giá cộng sự khởi nghiệp', 'Luận giải nhân duyên phụ tử', 'Đánh giá tương hợp tiền hôn nhân'
                ] : [
                  '感情匹配度分析', '合伙创业评估', '亲子缘分解读', '婚前相性评估'
                ]).map(item => (
                  <span key={item} style={{
                    fontSize: '12px', padding: '5px 14px', borderRadius: '20px',
                    background: theme === 'dark' ? 'rgba(212,168,67,0.08)' : 'rgba(212,168,67,0.12)',
                    border: `1px solid ${c.goldLine}`,
                    color: c.goldSolid,
                  }}>
                    {item}
                  </span>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/heming')}
                className="px-10 py-3 font-medium text-sm tracking-widest rounded-full"
                style={{
                  background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(140,100,20,0.1)',
                  border: `1px solid ${c.goldLine}`,
                  color: c.goldSolid,
                  cursor: 'pointer',
                }}>
                {isVi ? 'Bắt đầu phân tích hợp mệnh' : '开始合盘分析'}
              </motion.button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ 最终 CTA ══════════════════════════════════════ */}
      <section className="relative z-10 py-40 px-6 text-center" style={{ background: c.altSection }}>
        <FadeIn>
          <p className="text-[10px] tracking-[0.6em] uppercase mb-6" style={{ color: c.tagText }}>
            {isVi ? 'BẮT ĐẦU HÀNH TRÌNH KHÁM PHÁ LÁ SỐ' : '开始你的命盘之旅'}
          </p>
          <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-8 tracking-tight leading-tight`}
            style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
            {isVi ? (
              <>Lá số Tử Vi của bạn<br />Đang chờ được khai mở</>
            ) : (
              <>你的紫微命盘<br />等你解读</>
            )}
          </h2>
          <p className="text-sm mb-10 max-w-md mx-auto leading-relaxed" style={{ color: c.textSecond }}>
            {isVi ? (
              <>
                Nhập ngày tháng năm giờ sinh, an lá số độc bản trong vài giây<br />
                Để AI theo hệ thống chính tông Nghê Hải Hạ luận giải chuyên sâu cho bạn
              </>
            ) : (
              <>
                输入出生年月日时，在几秒内生成你的专属命盘<br />
                再由 AI 按倪海厦体系为你深度解读
              </>
            )}
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/chart')}
            className="px-14 py-4 font-semibold text-base tracking-widest rounded-full cursor-pointer"
            style={{ background: c.ctaBg, color: c.ctaText }}>
            {isVi ? 'Lập Lá Số Miễn Phí' : '免费起盘'}
          </motion.button>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <motion.a
              href="/knowledge"
              whileHover={{ scale: 1.02 }}
              className="text-xs tracking-[0.2em] inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                color: c.goldSolid,
                border: `1px solid ${c.goldLine}`,
                background: 'transparent',
                textDecoration: 'none',
              }}>
              {isVi ? '✦ Kho Tri Thức Tử Vi Đẩu Số →' : '✦ 紫微斗数知识库 →'}
            </motion.a>
            <motion.a
              href="/library"
              whileHover={{ scale: 1.02 }}
              className="text-xs tracking-[0.2em] inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                color: c.goldSolid,
                border: `1px solid ${c.goldLine}`,
                background: 'transparent',
                textDecoration: 'none',
              }}>
              {isVi ? '📜 Kho Cổ Tịch Nguyên Điển →' : '📜 古籍原典库 →'}
            </motion.a>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-6"
        style={{ borderTop: `1px solid ${c.niCardBord}` }}>

        {/* 4 板块导航占位（已上线 + 即将开放）*/}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-[9px] tracking-[0.3em] text-center mb-4 uppercase"
            style={{ color: c.textMuted, opacity: 0.6 }}>
            {isVi ? 'Phương Pháp Nghê Sư · Hệ Thống Học Thuật' : '倪师方法论 · 学术体系'}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {SECTIONS.map(s => {
              const ready = s.status === 'ready';
              return (
                <a
                  key={s.key}
                  href={ready ? '/chart' : undefined}
                  onClick={ready ? undefined : (e) => e.preventDefault()}
                  className="rounded-lg px-3 py-3 text-center transition-all"
                  style={{
                    background: ready ? c.starBg : 'transparent',
                    border: `1px ${ready ? 'solid' : 'dashed'} ${ready ? c.goldLine : c.navBorder}`,
                    cursor: ready ? 'pointer' : 'not-allowed',
                    opacity: ready ? 1 : 0.5,
                    textDecoration: 'none',
                  }}
                >
                  <div className="text-base font-semibold mb-0.5 tracking-[0.1em]"
                    style={{ color: ready ? c.goldSolid : c.textMuted }}>
                    {isVi ? s.nameVi : s.name}
                  </div>
                  <div className="text-[9px] tracking-wider"
                    style={{ color: ready ? '#10b981' : c.textMuted }}>
                    {ready ? (isVi ? '✓ Đã mở' : '✓ 已上线') : (isVi ? `${s.whenVi} ra mắt` : `${s.when} 开放`)}
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] tracking-wider mb-3" style={{ color: c.footerText }}>
            {isVi
              ? 'Tử Vi Đẩu Số · Dựa trên hệ thống chính tông Nghê Hải Hạ · Chỉ mang tính tham khảo, vận mệnh nằm trong tay bạn'
              : '紫微命盘 · 基于倪海厦正宗体系 · 仅供参考，命运掌握在自己手中'}
          </p>
          <p className="text-[10px] tracking-wider mb-3 max-w-2xl mx-auto leading-relaxed"
            style={{ color: c.footerText, opacity: 0.85 }}>
            {isVi ? (
              <>
                Nền tảng này dựa trên nghiên cứu văn hóa cổ truyền phương Đông, chỉ cung cấp thông tin học tập và tham khảo.<br className="sm:hidden" />
                Không cấu thành bất kỳ lời khuyên y tế, đầu tư, pháp lý hay quyết định trọng đại nào.
              </>
            ) : (
              <>
                本平台基于中国传统文化研究，仅提供学习参考。<br className="sm:hidden" />
                不构成任何医疗、投资、法律或重大决策建议。
              </>
            )}
          </p>
          <p className="text-[10px] tracking-wider" style={{ color: c.footerText }}>
            <a href="/terms" style={{ color: c.footerText, textDecoration: 'underline' }}>
              {isVi ? 'Điều khoản dịch vụ' : '服务条款'}
            </a>
            {' · '}
            <a href="/privacy" style={{ color: c.footerText, textDecoration: 'underline' }}>
              {isVi ? 'Chính sách bảo mật' : '隐私政策'}
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

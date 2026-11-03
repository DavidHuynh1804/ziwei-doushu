'use client';
import { motion } from 'framer-motion';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { BRANCHES, STEMS } from '@/lib/ziwei/constants';
import { detectPatterns, getMingGongSummary } from '@/lib/ziwei/patterns';
import { useLanguage } from '@/components/LanguageProvider';
interface ChartSummaryProps {
  chart: ZiweiChart;
}

const PatternLevelStyle = {
  excellent: { dot: 'bg-amber-400', label: 'text-amber-500', badge: 'text-amber-500 bg-amber-500/10 border-amber-500/25' },
  good: { dot: 'bg-sky-400', label: 'text-sky-500', badge: 'text-sky-500 bg-sky-500/10 border-sky-500/25' },
  neutral: { dot: 'bg-slate-400', label: 'text-slate-400', badge: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
  caution: { dot: 'bg-orange-500', label: 'text-orange-500', badge: 'text-orange-500 bg-orange-500/10 border-orange-500/25' },
};

const NATURE_TRANSLATION_VI: Record<string, string> = {
  '帝王星': 'Đế Vương Tinh',
  '智慧星': 'Trí Huệ Tinh',
  '贵人星': 'Quý Nhân Tinh',
  '财帛星': 'Tài Bạch Tinh',
  '福德星': 'Phúc Đức Tinh',
  '桃花星': 'Đào Hoa Tinh',
  '财库星': 'Tài Khố Tinh',
  '财富星': 'Tài Phú Tinh',
  '是非星': 'Thị Phi Tinh',
  '印绶星': 'Ấn Thụ Tinh',
  '荫庇星': 'Ấm Tinh',
  '将帅星': 'Tướng Soái Tinh',
  '变动星': 'Biến Động Tinh',
  '空宫': 'Vô Chính Diệu',
};

const KEYWORD_TRANSLATION_VI: Record<string, string> = {
  '尊贵': 'Tôn Quý',
  '独立': 'Độc Lập',
  '领导': 'Lãnh Đạo',
  '智慧': 'Trí Tuệ',
  '机变': 'Cơ Biến',
  '善谋': 'Thiện Mưu',
  '阳刚': 'Dương Cương',
  '官贵': 'Quan Quý',
  '慷慨': 'Hào Hiệp',
  '财富': 'Tài Phú',
  '刚毅': 'Cương Nghị',
  '果断': 'Quả Quyết',
  '温和': 'Ôn Hòa',
  '享福': 'Hưởng Phúc',
  '随缘': 'Tùy Duyên',
  '才艺': 'Tài Nghệ',
  '桃花': 'Đào Hoa',
  '多变': 'Đa Biến',
  '财库': 'Tài Khố',
  '稳重': 'Trầm Ổn',
  '保守': 'Cẩn Trọng',
  '柔美': 'Dịu Dàng',
  '细腻': 'Tinh Tế',
  '欲望': 'Dục Vọng',
  '多才': 'Đa Tài',
  '善辩': 'Thiện Biện',
  '多思': 'Trầm Tư',
  '口才': 'Khẩu Tài',
  '辅佐': 'Phò Tá',
  '行政': 'Hành Chính',
  '稳健': 'Vững Vàng',
  '荫护': 'Che Chở',
  '医药': 'Y Dược',
  '长辈': 'Trưởng Bối',
  '将星': 'Tướng Tinh',
  '果决': 'Quả Quyết',
  '孤克': 'Cô Khắc',
  '开创': 'Khai Phá',
  '变动': 'Biến Động',
  '破旧': 'Đổi Mới',
};

const GENDER_TRANSLATION_VI: Record<string, string> = {
  '阳男': 'Dương Nam',
  '阴男': 'Âm Nam',
  '阳女': 'Dương Nữ',
  '阴女': 'Âm Nữ',
};

export default function ChartSummary({ chart }: ChartSummaryProps) {
  const { locale, tStar, tPalace, tStem, tBranch, tSiHua, tWuxingJu, tPattern } = useLanguage();
  const isVi = locale === 'vi';
  const patterns = detectPatterns(chart);
  const { stars: mingStars, keywords, nature } = getMingGongSummary(chart);
  const currentDx = chart.daXians[chart.currentDaXianIndex];

  const siHuaSummary: { name: string; siHua: string; palaceName: string }[] = [];
  for (const palace of chart.palaces) {
    for (const star of palace.stars) {
      if (star.siHua) {
        siHuaSummary.push({ name: star.name, siHua: star.siHua, palaceName: palace.name });
      }
    }
  }
  const siHuaOrder = ['禄', '权', '科', '忌'];
  siHuaSummary.sort((a, b) => siHuaOrder.indexOf(a.siHua) - siHuaOrder.indexOf(b.siHua));

  const formatGanzhi = (stemIdx: number, branchIdx: number) => {
    if (isVi) return `${tStem(stemIdx)} ${tBranch(branchIdx)}`;
    return `${STEMS[stemIdx]}${BRANCHES[branchIdx]}`;
  };

  const fourPillarsText = chart.lunarInfo.fourPillars
    ? chart.lunarInfo.fourPillars.map(pillar => {
        if (!isVi) return pillar;
        const s = pillar.slice(0, 1);
        const b = pillar.slice(1);
        return `${tStem(s)} ${tBranch(b)}`;
      })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="space-y-4"
    >
      {/* ── 命格总览 ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      >
      <div className="card-glass rounded-xl p-5">
        <div className="text-[10px] tracking-widest mb-4 flex items-center gap-2 font-medium" style={{ color: 'var(--t-faint)' }}>
          <span style={{ color: 'var(--t-gold)', opacity: 0.6 }}>✦</span>
          {isVi ? 'TỔNG QUAN LÁ SỐ' : '命格总览'}
        </div>

        <div className="flex flex-wrap items-start gap-4">
          <div>
            <div className="text-[9px] mb-1.5" style={{ color: 'var(--t-faint)', opacity: 0.85 }}>
              {isVi ? 'Chính Tinh Thủ Mệnh' : '命宫主星'}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {mingStars.length > 0 ? (
                mingStars.map(s => (
                  <span key={s} className="font-bold text-lg" style={{ color: 'var(--t-gold)' }}>
                    {tStar(s)}
                  </span>
                ))
              ) : (
                <span className="text-sm font-medium" style={{ color: 'var(--t-faint)' }}>
                  {isVi ? 'Vô Chính Diệu' : '空宫'}
                </span>
              )}
            </div>
            {nature && (
              <div className="text-[10px] mt-1" style={{ color: 'var(--t-gold)', opacity: 0.6 }}>
                {isVi ? (NATURE_TRANSLATION_VI[nature] || nature) : nature}
              </div>
            )}
          </div>

          {keywords.length > 0 && (
            <div>
              <div className="text-[9px] mb-1.5" style={{ color: 'var(--t-faint)', opacity: 0.85 }}>
                {isVi ? 'Đặc Tính Khí Chất' : '性格特质'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {keywords.map(k => (
                  <span key={k} className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      color: 'var(--t-gold)',
                      background: 'rgba(212,168,67,0.08)',
                      border: '1px solid rgba(212,168,67,0.15)',
                    }}>
                    {isVi ? (KEYWORD_TRANSLATION_VI[k] || k) : k}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="ml-auto text-right">
            <div className="text-[9px] mb-1" style={{ color: 'var(--t-faint)', opacity: 0.85 }}>
              {isVi ? 'Cục Số · Đại Hạn Hiện Tại' : '五行局 · 当前大限'}
            </div>
            <div className="text-[11px] font-medium" style={{ color: 'var(--t-text2)' }}>
              {tWuxingJu(chart.wuxingJu)}
            </div>
            {currentDx && (
              <div className="text-[11px] text-purple-500 mt-0.5 font-medium">
                {currentDx.startAge}~{currentDx.endAge}{isVi ? ' tuổi' : '岁'} · {tPalace(currentDx.palaceName)}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 pt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[10px]"
          style={{ borderTop: '1px solid var(--t-border)', color: 'var(--t-faint)' }}>
          <span>
            {isVi ? 'Dương lịch: ' : '公历 '}
            {chart.birthInfo.year}-{chart.birthInfo.month}-{chart.birthInfo.day}
          </span>
          <span>
            {isVi ? 'Âm lịch: ' : '农历 '}
            {chart.lunarInfo.lunarYear}{isVi ? ' năm ' : '年'}
            {chart.lunarInfo.isLeapMonth ? (isVi ? 'Nhuận ' : '闰') : ''}
            {chart.lunarInfo.lunarMonth}{isVi ? ' tháng ' : '月'}
            {chart.lunarInfo.lunarDay}{isVi ? ' ngày' : '日'}
          </span>
          <span>
            {formatGanzhi(chart.lunarInfo.yearStem, chart.lunarInfo.yearBranch)}
            {isVi ? ' · Giờ ' : '年 · '}
            {tBranch(chart.birthInfo.hour)}
            {!isVi ? '时' : ''}
          </span>
          <span>
            {isVi ? 'Mệnh: ' : '命宫'}
            <span style={{ color: 'var(--t-gold)', opacity: 0.85 }}>{tBranch(chart.mingGongBranch)}</span>
            {isVi ? ' · Thân: ' : ' · 身宫'}
            <span className="text-sky-500/80">{tBranch(chart.shenGongBranch)}</span>
          </span>
          {chart.yinYangGender && (
            <span className="font-medium text-amber-500/80">
              {isVi ? (GENDER_TRANSLATION_VI[chart.yinYangGender] || chart.yinYangGender) : chart.yinYangGender}
            </span>
          )}
          {chart.mingZhu && (
            <span>
              {isVi ? 'Mệnh Chủ: ' : '命主: '}
              <span className="font-medium" style={{ color: 'var(--t-gold)' }}>{tStar(chart.mingZhu)}</span>
            </span>
          )}
          {chart.shenZhu && (
            <span>
              {isVi ? 'Thân Chủ: ' : '身主: '}
              <span className="font-medium text-sky-400">{tStar(chart.shenZhu)}</span>
            </span>
          )}
        </div>

        {fourPillarsText && (
          <div className="mt-2 pt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]"
            style={{ borderTop: '1px dashed var(--t-border)', color: 'var(--t-faint)' }}>
            <span className="font-medium" style={{ color: 'var(--t-gold)', opacity: 0.9 }}>
              {isVi ? 'Tứ Trụ (Bát Tự):' : '八字四柱:'}
            </span>
            <span>{isVi ? 'Năm: ' : '年: '}{fourPillarsText[0]}</span>
            <span>{isVi ? 'Tháng: ' : '月: '}{fourPillarsText[1]}</span>
            <span>{isVi ? 'Ngày: ' : '日: '}{fourPillarsText[2]}</span>
            <span>{isVi ? 'Giờ: ' : '时: '}{fourPillarsText[3]}</span>
          </div>
        )}
      </div>
      </motion.div>

      {/* ── 本命四化 ── */}
      {siHuaSummary.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
        <div className="card-glass rounded-xl p-4">
          <div className="text-[10px] tracking-widest mb-3 flex items-center gap-2 font-medium" style={{ color: 'var(--t-faint)' }}>
            <span style={{ color: 'var(--t-gold)', opacity: 0.6 }}>◆</span>
            {isVi ? 'PHÂN BỐ TỨ HÓA NĂM' : '本命四化'}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {siHuaSummary.map(({ name, siHua, palaceName }) => {
              const colors: Record<string, { text: string; bg: string; border: string }> = {
                '禄': { text: '#4ade80', bg: 'rgba(74,222,128,0.06)', border: 'rgba(74,222,128,0.2)' },
                '权': { text: '#60a5fa', bg: 'rgba(96,165,250,0.06)', border: 'rgba(96,165,250,0.2)' },
                '科': { text: '#facc15', bg: 'rgba(250,204,21,0.06)', border: 'rgba(250,204,21,0.2)' },
                '忌': { text: '#f87171', bg: 'rgba(248,113,113,0.06)', border: 'rgba(248,113,113,0.2)' },
              };
              const c = colors[siHua] || colors['禄'];
              return (
                <div key={name + siHua}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-[10px]"
                  style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
                >
                  <span className="font-medium">{tStar(name)}</span>
                  <div className="flex items-center gap-1.5 text-right">
                    <span style={{ opacity: 0.7 }} className="text-[9px]">{tPalace(palaceName)}</span>
                    <span className="font-bold">{isVi ? `Hóa ${tSiHua(siHua)}` : `化${siHua}`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </motion.div>
      )}

      {/* ── 格局识别 ── */}
      {patterns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
        <div className="card-glass rounded-xl p-4">
          <div className="text-[10px] tracking-widest mb-3 flex items-center gap-2 font-medium" style={{ color: 'var(--t-faint)' }}>
            <span style={{ color: 'var(--t-gold)', opacity: 0.6 }}>◉</span>
            {isVi ? 'CÁCH CỤC ĐẶC BIỆT' : '格局识别'}
            <span className="text-[9px] ml-auto" style={{ color: 'var(--t-faint)', opacity: 0.75 }}>
              {patterns.length} {isVi ? 'cách cục' : '个格局'}
            </span>
          </div>
          <div className="space-y-2">
            {patterns.map((p, i) => {
              const st = PatternLevelStyle[p.level];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.08 }}
                  className="card-inner rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${st.dot}`} />
                    <span className={`text-[11px] font-medium ${st.label}`}>
                      {tPattern(p.name).name || p.name}
                    </span>
                    <div className="flex gap-1 ml-auto">
                      {p.palaces.slice(0, 2).map(pa => (
                        <span key={pa} className={`text-[8px] px-1.5 py-px rounded-full border ${st.badge}`}>
                          {tPalace(pa)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] leading-relaxed pl-3.5" style={{ color: 'var(--t-text2)' }}>
                    {tPattern(p.name).description || p.description}
                  </p>
                  {p.conditions && (
                    <div className="mt-2 pl-3.5 space-y-0.5">
                      {p.conditions.required.length > 0 && (
                        <div className="text-[9px] leading-relaxed" style={{ color: 'var(--t-text2)', opacity: 0.85 }}>
                          <span className="font-medium" style={{ color: 'var(--t-gold)' }}>
                            {isVi ? 'Bắt buộc' : '必须'}
                          </span>
                          <span style={{ opacity: 0.6 }}> · </span>
                          {p.conditions.required.map(c => tStar(c)).join(isVi ? ', ' : '、')}
                        </div>
                      )}
                      {p.conditions.bonus && p.conditions.bonus.length > 0 && (
                        <div className="text-[9px] leading-relaxed" style={{ color: 'var(--t-text2)', opacity: 0.85 }}>
                          <span className="font-medium text-emerald-500">
                            {isVi ? 'Thêm điểm' : '加分'}
                          </span>
                          <span style={{ opacity: 0.6 }}> · </span>
                          {p.conditions.bonus.map(c => tStar(c)).join(isVi ? ', ' : '、')}
                        </div>
                      )}
                      {p.conditions.breaking && p.conditions.breaking.length > 0 && (
                        <div className="text-[9px] leading-relaxed" style={{ color: 'var(--t-text2)', opacity: 0.85 }}>
                          <span className="font-medium text-orange-500">
                            {isVi ? 'Phá cách' : '破格'}
                          </span>
                          <span style={{ opacity: 0.6 }}> · </span>
                          {p.conditions.breaking.map(c => tStar(c)).join(isVi ? ', ' : '、')}
                        </div>
                      )}
                    </div>
                  )}

                  {p.source && (
                    <div className="text-[9px] mt-1.5 pl-3.5" style={{ color: 'var(--t-faint)', opacity: 0.5 }}>
                      {isVi ? 'Xuất xứ' : '出处'} · {p.source}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        </motion.div>
      )}

      {/* ── 大限运程 ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.88, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
      <div className="card-glass rounded-xl p-4">
        <div className="text-[10px] tracking-widest mb-3 flex items-center gap-2 font-medium" style={{ color: 'var(--t-faint)' }}>
          <span className="text-purple-500/60">◎</span>
          {isVi ? 'ĐẠI HẠN VẬN TRÌNH' : '大限运程'}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {chart.daXians.slice(0, 9).map((dx, i) => {
            const isCurrent = i === chart.currentDaXianIndex;
            return (
              <div
                key={i}
                className="text-[10px] px-2 py-2 rounded-lg text-center transition-colors"
                style={{
                  border: isCurrent
                    ? '1px solid rgba(147,51,234,0.4)'
                    : '1px solid var(--t-border)',
                  background: isCurrent ? 'rgba(147,51,234,0.08)' : 'transparent',
                  color: isCurrent ? '#a78bfa' : 'var(--t-faint)',
                }}
              >
                <div className="font-mono tabular-nums">{dx.startAge}~{dx.endAge}{isVi ? 't' : ''}</div>
                <div className="text-[9px] mt-0.5 font-medium" style={{ opacity: 0.8 }}>
                  {tPalace(dx.palaceName)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </motion.div>
    </motion.div>
  );
}

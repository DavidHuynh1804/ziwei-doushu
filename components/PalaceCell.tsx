'use client';
import { motion } from 'framer-motion';
import type { Palace, Star, StarBrightness } from '@/lib/ziwei/types';
import { STEMS, BRANCHES } from '@/lib/ziwei/constants';
import { useLanguage } from '@/components/LanguageProvider';
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
}

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
  localizedText,
}: {
  siHua: string;
  overlay?: boolean;
  label?: string;
  onClick?: (e: React.MouseEvent) => void;
  localizedText?: string;
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center text-[8px] px-1 rounded-full border leading-none py-px font-bold ml-1 flex-shrink-0',
        SIHUA_STYLES[siHua] || 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        overlay && 'border-dashed opacity-80',
        onClick && 'cursor-pointer hover:opacity-100',
      )}
      onClick={onClick}
    >
      {overlay && label && <span className="mr-px opacity-70">{label}</span>}
      {localizedText ?? siHua}
    </span>
  );
};

const BRIGHTNESS_SHORT_VI: Record<StarBrightness, string> = {
  '庙': 'M',
  '旺': 'V',
  '得': 'Đ',
  '利': 'L',
  '平': 'B',
  '不': 'Bất',
  '闲': 'N',
  '陷': 'H',
  '地': 'Địa',
};

export default function PalaceCell({
  palace, onClick, onStarClick, isSelected, isSanFang, delay = 0,
  overlayStarSiHua, overlayLabel, onSiHuaClick,
}: PalaceCellProps) {
  const { locale, tStar, tPalace, tStem, tBranch, tSiHua } = useLanguage();
  const { branch, stem, name, stars, daXianAge, isCurrentDaXian, isMingGong, isShenGong } = palace;
  const ganzhi = locale === 'vi'
    ? `${tStem(stem)} ${tBranch(branch)}`
    : `${STEMS[stem]}${BRANCHES[branch]}`;

  const majorStars = stars.filter(s => s.type === 'major');
  const luckyStars = stars.filter(s => s.type === 'lucky');
  const shaStars = stars.filter(s => s.type === 'sha');

  const renderBrightnessBadge = (raw?: StarBrightness) => {
    if (!raw) return null;
    if (locale === 'zh') {
      return (
        <span className="text-[8px] text-amber-500/70 ml-0.5 select-none font-normal">
          {raw}
        </span>
      );
    }
    const shortVi = BRIGHTNESS_SHORT_VI[raw] || raw;
    const colorClass = (raw === '庙' || raw === '旺')
      ? 'text-amber-400 font-bold'
      : (raw === '得' || raw === '利')
      ? 'text-emerald-400 font-medium'
      : (raw === '平')
      ? 'text-slate-400 font-normal'
      : 'text-rose-400 font-semibold';
    return (
      <span className={clsx('text-[9px] ml-1 select-none font-mono', colorClass)}>
        [{shortVi}]
      </span>
    );
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      onClick={onClick}
      className="relative flex flex-col p-2 cursor-pointer transition-all duration-200 h-full border border-[rgba(212,168,67,0.12)] hover:border-[rgba(212,168,67,0.4)]"
      style={{
        minHeight: '124px',
        background: isCurrentDaXian
          ? 'rgba(147,51,234,0.12)'
          : isSelected
          ? 'rgba(212,168,67,0.16)'
          : isSanFang
          ? 'rgba(37,99,235,0.12)'
          : isMingGong
          ? 'rgba(212,168,67,0.08)'
          : isShenGong
          ? 'rgba(56,189,248,0.06)'
          : 'var(--t-bg)',
        boxShadow: isCurrentDaXian
          ? 'inset 3px 0 0 rgba(147,51,234,0.8)'
          : isSelected
          ? 'inset 0 0 0 1.5px rgba(212,168,67,0.85)'
          : isSanFang
          ? 'inset 0 0 0 1px rgba(37,99,235,0.5)'
          : 'none',
      }}
    >
      {/* 宫名行 + Can Chi + Đại Hạn */}
      <div className="flex items-center justify-between mb-1 pb-1 border-b border-[rgba(212,168,67,0.1)] gap-1">
        <div className="flex items-center gap-1 min-w-0">
          <span className={clsx('text-[11px] font-bold tracking-wide truncate',
            isMingGong ? 'text-amber-400 font-extrabold' : isShenGong ? 'text-sky-400 font-bold' : 'text-amber-500/90'
          )}>
            {tPalace(name)}
          </span>
          {isMingGong && (
            <span className="text-[8px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-1 rounded leading-tight flex-shrink-0">
              {locale === 'vi' ? 'MỆNH' : '命'}
            </span>
          )}
          {isShenGong && (
            <span className="text-[8px] font-bold text-sky-300 bg-sky-500/20 border border-sky-500/40 px-1 rounded leading-tight flex-shrink-0">
              {locale === 'vi' ? 'THÂN' : '身'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-[9px] font-mono text-[var(--t-faint)] font-medium">{ganzhi}</span>
          {daXianAge && (
            <span className={clsx(
              'text-[8px] font-mono tabular-nums px-1 py-0.5 rounded',
              isCurrentDaXian ? 'text-purple-300 bg-purple-500/25 font-bold' : 'text-[var(--t-faint)] bg-black/20'
            )}>
              {daXianAge[0]}–{daXianAge[1]}
            </span>
          )}
        </div>
      </div>

      {/* 主星 */}
      <div className="flex flex-col gap-0.5 flex-1">
        {majorStars.length === 0 && (
          <span className="text-[10px] italic" style={{ color: 'var(--t-faint)', opacity: 0.6 }}>
            {locale === 'vi' ? 'Vô Chính Diệu' : '空宫'}
          </span>
        )}
        {majorStars.map((star) => {
          const overlaySiHua = overlayStarSiHua?.[star.name];
          return (
            <div
              key={star.name}
              className="flex items-center"
              onClick={e => { e.stopPropagation(); onStarClick?.(star); }}
            >
              <span className={clsx(
                'text-[13px] leading-tight font-bold tracking-tight cursor-pointer hover:brightness-125 transition-all',
                star.brightness === 'bright' ? 'text-amber-300' : star.brightness === 'dim' ? 'text-amber-700/80' : 'text-amber-500',
              )}>
                {tStar(star.name)}
              </span>
              {renderBrightnessBadge(star.brightnessRaw)}
              {star.siHua && <SiHuaBadge siHua={star.siHua} localizedText={tSiHua(star.siHua)} />}
              {overlaySiHua && (
                <SiHuaBadge
                  siHua={overlaySiHua}
                  localizedText={tSiHua(overlaySiHua)}
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
              <span key={s.name} className="inline-flex items-center text-[9px] text-sky-500/70 leading-tight">
                {tStar(s.name)}
                {renderBrightnessBadge(s.brightnessRaw)}
                {s.siHua && <SiHuaBadge siHua={s.siHua} localizedText={tSiHua(s.siHua)} />}
                {overlaySiHua && (
                  <SiHuaBadge
                    siHua={overlaySiHua}
                    localizedText={tSiHua(overlaySiHua)}
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
            <span key={s.name} className="inline-flex items-center text-[9px] text-red-500/60 leading-tight">
              {tStar(s.name)}
              {renderBrightnessBadge(s.brightnessRaw)}
              {s.siHua && <SiHuaBadge siHua={s.siHua} localizedText={tSiHua(s.siHua)} />}
            </span>
          ))}
        </div>
      )}

    </motion.div>
  );
}

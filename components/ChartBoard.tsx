'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart, Palace, Star } from '@/lib/ziwei/types';
import { BRANCHES, STEMS } from '@/lib/ziwei/constants';
import { useLanguage } from '@/components/LanguageProvider';
import PalaceCell from './PalaceCell';
import TimeNav, { type TimeView, getYearStemIndex, buildSiHuaOverlay } from './TimeNav';

interface ChartBoardProps {
  chart: ZiweiChart;
  onStarSelect?: (star: Star, palace: Palace) => void;
  onPalaceSelect?: (palace: Palace) => void;
  onSiHuaClick?: (starName: string, siHua: string, view: TimeView) => void;
}

const BRANCH_GRID_POS: Record<number, [number, number]> = {
  5: [1, 1], 6: [1, 2], 7: [1, 3], 8: [1, 4],
  4: [2, 1], 9: [2, 4],
  3: [3, 1], 10: [3, 4],
  2: [4, 1], 1: [4, 2], 0: [4, 3], 11: [4, 4],
};

// 每个地支宫位在网格中的中心坐标（百分比）
const BRANCH_SVG_POS: Record<number, [number, number]> = {
  5: [12.5, 12.5], 6: [37.5, 12.5], 7: [62.5, 12.5], 8: [87.5, 12.5],
  4: [12.5, 37.5],                                      9: [87.5, 37.5],
  3: [12.5, 62.5],                                     10: [87.5, 62.5],
  2: [12.5, 87.5], 1: [37.5, 87.5], 0: [62.5, 87.5], 11: [87.5, 87.5],
};

// 绕盘面顺时针排列（用于三方四正四边形排序）
const CLOCKWISE_INDEX: Record<number, number> = {
  5: 0, 6: 1, 7: 2, 8: 3,
  9: 4, 10: 5,
  11: 6, 0: 7, 1: 8, 2: 9,
  3: 10, 4: 11,
};

function sortClockwise(branches: number[]): number[] {
  return [...branches].sort((a, b) => CLOCKWISE_INDEX[a] - CLOCKWISE_INDEX[b]);
}

/** 三方四正：本宫 + 对宫 + 两个三合宫 */
function getSanFangSiZheng(branch: number): [number, number, number, number] {
  return [
    branch,
    (branch + 6) % 12,   // 对宫
    (branch + 4) % 12,   // 三合1
    (branch + 8) % 12,   // 三合2
  ];
}

const ANIMATION_ORDER = [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4];

export default function ChartBoard({ chart, onStarSelect, onPalaceSelect, onSiHuaClick }: ChartBoardProps) {
  const { locale, tPalace, tStar, tStem, tBranch, tWuxingJu } = useLanguage();
  const isVi = locale === 'vi';
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [timeView, setTimeView] = useState<TimeView>('mingpan');
  const [liunianYear, setLiunianYear] = useState<number>(new Date().getFullYear());

  const palaceMap: Record<number, Palace> = {};
  chart.palaces.forEach(p => { palaceMap[p.branch] = p; });

  // 计算当前叠加四化数据（大限或流年）
  const currentDx = chart.daXians[chart.currentDaXianIndex];
  const overlayData: Record<string, string> = (() => {
    if (timeView === 'daxian' && currentDx) {
      const dxPalace = chart.palaces.find(p => p.branch === currentDx.palaceBranch);
      if (dxPalace) return buildSiHuaOverlay(dxPalace.stem);
    }
    if (timeView === 'liunian') {
      return buildSiHuaOverlay(getYearStemIndex(liunianYear));
    }
    return {};
  })();
  const overlayLabel = timeView === 'daxian'
    ? (isVi ? 'Hạn' : '限')
    : timeView === 'liunian'
    ? (isVi ? 'Năm' : '年')
    : undefined;
  const handlePalaceClick = (branch: number) => {
    const isDeselecting = selectedBranch === branch;
    setSelectedBranch(prev => prev === branch ? null : branch);
    if (!isDeselecting) {
      const palace = palaceMap[branch];
      if (palace) onPalaceSelect?.(palace);
    }
  };

  // 三方四正
  const sanFangBranches = selectedBranch !== null ? getSanFangSiZheng(selectedBranch) : null;
  const sanFangSet = sanFangBranches ? new Set(sanFangBranches) : null;

  return (
    <div className="w-full select-none">
      {/* 时间导航轴 */}
      <TimeNav
        chart={chart}
        view={timeView}
        liunianYear={liunianYear}
        onViewChange={setTimeView}
        onYearChange={setLiunianYear}
      />

      {/* 命盘标题 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-3"
      >
        <div className="text-[10px] tracking-[0.5em] uppercase mb-1" style={{ color: 'var(--t-faint)' }}>
          Zi Wei Dou Shu
        </div>
        <h2 className="text-sm tracking-[0.25em] font-medium" style={{ color: 'var(--t-gold)' }}>
          {chart.birthInfo.name ? `${chart.birthInfo.name} · ` : ''}
          {isVi ? 'Lá Số Tử Vi Đẩu Số' : '紫微斗数命盘'}
        </h2>
      </motion.div>

      {/* 4x4 命盘网格（含 SVG 叠加层） */}
      <div
        className="grid rounded-xl overflow-hidden relative"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, minmax(124px, 1fr))',
          gap: '2px',
          background: 'var(--t-border)',
          border: '2px solid var(--t-border)',
          boxShadow: '0 8px 36px rgba(0,0,0,0.3)',
        }}
      >
        {ANIMATION_ORDER.map((branch, i) => {
          const [row, col] = BRANCH_GRID_POS[branch];
          const palace = palaceMap[branch];
          if (!palace) return null;
          return (
            <div key={branch} style={{ gridRow: row, gridColumn: col, background: 'var(--t-bg)' }}>
              <PalaceCell
                palace={palace}
                onClick={() => handlePalaceClick(branch)}
                onStarClick={(star) => onStarSelect?.(star, palace)}
                isSelected={selectedBranch === branch}
                isSanFang={!!(sanFangSet?.has(branch) && selectedBranch !== branch)}
                delay={i * 0.04}
                overlayStarSiHua={Object.keys(overlayData).length > 0 ? overlayData : undefined}
                overlayLabel={overlayLabel}
                onSiHuaClick={(starName, siHua) => onSiHuaClick?.(starName, siHua, timeView)}
              />
            </div>
          );
        })}

        {/* 中央信息区 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="relative flex flex-col justify-between p-3.5 card-glass overflow-hidden"
          style={{
            gridRow: '2 / 4',
            gridColumn: '2 / 4',
            background: 'linear-gradient(135deg, rgba(212,168,67,0.06) 0%, rgba(14,23,42,0.95) 50%, rgba(212,168,67,0.04) 100%)',
          }}
        >
          {/* Background Yin-Yang decoration */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-8xl select-none" style={{ color: 'var(--t-gold)', opacity: 0.05, filter: 'drop-shadow(0 0 20px rgba(180,120,30,0.2))' }}>
              ☯
            </span>
          </div>

          {/* Top header */}
          <div className="relative z-10 text-center pb-2 border-b border-[rgba(212,168,67,0.15)]">
            <div className="text-[10px] tracking-[0.4em] uppercase font-bold text-amber-400">
              {isVi ? 'TỬ VI ĐẨU SỐ' : '紫微斗数'}
            </div>
            {chart.birthInfo.name && (
              <div className="text-[13px] font-bold text-[var(--t-text)] mt-0.5">
                {chart.birthInfo.name} · <span className="text-amber-400 font-medium">{chart.yinYangGender || (chart.birthInfo.gender === 'male' ? 'Nam' : 'Nữ')}</span>
              </div>
            )}
          </div>

          {/* Four Pillars (Bát Tự Tứ Trụ) */}
          {chart.lunarInfo.fourPillars && (
            <div className="relative z-10 my-1 py-1 px-2 rounded-lg bg-black/25 border border-[rgba(212,168,67,0.12)]">
              <div className="text-[8px] text-[var(--t-faint)] tracking-widest text-center mb-1 font-semibold uppercase">
                {isVi ? 'Tứ Trụ Bát Tự (Năm · Tháng · Ngày · Giờ)' : '八字四柱'}
              </div>
              <div className="grid grid-cols-4 gap-1 text-center font-mono">
                {chart.lunarInfo.fourPillars.map((p, idx) => (
                  <div key={idx} className="bg-black/20 py-0.5 rounded">
                    <div className="text-[10px] font-bold text-amber-300">
                      {isVi ? `${tStem(p[0])} ${tBranch(p[1])}` : p}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core Info Summary */}
          <div className="relative z-10 grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] px-1">
            <div className="flex items-center justify-between">
              <span className="text-[var(--t-faint)]">{isVi ? 'Cục số:' : '五行局:'}</span>
              <span className="font-bold text-amber-300">{tWuxingJu(chart.wuxingJu)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--t-faint)]">{isVi ? 'Mệnh / Thân:' : '命身:'}</span>
              <span className="font-semibold text-[var(--t-text)]">
                {tBranch(chart.mingGongBranch)} / <span className="text-sky-400">{tBranch(chart.shenGongBranch)}</span>
              </span>
            </div>
            {chart.mingZhu && (
              <div className="flex items-center justify-between">
                <span className="text-[var(--t-faint)]">{isVi ? 'Mệnh Chủ:' : '命主:'}</span>
                <span className="font-medium text-amber-400">{tStar(chart.mingZhu)}</span>
              </div>
            )}
            {chart.shenZhu && (
              <div className="flex items-center justify-between">
                <span className="text-[var(--t-faint)]">{isVi ? 'Thân Chủ:' : '身主:'}</span>
                <span className="font-medium text-sky-400">{tStar(chart.shenZhu)}</span>
              </div>
            )}
          </div>

          {/* Current DaXian Badge */}
          {chart.currentDaXianIndex >= 0 && (() => {
            const dx = chart.daXians[chart.currentDaXianIndex];
            return (
              <div className="relative z-10 mt-1 border border-purple-500/30 rounded-lg py-1 px-2 flex items-center justify-between"
                style={{ background: 'rgba(147,51,234,0.1)' }}>
                <span className="text-[9px] text-purple-300 font-medium">
                  {isVi ? 'Đại Hạn Hiện Tại' : '当前大限'}
                </span>
                <span className="text-[11px] text-purple-200 font-bold tabular-nums">
                  {dx.startAge}–{dx.endAge}{isVi ? ' tuổi' : '岁'} · {tPalace(dx.palaceName)}
                </span>
              </div>
            );
          })()}

          {/* Lunar calendar footer */}
          <div className="relative z-10 text-[9px] text-center text-[var(--t-faint)] font-mono pt-1 border-t border-[rgba(212,168,67,0.1)]">
            {isVi ? 'Âm lịch: ' : '农历: '}
            Ngày {chart.lunarInfo.lunarDay} thg {chart.lunarInfo.lunarMonth}{chart.lunarInfo.isLeapMonth ? (isVi ? ' (Nhuận)' : ' (闰)') : ''} năm {chart.lunarInfo.lunarYear}
          </div>
        </motion.div>

        {/* ── 三方四正 SVG 连线（绝对定位在 grid 内部，受 overflow:hidden 裁切） ── */}
        <AnimatePresence>
          {sanFangBranches !== null && (
            <motion.div
              key={`sf-${selectedBranch}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none"
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 20,
              }}
            >
              <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: 'block' }}
              >
                {(() => {
                  // 三角形（三方）+ 一条直线（对宫）
                  const p0 = BRANCH_SVG_POS[sanFangBranches[0]]; // 本宫
                  const p1 = BRANCH_SVG_POS[sanFangBranches[1]]; // 对宫
                  const p2 = BRANCH_SVG_POS[sanFangBranches[2]]; // 三合1
                  const p3 = BRANCH_SVG_POS[sanFangBranches[3]]; // 三合2
                  const dash = "6,5";
                  const stroke = "rgba(37,99,235,0.55)";
                  const sw = "1.5";
                  return (
                    <>
                      {/* 对宫直线：本宫 ↔ 对宫（穿过中心） */}
                      <line
                        x1={`${p0[0]}%`} y1={`${p0[1]}%`}
                        x2={`${p1[0]}%`} y2={`${p1[1]}%`}
                        stroke={stroke} strokeWidth={sw}
                        strokeDasharray={dash} strokeLinecap="round"
                      />
                      {/* 三合三角形：本宫 → 三合1 → 三合2 → 本宫 */}
                      <line
                        x1={`${p0[0]}%`} y1={`${p0[1]}%`}
                        x2={`${p2[0]}%`} y2={`${p2[1]}%`}
                        stroke={stroke} strokeWidth={sw}
                        strokeDasharray={dash} strokeLinecap="round"
                      />
                      <line
                        x1={`${p2[0]}%`} y1={`${p2[1]}%`}
                        x2={`${p3[0]}%`} y2={`${p3[1]}%`}
                        stroke={stroke} strokeWidth={sw}
                        strokeDasharray={dash} strokeLinecap="round"
                      />
                      <line
                        x1={`${p3[0]}%`} y1={`${p3[1]}%`}
                        x2={`${p0[0]}%`} y2={`${p0[1]}%`}
                        stroke={stroke} strokeWidth={sw}
                        strokeDasharray={dash} strokeLinecap="round"
                      />
                      {/* 四个宫位中心标记点 */}
                      {[p0, p1, p2, p3].map((p, i) => (
                        <circle
                          key={i}
                          cx={`${p[0]}%`} cy={`${p[1]}%`}
                          r="3"
                          fill={i === 0 ? 'rgba(37,99,235,0.8)' : 'rgba(37,99,235,0.45)'}
                        />
                      ))}
                    </>
                  );
                })()}
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 图例 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-3 flex items-center justify-center gap-2 text-[9px] flex-wrap"
      >
        {[
          { h: '化禄', c: 'text-emerald-500 border-emerald-500/30' },
          { h: '化权', c: 'text-blue-500 border-blue-500/30' },
          { h: '化科', c: 'text-yellow-500 border-yellow-500/30' },
          { h: '化忌', c: 'text-red-500 border-red-500/30' },
        ].map(({ h, c }) => (
          <span key={h} className={`border px-1.5 py-0.5 rounded-full font-medium ${c}`}>{h}</span>
        ))}
        <span className="px-1.5 py-0.5 rounded-full" style={{ color: 'var(--t-faint)', border: '1px solid var(--t-border)' }}>
          点击宫位看三方四正
        </span>
      </motion.div>
    </div>
  );
}

'use client';

/**
 * 命盘分享卡 — 真正的 12 宫命盘缩略图
 *
 * 设计：左侧 12 宫缩略命盘 + 右侧关键信息
 * 浏览器原生中文字体，不依赖 SSR
 */

import type { ZiweiChart } from '@/lib/ziwei/types';
import { SITE_HOST } from '@/lib/site';
import { useLanguage } from '@/components/LanguageProvider';

const GENDER_TRANSLATION_VI: Record<string, string> = {
  '阳男': 'Dương Nam',
  '阴男': 'Âm Nam',
  '阳女': 'Dương Nữ',
  '阴女': 'Âm Nữ',
};
const BRANCH_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 紫微斗数 12 宫地支布局（按"地支盘"标准排列，固定）
// 寅卯辰巳 → 上行
// 丑    午
// 子    未
// 亥戌酉申 → 下行
const ZHIWEI_LAYOUT: Array<{ branch: number; row: number; col: number }> = [
  { branch: 2,  row: 0, col: 0 }, // 寅
  { branch: 3,  row: 0, col: 1 }, // 卯
  { branch: 4,  row: 0, col: 2 }, // 辰
  { branch: 5,  row: 0, col: 3 }, // 巳
  { branch: 1,  row: 1, col: 0 }, // 丑
  { branch: 6,  row: 1, col: 3 }, // 午
  { branch: 0,  row: 2, col: 0 }, // 子
  { branch: 7,  row: 2, col: 3 }, // 未
  { branch: 11, row: 3, col: 0 }, // 亥
  { branch: 10, row: 3, col: 1 }, // 戌
  { branch: 9,  row: 3, col: 2 }, // 酉
  { branch: 8,  row: 3, col: 3 }, // 申
];

interface ShareCardProps {
  chart: ZiweiChart;
  birth: { year: string; month: string; day: string; hour: string; minute: string; gender: 'male' | 'female'; city?: string };
  highlight?: string;
}

export default function ShareCardCanvas({ chart, birth, highlight }: ShareCardProps) {
  const { locale, tStar, tPalace, tStem, tBranch, tWuxingJu, tSiHua } = useLanguage();
  const isVi = locale === 'vi';

  const mingPalace = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  const mingMajorStars = mingPalace?.stars.filter(s => s.type === 'major').map(s => s.name) ?? [];
  const mingStarStr = mingMajorStars.length > 0
    ? mingMajorStars.map(s => isVi ? tStar(s) : s).join(' · ')
    : (isVi ? 'Vô Chính Diệu' : '空宫');
  const mingBranchName = isVi ? tBranch(chart.mingGongBranch) : (BRANCH_NAMES[chart.mingGongBranch] || '');
  const shenBranchName = isVi ? tBranch(chart.shenGongBranch) : (BRANCH_NAMES[chart.shenGongBranch] || '');
  const dx = chart.daXians?.[chart.currentDaXianIndex];

  const personName = chart.birthInfo.name || '';

  // Tứ Trụ (Bát Tự)
  const fourPillarsText = chart.lunarInfo.fourPillars
    ? chart.lunarInfo.fourPillars.map(pillar => {
        if (!isVi) return pillar;
        const s = pillar.slice(0, 1);
        const b = pillar.slice(1);
        return `${tStem(s)} ${tBranch(b)}`;
      })
    : null;

  // Âm Dương Giới Tính
  const genderDisplay = chart.yinYangGender
    ? (isVi ? (GENDER_TRANSLATION_VI[chart.yinYangGender] || chart.yinYangGender) : chart.yinYangGender)
    : (birth.gender === 'male' ? (isVi ? 'Nam Mệnh' : '男命') : (isVi ? 'Nữ Mệnh' : '女命'));

  // Ngày sinh âm lịch
  const lunarDayStr = isVi
    ? `Âm lịch: Ngày ${chart.lunarInfo.lunarDay} tháng ${chart.lunarInfo.lunarMonth}${chart.lunarInfo.isLeapMonth ? ' (Nhuận)' : ''}`
    : `农历: ${chart.lunarInfo.isLeapMonth ? '闰' : ''}${chart.lunarInfo.lunarMonth}月${chart.lunarInfo.lunarDay}日`;

  // 把每个宫位组织成 12 个格子，按布局画
  const cells = ZHIWEI_LAYOUT.map(slot => {
    const palace = chart.palaces.find(p => p.branch === slot.branch);
    const majors = palace?.stars.filter(s => s.type === 'major') ?? [];
    const isMing = palace?.branch === chart.mingGongBranch;
    const isShen = palace?.branch === chart.shenGongBranch;
    return { ...slot, palace, majors, isMing, isShen };
  });

  // 卡片尺寸：680x420（适合微信缩略 + 朋友圈）
  return (
    <div id="share-card" style={{
      width: '680px',
      height: '420px',
      background: 'linear-gradient(135deg, #fef9eb 0%, #f7e8c4 60%, #efd8a0 100%)',
      padding: '16px 24px',
      fontFamily: isVi
        ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        : '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Microsoft JhengHei", sans-serif',
      position: 'relative',
      boxSizing: 'border-box',
      borderRadius: '14px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 装饰光晕 */}
      <div style={{
        position: 'absolute', top: '-60px', left: '-60px',
        width: '180px', height: '180px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,146,42,0.18) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', bottom: '-50px', right: '-50px',
        width: '160px', height: '160px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196,90,45,0.12) 0%, transparent 70%)',
      }} />

      {/* 顶部 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #d4a948 0%, #b8922a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: isVi ? '13px' : '15px', fontWeight: 700,
          }}>{isVi ? 'Tử' : '紫'}</div>
          <div>
            <div style={{ fontSize: '15px', color: '#3d2f10', fontWeight: 700, letterSpacing: isVi ? '0.04em' : '0.12em', lineHeight: 1.25 }}>
              {isVi ? 'LÁ SỐ TỬ VI ĐẨU SỐ' : '紫微命盘'}
              {personName ? <span style={{ marginLeft: '8px', fontSize: '13px', fontWeight: 600, color: '#8b6a14' }}>· {personName}</span> : null}
            </div>
            <div style={{ fontSize: '8.5px', color: '#a89b7c', letterSpacing: isVi ? '0.06em' : '0.18em', marginTop: '1px' }}>
              {isVi ? 'Chính Tông Nghê Hải Hạ · TỬ VI ĐẨU SỐ' : '倪海厦正宗 · ZI WEI'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.3 }}>
          <div style={{ fontSize: '9.5px', color: '#6b5d3f', letterSpacing: '0.02em' }}>
            {isVi
              ? `${birth.day.padStart(2,'0')}/${birth.month.padStart(2,'0')}/${birth.year} · ${birth.hour.padStart(2,'0')}:${birth.minute.padStart(2,'0')}`
              : `${birth.year}年${birth.month}月${birth.day}日 · ${birth.hour.padStart(2,'0')}:${birth.minute.padStart(2,'0')}`}
            <span style={{ margin: '0 4px', color: '#b8922a' }}>·</span>
            {genderDisplay}
            {birth.city && <><span style={{ margin: '0 4px', color: '#b8922a' }}>·</span>{birth.city}</>}
          </div>
          <div style={{ fontSize: '8px', color: '#b8922a', letterSpacing: '0.08em', marginTop: '1px' }}>
            {SITE_HOST}
          </div>
        </div>
      </div>

      {/* 主体：左 12 宫格子 + 右关键信息 */}
      <div style={{ display: 'flex', gap: '14px', flex: 1, position: 'relative', zIndex: 1, minHeight: 0 }}>
        {/* 左：12 宫缩略命盘 */}
        <div style={{
          width: '304px',
          height: '334px',
          background: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(184,146,42,0.3)',
          borderRadius: '8px',
          padding: '4px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          gap: '3px',
          position: 'relative',
          boxSizing: 'border-box',
        }}>
          {cells.map((cell, i) => {
            // 中央 4 个格子（row 1-2, col 1-2）合并为中心说明区
            if ((cell.row === 1 || cell.row === 2) && (cell.col === 1 || cell.col === 2)) return null;
            const palaceName = cell.palace ? (isVi ? tPalace(cell.palace.name) : cell.palace.name) : '';
            const palaceBranch = isVi ? tBranch(cell.branch) : BRANCH_NAMES[cell.branch];
            const palaceStem = cell.palace ? (isVi ? tStem(cell.palace.stem) : '') : '';
            const stemBranchLabel = isVi && palaceStem ? `${palaceStem} ${palaceBranch}` : palaceBranch;

            return (
              <div key={i} style={{
                gridRow: cell.row + 1,
                gridColumn: cell.col + 1,
                background: cell.isMing ? 'rgba(184,146,42,0.18)' : 'rgba(255,255,255,0.6)',
                border: cell.isMing
                  ? '1.5px solid #b8922a'
                  : '0.5px solid rgba(184,146,42,0.2)',
                borderRadius: '4px',
                padding: '3px 4px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box',
              }}>
                {/* 宫名 + 地支 */}
                <div style={{
                  fontSize: '8px',
                  color: cell.isMing ? '#8b6a14' : '#8a7b5c',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  lineHeight: 1.2,
                }}>
                  <span style={{ fontWeight: cell.isMing ? 700 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {palaceName}
                    {cell.isShen ? (
                      <span style={{
                        marginLeft: '2px',
                        fontSize: '7px',
                        color: '#0284c7',
                        fontWeight: 600,
                      }}>
                        {isVi ? '·Thân' : '·身'}
                      </span>
                    ) : ''}
                  </span>
                  <span style={{ fontSize: '7px', opacity: 0.75, flexShrink: 0, marginLeft: '2px' }}>
                    {stemBranchLabel}
                  </span>
                </div>
                {/* 主星 */}
                <div style={{
                  marginTop: '1px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1px',
                  flex: 1,
                  justifyContent: 'center',
                }}>
                  {cell.majors.length > 0 ? cell.majors.slice(0, 2).map((s, j) => (
                    <div key={j} style={{
                      fontSize: isVi ? '9.5px' : '11px',
                      fontWeight: 600,
                      color: cell.isMing ? '#8b6a14' : '#3d2f10',
                      lineHeight: 1.15,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {isVi ? tStar(s.name) : s.name}
                      {s.siHua ? (
                        <span style={{ fontSize: '7.5px', color: '#c45a2d', marginLeft: '2px', fontWeight: 700 }}>
                          {isVi ? tSiHua(s.siHua) : s.siHua}
                        </span>
                      ) : ''}
                    </div>
                  )) : (
                    <div style={{ fontSize: isVi ? '8px' : '9px', color: '#a89b7c', fontStyle: 'italic', lineHeight: 1.1 }}>
                      {isVi ? 'Vô Chính Diệu' : '空宫'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* 中央说明区（占据 4 个格子）*/}
          <div style={{
            gridRow: '2 / 4',
            gridColumn: '2 / 4',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(184,146,42,0.06)',
            border: '0.5px dashed rgba(184,146,42,0.3)',
            borderRadius: '4px',
            padding: '4px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '7.5px', color: '#a89b7c', letterSpacing: '0.15em', marginBottom: '2px' }}>ZI WEI DOU SHU</div>
            <div style={{ fontSize: '13px', color: '#3d2f10', fontWeight: 700, letterSpacing: isVi ? '0.04em' : '0.1em', lineHeight: 1.2 }}>
              {isVi ? 'TỬ VI ĐẨU SỐ' : '紫微斗数'}
            </div>
            <div style={{ fontSize: '9px', color: '#6b5d3f', marginTop: '4px', lineHeight: 1.25 }}>
              {isVi ? `Mệnh: ${mingBranchName}` : `命宫 · ${mingBranchName}`}
              <span style={{ margin: '0 3px', color: '#b8922a' }}>·</span>
              {isVi ? `Thân: ${shenBranchName}` : `身宫 · ${shenBranchName}`}
            </div>
            <div style={{ fontSize: '9px', color: '#8b6a14', marginTop: '3px', fontWeight: 600, lineHeight: 1.25 }}>
              {isVi ? tWuxingJu(chart.wuxingJuName) : chart.wuxingJuName}
            </div>
          </div>
        </div>

        {/* 右：关键信息 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
          {/* 命宫主星 */}
          <div>
            <div style={{ fontSize: '9.5px', color: '#a89b7c', letterSpacing: isVi ? '0.08em' : '0.25em', marginBottom: '2px' }}>
              {isVi ? `CUNG MỆNH · ${mingBranchName.toUpperCase()}` : `命 宫 · ${mingBranchName}`}
            </div>
            <div style={{
              fontSize: isVi ? (mingMajorStars.length > 1 ? '34px' : '40px') : '48px',
              fontWeight: 800,
              color: '#8b6a14',
              letterSpacing: '0.02em',
              lineHeight: 1.1,
              marginBottom: '8px',
              wordBreak: 'break-word',
            }}>{mingStarStr}</div>

            {/* 四柱八字 & 农历 */}
            <div style={{
              fontSize: '9.5px',
              color: '#6b5d3f',
              lineHeight: 1.45,
              marginBottom: '8px',
              padding: '6px 8px',
              background: 'rgba(255,255,255,0.45)',
              borderRadius: '6px',
              border: '0.5px solid rgba(184,146,42,0.2)',
            }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ color: '#a89b7c' }}>{isVi ? 'Bát tự:' : '八字:'}</span>
                <span style={{ fontWeight: 600, color: '#3d2f10' }}>
                  {fourPillarsText ? fourPillarsText.join(' · ') : (chart.lunarInfo.fourPillars ? chart.lunarInfo.fourPillars.join(' ') : '')}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                <span style={{ color: '#a89b7c' }}>{isVi ? 'Cục:' : '局:'}</span>
                <span style={{ fontWeight: 600 }}>{isVi ? tWuxingJu(chart.wuxingJuName) : chart.wuxingJuName}</span>
                {chart.mingZhu && (
                  <>
                    <span style={{ color: '#b8922a' }}>·</span>
                    <span>{isVi ? 'Mệnh Chủ: ' : '命主: '}<b>{isVi ? tStar(chart.mingZhu) : chart.mingZhu}</b></span>
                  </>
                )}
                {chart.shenZhu && (
                  <>
                    <span style={{ color: '#b8922a' }}>·</span>
                    <span>{isVi ? 'Thân Chủ: ' : '身主: '}<b>{isVi ? tStar(chart.shenZhu) : chart.shenZhu}</b></span>
                  </>
                )}
              </div>
              <div style={{ fontSize: '8.5px', color: '#8a7b5c', marginTop: '2px' }}>
                {lunarDayStr}
              </div>
            </div>

            {/* 高亮 */}
            {highlight && (
              <div style={{
                fontSize: '11px',
                color: '#5b4c2e',
                fontWeight: 500,
                padding: '6px 8px',
                background: 'rgba(255,255,255,0.5)',
                borderLeft: '3px solid #b8922a',
                borderRadius: '4px',
                letterSpacing: '0.02em',
                lineHeight: 1.35,
                marginBottom: '8px',
              }}>{highlight}</div>
            )}
          </div>

          {/* 当前大限 + slogan */}
          <div>
            {dx && (
              <div style={{
                fontSize: '10px',
                color: '#3d2f10',
                marginBottom: '6px',
                letterSpacing: '0.02em',
                lineHeight: 1.3,
              }}>
                <span style={{ color: '#a89b7c' }}>{isVi ? 'Đại Hạn hiện tại: ' : '当前大限 '}</span>
                <span style={{ fontWeight: 600 }}>
                  {isVi
                    ? `${dx.startAge}–${dx.endAge} tuổi · Cung ${tPalace(dx.palaceName)}`
                    : `${dx.startAge}–${dx.endAge} 岁 · ${dx.palaceName}`}
                </span>
              </div>
            )}
            <div style={{
              padding: '8px 10px',
              background: 'linear-gradient(135deg, rgba(212,169,72,0.18) 0%, rgba(184,146,42,0.08) 100%)',
              border: '1px solid rgba(184,146,42,0.3)',
              borderRadius: '6px',
            }}>
              <div style={{ fontSize: '10px', color: '#3d2f10', fontWeight: 600, letterSpacing: isVi ? '0.03em' : '0.08em', lineHeight: 1.35 }}>
                {isVi ? 'Tử Vi làm cửa · Thiên Địa Nhân làm đường' : '紫微为门 · 天地人为路'}
              </div>
              <div style={{ fontSize: '9px', color: '#8b6a14', fontWeight: 600, letterSpacing: isVi ? '0.03em' : '0.08em', lineHeight: 1.35, marginTop: '2px' }}>
                {isVi ? 'Thuật toán chính tông Nghê Hải Hạ · Khám phá vận mệnh' : '倪海厦为师 · AI 答疑伴学'}
              </div>
              <div style={{ fontSize: '8px', color: '#a89b7c', letterSpacing: isVi ? '0.04em' : '0.15em', marginTop: '3px' }}>
                {isVi ? 'Tra cứu & an lá số Tử Vi chuẩn mực →' : '扫码起你的命盘 →'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 截图工具：把上面的 div 转成 PNG dataURL */
export async function captureShareCard(): Promise<string | null> {
  try {
    const html2canvas = (await import('html2canvas')).default;
    const node = document.getElementById('share-card');
    if (!node) return null;
    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });
    return canvas.toDataURL('image/png');
  } catch (e) {
    console.error('captureShareCard failed', e);
    return null;
  }
}

export function downloadDataURL(dataURL: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

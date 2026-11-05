'use client';
import { useState } from 'react';
import BirthForm from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import InsightPanel from '@/components/InsightPanel';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/components/LanguageProvider';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart, Palace } from '@/lib/ziwei/types';

/**
 * 命盘页 —— 开源版「排盘引擎 Demo」
 *
 * 这是一个最小可运行示例：用本仓库的排盘引擎 generateChart() 配合基础 UI
 * 组件，渲染一张完整紫微命盘 + 基础解读，并支持本命 / 大限 / 流年切换。
 *
 * 说明：线上商业版的完整交互界面（重设计的新 UI、AI 流式解读、合盘、分享
 * 卡片等）不在开源范围内；但排盘内核——安星算法、四化、格局识别、古籍库——
 * 完全开放（见 lib/ziwei/*），可自由二次开发出你自己的界面。
 */
export default function ChartPage() {
  const { locale } = useLanguage();
  const isVi = locale === 'vi';
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);

  // ── 未起盘：展示出生信息表单 ──
  if (!chart) {
    return (
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px' }}>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
            {isVi ? 'Lập Lá Số Tử Vi Đẩu Số' : '紫微斗数排盘'}
          </h1>
          <LanguageToggle compact />
        </div>
        <p style={{ color: '#888', marginBottom: 32, fontSize: 14, lineHeight: 1.7 }}>
          {isVi ? (
            <>
              Nhập ngày tháng năm và giờ sinh để hệ thống an sao lập lá số Tử Vi hoàn chỉnh tức thì.
              <br />
              （Phiên bản mã nguồn mở: thuật toán an sao, tứ hóa, cách cục chuẩn mực; giao diện demo.）
            </>
          ) : (
            <>
              输入出生年月日时，开源排盘引擎即时生成命盘。
              <br />
              （本页为引擎 Demo，完整商业版界面不在开源范围；排盘内核完全开放。）
            </>
          )}
        </p>
        <BirthForm onSubmit={(info: BirthInfo) => setChart(generateChart(info))} />
      </main>
    );
  }

  // ── 已起盘：命盘 + 解读 ──
  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px' }}>
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <button
          type="button"
          onClick={() => { setChart(null); setSelectedPalace(null); }}
          className="hover:opacity-80 transition-opacity"
          style={{
            padding: '6px 14px', cursor: 'pointer',
            border: '1px solid var(--t-border, #ccc)', borderRadius: 8, background: 'transparent',
            fontSize: 13,
          }}
        >
          {isVi ? '← Lập lá số khác' : '← 重新起盘'}
        </button>
        <LanguageToggle compact />
      </div>
      <div
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]"
        style={{
          gap: 20, marginTop: 16, alignItems: 'start',
        }}
      >
        <ChartBoard chart={chart} onPalaceSelect={setSelectedPalace} />
        <InsightPanel chart={chart} selectedPalace={selectedPalace} />
      </div>
    </main>
  );
}

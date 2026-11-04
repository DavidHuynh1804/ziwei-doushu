'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ScrollIntro from '@/components/ScrollIntro';
import { useLanguage } from '@/components/LanguageProvider';
import LanguageToggle from '@/components/LanguageToggle';

export default function PreviewPage() {
  const router = useRouter();
  // replayKey 用于强制重置 ScrollIntro（用户点"再播放一次"时）
  const [replayKey, setReplayKey] = useState(0);
  const [done, setDone] = useState(false);
  const { locale } = useLanguage();
  const isVi = locale === 'vi';

  return (
    <>
      {/* 卷轴开场动画 */}
      <ScrollIntro key={replayKey} onComplete={() => setDone(true)} />

      {/* 动画结束后的「样片说明 + 操作按钮」面板 */}
      {done && (
        <main style={{
          minHeight: '100vh',
          background: '#0d0a08',
          color: '#e8dcc4',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '48px 24px',
          fontFamily: '"STSong", "Songti SC", serif',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.4em', color: '#c89647' }}>
              SCROLL · INTRO · PREVIEW
            </div>
            <LanguageToggle compact />
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            letterSpacing: '0.18em',
            color: '#e8dcc4',
            marginBottom: '16px',
            fontWeight: 600,
          }}>
            {isVi ? 'Cuộn Giấy Tử Vi · Xem Trước Mở Màn' : '紫微卷轴 · 开场预览'}
          </h1>
          <p style={{
            fontSize: '14px', color: '#a89878',
            maxWidth: '500px', lineHeight: 1.9,
            letterSpacing: '0.1em',
            marginBottom: '40px',
            fontFamily: '"STKaiti", "Kaiti SC", serif',
          }}>
            {isVi ? (
              <>
                Hiệu ứng cuộn tranh thư pháp mở ra khi truy cập trang chủ.<br />
                Tái hiện phong vị cổ điển kết hợp trải nghiệm số hóa hiện đại.
              </>
            ) : (
              <>
                刚才看到的卷轴效果会在每次进入主页时缓缓铺开。<br />
                如果满意，告诉我，我把它接到主页 / 上线。
              </>
            )}
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
            <button
              onClick={() => { setDone(false); setReplayKey(k => k + 1); }}
              style={{
                background: '#a8302a',
                color: '#f5ecd7',
                padding: '14px 28px',
                fontSize: '14px',
                fontFamily: '"STSong", serif',
                letterSpacing: '0.3em',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {isVi ? 'PHÁT LẠI MỘT LẦN NỮA' : '再 播 放 一 次'}
            </button>
            <button
              onClick={() => router.push('/')}
              style={{
                background: 'transparent',
                color: '#e8dcc4',
                padding: '14px 28px',
                fontSize: '14px',
                fontFamily: '"STSong", serif',
                letterSpacing: '0.3em',
                border: '1px solid rgba(232,220,196,0.25)',
                cursor: 'pointer',
              }}
            >
              {isVi ? 'VÀO TRANG CHỦ' : '进 入 原 版 首 页'}
            </button>
          </div>

          <div style={{
            marginTop: '40px', fontSize: '12px', color: '#6e6048',
            letterSpacing: '0.15em',
            display: 'flex', gap: '20px',
          }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>{isVi ? 'Trang chủ ↗' : '原版 ↗'}</Link>
            <span>·</span>
            <Link href="/chart" style={{ color: 'inherit', textDecoration: 'none' }}>{isVi ? 'Lập lá số' : '命盘'}</Link>
            <span>·</span>
            <Link href="/heming" style={{ color: 'inherit', textDecoration: 'none' }}>{isVi ? 'Hợp mệnh' : '合盘'}</Link>
          </div>

          {/* 时间轴说明 */}
          <div style={{
            marginTop: '64px',
            padding: '24px 32px',
            border: '1px solid rgba(232,220,196,0.12)',
            maxWidth: '500px',
            fontSize: '12px',
            color: '#a89878',
            lineHeight: 1.9,
            letterSpacing: '0.1em',
            fontFamily: '"STKaiti", serif',
            textAlign: 'left',
          }}>
            <div style={{ color: '#c89647', marginBottom: '12px', letterSpacing: '0.2em', fontSize: '11px' }}>
              {isVi ? 'DÒNG THỜI GIAN HIỆU ỨNG' : '动画时间轴'}
            </div>
            <div>{isVi ? '· 0.0 ~ 1.7 s   Trục cuộn từ trung tâm mở rộng sang hai phía' : '· 0.0 ~ 1.7 s   卷轴从中央向两侧展开'}</div>
            <div>{isVi ? '· 1.9 ~ 2.7 s   Nội dung thư pháp hiển thị (Tiêu đề + Chu sa ấn)' : '· 1.9 ~ 2.7 s   宣纸内容浮现（标题 + 副标 + 朱砂印）'}</div>
            <div>{isVi ? '· 2.7 ~ 3.5 s   Dừng lại thưởng lãm nét mực' : '· 2.7 ~ 3.5 s   停留欣赏'}</div>
            <div>{isVi ? '· 3.5 ~ 4.2 s   Toàn bộ mờ dần chuyển tiếp vào trang chủ' : '· 3.5 ~ 4.2 s   整体淡出，进入主页'}</div>
            <div style={{ marginTop: '12px', color: '#6e6048', fontSize: '11px' }}>
              {isVi ? 'Người dùng có thể nhấn nút "Bỏ qua" ở góc dưới bên phải bất cứ lúc nào.' : '用户随时可点右下「跳过」直接进入主页。'}
            </div>
          </div>
        </main>
      )}
    </>
  );
}

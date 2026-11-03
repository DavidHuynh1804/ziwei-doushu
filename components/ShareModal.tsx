'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { useLanguage } from '@/components/LanguageProvider';
import ShareCardCanvas, { captureShareCard, downloadDataURL } from './ShareCardCanvas';
interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  shareUrl: string;
  chart: ZiweiChart | null;
  birth: { year: string; month: string; day: string; hour: string; minute: string; gender: 'male' | 'female'; city?: string };
  highlight?: string;
}

export default function ShareModal({ open, onClose, shareUrl, chart, birth, highlight }: ShareModalProps) {
  const { locale, t } = useLanguage();
  const isVi = locale === 'vi';
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('input');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadImage = async () => {
    setDownloading(true);
    try {
      const dataURL = await captureShareCard();
      if (!dataURL) {
        alert(isVi ? 'Không thể tạo ảnh, vui lòng thử lại hoặc chụp ảnh màn hình.' : '图片生成失败，请截图保存或刷新重试');
        return;
      }
      const rawName = chart?.birthInfo.name?.trim();
      const sanitizedName = rawName ? rawName.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9]/g, '_') : '';
      const filename = isVi
        ? (sanitizedName ? `tu-vi-${sanitizedName}.png` : `tu-vi-la-so_${Date.now()}.png`)
        : (sanitizedName ? `ziwei-${sanitizedName}.png` : `紫微命盘_${Date.now()}.png`);
      downloadDataURL(dataURL, filename);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={e => e.stopPropagation()}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'white',
              maxWidth: '720px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
            }}
          >
            {/* 顶部标题 */}
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid rgba(184,146,42,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#3d2f10', letterSpacing: isVi ? '0.04em' : '0.12em' }}>
                ✦ {isVi ? 'Chia sẻ lá số' : '分享命盘'}
              </div>
              <button onClick={onClose}
                aria-label={isVi ? 'Đóng' : '关闭'}
                title={isVi ? 'Đóng' : '关闭'}
                style={{
                  width: '28px', height: '28px', borderRadius: '50%', border: 'none',
                  background: 'rgba(0,0,0,0.05)', color: '#666', fontSize: '16px',
                  cursor: 'pointer', lineHeight: 1,
                }}
              >×</button>
            </div>

            {/* 卡片图预览（实际渲染） */}
            <div style={{ padding: '20px', background: '#fbf6e8', display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
              {chart && (
                <ShareCardCanvas chart={chart} birth={birth} highlight={highlight} />
              )}
            </div>

            <div style={{ padding: '0 20px 12px', textAlign: 'center', fontSize: '11px', color: '#a89b7c', letterSpacing: '0.04em' }}>
              {isVi
                ? '↑ Tương thích chia sẻ trên Zalo / Facebook / Messenger / Tin nhắn'
                : '↑ 朋友圈 / 微信 / 抖音 / 小红书 都能用'}
            </div>

            {/* 操作区 */}
            <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={downloadImage} disabled={downloading}
                style={{
                  padding: '14px', borderRadius: '10px', border: 'none',
                  background: 'linear-gradient(135deg, #d4a948 0%, #b8922a 100%)',
                  color: 'white', fontSize: '14px', fontWeight: 600, letterSpacing: isVi ? '0.05em' : '0.15em',
                  cursor: downloading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(184,146,42,0.3)',
                  opacity: downloading ? 0.7 : 1,
                }}
              >
                {downloading
                  ? (isVi ? 'Đang tạo ảnh…' : '生成中…')
                  : (isVi ? '⬇ Tải ảnh lá số (PNG)' : '⬇ 下载分享图')}
              </button>

              <button onClick={copyLink}
                style={{
                  padding: '14px', borderRadius: '10px',
                  border: '1px solid rgba(184,146,42,0.4)', background: 'white',
                  color: '#b8922a', fontSize: '14px', fontWeight: 500, letterSpacing: isVi ? '0.04em' : '0.12em',
                  cursor: 'pointer',
                }}
              >
                {copied
                  ? (isVi ? '✓ Đã sao chép!' : '✓ 已复制链接')
                  : (isVi ? '🔗 Sao chép liên kết' : '🔗 复制命盘链接')}
              </button>

              <div style={{
                fontSize: '11px', color: '#a89b7c', lineHeight: 1.7,
                padding: '10px 12px', background: 'rgba(184,146,42,0.05)',
                borderRadius: '8px', marginTop: '4px',
              }}>
                <div style={{ marginBottom: '4px', fontWeight: 600, color: '#8b6a14' }}>
                  {isVi ? 'Hướng dẫn:' : '使用提示：'}
                </div>
                {isVi ? (
                  <>
                    · Tải ảnh lá số để gửi cho bạn bè hoặc lưu trữ trên thiết bị<br />
                    · Sao chép liên kết gửi cho người khác, mở ra để xem ngay lá số
                  </>
                ) : (
                  <>
                    · 下载图片可发朋友圈 / 抖音 / 小红书<br />
                    · 复制链接发给微信好友，对方点开看自己的盘起点
                  </>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    background: '#f9fafb',
                    color: '#4b5563',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {isVi ? 'Đóng' : '关闭'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

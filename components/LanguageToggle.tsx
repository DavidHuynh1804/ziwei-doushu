'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';
import { useTheme } from '@/components/ThemeProvider';

export interface LanguageToggleProps {
  className?: string;
  compact?: boolean;
}

export function LanguageToggle({ className = '', compact = false }: LanguageToggleProps) {
  const { locale, toggle } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isVi = locale === 'vi';

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      aria-label={isVi ? 'Chuyển sang Tiếng Trung' : 'Chuyển sang Tiếng Việt'}
      title={isVi ? 'Chuyển sang Tiếng Trung (切换至中文)' : 'Chuyển sang Tiếng Việt (切换至越南语)'}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer ${className}`}
      style={{
        borderColor: isDark ? 'rgba(212,168,67,0.3)' : 'rgba(140,100,20,0.35)',
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,252,242,0.85)',
        transition: 'background 0.35s ease, border-color 0.35s ease',
      }}
    >
      <div
        className="relative w-10 h-5 rounded-full flex-shrink-0"
        style={{
          background: isDark ? 'rgba(12,24,64,0.95)' : 'rgba(230,195,80,0.55)',
          transition: 'background 0.35s ease',
        }}
      >
        <motion.div
          animate={{ x: isVi ? 2 : 22 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="absolute top-1 w-3.5 h-3.5 rounded-full"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #b8a050, #e8d090)'
              : 'linear-gradient(135deg, #e89010, #f8d050)',
          }}
        />
      </div>
      <span
        className="text-[11px] font-medium tracking-wide select-none"
        style={{
          color: isDark ? 'rgba(212,180,100,0.85)' : 'rgba(110,72,8,0.8)',
          transition: 'color 0.35s ease',
        }}
      >
        {isVi ? (compact ? '🇻🇳 VN' : '🇻🇳 Tiếng Việt') : '🇨🇳 中文'}
      </span>
    </motion.button>
  );
}

export default LanguageToggle;

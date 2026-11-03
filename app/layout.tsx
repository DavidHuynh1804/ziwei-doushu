import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/components/LanguageProvider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Tử Vi Đẩu Số · Lập Lá Số & Luận Giải Chính Tông Nghê Hải Hạ | Ziwei Master',
  description: 'Dựa trên hệ thống Tử Vi Đẩu Số chính tông của thầy Nghê Hải Hạ, AI phân tích chuyên sâu lá số mệnh bàn, đại hạn lưu niên, tình cảm sự nghiệp tài vận sức khỏe toàn diện.',
  keywords: 'Tử Vi Đẩu Số, Tử Vi, Lập Lá Số Tử Vi, Luận Giải Tử Vi, Nghê Hải Hạ, 14 Chính Tinh, 12 Cung Vị, Lá số tử vi, Tử Vi Đẩu Số Toàn Thư, Cốt Tủy Phú, 紫微斗数, 倪海厦, 紫微斗数全集, 紫微斗数全书, 骨髓赋, 命盘, 命理, 14主星, 12宫位',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Tử Vi Đẩu Số · Lập Lá Số & Luận Giải Chính Tông Nghê Hải Hạ | Ziwei Master',
    description: 'Dựa trên hệ thống Tử Vi Đẩu Số chính tông của thầy Nghê Hải Hạ, AI phân tích chuyên sâu lá số mệnh bàn, đại hạn lưu niên, tình cảm sự nghiệp tài vận sức khỏe toàn diện.',
    url: SITE_URL,
    siteName: 'Tử Vi Đẩu Số · Ziwei Master',
    locale: 'vi_VN',
    type: 'website',
  },
  // 站长平台验证（拿到 verification code 后填入对应字段，重新部署即可）
  verification: {
    // Google Search Console: 在 https://search.google.com/search-console 添加站点后获取
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    // Bing Webmaster Tools: 在 https://www.bing.com/webmasters 添加站点后获取
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '808FFC6023A2C359B375DD860FEDA856',
      // 百度站长（等执照下来后）
      'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_VERIFICATION || '',
      // 360 站长（等执照下来后）
      '360-site-verification': process.env.NEXT_PUBLIC_360_VERIFICATION || '',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('ziwei-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);else document.documentElement.setAttribute('data-theme','dark');var l=localStorage.getItem('ziwei-lang');if(l==='zh'||l==='vi'){document.documentElement.setAttribute('data-lang',l);document.documentElement.setAttribute('lang',l==='zh'?'zh-CN':'vi');}else{document.documentElement.setAttribute('data-lang','vi');document.documentElement.setAttribute('lang','vi');}}catch(e){}})();` }} />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

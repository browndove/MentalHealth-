import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { Noto_Sans_JP, Noto_Serif_JP, Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

// Primary font - Noto Sans JP for clean, modern Japanese-inspired UI
const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

// Secondary font - Noto Serif JP for elegant headers and emphasis
const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-serif-jp',
  display: 'swap',
});

// Fallback font - Inter for compatibility
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Accra TechMind | 心の健康',
  description: 'Mental health and counseling resources for students. A zen-inspired platform for mindful wellness.',
  keywords: ['mental health', 'counseling', 'wellness', 'mindfulness', 'students'],
  authors: [{ name: 'Accra TechMind' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f6f3' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1419' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={cn(
          // Font stack with Japanese-inspired hierarchy
          "font-sans antialiased min-h-screen bg-background flex flex-col",
          // Japanese-inspired typography features
          "text-rendering-optimizelegibility",
          // Font variables for CSS usage
          notoSansJP.variable,
          notoSerifJP.variable,
          inter.variable,
          // Japanese aesthetic enhancements
          "bg-washi selection:bg-primary/20 selection:text-primary-foreground",
          // Smooth transitions for theme changes
          "transition-colors duration-300 ease-out"
        )}
        style={{
          // Japanese typography optimizations
          fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
          fontVariantNumeric: 'tabular-nums',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          // Subtle letter spacing for Japanese aesthetic
          letterSpacing: '0.01em',
        }}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
import type { Metadata } from 'next';
import { DM_Sans, DM_Mono } from 'next/font/google';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-sans' });
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--font-mono' });

export const metadata: Metadata = { title: 'ERP Acabamentos' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${dmMono.variable} h-full`}>
      <body className="flex h-full overflow-hidden bg-canvas text-primary font-sans antialiased">
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
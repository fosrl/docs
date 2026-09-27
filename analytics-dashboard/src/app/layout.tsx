import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Docs analytics',
  robots: { index: false, follow: false },
};

const docsUrl = process.env.DOCS_SITE_URL ?? 'https://docs.pangolin.net';

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">
        <header className="border-b">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="font-medium">
              Pangolin Docs · Analytics
            </Link>
            <a href={docsUrl} className="text-sm text-fd-muted-foreground hover:text-fd-foreground">
              View docs ↗
            </a>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">{children}</main>
      </body>
    </html>
  );
}

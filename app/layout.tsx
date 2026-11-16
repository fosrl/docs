import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Inter } from 'next/font/google';
import { Analytics } from '@/components/analytics';
import { AskAiProvider } from '@/components/ai/ask-ai';
import { SiteSearchProvider } from '@/components/search/site-search';
import { appName, siteDescription, siteUrl } from '@/lib/shared';
import { FEATURE_BANNER_INIT_SCRIPT } from '@/lib/site';
import './global.css';

/** same fonts as pangolin.net: Inter (titles use 800) and IBM Plex Mono for code */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { template: `%s | ${appName}`, default: appName },
  description: siteDescription,
  appleWebApp: { title: appName },
  alternates: { types: { 'application/xml': '/sitemap.xml' } },
  openGraph: { siteName: appName, images: '/images/home-social-graph.png' },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#141415' },
  ],
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plexMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-background font-sans text-base text-foreground antialiased">
        <script dangerouslySetInnerHTML={{ __html: FEATURE_BANNER_INIT_SCRIPT }} />
        {/* search and Ask AI are our own (components/search, components/ai), not Fumadocs' */}
        {/* light / dark follows the system until the visitor picks one (header toggle) */}
        <RootProvider search={{ enabled: false }} theme={{ defaultTheme: 'system', enableSystem: true }}>
          <AskAiProvider>
            <SiteSearchProvider>{children}</SiteSearchProvider>
          </AskAiProvider>
        </RootProvider>
        <Analytics />
      </body>
    </html>
  );
}

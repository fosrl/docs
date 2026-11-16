import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { siteHref, type Site } from '@/lib/site';

/** assistant answers are Markdown; relative links point at the site the chat was on, in a new tab */
export function MessageMarkdown({ text, site }: { text: string; site: Site }) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ node: _, href, ...props }) => (
          <a {...props} href={href?.startsWith('/') ? siteHref(site, href) : href} target="_blank" rel="noreferrer" />
        ),
      }}
    >
      {text}
    </Markdown>
  );
}

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const docsUrl = process.env.DOCS_SITE_URL ?? 'https://docs.pangolin.net';

/** assistant answers are Markdown; relative links point at the docs site, in a new tab */
export function MessageMarkdown({ text }: { text: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ node: _, href, ...props }) => (
          <a {...props} href={href?.startsWith('/') ? `${docsUrl}${href}` : href} target="_blank" rel="noreferrer" />
        ),
      }}
    >
      {text}
    </Markdown>
  );
}

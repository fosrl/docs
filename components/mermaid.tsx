'use client';

import { useEffect, useId, useState } from 'react';
import { useTheme } from 'next-themes';

/** Renders a ```mermaid code block (converted by remarkMdxMermaid) client-side, following the site theme */
export function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/[^a-zA-Z0-9-_]/g, '');
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = useState<string>();
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { default: mermaid } = await import('mermaid');
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          fontFamily: 'inherit',
          theme: resolvedTheme === 'dark' ? 'dark' : 'default',
        });
        const { svg } = await mermaid.render(`mermaid-${id}-${resolvedTheme}`, chart);
        if (!cancelled) {
          setSvg(svg);
          setError(false);
        }
      } catch (e) {
        console.error('Mermaid render failed', e);
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id, resolvedTheme]);

  if (error) {
    return (
      <pre className="my-6 overflow-x-auto rounded-lg border p-4 text-sm">
        <code>{chart}</code>
      </pre>
    );
  }

  return (
    <div
      className="my-6 flex justify-center overflow-x-auto [&_svg]:h-auto [&_svg]:max-w-full"
      // mermaid output is generated from our own MDX content
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
}

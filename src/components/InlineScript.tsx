/**
 * An inline script that runs while the server-rendered HTML is parsed (before first
 * paint). On the client it is rendered as text/plain, so React does not warn about a
 * <script> it would never execute. See the Next.js guide "Preventing flash before
 * hydration".
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * validates a pasted "embed code" string for a knowledge-library page. only a
 * single, well-formed `<iframe>` whose `src` resolves to an allowed YouTube or
 * Spotify embed host is accepted — everything else is rejected outright. this
 * is a deliberate narrowing (agreed in the design) of "paste any embed HTML"
 * to prevent an admin-pasted `<script>`/`onerror` handler from running in
 * every visitor's browser. no HTML sanitizer library is used: the input is
 * either exactly this one safe shape, or it is refused, not partially cleaned.
 */

const ALLOWED_EMBED_HOSTS = new Set(['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'open.spotify.com']);

const SINGLE_IFRAME_PATTERN = /^\s*<iframe\b[^>]*>\s*<\/iframe>\s*$/i;
const SRC_ATTRIBUTE_PATTERN = /\bsrc\s*=\s*"([^"]*)"|\bsrc\s*=\s*'([^']*)'/i;
const DISALLOWED_ATTRIBUTE_PATTERN = /\b(on\w+|srcdoc)\s*=/i;

/**
 * true if the given src resolves to an allowed embed host over https, with no
 * userinfo (`https://user@host` tricks) and no lookalike subdomain
 * (`youtube.com.evil.com` fails: its hostname is `youtube.com.evil.com`, not
 * `youtube.com`, so it never matches the exact allowlist below).
 */
function isAllowedEmbedSrc(src: string): boolean {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:') return false;
  if (url.username || url.password) return false;
  return ALLOWED_EMBED_HOSTS.has(url.hostname.toLowerCase());
}

/**
 * validate an admin-pasted embed snippet. returns the trimmed, accepted
 * snippet on success, or null if it doesn't match the strict allowed shape.
 */
export function validateEmbedHtml(rawHtml: string | undefined | null): string | null {
  if (!rawHtml) return null;
  const html = rawHtml.trim();
  if (!html) return null;

  if (!SINGLE_IFRAME_PATTERN.test(html)) return null;
  if (DISALLOWED_ATTRIBUTE_PATTERN.test(html)) return null;

  const srcMatch = SRC_ATTRIBUTE_PATTERN.exec(html);
  const src = srcMatch?.[1] ?? srcMatch?.[2];
  if (!src || !isAllowedEmbedSrc(src)) return null;

  return html;
}

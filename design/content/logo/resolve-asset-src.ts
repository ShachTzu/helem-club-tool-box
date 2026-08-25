/**
 * normalizes a bundled asset url so the server and the browser agree on it.
 *
 * the deployed container serves bundled assets from the origin root (e.g.
 * `/static/images/...`) — that is the path that must be baked into the
 * server-rendered html so the image loads on the very first paint. the
 * `/public/...` form only exists on the local dev server and must never be
 * the default: in production it silently resolves to the app's html
 * fallback (a 200 response with the wrong content type) instead of a 404,
 * so a browser's `<img>` element does not reliably fire `onerror`, and if a
 * hydration mismatch anywhere else on the page stops react from taking
 * over, the client-side fallback never gets a chance to run either —
 * leaving the logo permanently broken. resolving to the root path by
 * default removes the dependency on hydration and js entirely.
 *
 * absolute urls (http, protocol-relative) and inlined data uris are already
 * unambiguous and are returned untouched.
 *
 * @param src the asset url produced by the bundler import.
 * @returns a url that resolves correctly on the deployed server by default.
 */
export function resolveAssetSrc(src: string): string {
  if (isAbsoluteAssetSrc(src)) return src;

  const path = src.replace(/^\/+/, ``).replace(/^public\//, ``);
  return `/${path}`;
}

/**
 * whether an asset url is already unambiguous and must not be rewritten.
 *
 * @param src the asset url produced by the bundler import.
 * @returns true for absolute, protocol-relative and data urls.
 */
export function isAbsoluteAssetSrc(src: string): boolean {
  return /^(https?:)?\/\//.test(src) || src.startsWith(`data:`);
}

/**
 * the same asset served from the other static root.
 *
 * the dev server mounts bundled assets under `/public`, while the deployed
 * container serves them from the origin root. `resolveAssetSrc` defaults to
 * the root form since that is what production needs, so this fallback only
 * ever has to add the `/public` prefix back for the local dev server case.
 *
 * @param src an asset url already normalized by `resolveAssetSrc`.
 * @returns the counterpart url, or undefined when there is no alternative.
 */
export function alternateAssetSrc(src: string): string | undefined {
  if (isAbsoluteAssetSrc(src)) return undefined;
  if (src.startsWith(`/public/`)) return undefined;

  return `/public${src.startsWith(`/`) ? src : `/${src}`}`;
}

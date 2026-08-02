import { createHash } from 'node:crypto';

/**
 * the three values needed to sign and target a Cloudinary upload, parsed once
 * from the CLOUDINARY_URL secret. the api secret never leaves the server.
 */
export type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

const CLOUDINARY_URL_PATTERN = /^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/;

/**
 * parse a `cloudinary://<api_key>:<api_secret>@<cloud_name>` connection
 * string (the format Cloudinary publishes as CLOUDINARY_URL). throws on a
 * missing or malformed value — callers should fail the single operation that
 * needs it rather than crash the whole aspect, since browsing the catalog
 * doesn't depend on Cloudinary.
 */
export function parseCloudinaryUrl(url: string | undefined): CloudinaryConfig {
  const match = url ? CLOUDINARY_URL_PATTERN.exec(url) : null;
  if (!match) {
    throw new Error('CLOUDINARY_URL is missing or malformed (expected cloudinary://key:secret@cloud_name)');
  }
  const [, apiKey, apiSecret, cloudName] = match;
  return { cloudName, apiKey, apiSecret };
}

/**
 * sign a Cloudinary upload per their documented algorithm: sort the given
 * params alphabetically by key, join as `key=value&key=value`, append the api
 * secret, then sha1 hex the result. only sign the params actually sent to the
 * upload API — Cloudinary rejects the upload if the signed params don't match
 * what's posted, which is what pins an upload to the folder we signed for.
 */
export function signCloudinaryUpload(
  params: Record<string, string | number>,
  apiSecret: string
): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return createHash('sha1').update(toSign + apiSecret).digest('hex');
}

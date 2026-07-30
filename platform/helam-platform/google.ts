import { OAuth2Client } from 'google-auth-library';

/**
 * a verified Google identity extracted from an ID token.
 */
export type GoogleIdentity = {
  email: string;
  sub: string;
  emailVerified: boolean;
};

/**
 * verify a Google ID token server-side against our OAuth client id. returns the
 * verified identity, or null when the token is invalid, not signed by Google, or
 * issued for a different audience. the token payload is never trusted without
 * this verification.
 */
export async function verifyGoogleIdToken(
  idToken: string,
  clientId: string
): Promise<GoogleIdentity | null> {
  const client = new OAuth2Client(clientId);
  try {
    const ticket = await client.verifyIdToken({ idToken, audience: clientId });
    const payload = ticket.getPayload();
    if (!payload?.email || !payload.sub) return null;
    return {
      email: payload.email.toLowerCase(),
      sub: payload.sub,
      emailVerified: Boolean(payload.email_verified),
    };
  } catch {
    return null;
  }
}

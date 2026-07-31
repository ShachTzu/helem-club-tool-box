import { OAuth2Client } from 'google-auth-library';

/**
 * the verified identity extracted from a Google ID token, after the token's
 * signature, issuer, audience and expiry have all been validated by Google's
 * own library against Google's published certificates.
 */
export type GoogleIdentity = {
  /**
   * Google's stable, unique subject identifier for the account. this never
   * changes, even when the user changes their email address, which is why it
   * is the field we key accounts on rather than the email.
   */
  googleSub: string;

  /**
   * the account's email address, lowercased.
   */
  email: string;

  /**
   * whether Google itself has verified ownership of the email address.
   */
  emailVerified: boolean;

  /**
   * the account's display name, when the profile scope was granted.
   */
  displayName?: string;

  /**
   * the account's profile picture url, when available.
   */
  avatarUrl?: string;
};

/**
 * verifies Google ID tokens against the configured OAuth client.
 *
 * this exists because a client-supplied token is untrusted input: without
 * cryptographic verification anyone could post an arbitrary string and be
 * issued a session. `verifyIdToken` checks the RS256 signature against
 * Google's rotating public certificates, and asserts the issuer, the audience
 * (our client id) and the expiry.
 */
export class GoogleVerifier {
  private client: OAuth2Client;

  constructor(private clientId: string) {
    this.client = new OAuth2Client(clientId);
  }

  /**
   * verify a Google ID token and return the identity it asserts.
   *
   * @param idToken the raw JWT issued by Google Identity Services in the browser.
   * @returns the verified identity, or null when the token is invalid, expired,
   * issued for a different audience, or belongs to an unverified email.
   */
  async verify(idToken: string): Promise<GoogleIdentity | null> {
    if (!idToken) return null;

    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.clientId,
      });

      const payload = ticket.getPayload();
      if (!payload) return null;

      const { sub, email, email_verified: emailVerified, name, picture } = payload;
      if (!sub || !email) return null;

      // an unverified Google address proves nothing about who is signing in —
      // treat it as a failed sign-in rather than provisioning an account.
      if (!emailVerified) return null;

      return {
        googleSub: sub,
        email: email.toLowerCase(),
        emailVerified: true,
        displayName: name,
        avatarUrl: picture,
      };
    } catch {
      // an invalid signature, a mismatched audience or an expired token all
      // land here. never surface the underlying reason to the client.
      return null;
    }
  }
}

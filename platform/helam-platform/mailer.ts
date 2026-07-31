/**
 * a single outbound email.
 */
export type OutboundEmail = {
  /**
   * recipient address.
   */
  to: string;

  /**
   * subject line.
   */
  subject: string;

  /**
   * plain-text body, used as the fallback part.
   */
  text: string;

  /**
   * html body.
   */
  html: string;
};

export type MailerOptions = {
  /**
   * Resend API key. when absent, no mail can be sent.
   */
  apiKey?: string;

  /**
   * the sender address, e.g. "ahalan@helem.club". must belong to a domain
   * verified in Resend. a bare address is accepted as well as the
   * "Name <address>" form.
   */
  fromAddress?: string;

  /**
   * when true, a missing API key is fatal instead of falling back to printing
   * codes to the server log. set for production.
   */
  requireDelivery?: boolean;
};

/**
 * the default sender, used when no address is configured.
 */
export const DEFAULT_FROM_ADDRESS = 'ahalan@helem.club';

/**
 * the display name shown to recipients.
 */
export const MAIL_FROM_NAME = 'הלם קלאב';

/**
 * build the RFC-5322 From header.
 *
 * hosting environments reject env values containing spaces or angle brackets,
 * so the configured value is expected to be a bare address and the display
 * name is attached here.
 *
 * @param address the configured sender address.
 * @returns the From header value.
 */
export function formatFrom(address: string): string {
  const trimmed = address.trim();
  // already in "Name <address>" form — pass it through untouched.
  if (trimmed.includes('<')) return trimmed;
  return `${MAIL_FROM_NAME} <${trimmed}>`;
}

/**
 * sends transactional email through Resend's HTTP API.
 *
 * the HTTP API is used rather than SMTP because it needs no long-lived
 * connection or port access, which suits a container that may be cold-started
 * per request.
 *
 * when no API key is configured the mailer runs in "log" mode: the message is
 * written to the server console so the sign-in flow stays testable locally
 * without a mail provider. that fallback is deliberately refused when
 * `requireDelivery` is set, because silently logging a sign-in code to stdout
 * in production would mean codes that never reach the member — and that sit
 * in a log file.
 */
export class Mailer {
  constructor(private options: MailerOptions) {}

  /**
   * whether real delivery is configured.
   */
  get canDeliver(): boolean {
    return Boolean(this.options.apiKey);
  }

  /**
   * send an email. resolves with whether the message was accepted by Resend
   * (false when it was only logged).
   *
   * @param email the message to send.
   * @returns true when handed off to the provider.
   */
  async send(email: OutboundEmail): Promise<boolean> {
    if (!this.options.apiKey) {
      if (this.options.requireDelivery) {
        throw new Error(
          '[helam-platform] RESEND_API_KEY is not set. refusing to fall back to logging ' +
            'sign-in codes to the server console in production.'
        );
      }

      // eslint-disable-next-line no-console
      console.info(
        `[helam-platform][mail:log-mode] to=${email.to} subject="${email.subject}"\n${email.text}`
      );
      return false;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: formatFrom(this.options.fromAddress || DEFAULT_FROM_ADDRESS),
        to: [email.to],
        subject: email.subject,
        text: email.text,
        html: email.html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`[helam-platform] Resend rejected the message (${response.status}): ${detail}`);
    }

    return true;
  }
}

/**
 * build the Hebrew, RTL one-time-password email sent to members.
 *
 * @param code the six-digit code.
 * @param ttlMinutes how long the code stays valid.
 * @returns the message body parts.
 */
export function buildOtpEmail(code: string, ttlMinutes: number): Omit<OutboundEmail, 'to'> {
  const subject = `קוד הכניסה שלך להלם קלאב — ${code}`;
  const text = [
    `קוד הכניסה שלך הוא: ${code}`,
    ``,
    `הקוד תקף ל-${ttlMinutes} דקות.`,
    `אם לא ביקשת את הקוד, אפשר להתעלם מהמייל הזה — לא בוצעה שום פעולה בחשבון.`,
  ].join('\n');

  const html = `
    <div dir="rtl" style="font-family: system-ui, -apple-system, 'Segoe UI', Arial, sans-serif; background:#0B1A30; padding:32px; color:#F5F7FA;">
      <div style="max-width:480px; margin:0 auto; background:#FFFFFF; color:#0B1A30; border-radius:16px; padding:32px; text-align:right;">
        <h1 style="margin:0 0 8px; font-size:20px; color:#0B1A30;">הלם קלאב</h1>
        <p style="margin:0 0 24px; color:#4F6D7A; font-size:15px;">קוד הכניסה שלך מוכן.</p>
        <div style="font-size:34px; letter-spacing:10px; font-weight:700; color:#0B1A30; background:#F2F5F8; border-radius:12px; padding:16px; text-align:center; direction:ltr;">
          ${code}
        </div>
        <p style="margin:24px 0 0; color:#4F6D7A; font-size:14px;">הקוד תקף ל-${ttlMinutes} דקות.</p>
        <p style="margin:8px 0 0; color:#4F6D7A; font-size:13px;">
          אם לא ביקשת את הקוד, אפשר להתעלם מהמייל הזה — לא בוצעה שום פעולה בחשבון.
        </p>
        <div style="margin-top:24px; height:3px; background:#E89F4B; border-radius:3px;"></div>
      </div>
    </div>
  `;

  return { subject, text, html };
}

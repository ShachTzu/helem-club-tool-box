import type { ReactNode, CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heading } from '@helemclub/design.typography.heading';
import { Paragraph } from '@helemclub/design.typography.paragraph';
import { Button as DsButton, type ButtonVariant } from '@helemclub/design.actions.button';
import { Card as DsCard } from '@helemclub/design.content.card';
import { Badge as DsBadge } from '@helemclub/design.content.badge';
import { TagChip } from '@helemclub/design.content.tag-chip';
import { StarRating } from '@helemclub/design.content.star-rating';
import { theme } from './theme.js';

/** Full-width page background wrapper. */
export function PageShell({ children }: { children: ReactNode }) {
  return <div style={{ background: theme.color.surface, minHeight: '100vh' }}>{children}</div>;
}

/** Centered max-width content container. */
export function Container({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 20px', ...style }}>{children}</div>
  );
}

/** A page hero band with navy gradient. */
export function Hero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section
      style={{
        background: `linear-gradient(160deg, ${theme.color.primary} 0%, #12294a 100%)`,
        color: theme.color.white,
        padding: '52px 20px 58px',
      }}
    >
      <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
        {eyebrow && (
          <div
            style={{
              color: theme.color.accent,
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 0.5,
              marginBottom: 12,
            }}
          >
            {eyebrow}
          </div>
        )}
        <Heading level={1} color="inverse" align="center" style={{ margin: '0 0 14px' }}>
          {title}
        </Heading>
        {subtitle && (
          <Paragraph size="lg" style={{ margin: 0, opacity: 0.85, color: theme.color.white }}>
            {subtitle}
          </Paragraph>
        )}
        {children && <div style={{ marginTop: 24 }}>{children}</div>}
      </div>
    </section>
  );
}

/** Section with an optional title + subtitle. */
export function Section({
  title,
  subtitle,
  action,
  children,
  style,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <Container style={{ padding: '40px 20px', ...style }}>
      {(title || action) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 22,
            flexWrap: 'wrap',
          }}
        >
          <div>
            {title && (
              <Heading level={2} color="primary" style={{ margin: 0 }}>
                {title}
              </Heading>
            )}
            {subtitle && (
              <Paragraph muted style={{ margin: '8px 0 0' }}>
                {subtitle}
              </Paragraph>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </Container>
  );
}

/** A surface card. Renders as a link when `to` is set. */
export function Card({
  children,
  to,
  href,
  style,
  onClick,
}: {
  children: ReactNode;
  to?: string;
  href?: string;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  const card = (
    <DsCard padding="none" clickable={Boolean(to || href || onClick)} onClick={onClick} style={style}>
      {children}
    </DsCard>
  );
  if (to)
    return (
      <Link to={to} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        {card}
      </Link>
    );
  if (href)
    return (
      <a href={href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        {card}
      </a>
    );
  return card;
}

/** A pill chip, optionally toggleable/active. Delegates to the design TagChip. */
export function Chip({
  label,
  active,
  onClick,
  count,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  tone?: 'steel' | 'amber';
  count?: number;
}) {
  return <TagChip label={label} active={active} count={count} onToggle={onClick} />;
}

type BadgeTone = 'neutral' | 'accent' | 'success' | 'info';

/** A small colored badge. Delegates to the design Badge. */
export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: BadgeTone }) {
  const variant = tone === 'info' ? 'neutral' : tone;
  return <DsBadge variant={variant}>{children}</DsBadge>;
}

/** Primary / accent button that can render as link. Delegates to the design Button. */
export function Button({
  children,
  to,
  href,
  onClick,
  variant = 'accent',
  size = 'md',
  fullWidth,
}: {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'accent' | 'primary' | 'ghost';
  size?: 'md' | 'lg';
  fullWidth?: boolean;
}) {
  const navigate = useNavigate();
  const dsVariant: ButtonVariant = variant;
  // ghost buttons sit on the navy hero — force light-on-dark contrast.
  const ghostStyle: CSSProperties | undefined =
    variant === 'ghost'
      ? { color: theme.color.white, borderColor: 'rgba(255,255,255,0.45)' }
      : undefined;
  const handleClick = () => {
    if (to) navigate(to);
    onClick?.();
  };
  if (href) {
    return (
      <DsButton variant={dsVariant} size={size} href={href} external fullWidth={fullWidth} style={ghostStyle}>
        {children}
      </DsButton>
    );
  }
  return (
    <DsButton variant={dsVariant} size={size} fullWidth={fullWidth} onClick={handleClick} style={ghostStyle}>
      {children}
    </DsButton>
  );
}

/** Star rating display. Delegates to the design StarRating. */
export function Stars({ value, size = 15 }: { value: number; size?: number }) {
  return <StarRating value={value} size={size} />;
}

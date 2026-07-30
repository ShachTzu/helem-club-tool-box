import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useAuth } from '@helemclub/platform.hooks.use-auth';
import type { PlainUser, UserRole } from '@helemclub/platform.entities.user';
import { Avatar } from '@helemclub/design.content.avatar';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { Button } from '@helemclub/design.actions.button';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import type { ProfileUpdateInput } from './profile-update-input-type.js';
import styles from './profile.module.scss';

const ROLE_LABELS: Record<UserRole, string> = {
  member: `חבר קהילה`,
  writer: `כותב`,
  moderator: `מודרטור`,
  admin: `אדמין`,
};

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  member: `גישה לתוכן חברי-קהילה ושמירת מועדפים`,
  writer: `יכול/ה ליצור ולערוך תוכן`,
  moderator: `מנהל/ת תגובות ומאשר/ת הגשות`,
  admin: `גישה מלאה לניהול המערכת`,
};

function formatMemberSince(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return ``;
  return new Intl.DateTimeFormat(`he-IL`, { year: `numeric`, month: `long` }).format(date);
}

export type ProfileProps = {
  /**
   * provide mock data for the current user, bypassing the auth query.
   * useful for tests and previews. pass null to simulate a signed-out state.
   */
  mockUser?: PlainUser | null;

  /**
   * called when the member saves changes to their display name or avatar.
   * resolves (or returns) whether the update succeeded.
   */
  onSave?: (input: ProfileUpdateInput) => Promise<boolean> | boolean;

  /**
   * path to redirect signed-out visitors to.
   */
  redirectTo?: string;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * the profile page (protected): lets a signed-in member edit their display
 * name and avatar, view their community role, and sign out. RTL.
 */
export function Profile({ mockUser, onSave, redirectTo = `/login`, className, style }: ProfileProps) {
  return (
    <ProtectedRoute mockData={mockUser} redirectTo={redirectTo}>
      <ProfileCard mockUser={mockUser} onSave={onSave} className={className} style={style} />
    </ProtectedRoute>
  );
}

type ProfileCardProps = {
  mockUser?: PlainUser | null;
  onSave?: (input: ProfileUpdateInput) => Promise<boolean> | boolean;
  className?: string;
  style?: React.CSSProperties;
};

function ProfileCard({ mockUser, onSave, className, style }: ProfileCardProps) {
  const hasMockUser = mockUser !== undefined;
  const { user, signOut } = useAuth(hasMockUser ? { mockData: mockUser } : undefined);

  const [displayName, setDisplayName] = useState(``);
  const [avatarUrl, setAvatarUrl] = useState(``);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: `success` | `error`; message: string } | null>(null);

  useEffect(() => {
    setDisplayName(user?.displayName || ``);
    setAvatarUrl(user?.avatarUrl || ``);
  }, [user?.displayName, user?.avatarUrl]);

  if (!user) return null;

  const isDirty = displayName.trim() !== user.displayName || avatarUrl.trim() !== (user.avatarUrl || ``);
  const canSave = isDirty && displayName.trim().length > 1 && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setFeedback(null);
    try {
      const input: ProfileUpdateInput = { displayName: displayName.trim(), avatarUrl: avatarUrl.trim() || undefined };
      const succeeded = onSave ? await onSave(input) : true;
      setFeedback(
        succeeded
          ? { tone: `success`, message: `הפרטים עודכנו בהצלחה` }
          : { tone: `error`, message: `לא הצלחנו לשמור את השינויים, נסו שוב` }
      );
    } catch {
      setFeedback({ tone: `error`, message: `לא הצלחנו לשמור את השינויים, נסו שוב` });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setDisplayName(user.displayName);
    setAvatarUrl(user.avatarUrl || ``);
    setFeedback(null);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className={classNames(styles.page, className)} style={style}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.eyebrow}>החשבון שלי</div>
          <h1 className={styles.title}>הפרופיל שלי</h1>
          <p className={styles.subtitle}>עדכנו את שם התצוגה והתמונה שלכם, וצפו בתפקיד שלכם בקהילה.</p>
        </div>

        <div className={styles.card}>
          <div className={styles.identity}>
            <div className={styles.avatarWrap}>
              <Avatar name={user.displayName} imageUrl={user.avatarUrl} size="x-large" ring />
              <span className={styles.roleBadge}>{ROLE_LABELS[user.role]}</span>
            </div>
            <div className={styles.identityText}>
              <h2 className={styles.name}>{user.displayName}</h2>
              <p className={styles.email}>{user.email}</p>
              {user.createdAt && (
                <p className={styles.memberSince}>חברים בקהילה מאז {formatMemberSince(user.createdAt)}</p>
              )}
            </div>
          </div>

          <hr className={styles.divider} />

          <div className={styles.form}>
            <span className={styles.sectionLabel}>עריכת פרטים אישיים</span>
            <TextInput
              label="שם תצוגה"
              value={displayName}
              onChange={(value) => setDisplayName(value)}
              placeholder="איך יקראו לך בקהילה?"
              required
            />
            <TextInput
              label="קישור לתמונת פרופיל (אופציונלי)"
              type="url"
              value={avatarUrl}
              onChange={(value) => setAvatarUrl(value)}
              placeholder="https://example.com/avatar.jpg"
              helperText="אם לא תוסיפו תמונה, נציג את הראשי תיבות של השם שלכם."
            />

            {feedback && (
              <div
                className={classNames(styles.feedback, {
                  [styles.feedbackSuccess]: feedback.tone === `success`,
                  [styles.feedbackError]: feedback.tone === `error`,
                })}
              >
                {feedback.message}
              </div>
            )}

            <div className={styles.actions}>
              <Button variant="ghost" disabled={!isDirty || saving} onClick={() => handleReset()}>
                ביטול
              </Button>
              <Button variant="accent" disabled={!canSave} loading={saving} onClick={() => handleSave()}>
                שמירת שינויים
              </Button>
            </div>
          </div>

          <div className={styles.roleSection}>
            <div className={styles.roleInfo}>
              <span className={styles.roleValue}>תפקיד בקהילה: {ROLE_LABELS[user.role]}</span>
              <p className={styles.roleDescription}>{ROLE_DESCRIPTIONS[user.role]}</p>
            </div>
          </div>

          <div className={styles.dangerZone}>
            <div className={styles.dangerText}>
              <p className={styles.dangerTitle}>יציאה מהחשבון</p>
              <p className={styles.dangerDescription}>תתנתקו מהמכשיר הזה. תוכלו להתחבר שוב בכל עת.</p>
            </div>
            <Button variant="danger" loading={signingOut} onClick={() => handleSignOut()}>
              התנתקות
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

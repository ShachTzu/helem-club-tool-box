import React, { useState } from 'react';
import classNames from 'classnames';
import {
  useListPendingPosts,
  useReviewPost,
  useUpdatePost,
  type UpdatePostInput,
} from '@helemclub/blog.hooks.use-posts';
import { Post } from '@helemclub/blog.entities.post';
import { Button } from '@helemclub/design.actions.button';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import type { PendingPostMock } from './pending-post-type.js';
import type { ReviewPostsMockUser } from './review-posts-user-type.js';
import { mockPendingPostList } from './review-posts.mock.js';
import styles from './review-posts.module.scss';

const STATUS_LABELS: Record<string, string> = {
  draft: `טיוטה`,
  pending: `ממתין לאישור`,
  published: `פורסם`,
  rejected: `נדחה`,
};

type EditFormState = {
  title: string;
  excerpt: string;
  body: string;
};

function toFormState(post: Post): EditFormState {
  return { title: post.title, excerpt: post.excerpt, body: post.body };
}

export type ReviewPostsProps = {
  /**
   * provide mock data for the pending post queue, bypassing the GraphQL
   * query. useful for tests and previews.
   */
  mockData?: PendingPostMock[];

  /**
   * provide mock data for the currently signed-in user, bypassing the
   * auth guard. pass null to simulate a signed-out state. useful for
   * tests and previews.
   */
  mockUser?: ReviewPostsMockUser;

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
 * proofing/review queue for community-submitted blog posts (RTL). lists
 * posts awaiting moderation, allows inline editing before publishing, and
 * lets moderators approve (publish) or reject each submission. protected
 * to moderators and admins only.
 */
export function ReviewPosts({ mockData, mockUser, className, style }: ReviewPostsProps) {
  return (
    <ProtectedRoute mockData={mockUser} allowedRoles={[`moderator`, `admin`]} redirectTo="/login">
      <ReviewPostsQueue mockData={mockData} className={className} style={style} />
    </ProtectedRoute>
  );
}

function ReviewPostsQueue({
  mockData,
  className,
  style,
}: Pick<ReviewPostsProps, `mockData` | `className` | `style`>) {
  const hasMock = mockData !== undefined;
  const { posts, loading, error, refetch } = useListPendingPosts(
    hasMock ? { mockData: mockData || mockPendingPostList() } : undefined
  );
  const { reviewPost, loading: reviewing } = useReviewPost();
  const { updatePost, loading: updating } = useUpdatePost();

  const [editingId, setEditingId] = useState<string>(``);
  const [formState, setFormState] = useState<EditFormState>({ title: ``, excerpt: ``, body: `` });
  const [actioningId, setActioningId] = useState<string>(``);

  const startEditing = (post: Post) => {
    setEditingId(post.id);
    setFormState(toFormState(post));
  };

  const cancelEditing = () => {
    setEditingId(``);
    setFormState({ title: ``, excerpt: ``, body: `` });
  };

  const saveEditing = async (id: string) => {
    const input: UpdatePostInput = {
      title: formState.title,
      excerpt: formState.excerpt,
      body: formState.body,
    };
    await updatePost(id, input);
    await refetch();
    cancelEditing();
  };

  const handleApprove = async (id: string) => {
    setActioningId(id);
    await reviewPost(id, `approve`);
    await refetch();
    setActioningId(``);
  };

  const handleReject = async (id: string) => {
    setActioningId(id);
    await reviewPost(id, `reject`);
    await refetch();
    setActioningId(``);
  };

  return (
    <div className={classNames(styles.reviewPosts, className)} style={style}>
      <div className={styles.header}>
        <div className={styles.eyebrow}>אזור ניהול · בלוג</div>
        <h1 className={styles.title}>תור הגהה ואישור כתבות</h1>
        <p className={styles.subtitle}>
          עברו על הכתבות שהוגשו על ידי הקהילה, ערכו לפני פרסום, ואשרו או דחו כל הגשה.
        </p>
      </div>

      {error && <div className={styles.errorBanner}>אירעה שגיאה בטעינת התור. נסו לרענן את העמוד.</div>}

      {loading && (
        <div className={styles.stateCard}>
          <div className={styles.stateIcon}>⏳</div>
          <h2 className={styles.stateTitle}>טוען את התור</h2>
          <p className={styles.stateDescription}>רק רגע, אנחנו טוענים את הכתבות הממתינות.</p>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className={styles.stateCard}>
          <div className={styles.stateIcon}>✅</div>
          <h2 className={styles.stateTitle}>אין כתבות הממתינות לאישור</h2>
          <p className={styles.stateDescription}>כל ההגשות טופלו. חזרו לבדוק כאן מאוחר יותר.</p>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className={styles.queueList}>
          {posts.map((post) => {
            const isEditing = editingId === post.id;
            const isBusy = (reviewing || updating) && actioningId === post.id;

            return (
              <div key={post.id} className={styles.queueCard}>
                <div className={styles.coverWrapper}>
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className={styles.cover} />
                  ) : (
                    <div className={styles.coverPlaceholder}>📝</div>
                  )}
                  {post.isMembersOnly && <span className={styles.membersBadge}>לחברי קהילה</span>}
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.domainsRow}>
                    {post.domains.map((domain) => (
                      <span key={domain} className={styles.domainChip}>
                        {domain}
                      </span>
                    ))}
                  </div>

                  {isEditing ? (
                    <div className={styles.editForm}>
                      <span className={styles.fieldLabel}>כותרת</span>
                      <input
                        className={styles.fieldInput}
                        value={formState.title}
                        onChange={(event) =>
                          setFormState({ ...formState, title: event.target.value })
                        }
                      />
                      <span className={styles.fieldLabel}>תקציר</span>
                      <textarea
                        className={styles.fieldTextarea}
                        value={formState.excerpt}
                        onChange={(event) =>
                          setFormState({ ...formState, excerpt: event.target.value })
                        }
                      />
                      <span className={styles.fieldLabel}>גוף הכתבה</span>
                      <textarea
                        className={styles.fieldTextarea}
                        value={formState.body}
                        onChange={(event) =>
                          setFormState({ ...formState, body: event.target.value })
                        }
                      />
                      <div className={styles.editActions}>
                        <Button
                          variant="primary"
                          size="sm"
                          loading={updating}
                          onClick={() => saveEditing(post.id)}
                        >
                          שמירת שינויים
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => cancelEditing()}>
                          ביטול
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className={styles.postTitle}>{post.title}</h3>
                      <p className={styles.postExcerpt}>{post.excerpt}</p>
                    </>
                  )}

                  <div className={styles.metaRow}>
                    <span>{post.authorName}</span>
                    <span>·</span>
                    <span className={styles.statusLabel}>
                      {STATUS_LABELS[post.status] || post.status}
                    </span>
                  </div>

                  {!isEditing && (
                    <div className={styles.actionsRow}>
                      <Button variant="secondary" size="sm" onClick={() => startEditing(post)}>
                        עריכה
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        loading={isBusy}
                        onClick={() => handleApprove(post.id)}
                      >
                        אישור ופרסום
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        loading={isBusy}
                        onClick={() => handleReject(post.id)}
                      >
                        דחייה
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

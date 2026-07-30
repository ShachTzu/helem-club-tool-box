import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { PageLayout } from '@helemclub/design.layouts.page-layout';
import { Card } from '@helemclub/design.content.card';
import { Badge } from '@helemclub/design.content.badge';
import type { WishlistIdea } from './wishlist-idea-type.js';
import { STATUS_TONE } from './wishlist-idea-type.js';
import { WISHLIST_IDEAS } from './wishlist.mock.js';
import styles from './wishlist.module.scss';

export type WishlistProps = {
  /**
   * small eyebrow label shown above the hero title.
   */
  heroEyebrow?: string;

  /**
   * main hero title.
   */
  heroTitle?: string;

  /**
   * hero subtitle describing the wishlist.
   */
  heroSubtitle?: string;

  /**
   * route to the "propose an idea" page.
   */
  proposeHref?: string;

  /**
   * the community ideas to display. defaults to the seed catalog.
   */
  ideas?: WishlistIdea[];

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
 * toolbox wishlist page (/toolbox/wishlist): community-submitted ideas for
 * new coping tools, sorted by votes, each votable with a single tap. the
 * top-voted ideas get priority in development. RTL, responsive.
 *
 * @param props - see {@link WishlistProps}.
 * @returns the rendered wishlist page.
 */
export function Wishlist({
  heroEyebrow = `ארגז הכלים · Wishlist`,
  heroTitle = `רשימת המשאלות של הקהילה`,
  heroSubtitle = `חסר לכם כלי? הציעו רעיון, והצביעו לרעיונות של אחרים. הרעיונות המובילים מקבלים עדיפות בפיתוח ובגיוס יזמים.`,
  proposeHref = `/toolbox/wishlist/new`,
  ideas = WISHLIST_IDEAS,
  className,
  style,
}: WishlistProps) {
  const [votes, setVotes] = useState<Record<string, number>>(() =>
    Object.fromEntries(ideas.map((idea) => [idea.id, idea.votes]))
  );
  const [voted, setVoted] = useState<Record<string, boolean>>({});

  const toggleVote = (id: string) => {
    setVoted((prev) => {
      const has = prev[id];
      setVotes((current) => ({ ...current, [id]: (current[id] ?? 0) + (has ? -1 : 1) }));
      return { ...prev, [id]: !has };
    });
  };

  const sorted = useMemo(
    () => [...ideas].sort((a, b) => (votes[b.id] ?? b.votes) - (votes[a.id] ?? a.votes)),
    [ideas, votes]
  );

  return (
    <div className={classNames(styles.wishlist, className)} style={style}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {heroEyebrow && <div className={styles.heroEyebrow}>{heroEyebrow}</div>}
          <h1 className={styles.heroTitle}>{heroTitle}</h1>
          {heroSubtitle && <p className={styles.heroSubtitle}>{heroSubtitle}</p>}
          <div className={styles.heroActions}>
            <Link to={proposeHref} className={styles.primaryAction}>
              💡 הצעת רעיון
            </Link>
            <Link to="/toolbox" className={styles.ghostAction}>
              ← חזרה לארגז הכלים
            </Link>
          </div>
        </div>
      </section>

      <PageLayout>
        <div className={styles.list}>
          {sorted.map((idea) => {
            const count = votes[idea.id] ?? idea.votes;
            const isVoted = Boolean(voted[idea.id]);
            return (
              <Card key={idea.id} padding="medium" className={styles.ideaCard}>
                <div className={styles.ideaRow}>
                  <button
                    type="button"
                    onClick={() => toggleVote(idea.id)}
                    aria-pressed={isVoted}
                    aria-label={`הצבעה לרעיון: ${idea.title}`}
                    className={classNames(styles.voteButton, isVoted && styles.voteButtonActive)}
                  >
                    <span className={styles.voteArrow}>▲</span>
                    <span className={styles.voteCount}>{count}</span>
                    <span className={styles.voteLabel}>הצבעות</span>
                  </button>

                  <div className={styles.ideaBody}>
                    <div className={styles.ideaHeader}>
                      <h3 className={styles.ideaTitle}>{idea.title}</h3>
                      <Badge variant={STATUS_TONE[idea.status]}>{idea.status}</Badge>
                    </div>
                    <p className={styles.ideaDescription}>{idea.description}</p>
                    <div className={styles.ideaMeta}>
                      {idea.domains.map((domain) => (
                        <span key={domain} className={styles.domainChip}>
                          {domain}
                        </span>
                      ))}
                      <span className={styles.ideaAuthor}>הוצע ע״י {idea.author}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <p className={styles.note}>
          הצבעה דורשת חשבון מחובר. הרעיונות שמקבלים הכי הרבה הצבעות עולים לראש הרשימה ומקבלים עדיפות בפיתוח.
        </p>
      </PageLayout>
    </div>
  );
}

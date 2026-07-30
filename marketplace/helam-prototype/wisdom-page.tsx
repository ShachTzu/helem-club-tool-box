import { PageShell, Hero } from './ui.js';
import { CommunityWisdom } from './community-wisdom.js';

/** Full "חוכמת הקהילה" page — the entire ecosystem knowledge in one filterable hub. */
export function WisdomPage() {
  return (
    <PageShell>
      <Hero
        eyebrow="המרכז של הלם קלאב"
        title="חוכמת הקהילה"
        subtitle="כל הידע מכל הענפים במקום אחד — סננו לפי סוג תוכן, תחום התמודדות או חיפוש חופשי, וגלו בדיוק את מה שרלוונטי לכם עכשיו."
      />
      <CommunityWisdom />
    </PageShell>
  );
}

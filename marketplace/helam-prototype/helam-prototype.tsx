import { Routes, Route } from 'react-router-dom';
import { theme } from './theme.js';
import { Header } from './header.js';
import { Footer } from './footer.js';
import { MobileNav } from './mobile-nav.js';
import { LandingPage } from './landing-page.js';
import { ToolboxPage } from './toolbox-page.js';
import { AppDetailPage } from './app-detail-page.js';
import { KnowledgePage, LabelPage, RecordPage } from './knowledge-page.js';
import { BlogPage, PostPage, SubmitArticlePage, NotContent } from './blog-page.js';
import { EventsPage, EventPage } from './events-page.js';
import { GalleryPage } from './gallery-page.js';
import { DomainsPage } from './domains-page.js';
import { DomainPage } from './domain-page.js';
import { WishlistPage } from './wishlist-page.js';
import { WishlistNewPage } from './wishlist-new-page.js';
import { WisdomPage } from './wisdom-page.js';
import { OnboardingPage } from './onboarding-page.js';
import { LoginPage, SavedPage, AdminPage, SubmitToolPage } from './misc-pages.js';

/** Global styles: margin reset + responsive nav behavior. */
const GLOBAL_CSS = `
  body { margin: 0; }
  * { -webkit-tap-highlight-color: transparent; }
  .helam-card:hover { transform: translateY(-3px); box-shadow: ${theme.shadow.cardHover}; }
  .helam-mobile-drawer, .helam-mobile-toggle { display: none; }
  @media (max-width: 900px) {
    .helam-desktop-nav { display: none !important; }
    .helam-mobile-toggle { display: block !important; }
    .helam-bottom-nav { display: flex !important; }
    .helam-has-bottom-nav { padding-bottom: 68px; }
  }
`;

/** Root of the Helam Club ecosystem prototype. */
export function HelamPrototype() {
  return (
    <div style={{ fontFamily: theme.font.family, direction: 'rtl' }} className="helam-has-bottom-nav">
      <style>{GLOBAL_CSS}</style>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Toolbox */}
          <Route path="/toolbox" element={<ToolboxPage />} />
          <Route path="/toolbox/submit" element={<SubmitToolPage />} />
          <Route path="/toolbox/wishlist" element={<WishlistPage />} />
          <Route path="/toolbox/wishlist/new" element={<WishlistNewPage />} />
          <Route path="/app/:id" element={<AppDetailPage />} />

          {/* Knowledge base */}
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/knowledge/record/:slug" element={<RecordPage />} />
          <Route path="/knowledge/:labelSlug" element={<LabelPage />} />

          {/* Blog */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/submit" element={<SubmitArticlePage />} />
          <Route path="/blog/:slug" element={<PostPage />} />

          {/* Events */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:slug" element={<EventPage />} />

          {/* Gallery */}
          <Route path="/gallery" element={<GalleryPage />} />

          {/* Community wisdom hub */}
          <Route path="/wisdom" element={<WisdomPage />} />

          {/* Cross-cutting + account */}
          <Route path="/domains" element={<DomainsPage />} />
          <Route path="/domains/:slug" element={<DomainPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/admin" element={<AdminPage />} />

          <Route path="*" element={<NotContent label="העמוד לא נמצא" />} />
        </Routes>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}

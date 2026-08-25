import React from 'react';
import { SymphonyPlatformAspect, type SymphonyPlatformBrowser } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformBrowser } from '@helemclub/platform.helam-platform';
import { BlogHome } from '@helemclub/blog.pages.blog-home';
import { PostPage } from '@helemclub/blog.pages.post-page';
import { PostEditor } from '@helemclub/blog.pages.post-editor';
import { SubmitArticle } from '@helemclub/blog.pages.submit-article';
import { ReviewPosts } from '@helemclub/blog.admin.review-posts';
import { ManageAuthors } from '@helemclub/blog.admin.manage-authors';
import { BlogDashboard } from '@helemclub/blog.admin.blog-dashboard';
import { BlogPreview } from '@helemclub/blog.sections.blog-preview';
import type { BlogConfig } from './blog-config.js';

export class BlogBrowser {
  constructor(
    private blogConfig: BlogConfig,
    private symphonyPlatform: SymphonyPlatformBrowser,
    private helamPlatform: HelamPlatformBrowser
  ) {}

  /**
   * returns the configuration for the blog aspect.
   */
  getConfig(): BlogConfig {
    return this.blogConfig;
  }

  static dependencies = [SymphonyPlatformAspect, HelamPlatformAspect];

  static defaultConfig: BlogConfig = {};

  static async provider(
    [symphonyPlatform, helamPlatform]: [SymphonyPlatformBrowser, HelamPlatformBrowser],
    config: BlogConfig
  ) {
    const blog = new BlogBrowser(config, symphonyPlatform, helamPlatform);

    /**
     * mount the blog reading and authoring surfaces as platform routes. the
     * editor is gated to writers/admins internally by the page's
     * ProtectedRoute, and the submit form requires authentication.
     */
    helamPlatform.registerRoute([
      {
        path: '/blog',
        component: () => <BlogHome />,
      },
      {
        path: '/blog/submit',
        component: () => <SubmitArticle />,
        requiresAuth: true,
      },
      {
        path: '/blog/editor',
        component: () => <PostEditor />,
      },
      {
        path: '/blog/editor/:id',
        component: () => <PostEditor />,
      },
      {
        path: '/blog/:slug',
        component: () => <PostPage />,
      },
    ]);

    /**
     * expose the blog as a primary navigation surface in the header/mobile nav.
     */
    helamPlatform.registerNavigationItem([
      {
        label: 'בלוג',
        href: '/blog',
        order: 40,
      },
    ]);

    /**
     * advertise this feature as an ecosystem pillar on the home page. the
     * platform renders only the pillars registered by mounted aspects, so a
     * feature that is switched off is never linked to.
     */
    helamPlatform.registerEcosystemPillar([
      {
        slug: 'blog',
        icon: '📝',
        title: 'בלוג',
        description: 'ידע מקצועי ושיתופים אישיים מהקהילה — סיפורים אמיתיים מהשטח.',
        href: '/blog',
        order: 40,
      },
    ]);

    /**
     * surface the latest blog posts on the home page as a preview section with
     * a "see all" link to the full blog.
     */
    helamPlatform.registerHomeSection({
      id: 'blog-preview',
      order: 30,
      component: () => <BlogPreview />,
    });

    /**
     * add the blog moderation, author management and analytics panels to the
     * admin dashboard.
     */
    helamPlatform.registerAdminRoute([
      {
        path: 'blog-review',
        label: 'הגהת כתבות',
        component: () => <ReviewPosts />,
      },
      {
        path: 'blog-authors',
        label: 'ניהול כותבים',
        component: () => <ManageAuthors />,
      },
      {
        path: 'blog-dashboard',
        label: 'דשבורד בלוג',
        component: () => <BlogDashboard />,
      },
    ]);

    return blog;
  }
}

export default BlogBrowser;

import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { PostBody } from './post-body.js';
import styles from './post-body.module.scss';

describe('PostBody', () => {
  it('renders plain html paragraphs', () => {
    const { container } = render(
      <MockProvider>
        <PostBody body="<p>פסקה ראשונה בכתבה.</p><p>פסקה שנייה בכתבה.</p>" embeddedApps={[]} />
      </MockProvider>
    );

    const htmlBlocks = container.querySelectorAll(`.${styles.htmlContent}`);
    expect(htmlBlocks.length).toBe(1);
    expect(htmlBlocks[0].textContent).toContain('פסקה ראשונה בכתבה.');
    expect(htmlBlocks[0].textContent).toContain('פסקה שנייה בכתבה.');
  });

  it('renders an image block from an image embed marker', () => {
    const body = `<p>לפני התמונה</p>{{image:https://example.com/photo.png|תיאור תמונה}}<p>אחרי התמונה</p>`;

    const { container } = render(
      <MockProvider>
        <PostBody body={body} embeddedApps={[]} />
      </MockProvider>
    );

    const imageBlock = container.querySelector(`.${styles.imageBlock}`);
    expect(imageBlock).toBeTruthy();
    const img = imageBlock?.querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://example.com/photo.png');
  });

  it('renders an app embed block when the app id is allowed', () => {
    const body = `<p>כלי מומלץ:</p>{{app:ground-me}}`;

    const { container } = render(
      <MockProvider>
        <PostBody body={body} embeddedApps={['ground-me']} />
      </MockProvider>
    );

    const appBlock = container.querySelector(`.${styles.appBlock}`);
    expect(appBlock).toBeTruthy();
  });

  it('skips an app embed block when the app id is not allowed', () => {
    const body = `<p>כלי לא מאושר:</p>{{app:unlisted-app}}`;

    const { container } = render(
      <MockProvider>
        <PostBody body={body} embeddedApps={['ground-me']} />
      </MockProvider>
    );

    const appBlock = container.querySelector(`.${styles.appBlock}`);
    expect(appBlock).toBeFalsy();
  });

  it('applies a custom class name to the root element', () => {
    const { container } = render(
      <MemoryRouter>
        <PostBody body="<p>תוכן</p>" embeddedApps={[]} className="custom-post-body" />
      </MemoryRouter>
    );

    const root = container.querySelector(`.${styles.postBody}`);
    expect(root?.classList.contains('custom-post-body')).toBe(true);
  });
});

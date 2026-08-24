import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { mockDrafts } from '@helemclub/editorial.entities.draft';
import { DraftCard } from './draft-card.js';
import styles from './draft-card.module.scss';

const drafts = mockDrafts().map((draft) => draft.toObject());

describe(`DraftCard`, () => {
  it(`should render the draft title`, () => {
    const { container } = render(
      <MemoryRouter>
        <DraftCard draft={drafts[0]} />
      </MemoryRouter>
    );

    const title = container.querySelector(`.${styles.title}`);
    expect(title?.textContent).toBe(drafts[0].title);
  });

  it(`should render the author name`, () => {
    const { container } = render(
      <MemoryRouter>
        <DraftCard draft={drafts[0]} />
      </MemoryRouter>
    );

    const authorName = container.querySelector(`.${styles.authorName}`);
    expect(authorName?.textContent).toBe(drafts[0].authorName);
  });

  it(`should render the current version label`, () => {
    const { container } = render(
      <MemoryRouter>
        <DraftCard draft={drafts[0]} />
      </MemoryRouter>
    );

    const version = container.querySelector(`.${styles.version}`);
    expect(version?.textContent).toBe(`גרסה ${drafts[0].currentVersion}`);
  });

  it(`should render the last reviewer note when present`, () => {
    const { container } = render(
      <MemoryRouter>
        <DraftCard draft={drafts[2]} />
      </MemoryRouter>
    );

    const note = container.querySelector(`.${styles.reviewNoteText}`);
    expect(note?.textContent).toContain(drafts[2].lastReviewNote as string);
  });

  it(`should not render a reviewer note section when absent`, () => {
    const { container } = render(
      <MemoryRouter>
        <DraftCard draft={drafts[0]} />
      </MemoryRouter>
    );

    const note = container.querySelector(`.${styles.reviewNote}`);
    expect(note).toBeNull();
  });

  it(`should render provided actions`, () => {
    const { getByText } = render(
      <MemoryRouter>
        <DraftCard draft={drafts[0]} actions={<button type="button">פעולה</button>} />
      </MemoryRouter>
    );

    expect(getByText(`פעולה`)).toBeTruthy();
  });

  it(`should not throw when the card is clicked`, () => {
    const { container } = render(
      <MemoryRouter>
        <DraftCard draft={drafts[0]} />
      </MemoryRouter>
    );

    const card = container.querySelector(`.${styles.draftCard}`) as HTMLElement;
    expect(() => fireEvent.click(card)).not.toThrow();
  });
});

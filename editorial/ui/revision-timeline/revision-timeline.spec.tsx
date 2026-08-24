import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { mockRevisions } from '@helemclub/editorial.entities.revision';
import { mockApprovalEntries } from '@helemclub/editorial.entities.approval-entry';
import { RevisionTimeline } from './revision-timeline.js';
import styles from './revision-timeline.module.scss';

const revisions = mockRevisions().map((revision) => revision.toObject());
const approvals = mockApprovalEntries().map((approval) => approval.toObject());

describe(`RevisionTimeline`, () => {
  it(`should render revision and approval actor names`, () => {
    const { container } = render(
      <MemoryRouter>
        <RevisionTimeline revisions={revisions.slice(0, 1)} approvals={approvals.slice(0, 1)} />
      </MemoryRouter>
    );

    const actorNames = Array.from(container.querySelectorAll(`.${styles.actorName}`)).map(
      (element) => element.textContent
    );

    expect(actorNames).toContain(revisions[0].authorName);
    expect(actorNames).toContain(approvals[0].actorName);
  });

  it(`should render one item per revision and approval entry`, () => {
    const { container } = render(
      <MemoryRouter>
        <RevisionTimeline revisions={revisions.slice(0, 2)} approvals={approvals.slice(0, 3)} />
      </MemoryRouter>
    );

    const items = container.querySelectorAll(`.${styles.item}`);
    expect(items.length).toBe(5);
  });

  it(`should call onSelectVersion when a revision item is clicked`, () => {
    const onSelectVersion = vi.fn();

    const { container } = render(
      <MemoryRouter>
        <RevisionTimeline
          revisions={revisions.slice(0, 1)}
          approvals={[]}
          onSelectVersion={(versionNumber) => onSelectVersion(versionNumber)}
        />
      </MemoryRouter>
    );

    const content = container.querySelector(`.${styles.content}`) as HTMLElement;
    fireEvent.click(content);

    expect(onSelectVersion).toHaveBeenCalledWith(revisions[0].versionNumber);
  });

  it(`should mark a revision as selected when its version is included in selectedVersions`, () => {
    const { container } = render(
      <MemoryRouter>
        <RevisionTimeline
          revisions={revisions.slice(0, 1)}
          approvals={[]}
          selectedVersions={[revisions[0].versionNumber]}
        />
      </MemoryRouter>
    );

    const content = container.querySelector(`.${styles.content}`) as HTMLElement;
    expect(content.className).toContain(styles.selected);
  });

  it(`should call onRestore when the restore button is clicked`, () => {
    const onRestore = vi.fn();

    const { container } = render(
      <MemoryRouter>
        <RevisionTimeline
          revisions={revisions.slice(0, 1)}
          approvals={[]}
          onRestore={(versionNumber) => onRestore(versionNumber)}
        />
      </MemoryRouter>
    );

    const button = container.querySelector(`button`) as HTMLButtonElement;
    fireEvent.click(button);

    expect(onRestore).toHaveBeenCalledWith(revisions[0].versionNumber);
  });

  it(`should apply the compact class name when compact is set`, () => {
    const { container } = render(
      <MemoryRouter>
        <RevisionTimeline revisions={revisions.slice(0, 1)} approvals={[]} compact />
      </MemoryRouter>
    );

    const root = container.querySelector(`.${styles.timeline}`) as HTMLElement;
    expect(root.className).toContain(styles.compact);
  });
});

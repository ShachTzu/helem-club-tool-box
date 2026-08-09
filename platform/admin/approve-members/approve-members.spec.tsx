import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockUser } from '@helemclub/platform.entities.user';
import { ApproveMembers } from './approve-members.js';
import { MOCK_MEMBER_PROFILES } from './approve-members.mock.js';

const admin = mockUser({ displayName: `הלם אדמין`, role: `admin` });

function renderQueue(currentUser = admin.toObject()) {
  return render(
    <MockProvider>
      <ApproveMembers mockCurrentUser={currentUser} mockProfiles={MOCK_MEMBER_PROFILES} />
    </MockProvider>
  );
}

// the responsive Table renders every row twice — a desktop row and a mobile
// card — so a name legitimately appears more than once in the DOM.
const countOf = (queryAllByText: (text: string) => unknown[], name: string) =>
  queryAllByText(name).length;

it(`should open on the pending tab and list only pending applicants`, () => {
  const { queryAllByText } = renderQueue();
  expect(countOf(queryAllByText, `רותם לוי`)).toBeGreaterThan(0);
  expect(countOf(queryAllByText, `אמיר כהן`)).toBeGreaterThan(0);
  // approved and never-onboarded members belong to other tabs
  expect(countOf(queryAllByText, `יעל ברק`)).toBe(0);
});

it(`should switch to the approved tab`, () => {
  const { getByText, queryAllByText } = renderQueue();
  fireEvent.click(getByText(`חברי קהילה`));
  expect(countOf(queryAllByText, `יעל ברק`)).toBeGreaterThan(0);
  expect(countOf(queryAllByText, `רותם לוי`)).toBe(0);
});

it(`should reveal the sensitive answers only after opening a row`, () => {
  const { getAllByText, queryAllByText } = renderQueue();
  expect(countOf(queryAllByText, `פציעת ברך מהשירות, בשיקום כשנתיים`)).toBe(0);

  fireEvent.click(getAllByText(`הצג פרטים`)[0]);
  expect(countOf(queryAllByText, `פציעת ברך מהשירות, בשיקום כשנתיים`)).toBeGreaterThan(0);
});

it(`should move an applicant out of the pending tab once approved`, () => {
  const { getAllByText, queryAllByText } = renderQueue();
  fireEvent.click(getAllByText(`אישור`)[0]);
  expect(countOf(queryAllByText, `רותם לוי`)).toBe(0);
});

it(`should deny access to a non-admin`, () => {
  const moderator = mockUser({ displayName: `דנה מודרטורית`, role: `moderator` });
  const { getByText } = renderQueue(moderator.toObject());
  expect(getByText(`אין לך הרשאה לצפות בעמוד זה`)).toBeTruthy();
});

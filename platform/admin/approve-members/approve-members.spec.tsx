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

it(`should open on the pending tab and list only pending applicants`, () => {
  const { queryByText } = renderQueue();
  expect(queryByText(`רותם לוי`)).toBeTruthy();
  expect(queryByText(`אמיר כהן`)).toBeTruthy();
  // approved and never-onboarded members belong to other tabs
  expect(queryByText(`יעל ברק`)).toBeNull();
});

it(`should switch to the approved tab`, () => {
  const { getByText, queryByText } = renderQueue();
  fireEvent.click(getByText(`חברי קהילה`));
  expect(queryByText(`יעל ברק`)).toBeTruthy();
  expect(queryByText(`רותם לוי`)).toBeNull();
});

it(`should reveal the sensitive answers only after opening a row`, () => {
  const { getAllByText, queryByText } = renderQueue();
  expect(queryByText(`פציעת ברך מהשירות, בשיקום כשנתיים`)).toBeNull();

  fireEvent.click(getAllByText(`הצג פרטים`)[0]);
  expect(queryByText(`פציעת ברך מהשירות, בשיקום כשנתיים`)).toBeTruthy();
});

it(`should move an applicant out of the pending tab once approved`, () => {
  const { getAllByText, queryByText } = renderQueue();
  fireEvent.click(getAllByText(`אישור`)[0]);
  expect(queryByText(`רותם לוי`)).toBeNull();
});

it(`should deny access to a non-admin`, () => {
  const moderator = mockUser({ displayName: `דנה מודרטורית`, role: `moderator` });
  const { getByText } = renderQueue(moderator.toObject());
  expect(getByText(`אין לך הרשאה לצפות בעמוד זה`)).toBeTruthy();
});

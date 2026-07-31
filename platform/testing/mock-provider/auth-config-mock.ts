import { gql } from '@apollo/client';
import type { MockedResponse } from '@apollo/client/testing';

/**
 * the auth configuration query issued by `useAuth` on every render.
 *
 * it is redeclared here rather than imported from the use-auth hook on
 * purpose: the hook's own spec renders inside this provider, and importing it
 * would make the testing component depend on the component it is used to
 * test.
 */
export const AUTH_CONFIG_QUERY = gql`
  query AuthConfig {
    authConfig {
      googleClientId
      emailSignInEnabled
    }
  }
`;

/**
 * a default response for the auth configuration query: email sign-in on,
 * Google off.
 *
 * every screen behind `useAuth` fires this query, so without a default each
 * spec and composition logs an Apollo "no more mocked responses" warning.
 * Google is reported as unconfigured so previews never render a sign-in
 * button that cannot complete.
 */
export const authConfigMock: MockedResponse = {
  request: { query: AUTH_CONFIG_QUERY },
  result: {
    data: {
      authConfig: {
        __typename: 'AuthConfig',
        googleClientId: null,
        emailSignInEnabled: true,
      },
    },
  },
  // compositions re-render freely; an unlimited mock avoids exhausting it.
  maxUsageCount: Number.POSITIVE_INFINITY,
};

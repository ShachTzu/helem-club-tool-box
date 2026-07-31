import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
// the response type moved out of the react entrypoint in Apollo 4 — the value
// (MockedProvider) and the type now live in two different modules.
import type { MockedResponse } from '@apollo/client/testing';
import { HelamTheme } from '@helemclub/design.helam-theme';
import { EmptyContainer } from './empty-container.js';
import { MockContext } from './mock-provider-context.js';
import { authConfigMock } from './auth-config-mock.js';

export type MockProviderProps = {
  /**
   * sets the component children.
   */
  children?: ReactNode;

  /**
   * do not wrap children with the memory router.
   */
  noRouter?: boolean;

  /**
   * do not wrap children with the helam-theme.
   */
  noTheme?: boolean;

  /**
   * do not wrap children with the apollo mocked provider.
   */
  noApollo?: boolean;

  /**
   * additional Apollo mocked responses for the queries the children issue.
   * these are merged ahead of the built-in platform defaults, so a spec can
   * override any of them.
   */
  mocks?: MockedResponse[];
};

/**
 * a test/preview provider wrapping children with a MemoryRouter, an Apollo
 * MockedProvider and the helam-theme (RTL). used across the Helam Club
 * platform for compositions and specs.
 */
export function MockProvider({
  children,
  noRouter,
  noTheme,
  noApollo,
  mocks = [],
}: MockProviderProps) {
  const Router = noRouter ? EmptyContainer : MemoryRouter;
  const Theme = noTheme ? EmptyContainer : HelamTheme;

  // every screen behind `useAuth` queries the auth configuration, so it is
  // mocked by default. caller-supplied mocks come first and therefore win.
  const allMocks = [...mocks, authConfigMock];

  return (
    <MockContext.Provider value>
      <Router>
        <Theme>
          {noApollo ? (
            <EmptyContainer>{children}</EmptyContainer>
          ) : (
            <MockedProvider mocks={allMocks}>{children}</MockedProvider>
          )}
        </Theme>
      </Router>
    </MockContext.Provider>
  );
}

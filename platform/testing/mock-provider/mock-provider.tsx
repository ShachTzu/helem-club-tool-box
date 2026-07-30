import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import { HelamTheme } from '@helemclub/design.helam-theme';
import { EmptyContainer } from './empty-container.js';
import { MockContext } from './mock-provider-context.js';

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
};

/**
 * a test/preview provider wrapping children with a MemoryRouter, an Apollo
 * MockedProvider and the helam-theme (RTL). used across the Helam Club
 * platform for compositions and specs.
 */
export function MockProvider({ children, noRouter, noTheme, noApollo }: MockProviderProps) {
  const Router = noRouter ? EmptyContainer : MemoryRouter;
  const Theme = noTheme ? EmptyContainer : HelamTheme;
  const Apollo = noApollo ? EmptyContainer : MockedProvider;

  return (
    <MockContext.Provider value>
      <Router>
        <Theme>
          <Apollo>{children}</Apollo>
        </Theme>
      </Router>
    </MockContext.Provider>
  );
}

import { createContext } from 'react';

/**
 * context for running components in mock mode. defaults to false so that
 * outside of a MockProvider (i.e. in production) components use real data.
 */
export const MockContext = createContext<boolean>(false);

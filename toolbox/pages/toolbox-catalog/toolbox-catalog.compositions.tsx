import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockAppsData } from '@helemclub/toolbox.hooks.use-apps';
import { ToolboxCatalog } from './toolbox-catalog.js';

/** Full catalog with a grid of published apps. */
export const BasicToolboxCatalog = () => (
  <MockProvider>
    <ToolboxCatalog mockApps={mockAppsData()} />
  </MockProvider>
);

/** Empty catalog state (no apps available). */
export const EmptyToolboxCatalog = () => (
  <MockProvider>
    <ToolboxCatalog mockApps={[]} />
  </MockProvider>
);

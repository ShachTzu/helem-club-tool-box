import { loadAspect } from '@bitdev/harmony.testing.load-aspect';
import type { EditorialBrowser } from './editorial.browser.runtime.js';
import { EditorialAspect } from './editorial.aspect.js';

it('should retrieve the aspect', async () => {
  const editorial = await loadAspect<EditorialBrowser>(EditorialAspect, {
    runtime: 'browser',
  });

  expect(editorial).toBeTruthy();
});    

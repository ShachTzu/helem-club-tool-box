import { loadAspect } from '@bitdev/harmony.testing.load-aspect';
import type { KnowledgeLibraryBrowser } from './knowledge-library.browser.runtime.js';
import { KnowledgeLibraryAspect } from './knowledge-library.aspect.js';

it('should retrieve the aspect', async () => {
  const knowledgeLibrary = await loadAspect<KnowledgeLibraryBrowser>(KnowledgeLibraryAspect, {
    runtime: 'browser',
  });

  expect(knowledgeLibrary).toBeTruthy();
});    

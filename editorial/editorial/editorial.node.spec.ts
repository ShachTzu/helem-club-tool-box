import { loadAspect } from '@bitdev/harmony.testing.load-aspect';
import type { EditorialNode } from './editorial.node.runtime.js';
import { EditorialAspect } from './editorial.aspect.js';

it('should retrieve the aspect', async () => {
  const editorial = await loadAspect<EditorialNode>(EditorialAspect, {
    runtime: 'node',
  });

  expect(editorial).toBeTruthy();
});    

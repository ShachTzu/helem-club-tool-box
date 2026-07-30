import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Wishlist } from './wishlist.js';
import type { WishlistIdea } from './wishlist-idea-type.js';

/** The full wishlist page with the default seed catalog. */
export const BasicWishlist = () => (
  <MockProvider>
    <Wishlist />
  </MockProvider>
);

const singleIdea: WishlistIdea[] = [
  {
    id: 'x1',
    title: 'מרחב נשימה בכיס',
    description: 'תרגיל נשימה קצר בלחיצה אחת לרגעים של הצפה.',
    domains: ['ויסות רגשי', 'טריגרים'],
    votes: 12,
    status: 'נאסף',
    author: 'נועה ק.',
  },
];

/** The wishlist with a single idea, useful for verifying the card layout. */
export const SingleIdeaWishlist = () => (
  <MockProvider>
    <Wishlist ideas={singleIdea} />
  </MockProvider>
);

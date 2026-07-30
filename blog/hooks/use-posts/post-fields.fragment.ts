import { gql } from '@apollo/client';

/**
 * shared set of BlogPost fields reused across post-related queries and
 * mutations, keeping the selection set consistent everywhere.
 */
export const BLOG_POST_FIELDS = gql`
  fragment BlogPostFields on BlogPost {
    id
    slug
    title
    excerpt
    coverImage
    body
    authorName
    authorRef
    isStaffAuthor
    domains
    embeddedApps
    status
    visibility
    metaDescription
    publishDate
    viewCount
    uniqueVisitors
  }
`;

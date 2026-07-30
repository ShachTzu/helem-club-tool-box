/**
 * type of content this engagement bar targets, spanning reactions, saves,
 * shares and comments (e.g. a blog post, toolbox app, event or gallery item).
 */
export type EngagementTargetType =
  | `post`
  | `article`
  | `app`
  | `event`
  | `gallery`
  | `domain`
  | `record`
  | `comment`
  | `other`;

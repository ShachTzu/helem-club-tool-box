export type AddCommentInput = {
  targetType: string;
  targetId: string;
  text: string;
  displayName?: string;
  isAnonymous?: boolean;
  membersOnly?: boolean;
  deviceId: string;
};

export type ListCommentsInput = {
  targetType: string;
  targetId: string;
};

export type ReportCommentInput = {
  commentId: string;
  deviceId: string;
};

export type ReactionInput = {
  targetType: string;
  targetId: string;
  type: string;
  deviceId: string;
};

export type GetReactionsInput = {
  targetType: string;
  targetId: string;
  deviceId: string;
};

export type ResolveReportInput = {
  commentId: string;
  action: string;
};

export type ReactionCount = {
  type: string;
  count: number;
};

export type ReactionSummary = {
  counts: ReactionCount[];
  myReaction?: string;
};

export type ReportResult = {
  hidden: boolean;
};

import { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import { gql } from 'graphql-tag';
import type { MembershipNode } from './membership.node.runtime.js';

/**
 * the membership GraphQL contract.
 *
 * two shapes on purpose: `MyMembership` is what a member's own browser may
 * read (state + their own name), and `AdminMemberProfile` is the only shape
 * carrying the sensitive onboarding answers. every resolver returning the
 * latter is admin-gated in the node runtime — there is no public query that
 * can reach a member's injury note or recognition status.
 */
export function membershipGqlSchema(membership: MembershipNode): GqlSchema {
  return {
    typeDefs: gql`
      """
      the signed-in member's own membership state. carries no other member's
      data and none of the sensitive onboarding answers.
      """
      type MyMembership {
        userId: ID!
        status: String!
        onboardingCompleted: Boolean!
        fullName: String
      }

      """
      one row of the admin approval queue. admin-only, and deliberately without
      the health answers: the queue lists everyone at once, so these fields are
      the most that may travel in bulk.
      """
      type MemberProfileSummary {
        userId: ID!
        status: String!
        accountEmail: String
        accountDisplayName: String
        provider: String
        fullName: String
        phone: String
        contactEmail: String
        city: String
        submittedAt: String
        decidedAt: String
        createdAt: String
      }

      """
      one member's full application, health answers included. admin-only, and
      fetched one member at a time — never as a list.
      """
      type AdminMemberProfile {
        userId: ID!
        status: String!
        accountEmail: String
        accountDisplayName: String
        provider: String
        fullName: String
        phone: String
        contactEmail: String
        city: String
        age: Int
        communityRoles: String
        gender: String
        injuryNote: String
        recognitionStatus: String
        welcomeCallsOptIn: Boolean
        interests: [String]
        submittedAt: String
        decidedAt: String
        decisionNote: String
        createdAt: String
      }

      type MemberProfileCounts {
        none: Int!
        pending: Int!
        approved: Int!
        rejected: Int!
      }

      input SubmitMemberProfileOptions {
        fullName: String!
        phone: String!
        contactEmail: String
        age: Int
        city: String
        communityRoles: String
        gender: String
        injuryNote: String
        recognitionStatus: String
        welcomeCallsOptIn: Boolean
        interests: [String]
      }

      input ListMemberProfilesOptions {
        status: String
        query: String
      }

      input SetMembershipStatusOptions {
        userId: ID!
        status: String!
        note: String
      }

      type Query {
        """
        the current member's own membership state, or null when signed out.
        """
        myMembership: MyMembership

        """
        the admin approval queue. admins only. queue rows carry no health data.
        """
        listMemberProfiles(options: ListMemberProfilesOptions): [MemberProfileSummary]

        """
        one applicant's full application, health answers included. admins only.
        """
        getMemberProfile(userId: ID!): AdminMemberProfile

        """
        per-state counts for the approval queue tabs. admins only.
        """
        countMemberProfiles: MemberProfileCounts
      }

      type Mutation {
        """
        submit the current member's onboarding answers and enter the approval
        queue. the owner is taken from the session, never from the input.
        """
        submitMemberProfile(options: SubmitMemberProfileOptions!): MyMembership

        """
        record an admin decision on a member's application. admins only.
        """
        setMembershipStatus(options: SetMembershipStatusOptions!): AdminMemberProfile
      }
    `,
    resolvers: {
      Query: {
        myMembership: async (_parent: unknown, _args: unknown, context: any) => {
          return membership.getMyMembership(context);
        },

        listMemberProfiles: async (_parent: unknown, { options }: any, context: any) => {
          return membership.listMemberProfiles(options, context);
        },

        getMemberProfile: async (_parent: unknown, { userId }: any, context: any) => {
          return membership.getMemberProfile(userId, context);
        },

        countMemberProfiles: async (_parent: unknown, _args: unknown, context: any) => {
          return membership.countMemberProfiles(context);
        },
      },
      Mutation: {
        submitMemberProfile: async (_parent: unknown, { options }: any, context: any) => {
          return membership.submitMemberProfile(options, context);
        },

        setMembershipStatus: async (_parent: unknown, { options }: any, context: any) => {
          return membership.setMembershipStatus(options, context);
        },
      },
    },
  };
}

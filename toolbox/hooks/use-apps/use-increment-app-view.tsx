import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

/**
 * GraphQL mutation recording a view of an app's detail page. whether it
 * counts as a registered view is resolved server-side from the session.
 */
export const INCREMENT_TOOLBOX_APP_VIEW_MUTATION = gql`
  mutation IncrementToolboxAppView($appId: ID!) {
    incrementToolboxAppView(appId: $appId)
  }
`;

/**
 * records a view of an app's detail page, used to power the toolbox
 * engagement dashboard.
 */
export function useIncrementAppView() {
  const [incrementToolboxAppViewMutation, { loading, error }] = useMutation<
    { incrementToolboxAppView: boolean | null },
    { appId: string }
  >(INCREMENT_TOOLBOX_APP_VIEW_MUTATION);

  const incrementView = async (appId: string) => {
    const result = await incrementToolboxAppViewMutation({ variables: { appId } });
    return Boolean(result.data?.incrementToolboxAppView);
  };

  return {
    incrementView,
    loading,
    error,
  };
}

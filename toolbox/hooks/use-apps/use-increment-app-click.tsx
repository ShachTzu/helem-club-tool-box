import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

/**
 * GraphQL mutation recording a click-through on an app's external link.
 */
export const INCREMENT_TOOLBOX_APP_CLICK_MUTATION = gql`
  mutation IncrementToolboxAppClick($options: IncrementToolboxAppClickOptions!) {
    incrementToolboxAppClick(options: $options)
  }
`;

export type IncrementAppClickOptions = {
  /**
   * id of the app whose external link was clicked.
   */
  appId: string;

  /**
   * optional source of the click, e.g. "toolbox-list" or "app-detail".
   */
  source?: string;
};

/**
 * records a click-through on an app's external link, used to rank apps by
 * popularity across the toolbox.
 */
export function useIncrementAppClick() {
  const [incrementToolboxAppClickMutation, { loading, error }] = useMutation<
    { incrementToolboxAppClick: boolean | null },
    { options: IncrementAppClickOptions }
  >(INCREMENT_TOOLBOX_APP_CLICK_MUTATION);

  const incrementClick = async (options: IncrementAppClickOptions) => {
    const result = await incrementToolboxAppClickMutation({ variables: { options } });
    return Boolean(result.data?.incrementToolboxAppClick);
  };

  return {
    incrementClick,
    loading,
    error,
  };
}

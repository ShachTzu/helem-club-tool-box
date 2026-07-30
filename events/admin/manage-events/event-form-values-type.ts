/**
 * form values used by the create/edit event overlay. dates are kept as
 * `datetime-local` compatible strings and converted to ISO on submit.
 */
export type EventFormValues = {
  title: string;
  description: string;
  type: string;
  coverImage: string;
  startAt: string;
  endAt: string;
  location: string;
  isOnline: boolean;
  joinUrl: string;
  domains: string[];
};

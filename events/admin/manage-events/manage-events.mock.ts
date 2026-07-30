import type { EventTypeOption } from './event-type-option-type.js';

/**
 * the supported event types, matching the events GraphQL schema.
 */
export const EVENT_TYPE_OPTIONS: EventTypeOption[] = [
  { value: `round_table`, label: `שולחן עגול` },
  { value: `webinar`, label: `וובינר` },
  { value: `local`, label: `מפגש מקומי` },
  { value: `big`, label: `כנס גדול` },
];

/**
 * default media types offered when publishing an event recording to the
 * knowledge base.
 */
export const MEDIA_TYPE_OPTIONS: EventTypeOption[] = [
  { value: `video`, label: `וידאו` },
  { value: `audio`, label: `אודיו` },
];

export function labelForEventType(type: string): string {
  const found = EVENT_TYPE_OPTIONS.find((option) => option.value === type);
  return found ? found.label : type;
}

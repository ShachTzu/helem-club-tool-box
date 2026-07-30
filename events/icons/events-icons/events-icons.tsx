import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { EventIconProps } from './event-icon-props-type.js';

const CALENDAR_PATH = `M7 3v3M17 3v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z`;
const WEBINAR_PATH = `M3 5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-6l3 4H8l3-4H5a1 1 0 0 1-1-1V5Z M9 8.5l6 3-6 3v-6Z`;
const LOCATION_PATH = `M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z M12 12.2a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4Z`;
const RSVP_PATH = `M9 12.5l2 2 4-4.5 M7 3v3M17 3v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z`;

/**
 * calendar icon, used to represent an event's date across the events domain.
 */
export function CalendarIcon({
  size = `medium`,
  color = `current`,
  variant = `stroke`,
  title = `תאריך`,
  className,
  style,
}: EventIconProps) {
  return (
    <Icon
      path={CALENDAR_PATH}
      size={size}
      color={color}
      variant={variant}
      title={title}
      className={className}
      style={style}
    />
  );
}

/**
 * webinar icon, used to represent an online/streamed event.
 */
export function WebinarIcon({
  size = `medium`,
  color = `current`,
  variant = `stroke`,
  title = `וובינר`,
  className,
  style,
}: EventIconProps) {
  return (
    <Icon
      path={WEBINAR_PATH}
      size={size}
      color={color}
      variant={variant}
      title={title}
      className={className}
      style={style}
    />
  );
}

/**
 * location icon, used to represent a physical event venue.
 */
export function LocationIcon({
  size = `medium`,
  color = `current`,
  variant = `stroke`,
  title = `מיקום`,
  className,
  style,
}: EventIconProps) {
  return (
    <Icon
      path={LOCATION_PATH}
      size={size}
      color={color}
      variant={variant}
      title={title}
      className={className}
      style={style}
    />
  );
}

/**
 * rsvp icon, used to represent confirming attendance for an event.
 */
export function RsvpIcon({
  size = `medium`,
  color = `current`,
  variant = `stroke`,
  title = `אישור הגעה`,
  className,
  style,
}: EventIconProps) {
  return (
    <Icon
      path={RSVP_PATH}
      size={size}
      color={color}
      variant={variant}
      title={title}
      className={className}
      style={style}
    />
  );
}

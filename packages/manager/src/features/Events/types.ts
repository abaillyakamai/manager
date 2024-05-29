import type { Event, EventAction, EventStatus } from '@linode/api-v4';

export type EventMessage = {
  [S in EventStatus]?: (e: Event) => JSX.Element | string;
};

export type PartialEventMap = {
  [K in EventAction]?: EventMessage;
};

export type CompleteEventMap = {
  [K in EventAction]: EventMessage;
};

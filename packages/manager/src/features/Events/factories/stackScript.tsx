import * as React from 'react';

import { EventMessageLink } from '../EventMessageLink';

import type { PartialEventMap } from '../types';

export const stackScript: PartialEventMap = {
  stackscript_create: {
    notification: (e) => (
      <>
        StackScript <EventMessageLink action={e.action} entity={e.entity} /> has
        been <strong>created</strong>.
      </>
    ),
  },
  stackscript_delete: {
    notification: (e) => (
      <>
        StackScript <EventMessageLink action={e.action} entity={e.entity} /> has
        been <strong>deleted</strong>.
      </>
    ),
  },
  stackscript_publicize: {
    notification: (e) => (
      <>
        StackScript <EventMessageLink action={e.action} entity={e.entity} /> has
        been <strong>made public</strong>.
      </>
    ),
  },
  stackscript_revise: {
    notification: (e) => (
      <>
        StackScript <EventMessageLink action={e.action} entity={e.entity} /> has
        been <strong>revised</strong>.
      </>
    ),
  },
  stackscript_update: {
    notification: (e) => (
      <>
        StackScript <EventMessageLink action={e.action} entity={e.entity} /> has
        been <strong>updated</strong>.
      </>
    ),
  },
};

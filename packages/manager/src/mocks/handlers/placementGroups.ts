import { rest } from 'msw';

import { mswDB } from '../db';
import { makeResourcePage } from '../serverHandlers';

import type {
  CreatePlacementGroupPayload,
  UpdatePlacementGroupPayload,
} from '@linode/api-v4';

[1, 2, 3].forEach((_, idx) => {
  const placementGroupLinode = mswDB.placementGroupLinodes.create({
    id: idx + 1,
    is_compliant: true,
    // linode: 1,
  });

  const placementGroup = {
    affinity_type: 'anti_affinity',
    id: idx + 1,
    is_compliant: true,
    is_strict: true,
    label: `PG-${idx + 1}`,
    linodes: [placementGroupLinode],
  };

  mswDB.placementGroup.create(placementGroup);
});

export const placementGroups = [
  rest.get('*/placement/groups', (_req, res, ctx) => {
    return res(ctx.json(makeResourcePage(mswDB.placementGroup.getAll())));
  }),
  rest.get('*/placement/groups/:placementGroupId', (req, res, ctx) => {
    if (req.params.placementGroupId === '-1') {
      return res(ctx.status(404));
    }

    return res(
      ctx.json(
        mswDB.placementGroup.findFirst({
          where: {
            id: {
              equals: Number(req.params.placementGroupId[0]),
            },
          },
        })
      )
    );
  }),
  rest.post('*/placement/groups', (req, res, ctx) => {
    const newPlacementGroups = mswDB.placementGroup.create({
      ...(req.body as CreatePlacementGroupPayload),
    });

    return res(ctx.json(newPlacementGroups));
  }),
  rest.put('*/placement/groups/:placementGroupId', (req, res, ctx) => {
    if (req.params.placementGroupId === '-1') {
      return res(ctx.status(404));
    }

    const updatedPlacementGroup = mswDB.placementGroup.update({
      data: {
        ...(req.body as UpdatePlacementGroupPayload),
      },
      where: {
        id: {
          equals: Number(req.params.placementGroupId[0]),
        },
      },
    });

    return res(ctx.json(updatedPlacementGroup));
  }),
  rest.delete('*/placement/groups/:placementGroupId', (req, res, ctx) => {
    if (req.params.placementGroupId === '-1') {
      return res(ctx.status(404));
    }

    mswDB.placementGroup.delete({
      where: {
        id: {
          equals: Number(req.params.placementGroupId[0]),
        },
      },
    });

    return res(ctx.json({}));
  }),
  rest.post('*/placement/groups/:placementGroupId/assign', (req, res, ctx) => {
    if (req.params.placementGroupId === '-1') {
      return res(ctx.status(404));
    }

    return res(ctx.json(null));
  }),
  rest.post(
    '*/placement/groups/:placementGroupId/unassign',
    (req, res, ctx) => {
      if (req.params.placementGroupId === '-1') {
        return res(ctx.status(404));
      }

      return res(ctx.json(null));
    }
  ),
];

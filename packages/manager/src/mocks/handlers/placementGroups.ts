import { rest } from 'msw';

import { mswDB } from '../db';
import { makeResourcePage } from '../serverHandlers';

import type {
  CreatePlacementGroupPayload,
  UpdatePlacementGroupPayload,
} from '@linode/api-v4';

// Create a placement group with 0 linodes
mswDB.placementGroup.create({
  affinity_type: 'anti_affinity',
  is_compliant: true,
  is_strict: true,
  label: `PG-1`,
  linodes: [],
  region: 'region1',
});

// Create a linode and a placement group with 1 linode
const linode1 = mswDB.linode.create({
  label: `linode-1`,
});

const placementGroupLinode1 = mswDB.placementGroupLinodes.create({
  is_compliant: true,
  linode: linode1,
});

mswDB.placementGroup.create({
  affinity_type: 'anti_affinity',
  is_compliant: true,
  is_strict: true,
  label: `PG-2`,
  linodes: [placementGroupLinode1],
  region: 'region2',
});

// Create 9 linodes and a placement group with 9 linodes
const linodes = Array.from({ length: 9 }, (_, idx) => {
  const linode = mswDB.linode.create({
    label: `linode-${idx + 2}`,
  });

  return mswDB.placementGroupLinodes.create({
    is_compliant: true,
    linode,
  });
});

mswDB.placementGroup.create({
  affinity_type: 'anti_affinity',
  is_compliant: true,
  is_strict: true,
  label: `PG-3`,
  linodes,
  region: 'region3',
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
              equals: Number(req.params.placementGroupId),
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
          equals: Number(req.params.placementGroupId),
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
          equals: Number(req.params.placementGroupId),
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

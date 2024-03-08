import { rest } from 'msw';

import { placementGroupFactory } from 'src/factories/placementGroups';

import { makeResourcePage } from './serverHandlers';
import {
  createMockStoreEntity,
  getMockStoreEntities,
  getMockStoreEntity,
  updateMockStoreEntity,
} from './store';

import type { MockStoreFeature } from './store/types';
import type { PlacementGroup } from '@linode/api-v4';

const PG_MOCK_STORAGE_FEATURE: MockStoreFeature = 'Placement Groups';
const PLACEMENT_GROUPS_DISPLAY = 'placement-groups-list';

export const placementGroupsHandlers = [
  rest.get('*/placement/groups', (_req, res, ctx) => {
    const initialPlacementGroups = [
      placementGroupFactory.build({
        id: 1,
        is_compliant: true,
        label: 'pg-1',
      }),
      placementGroupFactory.build({
        id: 2,
        is_compliant: true,
        label: 'pg-2',
      }),
      placementGroupFactory.build({
        id: 3,
        is_compliant: false,
        label: 'pg-3',
      }),
    ];

    const { entities: placementGroups } = getMockStoreEntities({
      feature: PG_MOCK_STORAGE_FEATURE,
      initialEntities: initialPlacementGroups,
      key: PLACEMENT_GROUPS_DISPLAY,
    });

    return res(ctx.json(makeResourcePage(placementGroups)));
  }),
  rest.post('*/placement/groups', (req, res, ctx) => {
    const newPG = placementGroupFactory.build({
      ...(req.body as PlacementGroup),
      is_compliant: true,
      linodes: [],
    });

    const { entity: newPlacementGroup } = createMockStoreEntity({
      feature: PG_MOCK_STORAGE_FEATURE,
      key: PLACEMENT_GROUPS_DISPLAY,
      payload: newPG,
    });

    return res(ctx.json(newPlacementGroup));
  }),
  rest.get('*/placement/groups/:placementGroupId', (req, res, ctx) => {
    if (req.params.placementGroupId === '-1') {
      return res(ctx.status(404));
    }

    const { entity: placementGroup } = getMockStoreEntity({
      entityId: Number(req.params.placementGroupId),
      feature: PG_MOCK_STORAGE_FEATURE,
      key: PLACEMENT_GROUPS_DISPLAY,
    });

    return res(ctx.json(placementGroup));
  }),
  rest.put('*/placement/groups/:placementGroupId', (req, res, ctx) => {
    if (req.params.placementGroupId === '-1') {
      return res(ctx.status(404));
    }

    const { entity: updatedPlacementGroup } = updateMockStoreEntity({
      entityId: Number(req.params.placementGroupId),
      feature: PG_MOCK_STORAGE_FEATURE,
      key: PLACEMENT_GROUPS_DISPLAY,
      payload: req.body as PlacementGroup,
    });

    return res(ctx.json(updatedPlacementGroup));
  }),
  rest.delete('*/placement/groups/:placementGroupId', (req, res, ctx) => {
    if (req.params.placementGroupId === '-1') {
      return res(ctx.status(404));
    }

    return res(ctx.json({}));
  }),
  rest.post('*/placement/groups/:placementGroupId/assign', (req, res, ctx) => {
    if (req.params.placementGroupId === '-1') {
      return res(ctx.status(404));
    }

    const response = placementGroupFactory.build({
      affinity_type: 'anti_affinity',
      id: Number(req.params.placementGroupId) ?? -1,
      label: 'pg-1',
      linodes: [
        {
          is_compliant: true,
          linode: 1,
        },
        {
          is_compliant: true,
          linode: 2,
        },
        {
          is_compliant: true,
          linode: 3,
        },
        {
          is_compliant: true,
          linode: 4,
        },
        {
          is_compliant: true,
          linode: 5,
        },
        {
          is_compliant: true,
          linode: 6,
        },
        {
          is_compliant: true,
          linode: 7,
        },
        {
          is_compliant: true,
          linode: 8,
        },
        {
          is_compliant: false,
          linode: 43,
        },
        {
          is_compliant: true,
          linode: (req.body as any).linodes[0],
        },
      ],
    });

    return res(ctx.json(response));
  }),
  rest.post(
    '*/placement/groups/:placementGroupId/unassign',
    (req, res, ctx) => {
      if (req.params.placementGroupId === '-1') {
        return res(ctx.status(404));
      }

      const response = placementGroupFactory.build({
        affinity_type: 'anti_affinity',
        id: Number(req.params.placementGroupId) ?? -1,
        label: 'pg-1',
        linodes: [
          {
            is_compliant: true,
            linode: 1,
          },

          {
            is_compliant: true,
            linode: 2,
          },
          {
            is_compliant: true,
            linode: 3,
          },
          {
            is_compliant: true,
            linode: 4,
          },
          {
            is_compliant: true,
            linode: 5,
          },
          {
            is_compliant: true,
            linode: 6,
          },
          {
            is_compliant: true,
            linode: 7,
          },
          {
            is_compliant: true,
            linode: 8,
          },
          {
            is_compliant: false,
            linode: 43,
          },
        ],
      });

      return res(ctx.json(response));
    }
  ),
];

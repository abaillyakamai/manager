import { rest } from 'msw';

import { placementGroupFactory } from 'src/factories/placementGroups';

import { makeResourcePage } from './serverHandlers';
import {
  createMockStoreEntity,
  deleteMockStoreEntity,
  getMockStoreEntities,
  getMockStoreEntity,
  updateMockStoreEntity,
} from './store';

import type { MockStoreFeature } from './store/types';
import type { PlacementGroup } from '@linode/api-v4';

const PG_MOCK_STORAGE_FEATURE_KEY: MockStoreFeature = 'Placement Groups';
const PLACEMENT_GROUPS = 'placement-groups-list';

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

    const { entities: placementGroups } = getMockStoreEntities<PlacementGroup>({
      featureKey: PG_MOCK_STORAGE_FEATURE_KEY,
      initialEntities: initialPlacementGroups,
      queryKey: PLACEMENT_GROUPS,
    });

    return res(ctx.json(makeResourcePage(placementGroups)));
  }),
  rest.post('*/placement/groups', (req, res, ctx) => {
    const newPG = placementGroupFactory.build({
      ...(req.body as PlacementGroup),
      is_compliant: true,
      linodes: [],
    });

    const { entity: newPlacementGroup } = createMockStoreEntity<PlacementGroup>(
      {
        featureKey: PG_MOCK_STORAGE_FEATURE_KEY,
        payload: newPG,
        queryKey: PLACEMENT_GROUPS,
      }
    );

    return res(ctx.json(newPlacementGroup));
  }),
  rest.get('*/placement/groups/:placementGroupId', (req, res, ctx) => {
    if (req.params.placementGroupId === '-1') {
      return res(ctx.status(404));
    }

    const { entity: placementGroup } = getMockStoreEntity<PlacementGroup>({
      entityId: Number(req.params.placementGroupId),
      featureKey: PG_MOCK_STORAGE_FEATURE_KEY,
      queryKey: PLACEMENT_GROUPS,
    });

    return res(ctx.json(placementGroup));
  }),
  rest.put('*/placement/groups/:placementGroupId', (req, res, ctx) => {
    if (req.params.placementGroupId === '-1') {
      return res(ctx.status(404));
    }

    const {
      entity: updatedPlacementGroup,
    } = updateMockStoreEntity<PlacementGroup>({
      entityId: Number(req.params.placementGroupId),
      featureKey: PG_MOCK_STORAGE_FEATURE_KEY,
      payload: req.body as any,
      queryKey: PLACEMENT_GROUPS,
    });

    return res(ctx.json(updatedPlacementGroup));
  }),
  rest.delete('*/placement/groups/:placementGroupId', (req, res, ctx) => {
    if (req.params.placementGroupId === '-1') {
      return res(ctx.status(404));
    }

    deleteMockStoreEntity({
      entityId: Number(req.params.placementGroupId),
      featureKey: PG_MOCK_STORAGE_FEATURE_KEY,
      queryKey: PLACEMENT_GROUPS,
    });

    return res(ctx.json({}));
  }),
  rest.post('*/placement/groups/:placementGroupId/assign', (req, res, ctx) => {
    if (req.params.placementGroupId === '-1') {
      return res(ctx.status(404));
    }

    const { entity: updatedPlacementGroupLinodes } = updateMockStoreEntity<
      Partial<PlacementGroup>
    >({
      entityId: Number(req.params.placementGroupId),
      featureKey: PG_MOCK_STORAGE_FEATURE_KEY,
      payload: {
        linodes: [
          {
            is_compliant: true,
            linode: (req.body as Record<string, any>)?.linodes[0] as any,
          },
        ],
      },
      queryKey: PLACEMENT_GROUPS,
    });

    return res(ctx.json(updatedPlacementGroupLinodes));
  }),
  rest.post(
    '*/placement/groups/:placementGroupId/unassign',
    (req, res, ctx) => {
      if (req.params.placementGroupId === '-1') {
        return res(ctx.status(404));
      }

      const { entity: originalEntity } = getMockStoreEntity<PlacementGroup>({
        entityId: Number(req.params.placementGroupId),
        featureKey: PG_MOCK_STORAGE_FEATURE_KEY,
        queryKey: PLACEMENT_GROUPS,
      });

      const { entity: updatedPlacementGroupLinodes } = updateMockStoreEntity<
        Partial<PlacementGroup>
      >({
        deepMerge: false,
        entityId: Number(req.params.placementGroupId),
        featureKey: PG_MOCK_STORAGE_FEATURE_KEY,
        payload: {
          linodes: originalEntity?.linodes.filter(
            (linode) =>
              linode.linode !== (req.body as Record<string, any>)?.linodes[0]
          ),
        },
        queryKey: PLACEMENT_GROUPS,
      });

      return res(ctx.json(updatedPlacementGroupLinodes));
    }
  ),
];

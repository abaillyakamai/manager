import { HttpResponse, http } from 'msw';

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
  http.get('*/placement/groups', () => {
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

    return HttpResponse.json(makeResourcePage(placementGroups));
  }),
  http.post('*/placement/groups', ({ request }) => {
    const newPG = placementGroupFactory.build({
      ...(request.body as any),
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

    return HttpResponse.json(newPlacementGroup);
  }),
  http.get('*/placement/groups/:placementGroupId', ({ params }) => {
    if (params.placementGroupId === '-1') {
      return HttpResponse.json({}, { status: 404 });
    }

    const { entity: placementGroup } = getMockStoreEntity<PlacementGroup>({
      entityId: Number(params.placementGroupId),
      featureKey: PG_MOCK_STORAGE_FEATURE_KEY,
      queryKey: PLACEMENT_GROUPS,
    });

    return HttpResponse.json(placementGroup);
  }),
  http.put('*/placement/groups/:placementGroupId', ({ params, request }) => {
    if (params.placementGroupId === '-1') {
      return HttpResponse.json({}, { status: 404 });
    }

    const {
      entity: updatedPlacementGroup,
    } = updateMockStoreEntity<PlacementGroup>({
      entityId: Number(params.placementGroupId),
      featureKey: PG_MOCK_STORAGE_FEATURE_KEY,
      payload: request.body as any,
      queryKey: PLACEMENT_GROUPS,
    });

    return HttpResponse.json(updatedPlacementGroup);
  }),
  http.delete('*/placement/groups/:placementGroupId', ({ params }) => {
    if (params.placementGroupId === '-1') {
      return HttpResponse.json({}, { status: 404 });
    }

    deleteMockStoreEntity({
      entityId: Number(params.placementGroupId),
      featureKey: PG_MOCK_STORAGE_FEATURE_KEY,
      queryKey: PLACEMENT_GROUPS,
    });

    return HttpResponse.json({});
  }),
  http.post(
    '*/placement/groups/:placementGroupId/assign',
    ({ params, request }) => {
      if (params.placementGroupId === '-1') {
        return HttpResponse.json({}, { status: 404 });
      }

      const { entity: updatedPlacementGroupLinodes } = updateMockStoreEntity<
        Partial<PlacementGroup>
      >({
        entityId: Number(params.placementGroupId),
        featureKey: PG_MOCK_STORAGE_FEATURE_KEY,
        payload: {
          linodes: [
            {
              is_compliant: true,
              linode: (request.body as Record<string, any>)?.linodes[0] as any,
            },
          ],
        },
        queryKey: PLACEMENT_GROUPS,
      });

      return HttpResponse.json(updatedPlacementGroupLinodes);
    }
  ),
  http.post(
    '*/placement/groups/:placementGroupId/unassign',
    ({ params, request }) => {
      if (params.placementGroupId === '-1') {
        return HttpResponse.json({}, { status: 404 });
      }

      const { entity: originalEntity } = getMockStoreEntity<PlacementGroup>({
        entityId: Number(params.placementGroupId),
        featureKey: PG_MOCK_STORAGE_FEATURE_KEY,
        queryKey: PLACEMENT_GROUPS,
      });

      const { entity: updatedPlacementGroupLinodes } = updateMockStoreEntity<
        Partial<PlacementGroup>
      >({
        deepMerge: false,
        entityId: Number(params.placementGroupId),
        featureKey: PG_MOCK_STORAGE_FEATURE_KEY,
        payload: {
          linodes: originalEntity?.linodes.filter(
            (linode) =>
              linode.linode !==
              (request.body as Record<string, any>)?.linodes[0]
          ),
        },
        queryKey: PLACEMENT_GROUPS,
      });

      return HttpResponse.json(updatedPlacementGroupLinodes);
    }
  ),
];

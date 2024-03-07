import { rest } from 'msw';

import { placementGroupFactory } from 'src/factories/placementGroups';

import { makeResourcePage } from './serverHandlers';
import { handleGetMockStore, handlePostMockStore } from './store';

import type { MockStoreFeature } from './store/types';
import type { PlacementGroup } from '@linode/api-v4';

const PG_MOCK_STORAGE_FEATURE: MockStoreFeature = 'Placement Groups';

export const placementGroupsHandlers = [
  rest.get('*/placement/groups', (_req, res, ctx) => {
    const initialData = [
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

    const { storedData } = handleGetMockStore({
      feature: PG_MOCK_STORAGE_FEATURE,
      initialData,
      key: 'get:placement/groups',
    });

    return res(ctx.json(makeResourcePage(storedData)));
  }),
  rest.get('*/placement/groups/:placementGroupId', (req, res, ctx) => {
    if (req.params.placementGroupId === 'undefined') {
      return res(ctx.status(404));
    }

    return res(
      ctx.json(
        placementGroupFactory.build({
          id: 4,
        })
      )
    );
  }),
  rest.post('*/placement/groups', (req, res, ctx) => {
    const { newItem } = handlePostMockStore({
      feature: PG_MOCK_STORAGE_FEATURE,
      key: 'get:placement/groups',
      newItem: placementGroupFactory.build({
        ...(req.body as PlacementGroup),
      }),
    });

    return res(ctx.json(newItem));
  }),
  rest.put('*/placement/groups/:placementGroupId', (req, res, ctx) => {
    if (req.params.placementGroupId === '-1') {
      return res(ctx.status(404));
    }

    const response = placementGroupFactory.build({
      ...(req.body as any),
    });

    return res(ctx.json(response));
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

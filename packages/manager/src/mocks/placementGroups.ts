import { rest } from 'msw';

import { placementGroupFactory } from 'src/factories/placementGroups';
import { makeResourcePage } from './serverHandlers';
import { setMockData } from './store';

import type { MockStoreFeature } from './store';

const MOCK_STORAGE_FEATURE: MockStoreFeature = 'Placement Groups';

export const placementGroupsHandlers = [
  rest.get('*/placement/groups', (_req, res, ctx) => {
    const payload = [
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
    ]

    setMockData({
      feature: MOCK_STORAGE_FEATURE,
      endpoint: 'get/placement/groups',
      data: payload,
    });
    return res(
      ctx.json(
        makeResourcePage(payload)
      )
    );
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
    return res(
      ctx.json({
        ...placementGroupFactory.buildList(3),
        ...placementGroupFactory.build({
          ...(req.body as any),
          id: 20,
        }),
      })
    );
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
]

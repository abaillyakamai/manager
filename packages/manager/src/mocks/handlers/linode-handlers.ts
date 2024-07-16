import { DateTime } from 'luxon';
import { http } from 'msw';

import {
  configFactory,
  linodeBackupFactory,
  linodeDiskFactory,
  linodeFactory,
  linodeIPFactory,
  linodeStatsFactory,
  linodeTransferFactory,
} from 'src/factories';
import { queueEvents } from 'src/mocks/utilities/events';
import {
  makeNotFoundResponse,
  makePaginatedResponse,
  makeResponse,
} from 'src/mocks/utilities/response';

import { getPaginatedSlice } from '../utilities/pagination';

import type {
  Config,
  Disk,
  Firewall,
  Linode,
  LinodeBackupsResponse,
  LinodeIPsResponse,
  RegionalNetworkUtilization,
  Stats,
} from '@linode/api-v4';
import type { StrictResponse } from 'msw';
import type { MockContext } from 'src/mocks/types';
import type {
  APIErrorResponse,
  APIPaginatedResponse,
} from 'src/mocks/utilities/response';

export const getLinodes = (mockContext: MockContext) => [
  // Get an individual Linode's details.
  // Responds with a Linode instance if one exists with ID `id` in context.
  // Otherwise, a 404 response is mocked.
  http.get(
    '*/v4/linode/instances/:id',
    ({ params }): StrictResponse<APIErrorResponse | Linode> => {
      const id = Number(params.id);
      const linode = mockContext.linodes.find(
        (contextLinode) => contextLinode.id === id
      );

      if (!linode) {
        return makeNotFoundResponse();
      }
      return makeResponse(linode);
    }
  ),

  http.get(
    '*/v4/linode/instances/:id/configs',
    ({
      params,
      request,
    }): StrictResponse<APIErrorResponse | APIPaginatedResponse<Config>> => {
      const id = Number(params.id);
      const linode = mockContext.linodes.find(
        (contextLinode) => contextLinode.id === id
      );
      const url = new URL(request.url);

      if (!linode) {
        return makeNotFoundResponse();
      }

      const configs = mockContext.linodeConfigs
        .filter((configTuple) => configTuple[0] === id)
        .map((configTuple) => configTuple[1]);

      const pageNumber = Number(url.searchParams.get('page')) || 1;
      const pageSize = Number(url.searchParams.get('page_size')) || 25;
      const totalPages = Math.max(Math.ceil(configs.length / pageSize), 1);

      const pageSlice = getPaginatedSlice(configs, pageNumber, pageSize);

      return makePaginatedResponse(pageSlice, pageNumber, totalPages);
    }
  ),

  http.get('*/v4/linode/instances', ({ request }) => {
    const url = new URL(request.url);

    const pageNumber = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('page_size')) || 25;
    const totalPages = Math.ceil(mockContext.linodes.length / pageSize);

    const pageSlice = getPaginatedSlice(
      mockContext.linodes,
      pageNumber,
      pageSize
    );

    return makePaginatedResponse(pageSlice, pageNumber, totalPages);
  }),
];

export const createLinode = (mockContext: MockContext) => [
  http.post('*/v4/linode/instances', async ({ request }) => {
    const payload = await request.clone().json();
    const linode = linodeFactory.build({
      created: DateTime.now().toISO(),
      status: 'provisioning',
      ...payload,
    });

    if (!linode.label) {
      linode.label = `linode${linode.id}`;
    }

    const linodeConfig = configFactory.build({
      created: DateTime.now().toISO(),
    });

    mockContext.linodes.push(linode);
    mockContext.linodeConfigs.push([linode.id, linodeConfig]);

    queueEvents({
      event: {
        action: 'linode_create',
        entity: {
          id: linode.id,
          label: linode.label,
          type: 'linode',
          url: `/v4/linode/instances/${linode.id}`,
        },
      },
      mockContext,
      sequence: [
        { status: 'scheduled' },
        { isProgressEvent: true, status: 'started' },
        { status: 'finished' },
      ],
    })
      .then(() => {
        linode.status = 'booting';
        return queueEvents({
          event: {
            action: 'linode_boot',
            entity: {
              id: linode.id,
              label: linode.label,
              type: 'linode',
              url: `/v4/linode/instances/${linode.id}`,
            },
          },
          mockContext,
          sequence: [
            { isProgressEvent: true, status: 'started' },
            { status: 'finished' },
          ],
        });
      })
      .then(() => {
        linode.status = 'running';
      });

    return makeResponse(linode);
  }),
];

export const updateLinode = (mockContext: MockContext) => [
  http.put(
    '*/v4/linode/instances/:id',
    async ({
      params,
      request,
    }): Promise<StrictResponse<APIErrorResponse | Linode>> => {
      const id = Number(params.id);
      const payload = await request.clone().json();

      const linode = mockContext.linodes.find(
        (contextLinode) => contextLinode.id === id
      );

      if (!linode) {
        return makeNotFoundResponse();
      }

      Object.assign(linode, payload);

      queueEvents({
        event: {
          action: 'linode_update',
          entity: {
            id: linode.id,
            label: linode.label,
            type: 'linode',
            url: `/v4/linode/instances/${linode.id}`,
          },
        },
        mockContext,
        sequence: [{ status: 'notification' }],
      });

      return makeResponse(linode);
    }
  ),
];

export const deleteLinode = (mockContext: MockContext) => [
  http.delete('*/v4/linode/instances/:id', ({ params }) => {
    const id = Number(params.id);
    const linode = mockContext.linodes.find(
      (contextLinode) => contextLinode.id === id
    );

    if (linode) {
      const linodeIndex = mockContext.linodes.indexOf(linode);
      if (linodeIndex >= 0) {
        mockContext.linodes.splice(linodeIndex, 1);

        queueEvents({
          event: {
            action: 'linode_delete',
            entity: {
              id: linode.id,
              label: linode.label,
              type: 'linode',
              url: `/v4/linode/instances/${linode.id}`,
            },
          },
          mockContext,
          sequence: [{ status: 'finished' }],
        });

        return makeResponse({});
      }
    }

    return makeNotFoundResponse();
  }),
];

export const getLinodeStats = (mockContext: MockContext) => [
  http.get(
    '*/v4/linode/instances/:id/stats*',
    ({ params }): StrictResponse<APIErrorResponse | Stats> => {
      const id = Number(params.id);
      const linode = mockContext.linodes.find(
        (contextLinode) => contextLinode.id === id
      );

      if (!linode) {
        return makeNotFoundResponse();
      }

      const mockStats = linodeStatsFactory.build();

      return makeResponse(mockStats);
    }
  ),
];

export const getLinodeDisks = (mockContext: MockContext) => [
  http.get(
    '*/v4/linode/instances/:id/disks',
    ({
      params,
    }): StrictResponse<APIErrorResponse | APIPaginatedResponse<Disk>> => {
      const id = Number(params.id);
      const linode = mockContext.linodes.find(
        (contextLinode) => contextLinode.id === id
      );

      if (!linode) {
        return makeNotFoundResponse();
      }

      const mockDisks = linodeDiskFactory.buildList(3);

      return makePaginatedResponse(mockDisks);
    }
  ),
];

export const getLinodeTransfer = (mockContext: MockContext) => [
  http.get(
    '*/v4/linode/instances/:id/transfer',
    ({
      params,
    }): StrictResponse<APIErrorResponse | RegionalNetworkUtilization> => {
      const id = Number(params.id);
      const linode = mockContext.linodes.find(
        (contextLinode) => contextLinode.id === id
      );

      if (!linode) {
        return makeNotFoundResponse();
      }

      const mockTransfer = linodeTransferFactory.build();

      return makeResponse(mockTransfer);
    }
  ),
];

export const getLinodeFirewalls = (mockContext: MockContext) => [
  http.get(
    '*/v4/linode/instances/:id/firewalls',
    ({
      params,
    }): StrictResponse<APIErrorResponse | APIPaginatedResponse<Firewall>> => {
      const id = Number(params.id);
      const linode = mockContext.linodes.find(
        (contextLinode) => contextLinode.id === id
      );

      if (!linode) {
        return makeNotFoundResponse();
      }

      const mockFirewalls = mockContext.firewalls.filter((firewall) =>
        firewall.entities.some((entity) => entity.id === id)
      );

      return makePaginatedResponse(mockFirewalls);
    }
  ),
];

export const getLinodeIps = (mockContext: MockContext) => [
  http.get(
    '*/v4/linode/instances/:id/ips',
    ({ params }): StrictResponse<APIErrorResponse | LinodeIPsResponse> => {
      const id = Number(params.id);
      const linode = mockContext.linodes.find(
        (contextLinode) => contextLinode.id === id
      );

      if (!linode) {
        return makeNotFoundResponse();
      }

      const mockLinodeIps = linodeIPFactory.build();

      return makeResponse(mockLinodeIps);
    }
  ),
];

export const getLinodeBackups = (mockContext: MockContext) => [
  http.get(
    '*/v4/linode/instances/:id/backups',
    ({ params }): StrictResponse<APIErrorResponse | LinodeBackupsResponse> => {
      const id = Number(params.id);
      const linode = mockContext.linodes.find(
        (contextLinode) => contextLinode.id === id
      );

      if (!linode) {
        return makeNotFoundResponse();
      }

      const mockLinodeBackup = linodeBackupFactory.build();

      return makeResponse({
        automatic: [mockLinodeBackup],
        snapshot: {
          current: null,
          in_progress: null,
        },
      });
    }
  ),
];

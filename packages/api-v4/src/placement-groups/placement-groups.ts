import {
  assignVmsToPlacementGroupSchema,
  createPlacementGroupSchema,
  unassignVmsFromPlacementGroupSchema,
  updatePlacementGroupSchema,
} from '@linode/validation/lib/placement-groups.schema';
import { API_ROOT } from '../constants';

import Request, {
  setData,
  setMethod,
  setParams,
  setURL,
  setXFilter,
} from '../request';
import type { Filter, Params, ResourcePage as Page } from '../types';
import type {
  AssignVmsToPlacementGroupPayload,
  CreatePlacementGroupPayload,
  PlacementGroup,
  UnassignVmsFromPlacementGroupPayload,
  UpdatePlacementGroupPayload,
} from './types';

/**
 * getPlacementGroups
 *
 * Returns a paginated list of all Placement Groups which this customer has created.
 */
export const getPlacementGroups = (params?: Params, filter?: Filter) =>
  Request<Page<PlacementGroup>>(
    setURL(`${API_ROOT}/placement/groups`),
    setMethod('GET'),
    setParams(params),
    setXFilter(filter)
  );

/**
 * getPlacementGroup
 *
 * Get a single Placement Group.
 *
 * @param placementGroupId { number } The id of the Placement Group to be fetched.
 */
export const getPlacementGroup = (placementGroupId: number) =>
  Request<PlacementGroup>(
    setURL(
      `${API_ROOT}/placement/groups/${encodeURIComponent(placementGroupId)}`
    ),
    setMethod('GET')
  );

/**
 * createPlacementGroup
 *
 * Create a Placement Group.
 *
 * @param data { PlacementGroup } The data for the Placement Group.
 */
export const createPlacementGroup = (data: CreatePlacementGroupPayload) =>
  Request<PlacementGroup>(
    setURL(`${API_ROOT}/placement/groups`),
    setMethod('POST'),
    setData(data, createPlacementGroupSchema)
  );

/**
 * updatePlacementGroup
 *
 * Update a Placement Group.
 *
 * @param placementGroupId { number } The id of the Placement Group to be updated.
 * @param data { PlacementGroup } The data for the Placement Group.
 */
export const updatePlacementGroup = (
  placementGroupId: number,
  data: UpdatePlacementGroupPayload
) =>
  Request<PlacementGroup>(
    setURL(
      `${API_ROOT}/placement/groups/${encodeURIComponent(placementGroupId)}`
    ),
    setMethod('PUT'),
    setData(data, updatePlacementGroupSchema)
  );

/**
 * deletePlacementGroup
 *
 * Delete a Placement Group.
 *
 * @param placementGroupId { number } The id of the Placement Group to be deleted.
 */
export const deletePlacementGroup = (placementGroupId: number) =>
  Request<{}>(
    setURL(
      `${API_ROOT}/placement/groups/${encodeURIComponent(placementGroupId)}`
    ),
    setMethod('DELETE')
  );

/**
 * assignVmsToPlacementGroup
 *
 * Assign Linodes to a Placement Group.
 *
 * @param placementGroupId { number } The id of the Placement Group to add linodes to.
 * @param linodeIds { number[] } The ids of the Linodes to add to the Placement Group.
 *
 * @note While this accepts an array of Linode ids (future proofing), only one Linode id is supported at this time.
 */
export const assignVmsToPlacementGroup = (
  placementGroupId: number,
  linodeIds: AssignVmsToPlacementGroupPayload
) =>
  Request<PlacementGroup>(
    setURL(
      `${API_ROOT}/placement/groups/${encodeURIComponent(
        placementGroupId
      )}/assign`
    ),
    setMethod('POST'),
    setData(linodeIds, assignVmsToPlacementGroupSchema)
  );

/**
 * unassignVmsFromPlacementGroup
 *
 * Unassign Linodes from a Placement Group.
 *
 * @param placementGroupId { number } The id of the Placement Group to remove linodes from.
 * @param linodeIds { number[] } The ids of the Linodes to remove from the Placement Group.
 *
 * @note While this accepts an array of Linode ids (future proofing), only one Linode id is supported at this time.
 */
export const unassignVmsFromPlacementGroup = (
  placementGroupId: number,
  linodeIds: UnassignVmsFromPlacementGroupPayload
) =>
  Request<PlacementGroup>(
    setURL(
      `${API_ROOT}/placement/groups/${encodeURIComponent(
        placementGroupId
      )}/unassign`
    ),
    setMethod('POST'),
    setData(linodeIds, unassignVmsFromPlacementGroupSchema)
  );

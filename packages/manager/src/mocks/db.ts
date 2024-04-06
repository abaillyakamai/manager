import { factory } from '@mswjs/data';

import { LinodeModel, LinodePlacementGroupModel } from './models/Linode';
import {
  PlacementGroupLinodesModel,
  PlacementGroupModel,
} from './models/PlacementGroup';
import { seedPlacementGroupsData } from './seeds/placementGroups';

export const mswDB = factory({
  linode: LinodeModel,
  linodePlacementGroup: LinodePlacementGroupModel,
  placementGroup: PlacementGroupModel,
  placementGroupLinodes: PlacementGroupLinodesModel,
});

export const dbHandlers = [
  ...mswDB.placementGroup.toHandlers('rest'),
  ...mswDB.placementGroupLinodes.toHandlers('rest'),
];

seedPlacementGroupsData();

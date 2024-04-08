import { factory } from '@mswjs/data';

import { LinodeModel } from './models/Linode';
import { PlacementGroupModel } from './models/PlacementGroup';
import { seedPlacementGroupsData } from './seeds/placementGroups';

export const mswDB = factory({
  linode: LinodeModel,
  placementGroup: PlacementGroupModel,
});

seedPlacementGroupsData();

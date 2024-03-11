import { factory } from '@mswjs/data';

import { LinodeModel, LinodePlacementGroupModel } from './models/Linode';
import {
  PlacementGroupLinodesModel,
  PlacementGroupModel,
} from './models/PlacementGroup';

export const mswDB = factory({
  linode: LinodeModel,
  linodePlacementGroup: LinodePlacementGroupModel,
  placementGroup: PlacementGroupModel,
  placementGroupLinodes: PlacementGroupLinodesModel,
});

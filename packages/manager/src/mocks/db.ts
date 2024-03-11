import { factory } from '@mswjs/data';

import { LinodeModel } from './models/Linode';
import {
  PlacementGroupLinodesModel,
  PlacementGroupModel,
} from './models/PlacementGroup';

export const mswDB = factory({
  linode: LinodeModel,
  placementGroup: PlacementGroupModel,
  placementGroupLinodes: PlacementGroupLinodesModel,
});

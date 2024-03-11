import { manyOf, oneOf, primaryKey } from '@mswjs/data';

const PlacementGroupLinodesModel = {
  id: primaryKey(Number),
  is_compliant: Boolean,
  linode: oneOf('linode'),
};

const PlacementGroupModel = {
  affinity_type: String,
  id: primaryKey(Number),
  is_compliant: Boolean,
  is_strict: Boolean,
  label: String,
  linodes: manyOf('placementGroupLinodes'),
  region: String,
};

export { PlacementGroupLinodesModel, PlacementGroupModel };

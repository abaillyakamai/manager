import { nullable, oneOf, primaryKey } from '@mswjs/data';

import { mswUUID } from '../utils';

const LinodePlacementGroupModel = {
  affinity_type: String,
  id: primaryKey(() => mswUUID()),
  is_strict: Boolean,
  label: String,
};

const LinodeModel = {
  alerts: Array,
  backups: Array,
  group: String,
  hypervisor: String,
  id: primaryKey(() => mswUUID()),
  image: nullable(String),
  ipv4: Array,
  ipv6: Array,
  label: String,
  placement_group: nullable(oneOf('linodePlacementGroup')),
  region: String,
  specs: Array,
  status: String,
  tags: Array,
  type: nullable(String),
  updated: String,
  watchdog_enabled: Boolean,
};

export { LinodeModel, LinodePlacementGroupModel };

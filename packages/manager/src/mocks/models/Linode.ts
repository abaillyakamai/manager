import { nullable, oneOf, primaryKey } from '@mswjs/data';

const LinodeModel = {
  alerts: Array,
  backups: Array,
  group: String,
  hypervisor: String,
  id: primaryKey(Number),
  image: nullable(String),
  ipv4: Array,
  ipv6: Array,
  label: String,
  placement_group: nullable(oneOf('placementGroup')),
  region: String,
  specs: Array,
  status: String,
  tags: Array,
  type: nullable(String),
  updated: String,
  watchdog_enabled: Boolean,
};

export { LinodeModel };

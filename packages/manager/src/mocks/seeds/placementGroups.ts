import { placementGroupFactory } from 'src/factories';

import { mswDB } from '../db';
import { convertToMswContent } from '../utils';

import type { PlacementGroup } from '@linode/api-v4';

const linode1 = mswDB.linode.create({
  label: `linode-1`,
});

const placementGroupLinode1 = mswDB.placementGroupLinodes.create({
  is_compliant: true,
  linode_id: linode1,
});

const members = Array.from({ length: 9 }, (_, idx) => {
  const linode_id = mswDB.linode.create({
    label: `linode-${idx + 2}`,
  });

  return mswDB.placementGroupLinodes.create({
    is_compliant: true,
    linode_id,
  });
});

const pg1 = convertToMswContent<PlacementGroup>(
  placementGroupFactory.build({
    affinity_type: 'anti_affinity:local',
    is_compliant: true,
    is_strict: true,
    label: `PG-1`,
    members: [],
    region: 'region1',
  })
);

const pg2 = convertToMswContent<PlacementGroup>(
  placementGroupFactory.build({
    affinity_type: 'anti_affinity:local',
    is_compliant: true,
    is_strict: true,
    label: `PG-2`,
    members: [placementGroupLinode1],
    region: 'region2',
  })
);

const pg3 = convertToMswContent<PlacementGroup>(
  placementGroupFactory.build({
    affinity_type: 'anti_affinity:local',
    is_compliant: true,
    is_strict: true,
    label: `PG-3`,
    members,
    region: 'region3',
  })
);

export const seedPlacementGroupsData = () => {
  mswDB.placementGroup.create(pg1);
  mswDB.placementGroup.create(pg2);
  mswDB.placementGroup.create(pg3);
};

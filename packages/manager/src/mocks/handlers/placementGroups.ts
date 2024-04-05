import { mswDB } from '../db';

// Create a placement group with 0 linodes
mswDB.placementGroup.create({
  affinity_type: 'anti_affinity',
  is_compliant: true,
  is_strict: true,
  label: `PG-1`,
  linodes: [],
  region: 'region1',
});

// Create a linode and a placement group with 1 linode
const linode1 = mswDB.linode.create({
  label: `linode-1`,
});

const placementGroupLinode1 = mswDB.placementGroupLinodes.create({
  is_compliant: true,
  linode: linode1,
});

mswDB.placementGroup.create({
  affinity_type: 'anti_affinity',
  is_compliant: true,
  is_strict: true,
  label: `PG-2`,
  linodes: [placementGroupLinode1],
  region: 'region2',
});

// Create 9 linodes and a placement group with 9 linodes
const linodes = Array.from({ length: 9 }, (_, idx) => {
  const linode = mswDB.linode.create({
    label: `linode-${idx + 2}`,
  });

  return mswDB.placementGroupLinodes.create({
    is_compliant: true,
    linode,
  });
});

mswDB.placementGroup.create({
  affinity_type: 'anti_affinity',
  is_compliant: true,
  is_strict: true,
  label: `PG-3`,
  linodes,
  region: 'region3',
});

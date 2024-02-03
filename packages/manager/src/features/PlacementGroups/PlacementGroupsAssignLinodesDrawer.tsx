import { AFFINITY_TYPES } from '@linode/api-v4';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Drawer } from 'src/components/Drawer';
import { FormLabel } from 'src/components/FormLabel';
import { Link } from 'src/components/Link';
import { Notice } from 'src/components/Notice/Notice';
import { RemovableSelectionsList } from 'src/components/RemovableSelectionsList/RemovableSelectionsList';
import { Stack } from 'src/components/Stack';
import { Typography } from 'src/components/Typography';
import { useAllLinodesQuery } from 'src/queries/linodes/linodes';
import {
  useAllPlacementGroupsQuery,
  useAssignLinodesToPlacementGroup,
  useUnassignLinodesFromPlacementGroup,
} from 'src/queries/placementGroups';
import { useRegionsQuery } from 'src/queries/regions';

import { LinodeSelect } from '../Linodes/LinodeSelect/LinodeSelect';
import { hasPlacementGroupReachedCapacity } from './utils';
import { getLinodesFromAllPlacementGroups } from './utils';

import type { PlacementGroupsAssignLinodesDrawerProps } from './types';
import type {
  AssignLinodesToPlacementGroupPayload,
  Linode,
  Region,
  UnassignLinodesFromPlacementGroupPayload,
} from '@linode/api-v4';

export const PlacementGroupsAssignLinodesDrawer = (
  props: PlacementGroupsAssignLinodesDrawerProps
) => {
  const {
    onClose,
    // onLinodeAddedToPlacementGroup,
    open,
    selectedPlacementGroup,
  } = props;
  const { data: linodes } = useAllLinodesQuery();
  const { data: regions } = useRegionsQuery();
  const { data: allPlacementGroups } = useAllPlacementGroupsQuery();
  const { mutateAsync: assignLinodes } = useAssignLinodesToPlacementGroup(
    selectedPlacementGroup?.id ?? -1
  );
  const { mutateAsync: unassignLinodes } = useUnassignLinodesFromPlacementGroup(
    selectedPlacementGroup?.id ?? -1
  );
  const [selectedLinode, setSelectedLinode] = React.useState<Linode | null>(
    null
  );
  const [localLinodesSelection, setLocalLinodesSelection] = React.useState<
    Linode[]
  >([]);
  const [generalError, setGeneralError] = React.useState<string | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedLinode(null);
    setLocalLinodesSelection([]);
    setGeneralError(undefined);
  }, [open]);

  const linodesFromAllPlacementGroups = getLinodesFromAllPlacementGroups(
    allPlacementGroups
  );
  const getLinodeSelectOptions = (): Linode[] => {
    return (
      linodes?.filter((linode) => {
        const isInRegion = linode.region === selectedPlacementGroup?.region;
        // TODO: it should not be assigned to ANY placement group, not just the current one
        const isNotAlreadyAssigned = !linodesFromAllPlacementGroups.includes(
          linode.id as number
        );
        const isNotAssignedInDrawer = !localLinodesSelection.find(
          (l) => l.id === linode.id
        );

        return isInRegion && isNotAlreadyAssigned && isNotAssignedInDrawer;
      }) ?? []
    );
  };

  if (!linodes) {
    return null;
  }

  if (!selectedPlacementGroup) {
    return null;
  }

  const { affinity_type, label } = selectedPlacementGroup;
  const placementGroupRegion: Region | undefined = regions?.find(
    (region) => region.id === selectedPlacementGroup.region
  );
  const linodeSelectLabel = placementGroupRegion
    ? `Linodes in ${placementGroupRegion.label} (${placementGroupRegion.id})`
    : 'Linodes';

  const drawerTitle =
    label && affinity_type
      ? `Add Linodes to Placement Group ${label} (${AFFINITY_TYPES[affinity_type]})`
      : 'Add Linodes to Placement Group';

  const removableSelectionsListLabel = (
    <>
      <FormLabel htmlFor="pg-linode-removable-list">
        {label && affinity_type
          ? `Linodes Assigned to Placement Group ${label}
        (${AFFINITY_TYPES[affinity_type]})`
          : 'Linodes Assigned to Placement Group'}
      </FormLabel>
      <Typography fontSize="0.8rem">
        Maximum Number of Linodes for this group:{' '}
        {selectedPlacementGroup.capacity}
      </Typography>
    </>
  );

  const handleAssignLinode = async (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    setSelectedLinode(null);

    if (!selectedLinode) {
      return;
    }

    setLocalLinodesSelection([...localLinodesSelection, selectedLinode]);

    const payload: AssignLinodesToPlacementGroupPayload = {
      linodes: [selectedLinode.id],
    };

    try {
      await assignLinodes(payload);
    } catch (error) {
      setGeneralError(
        error?.[0]?.reason
          ? error[0].reason
          : 'An error occurred while adding the Linode to the group'
      );
    }
  };

  const handleUnassignLinode = (linode: Linode) => {
    setLocalLinodesSelection(
      localLinodesSelection.filter((l) => l.id !== linode.id)
    );

    const payload: UnassignLinodesFromPlacementGroupPayload = {
      linodes: [linode.id],
    };

    try {
      unassignLinodes(payload);
    } catch (error) {
      setGeneralError(
        error
          ? error?.[0]?.reason
          : 'An error occurred while removing the Linode from the group'
      );
    }
  };

  return (
    <Drawer onClose={onClose} open={open} title={drawerTitle}>
      <Grid>
        {generalError ? <Notice text={generalError} variant="error" /> : null}
        <form onSubmit={handleAssignLinode}>
          <Stack spacing={1}>
            <Typography>
              A Linode can only be assigned to a single Placement Group.
            </Typography>

            <Typography>
              If you need to add a new Linode, go to{' '}
              <Link to="/linodes/create">Create Linode</Link> and return to this
              page to assign it to this Placement Group.
            </Typography>
            <LinodeSelect
              onSelectionChange={(value) => {
                setSelectedLinode(value);
              }}
              helperText="Only displaying Linodes that aren’t assigned to a Placement Group"
              label={linodeSelectLabel}
              options={getLinodeSelectOptions()}
              value={selectedLinode?.id ?? null}
            />

            <ActionsPanel
              primaryButtonProps={{
                'data-testid': 'submit',
                disabled:
                  !selectedLinode ||
                  hasPlacementGroupReachedCapacity(selectedPlacementGroup),
                label: 'Add Linode',
                type: 'submit',
              }}
              sx={{ pt: 2 }}
            />
            <RemovableSelectionsList
              LabelComponent={({ selection }) => {
                return (
                  <Typography component="span">{selection.label}</Typography>
                );
              }}
              onRemove={(data: Linode) => {
                handleUnassignLinode(data);
              }}
              headerText={removableSelectionsListLabel}
              id="pg-linode-removable-list"
              noDataText={'No Linodes have been assigned.'}
              preferredDataLabel="linodeConfigLabel"
              selectionData={localLinodesSelection}
              sx={{ pt: 2 }}
            />
            <ActionsPanel
              primaryButtonProps={{
                buttonType: 'outlined',
                label: 'Done',
                onClick: onClose,
              }}
              sx={{ pt: 2 }}
            />
          </Stack>
        </form>
      </Grid>
    </Drawer>
  );
};

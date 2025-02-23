import { CircleProgress } from '@linode/ui';
import * as React from 'react';

import { TableBody } from 'src/components/TableBody';
import { TableRow } from 'src/components/TableRow';
import { useProfile } from 'src/queries/profile/profile';
import { formatDate } from 'src/utilities/formatDate';
import { truncate } from 'src/utilities/truncate';

import { StyledStackScriptSectionTableCell } from '../CommonStackScript.styles';
import StackScriptSelectionRow from './StackScriptSelectionRow';

import type { Image } from '@linode/api-v4/lib/images';
import type { StackScript } from '@linode/api-v4/lib/stackscripts';

interface Props {
  currentUser: string;
  data: StackScript[];
  disabled?: boolean;
  isSorting: boolean;
  onSelect: (s: StackScript) => void;
  openStackScriptDetailsDialog: (stackscriptId: number) => void;
  publicImages: Record<string, Image>;
  selectedId?: number;
}

export const SelectStackScriptsSection = (props: Props) => {
  const {
    data,
    disabled,
    isSorting,
    onSelect,
    openStackScriptDetailsDialog,
    selectedId,
  } = props;

  const { data: profile } = useProfile();

  const selectStackScript = (s: StackScript) => (
    <StackScriptSelectionRow
      updated={formatDate(s.updated, {
        displayTime: false,
        timezone: profile?.timezone,
      })}
      checked={selectedId === s.id}
      deploymentsActive={s.deployments_active}
      description={truncate(s.description, 100)}
      disabled={disabled}
      key={s.id}
      label={s.label}
      onSelect={() => onSelect(s)}
      openStackScriptDetailsDialog={openStackScriptDetailsDialog}
      stackScriptID={s.id}
      stackScriptUsername={s.username}
      updateFor={[selectedId === s.id]}
    />
  );

  return (
    <TableBody>
      {!isSorting ? (
        data && data.map(selectStackScript)
      ) : (
        <TableRow>
          <StyledStackScriptSectionTableCell colSpan={5}>
            <CircleProgress />
          </StyledStackScriptSectionTableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

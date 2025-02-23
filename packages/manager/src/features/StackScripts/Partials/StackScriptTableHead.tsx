import * as React from 'react';

import { Hidden } from 'src/components/Hidden';
import { TableCell } from 'src/components/TableCell';
import { TableHead } from 'src/components/TableHead';
import { TableRow } from 'src/components/TableRow';
import { TableSortCell } from 'src/components/TableSortCell';

import {
  sharedDeployCellStyles,
  sharedRevisionsCellStyles,
  sharedStackScriptCellStyles,
} from './StackScriptTableHead.styles';

import type { Theme } from '@mui/material/styles';

type SortOrder = 'asc' | 'desc';

type CurrentFilter = 'deploys' | 'label' | 'revision';

export interface StackScriptTableHeadProps {
  category?: string;
  currentFilterType: CurrentFilter | null;
  handleClickTableHeader?: (value: string) => void;
  isSelecting?: boolean;
  sortOrder?: SortOrder;
}

export const StackScriptTableHead = (props: StackScriptTableHeadProps) => {
  const {
    category,
    currentFilterType,
    handleClickTableHeader,
    isSelecting,
    sortOrder,
  } = props;

  const Cell: React.ComponentType<any> =
    !!handleClickTableHeader && sortOrder ? TableSortCell : TableCell;

  const maybeAddSortingProps = (orderBy: string) =>
    !!handleClickTableHeader && sortOrder
      ? {
          active: currentFilterType === orderBy,
          direction: sortOrder,
          handleClick: handleClickTableHeader,
          label: orderBy,
        }
      : {};

  const communityStackScripts = category === 'community';

  return (
    <TableHead>
      <TableRow>
        {/* The column width jumps in the Linode Create flow when the user
            clicks on the table header. This is currently also happening in
            production and might be related to the difference in width between
            the panels in the StackScript landing page and the one in the
            Linode Create flow.  */}
        <Cell
          sx={(theme: Theme) => ({
            ...sharedStackScriptCellStyles(category, isSelecting, theme),
          })}
          colSpan={isSelecting ? 2 : 1}
          data-qa-stackscript-table-header
          {...maybeAddSortingProps('label')}
        >
          StackScript
        </Cell>
        {!isSelecting && (
          <Cell
            data-qa-stackscript-active-deploy-header
            sx={(theme: Theme) => ({ ...sharedDeployCellStyles(theme) })}
            {...maybeAddSortingProps('deploys')}
          >
            Deploys
          </Cell>
        )}
        {!isSelecting && (
          <Hidden smDown>
            <Cell
              data-qa-stackscript-revision-header
              sx={(theme: Theme) => ({ ...sharedRevisionsCellStyles(theme) })}
              {...maybeAddSortingProps('revision')}
            >
              Last Revision
            </Cell>
          </Hidden>
        )}
        {!isSelecting && (
          <Hidden lgDown>
            <TableCell
              sx={{
                ...(category === 'account'
                  ? {
                      width: '20%',
                    }
                  : {
                      width: '26%',
                    }),
              }}
              data-qa-stackscript-compatible-images
            >
              Compatible Images
            </TableCell>
          </Hidden>
        )}
        {!isSelecting && !communityStackScripts ? (
          <Hidden lgDown>
            <TableCell
              sx={{
                width: '7%',
              }}
              data-qa-stackscript-status-header
            >
              Status
            </TableCell>
          </Hidden>
        ) : null}
        {!isSelecting && <TableCell />}
      </TableRow>
    </TableHead>
  );
};

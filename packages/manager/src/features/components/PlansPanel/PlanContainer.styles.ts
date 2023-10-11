import { Table } from 'src/components/Table';
import { TableCell, TableCellProps } from 'src/components/TableCell';
import { styled } from 'src/utilities/styled';

type StyledTableCellPropsProps = TableCellProps & {
  isPlanCell?: boolean;
};

export const StyledTable = styled(Table, {
  label: 'StyledTable',
})<{ isDisabled?: boolean }>(({ isDisabled, theme }) => ({
  '& tr ': {
    opacity: isDisabled ? 0.4 : 1,
  },
  borderLeft: `1px solid ${theme.borderColors.borderTable}`,
  borderRight: `1px solid ${theme.borderColors.borderTable}`,
  cursor: isDisabled ? 'not-allowed' : 'inherit',
  opacity: isDisabled ? 0.5 : 1,
  overflowX: 'hidden',
}));

export const StyledTableCell = styled(TableCell, {
  label: 'StyledTableCell',
})<StyledTableCellPropsProps>(({ theme, ...props }) => ({
  '&.emptyCell': {
    borderRight: 'none',
  },
  '&.planHeaderCell': {
    ...(props.isPlanCell && { paddingLeft: 4 }),
  },
  '&:last-child': {
    paddingRight: 15,
  },
  '&:not(.emptyCell)': {
    borderLeft: 'none !important',
  },
  borderBottom: `1px solid ${theme.borderColors.borderTable} !important`,
  borderTop: `1px solid ${theme.borderColors.borderTable} !important`,
}));

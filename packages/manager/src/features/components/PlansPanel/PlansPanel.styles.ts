import { TableRow, TableRowProps } from 'src/components/TableRow';
import { Typography } from 'src/components/Typography';
import { styled } from 'src/utilities/styled';

type StyledDisabledTableRowProps = Pick<TableRowProps, 'disabled'>;

export const StyledTypography = styled(Typography, {
  label: 'StyledTypography',
})(({ theme }) => ({
  '& a': {
    color: theme.textColors.linkActiveLight,
  },
  '& a:hover': {
    color: '#3683dc',
  },
  '& p': {
    fontFamily: '"LatoWebBold", sans-serif',
  },
  fontSize: '0.9em',
}));

export const StyledDisabledTableRow = styled(TableRow, {
  label: 'StyledDisabledTableRow',
})<StyledDisabledTableRowProps>(({ theme, ...props }) => ({
  ...(props.disabled && {
    backgroundColor: theme.bg.tableHeader,
    cursor: 'not-allowed',
    opacity: 0.4,
  }),
  '&:focus-within': {
    backgroundColor: theme.bg.lightBlue1,
  },
}));

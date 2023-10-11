import { styled } from 'src/utilities/styled';

import { Box } from 'src/components/Box';

export const StyledTransferDisplayContainer = styled(Box, {
  label: 'StyledTransferDisplayTypography',
})(({ theme }) => ({
  margin: 'auto',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    width: '85%',
  },
  width: '100%',
}));

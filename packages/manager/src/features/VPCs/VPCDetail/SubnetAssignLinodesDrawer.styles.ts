import { styled } from 'src/utilities/styled';

import { Box } from 'src/components/Box';
export const StyledButtonBox = styled(Box, { label: 'StyledButtonBox' })(
  ({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    margin: `${theme.spacing(3)} 0px`,
  })
);

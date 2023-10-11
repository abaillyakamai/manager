import { styled } from 'src/utilities/styled';

export const StyledDiv = styled('div', {
  label: 'StyledDiv',
})(({ theme }) => ({
  '&:before': {
    display: 'none',
  },
  marginTop: theme.spacing(4),
}));

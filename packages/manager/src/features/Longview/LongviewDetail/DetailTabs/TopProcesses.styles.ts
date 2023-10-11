import { styled } from 'src/utilities/styled';
import { Link } from 'react-router-dom';

export const StyledLink = styled(Link, { label: 'StyledLink' })({
  fontSize: 16,
  fontWeight: 'bold',
  position: 'relative',
  top: 3,
});

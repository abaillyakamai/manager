import * as React from 'react';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Collapse from 'src/components/core/Collapse';
import { useStyles } from './PrimaryNav.styles';
import { styled } from '@mui/material/styles';

interface ShowMoreExpansionProps {
  label: string;
  expanded?: boolean;
  children?: JSX.Element;
  icon?: JSX.Element;
}

export const CollapsibleNavItem = (props: ShowMoreExpansionProps) => {
  const { label, expanded, children, icon } = props;
  const { classes, cx } = useStyles();
  const [open, setOpen] = React.useState<boolean>(expanded || false);

  const handleNameClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <React.Fragment>
      <StyledCollapsibleNavItem
        className={cx(classes.listItem)}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : 'false'}
        data-qa-show-more-expanded={open ? 'true' : 'false'}
        onClick={handleNameClick}
        data-qa-show-more-toggle
      >
        <div className={classes.icon} aria-hidden>
          {icon}
        </div>
        <p className={classes.linkItem}>{label}</p>
        <StyledCollapsibleNavItemCaret />
      </StyledCollapsibleNavItem>
      <StyledCollapse in={open} className={open ? 'pOpen' : ''}>
        {open ? <div>{children}</div> : null}
      </StyledCollapse>
    </React.Fragment>
  );
};

const StyledCollapsibleNavItem = styled('a', {
  label: 'StyledCollapsibleNavItem',
})(({ theme }) => ({}));

const StyledCollapse = styled(Collapse, {
  label: 'StyledCollapse',
})(({ theme }) => ({
  '& p': {
    maxWidth: '100%',
  },
  '&.pOpen': {
    transition: 'height .3s ease-in-out',
  },
}));

const StyledCollapsibleNavItemCaret = styled(KeyboardArrowRight, {
  label: 'CollapsibleNavItemCaret',
})(({ theme }) => ({
  color: theme.color.white,
  marginRight: theme.spacing(0.5),
  fontSize: 28,
  position: 'relative',
  transition: 'transform .1s ease-in-out',
  top: 1,
  '&.rotate': {
    transition: 'transform .3s ease-in-out',
    transform: 'rotate(90deg)',
  },
}));

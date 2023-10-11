import { styled } from 'src/utilities/styled';
import { Tabs } from 'src/components/ReachTabs';

export const StyledTabs = styled(Tabs, { label: 'StyledTabs' })(
  ({ theme }) => ({
    marginBottom: `calc(${theme.spacing(3)} + 6px)`,
  })
);

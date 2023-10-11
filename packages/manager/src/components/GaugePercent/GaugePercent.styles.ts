import { styled } from 'src/utilities/styled';

import { GaugePercentProps } from './GaugePercent';

type StyledGaugePercentProps = Pick<GaugePercentProps, 'innerTextFontSize'> &
  Required<Pick<GaugePercentProps, 'height' | 'width'>>;

export const StyledSubTitleDiv = styled('div')<StyledGaugePercentProps>(
  ({ height, innerTextFontSize, theme, width }) => ({
    color: theme.color.headline,
    fontSize: innerTextFontSize || theme.spacing(2.5),
    position: 'absolute',
    textAlign: 'center',
    top: `calc(${height}px + ${theme.spacing(1.25)})`,
    width,
  })
);

export const StyledInnerTextDiv = styled('div')<StyledGaugePercentProps>(
  ({ height, theme, width }) => ({
    color: theme.palette.text.primary,
    fontSize: '1rem',
    position: 'absolute',
    textAlign: 'center',
    top: `calc(${height + 30}px / 2)`,
    width,
  })
);

export const StyledGaugeWrapperDiv = styled('div')<StyledGaugePercentProps>(
  ({ height, theme, width }) => ({
    height: `calc(${height}px + ${theme.spacing(3.75)})`,
    position: 'relative',
    width,
  })
);

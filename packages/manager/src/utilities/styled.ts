import isPropValid from '@emotion/is-prop-valid';
import { styled as _styled } from '@mui/material/styles';

type StyledOptions = {
  label?: string;
  shouldForwardProp?: never;
  target?: string;
};

export const styled = (tag: any, options?: StyledOptions) => {
  return _styled(tag, {
    shouldForwardProp: (prop: string) => {
      return isPropValid(prop);
    },
    ...options,
  });
};

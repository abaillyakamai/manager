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
      // console.log(prop, tag.propTypes);
      // if (['classes', 'control', 'cx', 'sx'].includes(prop)) {
      //   return true;
      // }

      // If component is a string, it's a DOM element
      // In this case we only want to forward valid HTML props
      if (typeof tag === 'string') {
        // console.log('is string', prop, tag);
        return isPropValid(prop);
      }

      if (tag?.propTypes && !(prop in tag.propTypes || isPropValid(prop))) {
        return false;
      }

      return true;
    },
    ...options,
  });
};

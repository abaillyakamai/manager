import { styled } from '@mui/material/styles';

import { MenuItem } from 'src/components/MenuItem';

export const StyledSearchSuggestion = styled(MenuItem, {
  label: 'StyledSearchSuggestion',
})(({ theme }) => ({
  '&.MuiButtonBase-root': {
    '&:hover': {
      // everything inside the button except the tag
      '& *:not(.tag-container *)': {
        color: theme.color.white,
      },
    },
    margin: '0 !important',
    padding: '0 !important',
  },
}));

export const StyledSuggestionIcon = styled('div', {
  label: 'StyledSuggestionIcon',
})(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  marginLeft: theme.spacing(1.5),
  padding: theme.spacing(),
}));

export const StyledSuggestionTitle = styled('div', {
  label: 'StyledSuggestionTitle',
})(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: theme.font.bold,
  fontSize: '1rem',
  wordBreak: 'break-all',
}));

export const StyledSegment = styled('span', {
  label: 'StyledSegment',
})(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const StyledSuggestionDescription = styled('div', {
  label: 'StyledSuggestionDescription',
})(({ theme }) => ({
  color: theme.color.headline,
  fontSize: '.75rem',
  marginTop: 2,
}));

export const StyledTagContainer = styled('div', {
  label: 'StyledTagContainer',
})(({ theme }) => ({
  '& .MuiChip-label': {
    '&:hover': {
      border: `1px solid ${theme.color.white}`,
    },
    border: `1px solid transparent`,
    paddingTop: 5,
  },
  '& > div': {
    margin: '2px',
  },
  alignItems: 'center',

  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  paddingRight: 8,
}));

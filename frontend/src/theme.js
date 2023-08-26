import { createTheme, alpha, getContrastRatio } from '@mui/material/styles';

const violetBase = '#DAD2E9';
const violetMain = alpha(violetBase, 0.7);

export const theme = createTheme({
  palette: {
    violet: {
      main: violetMain,
      light: alpha(violetBase, 0.5),
      dark: alpha(violetBase, 0.9),
      contrastText: getContrastRatio(violetMain, '#fff') > 4.5 ? '#fff' : '#111',
    },
  },
});
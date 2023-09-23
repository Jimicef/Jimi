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
    darkViolet: {
      main: '#af9dcf'
    },
    deepDarkViolet: {
      main: '#795baf'
    },
    yellow: {
      main: '#f5d2b3'
    }
  },
  typography: {
    fontFamily: "'Noto Sans KR', serif",
    // 여기에 다른 폰트 관련 설정도 추가할 수 있습니다.
  }
});
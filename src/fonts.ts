import {loadFont} from '@remotion/google-fonts/NotoSansTC';

const loaded = loadFont('normal', {
  weights: ['400', '600', '700'],
  subsets: ['chinese-traditional', 'latin'],
});

export const ybsFontFamily = loaded.fontFamily;

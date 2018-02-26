import Typography from 'typography'
import theme from 'typography-theme-parnassus';

theme.headerFontFamily = ['Eczar', 'serif',  'monospace'];
theme.baseFontSize = '18px';
theme.bodyColor = '#555';

const typography = new Typography(theme);

export default typography;

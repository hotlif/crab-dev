import BarChart from './barChart.js';

export type { BarChartProps, BarChartSeries, BarClickInfo, BarChartReferenceLine } from './types.js';
export type { BarChartPalette } from './palette.js';
export {
    CATEGORICAL_PALETTE,
    DEFAULT_BAR_CHART_PALETTE,
    SEMANTIC_BAR_CHART_PALETTE,
} from './palette.js';
export { vars as TokenVars } from './token.js';
export default BarChart;

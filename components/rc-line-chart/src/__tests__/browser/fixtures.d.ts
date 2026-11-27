declare module '*/esm/index.mjs' {
    const LineChart: typeof import('../../lineChart.js')['default'];
    export default LineChart;
}

declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

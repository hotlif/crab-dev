declare module '*/esm/index.mjs' {
    const PieChart: typeof import('../../pieChart.js')['default'];
    export default PieChart;
}

declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

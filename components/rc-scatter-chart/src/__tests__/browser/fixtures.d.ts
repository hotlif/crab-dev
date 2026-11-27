declare module '*/esm/index.mjs' {
    const ScatterChart: typeof import('../../scatterChart.js')['default'];
    export default ScatterChart;
}

declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

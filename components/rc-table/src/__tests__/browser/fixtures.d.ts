declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

// Keep ordinary typechecking independent of a previous ESM fixture build.
// Default behavior tests still import concrete source modules.
declare module '*/esm/index.mjs' {
    const Table: typeof import('../../table.js')['default'];
    export default Table;
}

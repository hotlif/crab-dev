declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

// Source checks retain the real component type without requiring built fixtures.
// Browser execution still loads the published ESM and extracted CSS.
declare module '*/esm/index.mjs' {
    const Segmented: typeof import('../../segmented.js')['default'];
    export default Segmented;
}

declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

declare module '*/esm/index.mjs' {
    const Divider: typeof import('../../divider.js')['default'];
    export default Divider;
}

declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

// Ordinary typechecking must not require a previous fixture build.
declare module '*/esm/index.mjs' {
    const Masonry: typeof import('../../masonry.js')['default'];
    export default Masonry;
}

declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

// Typecheck does not require a previous published fixture build.
declare module '*/esm/index.mjs' {
    const Component: typeof import('../../pagination.js')['default'];
    export default Component;
}

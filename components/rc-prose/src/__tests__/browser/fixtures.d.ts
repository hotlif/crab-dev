declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

// This exception is limited to the published-CSS regression. Source behavior
// remains covered by the ordinary DOM suite.
declare module '*/esm/index.mjs' {
    const Prose: typeof import('../../prose.js')['default'];
    export const TokenVars: typeof import('../../token.js')['vars'];
    export default Prose;
}

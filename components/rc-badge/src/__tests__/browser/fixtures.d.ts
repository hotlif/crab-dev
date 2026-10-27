declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

declare module '*/esm/index.mjs' {
    const Badge: typeof import('../../badge.js')['default'];
    export default Badge;
}

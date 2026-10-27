declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

declare module '*/esm/index.mjs' {
    const Skeleton: typeof import('../../skeleton.js')['default'];
    const TokenVars: typeof import('../../token.js')['vars'];
    export default Skeleton;
    export { TokenVars };
}

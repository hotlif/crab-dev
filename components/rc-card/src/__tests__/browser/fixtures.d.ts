declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

declare module '*/.cache/loading-demo.mjs' {
    const LoadingDemo: () => import('react').ReactElement;
    export default LoadingDemo;
}

// Keep published-runtime tests type-safe before their fixture build exists.
declare module '*/esm/index.mjs' {
    const Card: typeof import('../../card.js')['default'];
    const TokenVars: typeof import('../../token.js')['vars'];
    export default Card;
    export { TokenVars };
}

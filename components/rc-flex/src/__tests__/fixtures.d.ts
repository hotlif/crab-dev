declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

// Typecheck can run independently of the build that supplies browser fixtures.
declare module '*/esm/index.mjs' {
    const Flex: typeof import('../flex.js')['default'];
    export default Flex;
}

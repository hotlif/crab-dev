declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

// Ordinary typechecking must not require a previous browser fixture build.
declare module '*/esm/index.mjs' {
    const NumberEdit: typeof import('../../numberEdit.js')['default'];
    export default NumberEdit;
}

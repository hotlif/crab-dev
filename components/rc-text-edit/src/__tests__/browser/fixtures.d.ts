declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

// Ordinary source typechecking does not require a prior browser fixture build.
// Runtime geometry tests still import the actual built ESM rather than a mock.
declare module '*/esm/index.mjs' {
    const TextEdit: typeof import('../../textEdit.js')['default'];
    export default TextEdit;
}

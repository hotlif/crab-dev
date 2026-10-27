declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

// This geometry suite consumes the generated entry; DOM tests use source files.
declare module '*/esm/index.mjs' {
    const CronPicker: typeof import('../../cronPicker.js')['default'];
    export default CronPicker;
}

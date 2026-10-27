declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

// Ordinary typechecking must not require a previous fixture build.
declare module '*/esm/index.mjs' {
    const ColorPicker: typeof import('../../colorPicker/colorPicker.js')['default'];
    export default ColorPicker;
    export const ColorPickerPanel: typeof import('../../panels/colorPickerPanel.js')['default'];
}

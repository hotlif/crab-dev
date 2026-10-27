declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}
declare module '*/esm/index.mjs' {
    const DropdownContainer: typeof import('../../dropdownContainer.js')['default'];
    export default DropdownContainer;
    export const useDropdownContext: typeof import('../../context.js')['useDropdownContext'];
}

declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

// Typechecking does not require a previous library fixture build.
declare module '*/esm/index.mjs' {
    const Menu: typeof import('../../menu.js')['default'];
    export default Menu;
    export const MenuItemType: typeof import('../../type.js')['ItemType'];
}

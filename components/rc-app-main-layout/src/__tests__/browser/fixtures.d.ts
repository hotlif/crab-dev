declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}
declare module '*/esm/index.mjs' {
    const Layout: typeof import('../../layout.js')['default'];
    export const AppMainLayoutProvider: typeof import('../../context.js')['default'];
    export const useAppMainLayoutTabs: typeof import('../../useTabs.js')['default'];
    export default Layout;
}

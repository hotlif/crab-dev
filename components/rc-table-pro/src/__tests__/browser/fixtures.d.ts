declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

declare module '*/.cache/sidebar-demo.mjs' {
    const ActualSidebarDemo: () => import('react').ReactElement;
    export default ActualSidebarDemo;
}

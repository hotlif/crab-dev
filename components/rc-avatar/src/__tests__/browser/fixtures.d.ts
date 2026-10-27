declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

// Keep package typecheck independent of a previous published fixture build.
declare module '*/esm/index.mjs' {
    const Avatar: typeof import('../../avatar.js')['default'];
    const AvatarGroup: typeof import('../../avatar-group.js')['default'];
    const TokenVars: typeof import('../../token.js')['vars'];
    export { AvatarGroup, TokenVars };
    export default Avatar;
}

declare module '*/.cache/group-demo.mjs' {
    const GroupDemo: () => import('react').ReactElement;
    export default GroupDemo;
}

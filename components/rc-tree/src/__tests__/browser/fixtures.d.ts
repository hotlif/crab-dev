declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

declare module '*/.cache/inline-edit-demo.mjs' {
    const InlineEditDemo: () => import('react').ReactElement;
    export const CustomInput: typeof import('../../../docs/demos/inline-edit.demo.js')['CustomInput'];
    export const useKeyboardEditFocus: typeof import('../../../docs/demos/inline-edit.demo.js')['useKeyboardEditFocus'];
    export default InlineEditDemo;
}

// Only this published-layout regression imports the generated entry. The default
// DOM suite imports concrete source modules and verifies state/event behavior.
declare module '*/esm/index.mjs' {
    const Tree: typeof import('../../tree.js')['default'];
    export const NodeType: typeof import('../../type.js')['NodeType'];
    export const LoadStateType: typeof import('../../type.js')['LoadStateType'];
    export const NodeEditStateType: typeof import('../../type.js')['NodeEditStateType'];
    export const TokenVars: typeof import('../../token.js')['vars'];
    export default Tree;
}

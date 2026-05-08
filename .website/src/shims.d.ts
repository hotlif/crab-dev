declare module "react-syntax-highlighter" {
    import type { ComponentType, CSSProperties, ReactNode } from "react";
    interface HighlighterProps {
        language?: string;
        style?: Record<string, CSSProperties>;
        wrapLongLines?: boolean;
        customStyle?: CSSProperties;
        codeTagProps?: { style?: CSSProperties };
        children?: ReactNode;
    }
    export const Prism: ComponentType<HighlighterProps>;
}

declare module "react-syntax-highlighter/dist/esm/styles/prism/one-light.js" {
    const style: Record<string, import("react").CSSProperties>;
    export default style;
}

declare module "react-syntax-highlighter/dist/esm/styles/prism/one-dark.js" {
    const style: Record<string, import("react").CSSProperties>;
    export default style;
}

// Demo files imported via webpack alias `@@/` from generated loader map.
declare module "@@/../components/*" {
    import type { ComponentType } from "react";
    const Demo: ComponentType;
    export default Demo;
}

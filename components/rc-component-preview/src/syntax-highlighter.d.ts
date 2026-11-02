// The dependency's published declarations omit the .js entry points and the
// CommonJS default wrapper observed by native ESM consumers.
declare module 'react-syntax-highlighter/dist/cjs/prism-light.js' {
    import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism-light';
    const entry: typeof SyntaxHighlighter | { default: typeof SyntaxHighlighter };
    export default entry;
}

declare module 'react-syntax-highlighter/dist/cjs/languages/prism/*.js' {
    interface PrismLanguage {
        (syntax: unknown): void;
        displayName: string;
        aliases?: readonly string[];
    }
    const entry: PrismLanguage | { default: PrismLanguage };
    export default entry;
}

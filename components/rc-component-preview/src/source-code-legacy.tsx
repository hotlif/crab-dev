import { createElement } from 'react';
import { Prism } from 'react-syntax-highlighter';
import type { SyntaxHighlighterProps } from 'react-syntax-highlighter';

// Keep every previously supported language and alias. The full language graph
// is imported only for languages outside the small documentation fast path.
export default function LegacySourceCode(props: SyntaxHighlighterProps) {
    return createElement(Prism, props);
}

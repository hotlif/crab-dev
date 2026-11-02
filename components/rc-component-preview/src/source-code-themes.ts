import type { CSSProperties } from 'react';
import token from './token.js';

const codeLayout: CSSProperties = {
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    hyphens: 'none',
};

// Code themes are independent of the live preview's nearest design boundary.
// Keep every Prism token on the same paired palette as its source surface.
function createTheme(tokens: Readonly<Record<keyof typeof token.source.syntax.light, Readonly<{ color: string }>>>): Record<string, CSSProperties> {
    const palette = {
        foreground: tokens.foreground.color,
        comment: tokens.comment.color,
        keyword: tokens.keyword.color,
        string: tokens.string.color,
        number: tokens.number.color,
        function: tokens.function.color,
        tag: tokens.tag.color,
    };
    return {
        'code[class*="language-"]': { ...codeLayout, color: palette.foreground, textShadow: 'none' },
        'pre[class*="language-"]': { ...codeLayout, color: palette.foreground, background: 'transparent', textShadow: 'none' },
        comment: { color: palette.comment },
        prolog: { color: palette.comment },
        doctype: { color: palette.comment },
        cdata: { color: palette.comment },
        punctuation: { color: palette.foreground },
        operator: { color: palette.foreground },
        entity: { color: palette.foreground },
        variable: { color: palette.foreground },
        keyword: { color: palette.keyword },
        atrule: { color: palette.keyword },
        builtin: { color: palette.keyword },
        string: { color: palette.string },
        char: { color: palette.string },
        url: { color: palette.string },
        inserted: { color: palette.string },
        'attr-value': { color: palette.string },
        number: { color: palette.number },
        boolean: { color: palette.number },
        constant: { color: palette.number },
        regex: { color: palette.number },
        property: { color: palette.number },
        'attr-name': { color: palette.number },
        function: { color: palette.function },
        'function-variable': { color: palette.function },
        'class-name': { color: palette.function },
        tag: { color: palette.tag },
        selector: { color: palette.tag },
        deleted: { color: palette.tag },
        important: { color: palette.keyword, fontWeight: 'bold' },
        bold: { fontWeight: 'bold' },
        italic: { fontStyle: 'italic' },
        namespace: { color: palette.foreground },
    };
}

export const sourceCodeThemes = {
    light: createTheme(token.source.syntax.light),
    dark: createTheme(token.source.syntax.dark),
};

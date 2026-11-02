import { createElement, lazy, Suspense } from 'react';
import { LightPrism, lightLanguages } from './source-code-languages.js';
import token from './token.js';
import { sourceCodeThemes } from './source-code-themes.js';
import type { PreviewCodeTheme } from './preview.js';

const LegacySourceCode = lazy(() => import('./source-code-legacy.js'));

interface SourceCodeProps {
    readonly sourceCode: string;
    readonly language: string;
    readonly codeTheme: PreviewCodeTheme;
}

const prismCustomStyle = {
    margin: 0,
    padding: `${token.source['padding-block']} 0`,
    background: 'transparent',
    fontSize: token.source['font-size'],
    fontFamily: token.source['font-family'],
    lineHeight: token.source['line-height'],
    tabSize: token.source['tab-size'],
    MozTabSize: token.source['tab-size'],
    textShadow: 'none',
} as const;

const prismCodeTagProps = {
    style: {
        fontFamily: token.source['font-family'],
        fontSize: token.source['font-size'],
        lineHeight: token.source['line-height'],
    },
} as const;

const prismLineNumberStyle = {
    minWidth: token.source.gutter['min-width'],
    paddingRight: token.source.gutter['padding-right'],
    marginRight: token.source.gutter['margin-right'],
    color: token.source.gutter.color,
    textAlign: 'right' as const,
    userSelect: 'none' as const,
    fontVariantNumeric: 'tabular-nums' as const,
};

export function SourceCode({ sourceCode, language, codeTheme }: SourceCodeProps) {
    const prismProps = {
        language,
        style: sourceCodeThemes[codeTheme],
        wrapLongLines: false,
        showLineNumbers: true,
        lineNumberStyle: prismLineNumberStyle,
        customStyle: prismCustomStyle,
        codeTagProps: { ...prismCodeTagProps, 'data-source-language': language },
        children: sourceCode,
    };
    // Wake 0.1.23 的 CJS 转换会破坏具名懒加载模块中的 JSX；createElement 可保持双产物一致。
    if (lightLanguages.has(language)) return createElement(LightPrism, prismProps);
    return createElement(Suspense, {
        fallback: createElement(LightPrism, {
            ...prismProps,
            language: 'text',
            codeTagProps: { ...prismProps.codeTagProps, 'aria-busy': true },
        }),
        children: createElement(LegacySourceCode, prismProps),
    });
}

import { createElement } from 'react';
import { Prism } from 'react-syntax-highlighter';
// @ts-expect-error: 第三方库类型定义不全；CJS 子路径同时兼容 Wake 的 ESM 与 CommonJS 产物。
import oneLight from 'react-syntax-highlighter/dist/cjs/styles/prism/one-light.js';
// @ts-expect-error: 第三方库类型定义不全；CJS 子路径同时兼容 Wake 的 ESM 与 CommonJS 产物。
import oneDark from 'react-syntax-highlighter/dist/cjs/styles/prism/one-dark.js';
import token from './token.js';
import type { PreviewCodeTheme } from './preview.js';

interface SourceCodeProps {
    readonly sourceCode: string;
    readonly language: string;
    readonly codeTheme: PreviewCodeTheme;
}

const prismCustomStyle = {
    margin: 0,
    padding: `${token.source['padding-block']} 0`,
    background: 'transparent',
    fontSize: token.source.font.size,
    fontFamily: token.source.font.family,
    lineHeight: token.source['line-height'],
    tabSize: token.source['tab-size'],
    MozTabSize: token.source['tab-size'],
    textShadow: 'none',
} as const;

const prismCodeTagProps = {
    style: {
        fontFamily: token.source.font.family,
        fontSize: token.source.font.size,
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
        style: codeTheme === 'dark' ? oneDark : oneLight,
        wrapLongLines: true,
        showLineNumbers: true,
        lineNumberStyle: prismLineNumberStyle,
        customStyle: prismCustomStyle,
        codeTagProps: prismCodeTagProps,
        children: sourceCode,
    };
    // Wake 0.1.23 的 CJS 转换会破坏具名懒加载模块中的 JSX；createElement 可保持双产物一致。
    return createElement(Prism, prismProps);
}

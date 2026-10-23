export const meta = {
    title: "代码主题",
    description: "浅色和深色源码同时展开，核对语法颜色、背景与行号；实时按钮跟随页面主题。",
};

import Button from '@crab-dev/rc-button';
import { css } from '@crab-dev/css';
import Preview from '../../src/preview.js';
import token from '../../src/token.js';

const layoutStyle = css`display: grid; gap: ${token.stage.padding};`;

const sourceCode = `import Button from '@crab-dev/rc-button';

export function OpenMenuButton() {
    return (
        <Button appearance="outlined">
            Open Menu
        </Button>
    );
}
`;

const BaseDemo = () => (
    <div className={layoutStyle}>
    <Preview
        title="浅色源码"
        description="独立浅色源码背景与行号。"
        path="https://example.com"
        sourceCode={sourceCode}
        codeTheme="light"
        defaultExpanded
    >
        <Button appearance="outlined">Open Menu</Button>
    </Preview>
    <Preview title="深色源码" description="独立深色源码背景与行号。" sourceCode={sourceCode} codeTheme="dark" defaultExpanded>
        <Button appearance="outlined">Open Menu</Button>
    </Preview>
    </div>
);

export default BaseDemo;

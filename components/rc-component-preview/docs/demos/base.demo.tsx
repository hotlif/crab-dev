export const meta = {
    title: "Shortcuts",
    description: "卡片展示真实按钮，源码区默认收起，可通过工具栏展开；按钮随当前设计风格与主题切换。",
};

import Button from '@crab-dev/rc-button';
import Preview from '../../src/preview.js';

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
    <Preview
        title="Shortcuts"
        description="An outlined button that follows the current design, theme and component size."
        path="https://example.com"
        sourceCode={sourceCode}
    >
        <Button appearance="outlined">Open Menu</Button>
    </Preview>
);

export default BaseDemo;

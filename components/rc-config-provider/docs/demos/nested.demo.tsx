import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import ConfigProvider, { useConfig } from '../../src/index.js';

export const meta = {
    title: '嵌套设计风格与主题边界',
    description: '内层分别切换为 shadcn 浅色与 Apple 深色风格，未指定的主题、语言和尺寸继续继承父级。',
};

const panelStyle = css`
    padding: ${token.space['card-padding']};
    color: ${token.color.text.primary};
    background: ${token.color.background.surface};
    border-radius: ${token.radius.md};
`;

function Summary() {
    const { designSystem, colorMode, locale, size, density } = useConfig();
    return <p className={panelStyle}>{designSystem} / {colorMode} / {locale} / {size} / {density}</p>;
}

export default function NestedDemo() {
    return (
        <ConfigProvider designSystem="md3" colorMode="dark" locale="en-US" size="large" density="compact">
            <Summary />
            <ConfigProvider designSystem="shadcn" colorMode="light"><Summary /></ConfigProvider>
            <ConfigProvider designSystem="apple"><Summary /></ConfigProvider>
            <Summary />
        </ConfigProvider>
    );
}

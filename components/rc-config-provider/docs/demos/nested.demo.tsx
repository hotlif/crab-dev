import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import ConfigProvider, { useConfig } from '../../src/index.js';

export const meta = {
    title: '嵌套设计风格与主题边界',
    description: '内层切换为 shadcn 浅色风格，未指定的语言和尺寸继续继承父级。',
};

const panelStyle = css`
    padding: ${token.space['card-padding']};
    color: ${token.color.text.primary};
    background: ${token.color.background.surface};
    border-radius: ${token.radius.md};
`;

function Summary() {
    const { design, theme, locale, size } = useConfig();
    return <p className={panelStyle}>{design} / {theme} / {locale} / {size}</p>;
}

export default function NestedDemo() {
    return (
        <ConfigProvider design="material" theme="dark" locale="en-US" size="large">
            <Summary />
            <ConfigProvider design="shadcn" theme="light"><Summary /></ConfigProvider>
            <Summary />
        </ConfigProvider>
    );
}

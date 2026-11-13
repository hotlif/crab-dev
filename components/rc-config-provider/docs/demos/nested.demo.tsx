import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';

export const meta = {
    title: '嵌套配置与明暗边界',
    description: '内层分别覆盖明暗与尺寸，设计、语言和其他未指定配置继续继承父级。',
};

const panelStyle = css`
    padding: ${token.space['card-padding']};
    color: ${token.color.text.primary};
    background: ${token.color.background.surface};
    border-radius: ${token.radius.md};
`;

function Summary() {
    const config = useConfig();
    const { designSystem, colorMode, locale, size, density } = config;
    return <p className={panelStyle} data-resolved-config={JSON.stringify(config)}>{designSystem} / {colorMode} / {locale} / {size} / {density}</p>;
}

export default function NestedDemo() {
    return (
        <ConfigProvider colorMode="dark" locale="en-US" size="large" density="compact">
            <Summary />
            <ConfigProvider colorMode="light"><Summary /></ConfigProvider>
            <ConfigProvider size="small"><Summary /></ConfigProvider>
            <Summary />
        </ConfigProvider>
    );
}

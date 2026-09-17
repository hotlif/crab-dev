import { useState } from 'react';
import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';
import type { ConfigTheme, ConfigLocale, ConfigSize } from '@crab-dev/rc-config-provider';
import Button from '@crab-dev/rc-button';
import Empty from '@crab-dev/rc-empty';

const panelStyle = css`
    display: grid;
    gap: ${token.space['stack-gap']};
    padding: ${token.space['card-padding']};
    color: ${token.color.text.primary};
    background: ${token.color.background.surface};
    border-radius: ${token.radius.md};
    min-width: 0;
    overflow-wrap: anywhere;
`;

const controlsStyle = css`
    display: flex;
    flex-wrap: wrap;
    gap: ${token.space['component-gap']};
`;

function Preview() {
    const { theme, locale, size } = useConfig();
    return (
        <section className={panelStyle} aria-label="配置预览">
            <output aria-live="polite">{theme} / {locale} / {size}</output>
            <Empty />
            <div className={controlsStyle}>
                <Button appearance="primary">{locale === 'en-US' ? 'Default size' : '继承尺寸'}</Button>
                <Button size="small">{locale === 'en-US' ? 'Always small' : '固定小尺寸'}</Button>
            </div>
            <ConfigProvider theme="light">
                <div className={panelStyle}>
                    <strong>局部 Light：语言和尺寸继续继承</strong>
                    <Button>局部按钮</Button>
                </div>
            </ConfigProvider>
        </section>
    );
}

export default function Example() {
    const [theme, setTheme] = useState<ConfigTheme>('light');
    const [locale, setLocale] = useState<ConfigLocale>('zh-CN');
    const [size, setSize] = useState<ConfigSize>('middle');
    return (
        <div className={panelStyle}>
            <div className={controlsStyle} role="group" aria-label="主题">
                {(['light', 'dark'] as const).map(value => (
                    <Button key={value} isSelected={theme === value} onClick={() => setTheme(value)}>{value}</Button>
                ))}
            </div>
            <div className={controlsStyle} role="group" aria-label="语言">
                {(['zh-CN', 'en-US'] as const).map(value => (
                    <Button key={value} isSelected={locale === value} onClick={() => setLocale(value)}>{value}</Button>
                ))}
            </div>
            <div className={controlsStyle} role="group" aria-label="尺寸">
                {(['small', 'middle', 'large'] as const).map(value => (
                    <Button key={value} isSelected={size === value} onClick={() => setSize(value)}>{value}</Button>
                ))}
            </div>
            <ConfigProvider theme={theme} locale={locale} size={size}><Preview /></ConfigProvider>
        </div>
    );
}

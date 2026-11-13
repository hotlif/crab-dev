import { useId } from 'react';
import { css } from '@crab-dev/css';
import ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';
import token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';
import Switch from '@crab-dev/rc-switch';

export const meta = { title: '当前主题的交互状态', description: '观察当前主题下的选中、禁用和焦点反馈；示例继承文档配置，可直接操作。' };
const panel = css`
    display: grid;
    gap: ${token.space['component-gap']};
    padding: ${token.space['section-gap']};
    color: ${token.color.text.primary};
    background: ${token.color.surface.content};
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.radius.md};
`;
const stack = css`display: grid; gap: ${token.space['stack-gap']};`;
export default function DesignsDemo() {
    const { designSystem: design } = useConfig();
    const errorId = useId();
    return <div className={stack}>
        <ConfigProvider designSystem={design}>
            <section className={panel} aria-label={`${design} 开关`}>
                <strong>{designSystemRegistry[design].label}</strong>
                <Switch>开启通知</Switch>
                <Switch defaultChecked>自动同步</Switch>
                <Switch disabled>暂不可用</Switch>
                <Switch defaultChecked disabled>已开启且不可用</Switch>
                <Switch defaultChecked aria-invalid="true" aria-describedby={`${errorId}-${design}`}>云端备份</Switch>
                <small id={`${errorId}-${design}`}>备份失败，请检查连接后重试。</small>
            </section>
        </ConfigProvider>
    </div>;
}

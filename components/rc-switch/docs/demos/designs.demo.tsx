import { useId } from 'react';
import { css } from '@crab-dev/css';
import ConfigProvider from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import Switch from '../../src/switch.js';

export const meta = { title: '三套设计与状态', description: 'MD3 的手柄随选中和按压改变大小；macOS 与 shadcn 使用各自的紧凑轨道与等大的手柄。' };
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
    const errorId = useId();
    return <div className={stack}>
        {(['macos', 'material', 'shadcn'] as const).map(design => <ConfigProvider key={design} design={design}>
            <section className={panel} aria-label={`${design} 开关`}>
                <strong>{design === 'material' ? 'MD3' : design === 'macos' ? 'macOS' : 'shadcn'}</strong>
                <Switch>开启通知</Switch>
                <Switch defaultChecked>自动同步</Switch>
                <Switch disabled>暂不可用</Switch>
                <Switch defaultChecked disabled>已开启且不可用</Switch>
                <Switch defaultChecked aria-invalid="true" aria-describedby={`${errorId}-${design}`}>云端备份</Switch>
                <small id={`${errorId}-${design}`}>备份失败，请检查连接后重试。</small>
            </section>
        </ConfigProvider>)}
    </div>;
}

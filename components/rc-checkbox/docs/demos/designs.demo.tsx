import { useId } from 'react';
import { css } from '@crab-dev/css';
import ConfigProvider from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import Checkbox from '../../src/checkbox.js';

export const meta = { title: '三套设计与状态', description: '比较 macOS、MD3 与 shadcn 的方框、状态层和选中标记；用 Tab 与空格检查焦点和切换。' };
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
            <section className={panel} aria-label={`${design} 复选框`}>
                <strong>{design === 'material' ? 'MD3' : design === 'macos' ? 'macOS' : 'shadcn'}</strong>
                <Checkbox>未选中</Checkbox>
                <Checkbox defaultChecked>已选中</Checkbox>
                <Checkbox indeterminate>部分选中</Checkbox>
                <Checkbox disabled>不可用</Checkbox>
                <Checkbox defaultChecked disabled>已选中且不可用</Checkbox>
                <Checkbox aria-invalid="true" aria-describedby={`${errorId}-${design}`}>同意使用条款</Checkbox>
                <small id={`${errorId}-${design}`}>请勾选条款后继续。</small>
            </section>
        </ConfigProvider>)}
    </div>;
}

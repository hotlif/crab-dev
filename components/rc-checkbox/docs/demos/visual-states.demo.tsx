import { css } from '@crab-dev/css';
import Checkbox from '@crab-dev/rc-checkbox';
import token from '@crab-dev/rc-token-semantic';

export const meta = {
    title: '禁用与半选组合',
    description: '对照未选中、选中和半选的禁用表现；禁用项不可通过鼠标或键盘改变。',
};

const layout = css`
    display: grid;
    gap: ${token.space['group-gap']};
`;

export default function VisualStatesDemo() {
    return <section className={layout} aria-label="禁用复选框状态">
        <div data-demo-state="unchecked-disabled"><Checkbox disabled>未选中且不可用</Checkbox></div>
        <div data-demo-state="checked-disabled"><Checkbox checked disabled>已选中且不可用</Checkbox></div>
        <div data-demo-state="mixed-disabled"><Checkbox indeterminate disabled>部分选中且不可用</Checkbox></div>
    </section>;
}

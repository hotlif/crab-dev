import { css } from '@crab-dev/css';
import LineEdit from '@crab-dev/rc-line-edit';
import token from '@crab-dev/rc-token-semantic';

export const meta = {
    title: '填充字段的空值与内容',
    description: '比较 filled 字段的空值、已有内容和只读状态；使用 Tab 检查标签与焦点边界。',
};

const layout = css`
    display: grid;
    gap: ${token.space['group-gap']};
    max-width: calc(${token.size['40']} * 12);
`;

export default function VisualStatesDemo() {
    return <section className={layout} aria-label="填充输入字段状态">
        <div data-demo-state="filled-empty"><LineEdit appearance="filled" label="新项目名称" placeholder="请输入项目名称" supportingText="名称会显示在项目列表中。" allowClear /></div>
        <div data-demo-state="filled-value"><LineEdit appearance="filled" label="已有项目名称" defaultValue="团队设计工作台" supportingText="可编辑或清除已有内容。" allowClear /></div>
        <div data-demo-state="filled-readonly"><LineEdit appearance="filled" label="归档项目名称" value="组件库规范归档" readOnly supportingText="内容可选择与复制。" /></div>
    </section>;
}

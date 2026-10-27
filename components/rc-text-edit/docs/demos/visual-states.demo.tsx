import { css } from '@crab-dev/css';
import TextEdit from '@crab-dev/rc-text-edit';
import token from '@crab-dev/rc-token-semantic';

export const meta = {
    title: '只读多行字段',
    description: '只读字段仍可聚焦、选择和复制；分别核对 outlined 与 filled 的标签、内容和计数。',
};

const layout = css`
    display: grid;
    gap: ${token.space['group-gap']};
    max-width: calc(${token.size['40']} * 12);
`;

export default function VisualStatesDemo() {
    return <section className={layout} aria-label="只读多行字段状态">
        <div data-demo-state="outlined-readonly"><TextEdit appearance="outlined" label="归档说明" value={'项目已经归档。\n这段说明可以选择和复制，不能编辑。'} rows={3} readOnly showCount maxLength={200} supportingText="联系管理员申请恢复编辑权限。" /></div>
        <div data-demo-state="filled-readonly"><TextEdit appearance="filled" label="审核记录" value="审核已完成，所有参与者都可以查看这份记录。" rows={3} readOnly showCount maxLength={200} supportingText="只读状态不会显示清除操作。" allowClear /></div>
    </section>;
}

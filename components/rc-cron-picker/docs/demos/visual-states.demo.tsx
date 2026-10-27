import { css } from '@crab-dev/css';
import CronPicker from '@crab-dev/rc-cron-picker';
import token from '@crab-dev/rc-token-semantic';

export const meta = {
    title: '只读与填充计划字段',
    description: '只读计划可聚焦和复制，但不会打开编辑面板；填充字段保留正常编辑和校验反馈。',
};

const layout = css`
    display: grid;
    gap: ${token.space['group-gap']};
    max-width: calc(${token.size['40']} * 12);
`;

export default function VisualStatesDemo() {
    return <section className={layout} aria-label="计划字段状态">
        <div data-demo-state="outlined-readonly"><CronPicker label="固定执行计划" value="30 9 * * 1-5" readOnly supportingText="工作日上午 9:30 执行，由管理员维护。" /></div>
        <div data-demo-state="filled-value"><CronPicker appearance="filled" label="可编辑执行计划" defaultValue="0 10 * * *" supportingText="点击字段编辑计划。" /></div>
        <div data-demo-state="filled-readonly"><CronPicker appearance="filled" label="归档执行计划" value="0 8 * * 1" readOnly supportingText="每周一上午 8:00 执行。" /></div>
    </section>;
}

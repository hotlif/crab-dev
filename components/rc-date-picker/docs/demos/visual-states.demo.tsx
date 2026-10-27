import { css } from '@crab-dev/css';
import DatePicker, { DateTimePicker, TimePicker } from '@crab-dev/rc-date-picker';
import token from '@crab-dev/rc-token-semantic';

export const meta = {
    title: '选择器字段状态',
    description: '日期、时间和日期时间字段分别展示禁用、错误、警告与 filled 外观，面板操作沿用各选择器协议。',
};

const layout = css`
    display: grid;
    gap: ${token.space['section-gap']};
    max-width: calc(${token.size['40']} * 12);
`;
const group = css`
    display: grid;
    gap: ${token.space['group-gap']};
`;

export default function VisualStatesDemo() {
    return <div className={layout}>
        <section className={group} aria-label="日期字段状态">
            <div data-demo-state="date-disabled"><DatePicker label="不可用日期" disabled supportingText="此记录暂不允许调整日期。" /></div>
            <div data-demo-state="date-error"><DatePicker label="必填日期" required errorText="请选择计划日期。" /></div>
            <div data-demo-state="date-warning"><DatePicker label="待确认日期" status="warning" supportingText="请确认日期是否与团队排期一致。" /></div>
            <div data-demo-state="date-filled"><DatePicker label="填充日期" appearance="filled" supportingText="点击字段选择日期。" /></div>
        </section>
        <section className={group} aria-label="时间字段状态">
            <div data-demo-state="time-disabled"><TimePicker label="不可用时间" defaultValue={{ hour: 9, minute: 30, second: 0 }} disabled /></div>
            <div data-demo-state="time-error"><TimePicker label="必填时间" required errorText="请选择开始时间。" /></div>
            <div data-demo-state="time-warning"><TimePicker label="待确认时间" defaultValue={{ hour: 18, minute: 0, second: 0 }} status="warning" supportingText="该时间可能超出团队工作时段。" /></div>
            <div data-demo-state="time-filled"><TimePicker label="填充时间" appearance="filled" defaultValue={{ hour: 10, minute: 15, second: 0 }} /></div>
        </section>
        <section className={group} aria-label="日期时间字段状态">
            <div data-demo-state="datetime-disabled"><DateTimePicker label="不可用日期时间" disabled /></div>
            <div data-demo-state="datetime-error"><DateTimePicker label="必填日期时间" required errorText="请选择完整的日期与时间。" /></div>
            <div data-demo-state="datetime-warning"><DateTimePicker label="待确认日期时间" status="warning" supportingText="请与参与者确认可用时间。" /></div>
            <div data-demo-state="datetime-filled"><DateTimePicker label="填充日期时间" appearance="filled" /></div>
        </section>
    </div>;
}

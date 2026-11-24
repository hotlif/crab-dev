import { css } from '@crab-dev/css';
import { useState } from 'react';
import Button from '@crab-dev/rc-button';
import NumberEdit, { type NumberEditAdjustment } from '../../src/index.js';

export const meta = {
    title: '确认数值与调整反馈',
    description: '修改巡检告警阈值并按 Enter，或离开字段。试用超限、舍入、空值及无效文本。',
};

const form = css`display: grid; gap: 0.5rem; inline-size: min(100%, 22rem);`;
const adjustments: Record<NumberEditAdjustment, string> = {
    invalid: '数值格式无效',
    min: '已调整到下限',
    max: '已调整到上限',
    precision: '已按一位小数舍入',
};

export default function ConfirmNumber() {
    const [status, setStatus] = useState('');
    const [submitted, setSubmitted] = useState<string | null>(null);
    return <form className={form} onSubmit={event => {
        event.preventDefault();
        setSubmitted(String(new FormData(event.currentTarget).get('threshold') ?? ''));
    }}>
        <NumberEdit
            label="告警阈值" name="threshold" suffix="%" defaultValue={30}
            min={0} max={100} precision={1} step={0.5} largeStep={5}
            onValueCommit={(value, detail) => setStatus(detail.adjustments.length
                ? detail.adjustments.map(adjustment => adjustments[adjustment]).join('，')
                : value === null ? '已确认空值' : '已确认数值')}
        />
        <output aria-label="调整反馈">{status}</output>
        <Button type="submit" appearance="primary">应用阈值</Button>
        {submitted !== null && <p>表单提交值 {submitted || '空值'}</p>}
    </form>;
}

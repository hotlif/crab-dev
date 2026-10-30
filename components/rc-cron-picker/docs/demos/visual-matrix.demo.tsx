import { css } from '@crab-dev/css';
import CronPicker from '@crab-dev/rc-cron-picker';
import { useConfig } from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import { useId, useState } from 'react';

export const meta = { title: '计划编辑状态矩阵', description: '真实文本草稿、五段式规则面板与只读查看，预览使用固定日期采集。' };
const frame = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; background: ${token.color.background.surface}; color: ${token.color.text.primary}; max-width: calc(${token.size[40]} * 14); min-width: 0;`;
export default function VisualMatrixDemo() {
    const { locale } = useConfig();
    const [state, setState] = useState('default');
    const [value, setValue] = useState('30 9 * * 1-5');
    const id = useId();
    const english = locale === 'en-US';
    return <section className={frame} aria-label="CronPicker visual matrix" data-visual-scene data-state={state}>
        <div><label htmlFor={id}>验收状态</label>{' '}<select id={id} value={state} onChange={event => setState(event.currentTarget.value)}>{['default', 'disabled', 'read-only', 'warning'].map(item => <option key={item}>{item}</option>)}</select></div>
        <CronPicker label={english ? 'Execution schedule' : '执行计划'} aria-label="执行计划" value={value} onValueChange={setValue} disabled={state === 'disabled'} readOnly={state === 'read-only'} status={state === 'warning' ? 'warning' : undefined} supportingText={english ? 'Five fields: minute, hour, day, month, weekday.' : '五段式：分、时、日、月、周。'} previewCount={3} />
        <CronPicker appearance="filled" label={english ? 'Archived schedule' : '归档计划'} aria-label="归档计划" value="0 8 * * 1" readOnly previewCount={0} />
        <output aria-live="polite">{value}</output>
    </section>;
}

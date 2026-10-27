import NumberEdit from '@crab-dev/rc-number-edit';
import Select from '@crab-dev/rc-select';
import { CheckableTag } from '@crab-dev/rc-tag';
import { css, cx } from '@crab-dev/css';
import { useId, type FC } from 'react';

import { CRON_FIELD_SPECS, type CronFieldKind, type CronFieldValue } from './cron.js';
import token from './token.js';
import { useCronLocale } from './locale.js';
import type { CronPickerChangeDetails } from './types.js';

const editorStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.field.gap};
    padding-block-start: ${token.field.gap};
    min-inline-size: 0;
`;

const parametersStyle = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(${token.field.parameter['min-width']}, 1fr));
    gap: ${token.field.parameter.gap};
    > * { min-inline-size: 0; }
`;

const inputStyle = css`
    inline-size: 100%;
    min-inline-size: 0;
`;

const hintStyle = css`
    margin: 0;
    color: ${token.field.hint.color};
    font-size: ${token.field.hint['font-size']};
    line-height: ${token.field.hint['line-height']};
`;

const selectionHeadingStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    flex-wrap: wrap;
    gap: ${token['mode-row'].gap};
    margin-block-end: ${token['value-grid'].gap};
    color: ${token['mode-row'].text.color};
    font-size: ${token['mode-row']['font-size']};
`;

const gridStyle = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(${token['value-grid']['min-width']}, 1fr));
    gap: ${token['value-grid'].gap};
    row-gap: calc(${token['value-grid'].target.padding} * 2);
    max-block-size: ${token['value-grid']['max-height']};
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: ${token['value-grid'].target.padding} ${token['value-grid']['padding-focus']};
    scrollbar-gutter: stable;
`;

const namedGridStyle = css`
    grid-template-columns: repeat(auto-fit, minmax(${token['value-grid'].named['min-width']}, 1fr));
`;

const gridTagStyle = css`
    justify-content: center;
    text-align: center;
    margin: 0;
    font-variant-numeric: tabular-nums;
    /* 保持 32px chip 外观，向上下扩展命中区至 48px；行距防止目标重叠。 */
    overflow: visible;
    &::before {
        content: '';
        position: absolute;
        inset-inline: 0;
        inset-block: calc(-1 * ${token['value-grid'].target.padding});
    }
    @media (pointer: coarse) {
        &::before { inset-block: 0; }
    }
`;

const DEFAULT_STEP: Record<CronFieldKind, number> = {
    minute: 5, hour: 2, dayOfMonth: 2, month: 3, dayOfWeek: 2,
};

const DEFAULT_RANGE: Record<CronFieldKind, [number, number]> = {
    minute: [0, 30], hour: [9, 18], dayOfMonth: [1, 15], month: [1, 6], dayOfWeek: [1, 5],
};

const defaultFieldValue = (mode: CronFieldValue['kind'], kind: CronFieldKind): CronFieldValue => {
    switch (mode) {
        case 'every':
            return { kind: 'every' };
        case 'step':
            return { kind: 'step', from: CRON_FIELD_SPECS[kind].min, step: DEFAULT_STEP[kind] };
        case 'range': {
            const [from, to] = DEFAULT_RANGE[kind];
            return { kind: 'range', from, to };
        }
        case 'list':
            // 空列表格式化为 *，会立即回到「每个」模式；以首个合法值开始。
            return { kind: 'list', values: [CRON_FIELD_SPECS[kind].min] };
    }
};


export interface FieldEditorProps {
    kind: CronFieldKind;
    value: CronFieldValue;
    disabled?: boolean;
    onChange: (next: CronFieldValue, event?: CronPickerChangeDetails['event']) => void;
}

const FieldEditor: FC<FieldEditorProps> = ({ kind, value, onChange, disabled }) => {
    const spec = CRON_FIELD_SPECS[kind];
    const messages = useCronLocale();
    const ui = messages.field(kind);
    const weekOptions = messages.weekdays.map((label, index) => ({ label, value: String(index) }));
    const selectionId = useId();
    const modeOptions = [
        { value: 'every', label: ui.everyLabel },
        ...(kind === 'dayOfWeek' ? [] : [{ value: 'step', label: messages.step }]),
        { value: 'range', label: messages.range },
        { value: 'list', label: messages.specified(ui.name) },
    ];
    const allValues = Array.from({ length: spec.max - spec.min + 1 }, (_, index) => spec.min + index);

    const toggleListValue = (n: number, event?: CronPickerChangeDetails['event']) => {
        if (disabled || value.kind !== 'list') return;
        const next = value.values.includes(n)
            ? value.values.filter((v) => v !== n)
            : [...value.values, n].sort((a, b) => a - b);
        // 不把取消最后一项悄悄解释为「每分钟」等更高频率的规则。
        if (next.length > 0) onChange({ kind: 'list', values: next }, event);
    };

    return (
        <div className={editorStyle}>
            <Select
                disabled={disabled}
                label={messages.mode(ui.name)}
                className={inputStyle}
                options={modeOptions}
                value={value.kind}
                onValueChange={(next) => {
                    if (next !== value.kind && (next === 'every' || next === 'step' || next === 'range' || next === 'list')) {
                        onChange(defaultFieldValue(next, kind));
                    }
                }}
            />
            {value.kind === 'every' ? (
                <p className={hintStyle}>{messages.unlimited(ui.name)}</p>
            ) : null}
            {value.kind === 'step' ? (
                <>
                    <div className={parametersStyle}>
                        <NumberEdit
                            disabled={disabled}
                            className={inputStyle}
                            label={messages.start(ui.name)}
                            controls={false}
                            precision={0}
                            min={spec.min}
                            max={spec.max}
                            value={value.from}
                            onValueChange={(n, details) => {
                                if (n !== null) onChange({ ...value, from: n }, details.event);
                            }}
                        />
                        <NumberEdit
                            disabled={disabled}
                            className={inputStyle}
                            label={messages.interval(ui.unit)}
                            controls={false}
                            precision={0}
                            min={1}
                            max={spec.max}
                            value={value.step}
                            onValueChange={(n, details) => {
                                if (n !== null) onChange({ ...value, step: n }, details.event);
                            }}
                        />
                    </div>
                    <p className={hintStyle}>{messages.stepHint(value.from, value.step, ui.unit, ui.suffix)}</p>
                </>
            ) : null}
            {value.kind === 'range' ? (
                <>
                    <div className={parametersStyle}>
                        {kind === 'dayOfWeek' ? (
                            <>
                                <Select
                                    disabled={disabled}
                                    className={inputStyle}
                                    label={messages.from(messages.names.dayOfWeek)}
                                    options={weekOptions}
                                    value={String(value.from)}
                                    onValueChange={(next) => {
                                        if (next !== null) {
                                            const from = Number(next);
                                            onChange({ kind: 'range', from, to: Math.max(from, value.to) });
                                        }
                                    }}
                                />
                                <Select
                                    disabled={disabled}
                                    className={inputStyle}
                                    label={messages.to(messages.names.dayOfWeek)}
                                    options={weekOptions}
                                    value={String(value.to)}
                                    onValueChange={(next) => {
                                        if (next !== null) {
                                            const to = Number(next);
                                            onChange({ kind: 'range', from: Math.min(value.from, to), to });
                                        }
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <NumberEdit
                                    disabled={disabled}
                                    className={inputStyle}
                                    label={messages.from(ui.name)}
                                    controls={false}
                                    precision={0}
                                    min={spec.min}
                                    max={value.to}
                                    value={value.from}
                                    onValueChange={(n, details) => {
                                        if (n !== null) onChange({ ...value, from: n }, details.event);
                                    }}
                                />
                                <NumberEdit
                                    disabled={disabled}
                                    className={inputStyle}
                                    label={messages.to(ui.name)}
                                    controls={false}
                                    precision={0}
                                    min={value.from}
                                    max={spec.max}
                                    value={value.to}
                                    onValueChange={(n, details) => {
                                        if (n !== null) onChange({ ...value, to: n }, details.event);
                                    }}
                                />
                            </>
                        )}
                    </div>
                    <p className={hintStyle}>{messages.rangeHint(ui.name)}</p>
                </>
            ) : null}
            {value.kind === 'list' ? (
                <div>
                    <div className={selectionHeadingStyle}>
                        <span id={selectionId}>{messages.choose(ui.name)}</span>
                        <span className={hintStyle}>{messages.selected(value.values.length)}</span>
                    </div>
                    <div
                        role="group"
                        aria-labelledby={selectionId}
                        className={cx(gridStyle, (kind === 'month' || kind === 'dayOfWeek') && namedGridStyle)}
                    >
                        {allValues.map((n) => (
                            <CheckableTag
                                disabled={disabled}
                                key={n}
                                className={gridTagStyle}
                                checked={value.values.includes(n)}
                                onCheckedChange={(_checked, details) => toggleListValue(n, details.event)}
                                aria-label={kind === 'month' ? ui.valueLabel(n) : `${ui.valueLabel(n)}${ui.suffix}`}
                            >
                                {ui.valueLabel(n)}
                            </CheckableTag>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default FieldEditor;

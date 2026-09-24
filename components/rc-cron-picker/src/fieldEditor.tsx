import NumberEdit from '@crab-dev/rc-number-edit';
import Select from '@crab-dev/rc-select';
import { CheckableTag } from '@crab-dev/rc-tag';
import { css, cx } from '@crab-dev/css';
import { useId, type FC } from 'react';

import { CRON_FIELD_SPECS, DOW_LABELS, type CronFieldKind, type CronFieldValue } from './cron.js';
import token from './token.js';

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

interface FieldUi {
    name: string;
    everyLabel: string;
    unit: string;
    suffix: string;
    valueLabel: (n: number) => string;
}

const FIELD_UI: Record<CronFieldKind, FieldUi> = {
    minute: { name: '分钟', everyLabel: '每分钟', unit: '分钟', suffix: '分', valueLabel: String },
    hour: { name: '小时', everyLabel: '每小时', unit: '小时', suffix: '时', valueLabel: String },
    dayOfMonth: { name: '日期', everyLabel: '每日', unit: '天', suffix: '日', valueLabel: String },
    month: { name: '月份', everyLabel: '每月', unit: '个月', suffix: '月', valueLabel: (n) => `${n}月` },
    dayOfWeek: { name: '星期', everyLabel: '不限星期', unit: '', suffix: '', valueLabel: (n) => DOW_LABELS[n] },
};

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

const WEEK_OPTIONS = DOW_LABELS.map((label, index) => ({ label, value: String(index) }));

export interface FieldEditorProps {
    kind: CronFieldKind;
    value: CronFieldValue;
    onChange: (next: CronFieldValue) => void;
}

const FieldEditor: FC<FieldEditorProps> = ({ kind, value, onChange }) => {
    const spec = CRON_FIELD_SPECS[kind];
    const ui = FIELD_UI[kind];
    const selectionId = useId();
    const modeOptions = [
        { value: 'every', label: ui.everyLabel },
        ...(kind === 'dayOfWeek' ? [] : [{ value: 'step', label: '固定间隔' }]),
        { value: 'range', label: '连续范围' },
        { value: 'list', label: `指定${ui.name}` },
    ];
    const allValues = Array.from({ length: spec.max - spec.min + 1 }, (_, index) => spec.min + index);

    const toggleListValue = (n: number) => {
        if (value.kind !== 'list') return;
        const next = value.values.includes(n)
            ? value.values.filter((v) => v !== n)
            : [...value.values, n].sort((a, b) => a - b);
        // 不把取消最后一项悄悄解释为「每分钟」等更高频率的规则。
        if (next.length > 0) onChange({ kind: 'list', values: next });
    };

    return (
        <div className={editorStyle}>
            <Select
                label={`${ui.name}设置方式`}
                className={inputStyle}
                options={modeOptions}
                value={value.kind}
                onChange={(next) => {
                    if (next !== value.kind && (next === 'every' || next === 'step' || next === 'range' || next === 'list')) {
                        onChange(defaultFieldValue(next, kind));
                    }
                }}
            />
            {value.kind === 'every' ? (
                <p className={hintStyle}>{ui.name}不设限制，使用全部{ui.name}。</p>
            ) : null}
            {value.kind === 'step' ? (
                <>
                    <div className={parametersStyle}>
                        <NumberEdit
                            className={inputStyle}
                            label={`起始${ui.name}`}
                            controls={false}
                            precision={0}
                            min={spec.min}
                            max={spec.max}
                            value={value.from}
                            onChange={(n) => {
                                if (n !== null) onChange({ ...value, from: n });
                            }}
                        />
                        <NumberEdit
                            className={inputStyle}
                            label={`间隔（${ui.unit}）`}
                            controls={false}
                            precision={0}
                            min={1}
                            max={spec.max}
                            value={value.step}
                            onChange={(n) => {
                                if (n !== null) onChange({ ...value, step: n });
                            }}
                        />
                    </div>
                    <p className={hintStyle}>从 {value.from}{ui.suffix} 开始，每隔 {value.step} {ui.unit}执行；每个周期重新计数。</p>
                </>
            ) : null}
            {value.kind === 'range' ? (
                <>
                    <div className={parametersStyle}>
                        {kind === 'dayOfWeek' ? (
                            <>
                                <Select
                                    className={inputStyle}
                                    label="开始星期"
                                    options={WEEK_OPTIONS}
                                    value={String(value.from)}
                                    onChange={(next) => {
                                        if (next !== null) {
                                            const from = Number(next);
                                            onChange({ kind: 'range', from, to: Math.max(from, value.to) });
                                        }
                                    }}
                                />
                                <Select
                                    className={inputStyle}
                                    label="结束星期"
                                    options={WEEK_OPTIONS}
                                    value={String(value.to)}
                                    onChange={(next) => {
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
                                    className={inputStyle}
                                    label={`开始${ui.name}`}
                                    controls={false}
                                    precision={0}
                                    min={spec.min}
                                    max={value.to}
                                    value={value.from}
                                    onChange={(n) => {
                                        if (n !== null) onChange({ ...value, from: n });
                                    }}
                                />
                                <NumberEdit
                                    className={inputStyle}
                                    label={`结束${ui.name}`}
                                    controls={false}
                                    precision={0}
                                    min={value.from}
                                    max={spec.max}
                                    value={value.to}
                                    onChange={(n) => {
                                        if (n !== null) onChange({ ...value, to: n });
                                    }}
                                />
                            </>
                        )}
                    </div>
                    <p className={hintStyle}>包含开始和结束值，范围内的每个{kind === 'dayOfWeek' ? '星期' : ui.name}都适用。</p>
                </>
            ) : null}
            {value.kind === 'list' ? (
                <div>
                    <div className={selectionHeadingStyle}>
                        <span id={selectionId}>选择{ui.name}</span>
                        <span className={hintStyle}>已选 {value.values.length} 项 · 至少保留 1 项</span>
                    </div>
                    <div
                        role="group"
                        aria-labelledby={selectionId}
                        className={cx(gridStyle, (kind === 'month' || kind === 'dayOfWeek') && namedGridStyle)}
                    >
                        {allValues.map((n) => (
                            <CheckableTag
                                key={n}
                                className={gridTagStyle}
                                checked={value.values.includes(n)}
                                onChange={() => toggleListValue(n)}
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

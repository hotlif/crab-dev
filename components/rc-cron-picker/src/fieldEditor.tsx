import NumberEdit from '@crab-dev/rc-number-edit';
import Radio, { RadioGroup } from '@crab-dev/rc-radio';
import Select from '@crab-dev/rc-select';
import { CheckableTag } from '@crab-dev/rc-tag';
import { css, cx } from '@crab-dev/css';
import { useId, type FC } from 'react';

import { CRON_FIELD_SPECS, DOW_LABELS, type CronFieldKind, type CronFieldValue } from './cron.js';
import token from './token.js';

// ─── Styles ──────────────────────────────────────────────────────────────────

const editorStyle = css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: ${token.field.gap};
    padding-block-start: ${token.field.gap};
    inline-size: 100%;
`;

const rowStyle = css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: ${token['mode-row'].gap};
    font-size: ${token['mode-row'].font.size};
    color: ${token['mode-row'].text.color};
    cursor: pointer;
    min-block-size: 24px;
    transition: opacity ${token.transition};

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

/* 非激活模式整行弱化(§1 示能:参数控件当前不可编辑),点击行内任意处即可切换过来 */
const rowInactiveStyle = css`
    opacity: ${token['mode-row']['opacity-inactive']};
`;

const numberStyle = css`
    inline-size: 76px;
`;

const weekSelectStyle = css`
    inline-size: 100px;
`;

/* 缩进与 radio 文本对齐,用接近性表达网格从属于"指定"模式(§3 映射) */
const gridStyle = css`
    display: grid;
    gap: ${token['value-grid'].gap};
    padding-inline-start: 24px;
`;

const gridColumnsMap = {
    6: css`grid-template-columns: repeat(6, 1fr);`,
    7: css`grid-template-columns: repeat(7, 1fr);`,
    8: css`grid-template-columns: repeat(8, 1fr);`,
    10: css`grid-template-columns: repeat(10, 1fr);`,
} as const;

const gridTagStyle = css`
    justify-content: center;
    text-align: center;
    margin: 0;
`;

// ─── 字段 UI 配置 ────────────────────────────────────────────────────────────

interface FieldUi {
    /** 字段中文名,用于 aria-label 与"指定"模式标签 */
    name: string;
    everyLabel: string;
    /** 步进模式的单位词;null 表示该字段不提供步进模式(星期) */
    stepUnit: string | null;
    /** 数值后面的量词,如 "分" / "日";星期用下拉不需要 */
    suffix: string;
    gridColumns: keyof typeof gridColumnsMap;
    valueLabel: (n: number) => string;
}

const FIELD_UI: Record<CronFieldKind, FieldUi> = {
    minute: { name: '分钟', everyLabel: '每分钟', stepUnit: '分钟', suffix: '分', gridColumns: 10, valueLabel: String },
    hour: { name: '小时', everyLabel: '每小时', stepUnit: '小时', suffix: '时', gridColumns: 8, valueLabel: String },
    dayOfMonth: { name: '日期', everyLabel: '每日', stepUnit: '天', suffix: '日', gridColumns: 8, valueLabel: String },
    month: { name: '月份', everyLabel: '每月', stepUnit: '个月', suffix: '月', gridColumns: 6, valueLabel: (n) => `${n}月` },
    dayOfWeek: {
        name: '星期',
        everyLabel: '不限星期',
        stepUnit: null,
        suffix: '',
        gridColumns: 7,
        valueLabel: (n) => DOW_LABELS[n],
    },
};

/** 切入步进模式时的初始步长:取各字段的常见用法,避免产出 * / 1 这类退化表达 */
const DEFAULT_STEP: Record<CronFieldKind, number> = {
    minute: 5,
    hour: 2,
    dayOfMonth: 2,
    month: 3,
    dayOfWeek: 2,
};

/** 切入区间模式时的初始区间:取贴近真实意图的值(如工作日、工作时段),而非退化的全域 */
const DEFAULT_RANGE: Record<CronFieldKind, [number, number]> = {
    minute: [0, 30],
    hour: [9, 18],
    dayOfMonth: [1, 15],
    month: [1, 6],
    dayOfWeek: [1, 5],
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
            return { kind: 'list', values: [] };
    }
};

const WEEK_OPTIONS = DOW_LABELS.map((label, index) => ({ label, value: String(index) }));

// ─── Component ───────────────────────────────────────────────────────────────

export interface FieldEditorProps {
    kind: CronFieldKind;
    value: CronFieldValue;
    onChange: (next: CronFieldValue) => void;
}

const FieldEditor: FC<FieldEditorProps> = ({ kind, value, onChange }) => {
    const spec = CRON_FIELD_SPECS[kind];
    const ui = FIELD_UI[kind];
    const mode = value.kind;
    // 原生 radio 靠同名 name 成组,方向键才能在模式选项间移动;五个字段编辑器
    // 同时挂载在各 Tab 面板中,name 必须互不相同,避免跨字段互串(§4.6 用 useId)
    const radioGroupName = useId();

    // 非当前模式的行展示各自的默认参数,选中该模式后以此为起点
    const stepView = value.kind === 'step' ? value : defaultFieldValue('step', kind);
    const rangeView = value.kind === 'range' ? value : defaultFieldValue('range', kind);
    const stepFrom = stepView.kind === 'step' ? stepView.from : spec.min;
    const stepStep = stepView.kind === 'step' ? stepView.step : 1;
    const rangeFrom = rangeView.kind === 'range' ? rangeView.from : spec.min;
    const rangeTo = rangeView.kind === 'range' ? rangeView.to : spec.max;
    const listValues = value.kind === 'list' ? value.values : [];

    const changeMode = (next: CronFieldValue['kind']) => {
        if (next !== mode) {
            onChange(defaultFieldValue(next, kind));
        }
    };

    // 点击网格值一步完成"切到指定模式 + 勾选该值";网格容器不设行级 onClick,
    // 避免同一事件里模式重置与取值更新相互覆盖
    const toggleListValue = (n: number) => {
        const next = listValues.includes(n)
            ? listValues.filter((v) => v !== n)
            : [...listValues, n].sort((a, b) => a - b);

        onChange({ kind: 'list', values: next });
    };

    const allValues: number[] = [];

    for (let n = spec.min; n <= spec.max; n += 1) {
        allValues.push(n);
    }

    return (
        <RadioGroup
            size="small"
            name={radioGroupName}
            value={mode}
            onChange={(next) => changeMode(next as CronFieldValue['kind'])}
        >
            <div className={editorStyle}>
                <div
                    className={cx(rowStyle, mode !== 'every' && rowInactiveStyle)}
                    onClick={() => changeMode('every')}
                >
                    <Radio value="every">{ui.everyLabel}</Radio>
                </div>

                {ui.stepUnit !== null ? (
                    <div
                        className={cx(rowStyle, mode !== 'step' && rowInactiveStyle)}
                        onClick={() => changeMode('step')}
                    >
                        <Radio value="step" aria-label={`按步进指定${ui.name}`}>
                            从
                        </Radio>
                        <NumberEdit
                            size="small"
                            className={numberStyle}
                            readOnly={mode !== 'step'}
                            min={spec.min}
                            max={spec.max}
                            value={stepFrom}
                            onChange={(n) => {
                                if (n !== null) {
                                    onChange({ kind: 'step', from: n, step: stepStep });
                                }
                            }}
                            aria-label={`${ui.name}步进起点`}
                        />
                        <span>{ui.suffix} 起,每</span>
                        <NumberEdit
                            size="small"
                            className={numberStyle}
                            readOnly={mode !== 'step'}
                            min={1}
                            max={spec.max}
                            value={stepStep}
                            onChange={(n) => {
                                if (n !== null) {
                                    onChange({ kind: 'step', from: stepFrom, step: n });
                                }
                            }}
                            aria-label={`${ui.name}步长`}
                        />
                        <span>{ui.stepUnit}</span>
                    </div>
                ) : null}

                <div
                    className={cx(rowStyle, mode !== 'range' && rowInactiveStyle)}
                    onClick={() => changeMode('range')}
                >
                    <Radio value="range" aria-label={`按区间指定${ui.name}`}>
                        从
                    </Radio>
                    {kind === 'dayOfWeek' ? (
                        <>
                            <Select
                                size="small"
                                className={weekSelectStyle}
                                disabled={mode !== 'range'}
                                options={WEEK_OPTIONS}
                                value={String(rangeFrom)}
                                onChange={(next) => {
                                    if (next !== undefined) {
                                        // 起点晚于终点时联动抬高终点,杜绝 5-1 这类非法区间(§5 防错优于报错)
                                        const from = Number(next);

                                        onChange({ kind: 'range', from, to: Math.max(from, rangeTo) });
                                    }
                                }}
                                aria-label="星期区间起点"
                            />
                            <span>到</span>
                            <Select
                                size="small"
                                className={weekSelectStyle}
                                disabled={mode !== 'range'}
                                options={WEEK_OPTIONS}
                                value={String(rangeTo)}
                                onChange={(next) => {
                                    if (next !== undefined) {
                                        const to = Number(next);

                                        onChange({ kind: 'range', from: Math.min(rangeFrom, to), to });
                                    }
                                }}
                                aria-label="星期区间终点"
                            />
                        </>
                    ) : (
                        <>
                            <NumberEdit
                                size="small"
                                className={numberStyle}
                                readOnly={mode !== 'range'}
                                min={spec.min}
                                max={rangeTo}
                                value={rangeFrom}
                                onChange={(n) => {
                                    if (n !== null) {
                                        onChange({ kind: 'range', from: n, to: rangeTo });
                                    }
                                }}
                                aria-label={`${ui.name}区间起点`}
                            />
                            <span>{ui.suffix} 到</span>
                            <NumberEdit
                                size="small"
                                className={numberStyle}
                                readOnly={mode !== 'range'}
                                min={rangeFrom}
                                max={spec.max}
                                value={rangeTo}
                                onChange={(n) => {
                                    if (n !== null) {
                                        onChange({ kind: 'range', from: rangeFrom, to: n });
                                    }
                                }}
                                aria-label={`${ui.name}区间终点`}
                            />
                            <span>{ui.suffix}</span>
                        </>
                    )}
                </div>

                <div
                    className={cx(rowStyle, mode !== 'list' && rowInactiveStyle)}
                    onClick={() => changeMode('list')}
                >
                    <Radio value="list">指定{ui.name}</Radio>
                </div>
                <div
                    role="group"
                    aria-label={`指定${ui.name}的值`}
                    className={cx(gridStyle, gridColumnsMap[ui.gridColumns], mode !== 'list' && rowInactiveStyle)}
                >
                    {allValues.map((n) => (
                        <CheckableTag
                            key={n}
                            className={gridTagStyle}
                            checked={listValues.includes(n)}
                            onChange={() => toggleListValue(n)}
                            aria-label={`${ui.valueLabel(n)}${ui.suffix}`}
                        >
                            {ui.valueLabel(n)}
                        </CheckableTag>
                    ))}
                </div>
            </div>
        </RadioGroup>
    );
};

export default FieldEditor;

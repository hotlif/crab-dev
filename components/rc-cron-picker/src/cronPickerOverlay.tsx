import { useInterval } from '@crab-dev/rc-hooks';
import Tabs from '@crab-dev/rc-tabs';
import { css } from '@crab-dev/css';
import { useState, type FC } from 'react';

import {
    CRON_FIELD_ORDER,
    describeCron,
    DOW_LABELS,
    formatCron,
    nextOccurrences,
    pad2,
    type CronFieldKind,
    type CronFieldValue,
    type CronValue,
} from './cron.js';
import FieldEditor from './fieldEditor.js';
import token from './token.js';

// ─── Styles ──────────────────────────────────────────────────────────────────

const overlayStyle = css`
    inline-size: ${token.overlay.width};
    padding: ${token.overlay.padding};
    box-sizing: border-box;
`;

const footerStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token['mode-row'].gap};
    margin-block-start: ${token.field.gap};
    padding-block-start: ${token.field.gap};
    border-block-start: 1px solid ${token.divider.color};
`;

const expressionStyle = css`
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Consolas, monospace;
    font-size: ${token.expression['font-size']};
    color: ${token.expression.color};
    background-color: ${token.expression.background};
    border-radius: ${token.expression.radius};
    padding: ${token.expression.padding};
    text-align: center;
    letter-spacing: 0.08em;
    user-select: all;
    /* 指定值很多时(如几十个分钟值)表达式可能超宽,折行展示而非撑破弹层 */
    overflow-wrap: anywhere;
`;

const describeStyle = css`
    color: ${token.describe.color};
    font-size: ${token.describe.font.size};
`;

const previewStyle = css`
    color: ${token.preview.color};
    font-size: ${token.preview.font.size};

    ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    li {
        color: ${token.preview.time.color};
        font-variant-numeric: tabular-nums;
        line-height: 1.8;
    }
`;

// ─── Component ───────────────────────────────────────────────────────────────

const TAB_LABELS: Record<CronFieldKind, string> = {
    minute: '分钟',
    hour: '小时',
    dayOfMonth: '日',
    month: '月',
    dayOfWeek: '周',
};

const formatDateTime = (d: Date): string =>
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${DOW_LABELS[d.getDay()]} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

export interface CronPickerOverlayProps {
    overlayId: string;
    cronValue: CronValue;
    previewCount: number;
    onFieldChange: (kind: CronFieldKind, next: CronFieldValue) => void;
}

const CronPickerOverlay: FC<CronPickerOverlayProps> = ({
    overlayId,
    cronValue,
    previewCount,
    onFieldChange,
}) => {
    // 预览基准时间:打开时取一次,之后每 30s 刷新,保证面板久开后"接下来"不过期
    const [now, setNow] = useState(() => new Date());
    useInterval(() => setNow(new Date()), 30_000);

    const upcoming = previewCount > 0 ? nextOccurrences(cronValue, now, previewCount) : [];

    const items = CRON_FIELD_ORDER.map((kind) => ({
        key: kind,
        label: TAB_LABELS[kind],
        children: (
            <FieldEditor kind={kind} value={cronValue[kind]} onChange={(next) => onFieldChange(kind, next)} />
        ),
    }));

    return (
        <div id={overlayId} role="dialog" aria-label="Cron 表达式编辑面板" className={overlayStyle}>
            <Tabs size="small" type="line" items={items} defaultActiveKey="minute" />
            <div className={footerStyle}>
                {/* 展示面板真实状态的归一化表达式:受控传入非法值时面板按默认值兜底,
                    此处若回显非法原文会与面板内容自相矛盾 */}
                <div className={expressionStyle}>{formatCron(cronValue)}</div>
                {/* 表达式的自然语言回述是最直接的操作反馈(§4),值变化时向读屏播报 */}
                <div className={describeStyle} aria-live="polite">
                    {describeCron(cronValue)}
                </div>
                {previewCount > 0 ? (
                    <div className={previewStyle}>
                        {upcoming.length > 0 ? (
                            <>
                                <span>接下来 {upcoming.length} 次执行:</span>
                                <ul>
                                    {upcoming.map((d) => (
                                        <li key={d.getTime()}>{formatDateTime(d)}</li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <span>该表达式匹配不到任何执行时间</span>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default CronPickerOverlay;

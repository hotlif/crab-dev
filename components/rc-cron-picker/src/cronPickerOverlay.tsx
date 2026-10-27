import { useInterval } from '@crab-dev/rc-hooks';
import Tabs from '@crab-dev/rc-tabs';
import { css } from '@crab-dev/css';
import { useState, type FC } from 'react';
import { useLocale } from '@crab-dev/rc-config-provider';
import { useCronLocale } from './locale.js';

import {
    CRON_FIELD_ORDER,
    describeCron,
    formatCron,
    nextOccurrences,
    type CronFieldKind,
    type CronFieldValue,
    type CronValue,
} from './cron.js';
import FieldEditor from './fieldEditor.js';
import type { CronPickerChangeDetails } from './types.js';
import token from './token.js';

// ─── Styles ──────────────────────────────────────────────────────────────────

const overlayStyle = css`
    inline-size: ${token.overlay.width};
    /* 浮层滚动条会占用父容器宽度，必须同时约束在父级可用空间内。 */
    max-inline-size: min(100%, calc(100vw - ${token.overlay.viewport.gap} * 2));
    padding: ${token.overlay.padding};
    box-sizing: border-box;
`;

const footerStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.field.parameter.gap};
    margin-block-start: ${token.field.gap};
    padding-block-start: ${token.field.gap};
    border-block-start: 1px solid ${token.divider.color};
`;

const expressionStyle = css`
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Consolas, monospace;
    font-size: ${token.expression['font-size']};
    color: ${token.expression.color};
    background-color: ${token.expression['background-color']};
    border-radius: ${token.expression['border-radius']};
    padding: ${token.expression.padding};
    text-align: start;
    unicode-bidi: isolate;
    user-select: all;
    /* 指定值很多时(如几十个分钟值)表达式可能超宽,折行展示而非撑破弹层 */
    overflow-wrap: anywhere;
`;

const describeStyle = css`
    color: ${token.describe.color};
    font-size: ${token.describe['font-size']};
    font-weight: ${token.describe['font-weight']};
    line-height: ${token.describe['line-height']};
`;

const previewStyle = css`
    color: ${token.preview.color};
    font-size: ${token.preview['font-size']};

    ul {
        margin: 0;
        padding: 0;
        list-style: none;
        margin-block-start: ${token['mode-row'].gap};
    }

    li {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: ${token['mode-row'].gap};
        color: ${token.preview.time.color};
        font-variant-numeric: tabular-nums;
        line-height: ${token.preview['line-height']};
    }
`;

const previewHeadingStyle = css`
    display: flex;
    justify-content: space-between;
    gap: ${token['mode-row'].gap};
    flex-wrap: wrap;
`;

// ─── Component ───────────────────────────────────────────────────────────────

export interface CronPickerOverlayProps {
    overlayId: string;
    disabled?: boolean;
    cronValue: CronValue;
    previewCount: number;
    onFieldChange: (kind: CronFieldKind, next: CronFieldValue, event?: CronPickerChangeDetails['event']) => void;
}

const CronPickerOverlay: FC<CronPickerOverlayProps> = ({
    overlayId,
    disabled,
    cronValue,
    previewCount,
    onFieldChange,
}) => {
    const { locale } = useLocale();
    const messages = useCronLocale();
    // 预览基准时间:打开时取一次,之后每 30s 刷新,保证面板久开后"接下来"不过期
    const [now, setNow] = useState(() => new Date());
    useInterval(() => setNow(new Date()), 30_000);

    const upcoming = previewCount > 0 ? nextOccurrences(cronValue, now, previewCount) : [];

    const items = CRON_FIELD_ORDER.map((kind) => ({
        key: kind,
        label: messages.names[kind],
        children: (
            <FieldEditor kind={kind} value={cronValue[kind]} disabled={disabled} onChange={(next, event) => onFieldChange(kind, next, event)} />
        ),
    }));

    return (
        <div
            id={overlayId}
            role="dialog"
            aria-label={messages.panel}
            className={overlayStyle}
        >
            <Tabs size="small" type="line" items={items} defaultValue="minute" aria-label={messages.fields} />
            <div className={footerStyle}>
                <div className={describeStyle} aria-live="polite">
                    {describeCron(cronValue, locale)}
                </div>
                {/* 展示面板真实状态的归一化表达式:受控传入非法值时面板按默认值兜底,
                    此处若回显非法原文会与面板内容自相矛盾 */}
                <div dir="ltr" className={expressionStyle} aria-label={messages.expression}>{formatCron(cronValue)}</div>
                {previewCount > 0 ? (
                    <div className={previewStyle}>
                        {upcoming.length > 0 ? (
                            <>
                                <div className={previewHeadingStyle}>
                                    <span>{messages.upcoming(upcoming.length)}</span>
                                    <span>{messages.localTime}</span>
                                </div>
                                <ul>
                                    {upcoming.map((d) => (
                                        <li key={d.getTime()}>
                                            <span>{messages.formatDate(d)}</span>
                                            <time dateTime={d.toISOString()}>{messages.formatTime(d)}</time>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <span>{messages.noOccurrences}</span>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default CronPickerOverlay;

import { useInterval } from '@crab-dev/rc-hooks';
import Tabs from '@crab-dev/rc-tabs';
import { useState, type FC } from 'react';
import { useLocale } from '@crab-dev/rc-config-provider';
import { useCronLocale } from './locale.js';
import { CRON_FIELD_ORDER, describeCron, formatCron, nextOccurrences, type CronFieldKind, type CronFieldValue, type CronValue } from './cron.js';
import FieldEditor from './fieldEditor.js';
import type { CronPickerChangeDetails } from './types.js';
import { overlayStyle, footerStyle, expressionStyle, describeStyle, previewStyle, previewHeadingStyle } from "./cronPickerOverlay.styles.js";
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

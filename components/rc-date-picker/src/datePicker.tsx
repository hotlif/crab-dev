import { useState, type FC, type HTMLAttributes } from 'react';
import RcLineEdit from '@crab-dev/rc-line-edit';
import RcButton from "@crab-dev/rc-button"
import { css, cx } from '@linaria/core';
import { useFloating, autoUpdate, offset, flip, FloatingPortal } from '@floating-ui/react';
import { motion, AnimatePresence } from "motion/react"
import DatePickerPanel from './panels/datePickerPanel';
import { formatTemporal } from "./util"
import { Calendar } from './icons';

interface DatePickerProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {

    /**
     * 时区
     */
    timeZone?: string;

    /**
     * 一周的起始天
     */
    weekStartDay?: 1 | 2 | 3 | 4 | 5 | 6 | 7;

    /**
     * 国际化
     */
    locale?: string;
    
    /**
     * 日期值
     */
    value: Temporal.ZonedDateTime;

    /**
     * 改变日期的时候触发的事件
     * @param value 值
     */
    onValueChange?: (value: Temporal.ZonedDateTime) => void;

    /**
     * 自定义显示的日期字符串
     * @param value 值
     * @returns 显示的字符串
     */
    renderDisplayString?: (value: Temporal.ZonedDateTime) => string;
}

const DatePicker: FC<DatePickerProps> = ({
    value,
    onValueChange,
    timeZone,
    weekStartDay,
    locale,
    renderDisplayString = (value) => formatTemporal(value, "yyyy-MM-dd hh:mm:ss"),
    className,
    ...props
}) => {
    const [open, setOpen] = useState(false);
    const [selectValues, setSelectValues] = useState<Temporal.ZonedDateTime[]>([]);

    const { refs, floatingStyles } = useFloating({
        placement: 'bottom-start',
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(6),
            flip({
                fallbackPlacements: ['top', 'right', 'left'],
            }),
        ],
    });
    return (
        <div
            className={cx(
                className,
                css`
                    position: relative;
                `,
            )}
            {...props}
        >
            <RcLineEdit
                containerRef={refs.setReference}
                onFocus={() => {
                    setOpen(true);
                }}
                onBlur={() => {
                    setOpen(false);
                }}
                value={renderDisplayString ? renderDisplayString(value) : value.toString()}
                suffix={
                    <Calendar
                        className={css`
                            opacity: 0.5;
                        `}
                    />
                }
            />
            <FloatingPortal>
                <AnimatePresence>
                    {open && (
                        <div
                            ref={refs.setFloating}
                            style={floatingStyles}
                            onMouseDown={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <motion.div
                                className={css`
                                    background-color: #fff;
                                    box-shadow:
                                        0 6px 16px 0 rgba(0, 0, 0, 0.08),
                                        0 3px 6px -4px rgba(0, 0, 0, 0.12),
                                        0 9px 28px 8px rgba(0, 0, 0, 0.05);
                                    border-radius: 8px;
                                    padding: 0.2rem 1rem 1rem 1rem;
                                    transform-origin: top;
                                `}
                                initial={{ opacity: 0, scaleY: 0.8, y: -8 }}
                                animate={{ opacity: 1, scaleY: 1, y: 0 }}
                                exit={{ opacity: 0, scaleY: 0.8, y: -8 }}
                                transition={{
                                    duration: 0.2,
                                    ease: [0.215, 0.61, 0.355, 1],
                                }}
                            >
                                <DatePickerPanel
                                    value={value}
                                    timeZone={timeZone}
                                    weekStartDay={weekStartDay}
                                    locale={locale}
                                    selectValues={selectValues}
                                    onSelect={(elements) => {
                                        setSelectValues(elements);
                                    }}
                                />
                                <div
                                    className={css`
                                        margin-top: 0.5rem;
                                        display: flex;
                                        justify-content: flex-end;
                                        gap: 0.5rem;
                                    `}
                                >
                                    <RcButton
                                        appearance="text"
                                        size="small"
                                    >
                                        取消
                                    </RcButton>
                                    <RcButton
                                        size="small"
                                        appearance="primary"
                                        onClick={(e) => {
                                            e.preventDefault()
                                        }}
                                    >
                                        确定
                                    </RcButton>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </FloatingPortal>
        </div>
    );
};

export default DatePicker;

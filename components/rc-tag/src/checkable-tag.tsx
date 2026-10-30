import { useControllableValue } from '@crab-dev/rc-hooks';
import { cx } from '@crab-dev/css';
import type { FC, KeyboardEvent, MouseEvent } from 'react';
import type { CheckableTagProps, CheckableTagChangeDetails } from './types.js';
import { baseStyle, checkedStyle, uncheckedStyle, iconStyle } from "./checkable-tag.styles.js";
const SelectedIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" data-role="selected-icon">
        <path d="m5 12 4 4L19 6" />
    </svg>
);

const CheckableTag: FC<CheckableTagProps> = ({
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    icon,
    disabled = false,
    className,
    children,
    onClick,
    onKeyDown,
    ...restProps
}) => {
    const [checked, setChecked] = useControllableValue<boolean, [CheckableTagChangeDetails]>({ value: checkedProp, defaultValue: defaultChecked, onValueChange: onCheckedChange });
    const handleToggle = (event: KeyboardEvent<HTMLSpanElement> | MouseEvent<HTMLSpanElement>) => {
        if (disabled) {
            return;
        }
        setChecked(!checked, { reason: 'toggle', event });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle(e);
        }
    };

    return (
        <span
            {...restProps}
            role="checkbox"
            aria-checked={checked}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : 0}
            className={cx(baseStyle, checked ? checkedStyle : uncheckedStyle, className)}
            onClick={(e) => {
                onClick?.(e);
                if (!e.defaultPrevented) handleToggle(e);
            }}
            onKeyDown={handleKeyDown}
        >
            {checked || icon ? <span className={iconStyle}>{checked ? <SelectedIcon /> : icon}</span> : null}
            <span>{children}</span>
        </span>
    );
};

export default CheckableTag;

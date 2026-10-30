import { useComponentSize } from '@crab-dev/rc-config-provider';
import { css, cx } from '@crab-dev/css';
import { type FC, type MouseEvent } from 'react';
import { useControllableValue } from '@crab-dev/rc-hooks';
import token, { vars } from './token.js';
import type { SwitchProps } from './types.js';
import { wrapperStyle, trackStyle, trackCheckedStyle, trackDisabledStyle, trackDisabledCheckedStyle, handleStyle, handleCheckedStyle, handleDisabledStyle, handleDisabledCheckedStyle } from "./switch.styles.js";
const Switch: FC<SwitchProps> = ({
    checked: checkedProp,
    defaultChecked = false,
    disabled = false,
    size: sizeProp,
    onCheckedChange,
    onClick,
    children,
    className,
    ...restProps
}) => {
    const size = useComponentSize(sizeProp);
    const [checked, setChecked] = useControllableValue<
        boolean,
        [MouseEvent<HTMLButtonElement>]
    >({
        value: checkedProp,
        defaultValue: defaultChecked,
        onValueChange: (next, event) => onCheckedChange?.(next, { reason: 'toggle', event }),
    });

    const getSizeStyles = () => {
        if (size === 'large') {
            return {
                track: css`
                    ${vars['track.halo.left']}: calc(${token.size.large.handle.left} + (${token.size.large.handle.width} - ${token.track.halo.width}) / 2);
                    ${vars['track.halo.translate-checked']}: calc(${token.size.large.track.width} - ${token.size.large.handle.width} - 2 * ${token.size.large.handle.left});
                    width: ${token.size.large.track.width};
                    margin-inline: max(0px, calc((${token.root.touch['min-width']} - ${token.size.large.track.width}) / 2));
                    height: ${token.size.large.track.height};
                    border-radius: ${token.size.large.track['border-radius']};
                `,
                handle: css`
                    width: ${token.size.large.handle.width};
                    height: ${token.size.large.handle.width};
                    inset-inline-start: ${token.size.large.handle.left};
                `,
                handleChecked: css`
                    translate: calc(${token.size.large.track.width} - ${token.size.large.handle.width} - ${token.size.large.handle.left} - ${token.size.large.handle.left}) 0;
                    &:dir(rtl) { translate: calc(-1 * (${token.size.large.track.width} - ${token.size.large.handle.width} - ${token.size.large.handle.left} - ${token.size.large.handle.left})) 0; }
                `,
            };
        } else if (size === 'small') {
            return {
                track: css`
                    ${vars['track.halo.left']}: calc(${token.size.small.handle.left} + (${token.size.small.handle.width} - ${token.track.halo.width}) / 2);
                    ${vars['track.halo.translate-checked']}: calc(${token.size.small.track.width} - ${token.size.small.handle.width} - 2 * ${token.size.small.handle.left});
                    width: ${token.size.small.track.width};
                    margin-inline: max(0px, calc((${token.root.touch['min-width']} - ${token.size.small.track.width}) / 2));
                    height: ${token.size.small.track.height};
                    border-radius: ${token.size.small.track['border-radius']};
                `,
                handle: css`
                    width: ${token.size.small.handle.width};
                    height: ${token.size.small.handle.width};
                    inset-inline-start: ${token.size.small.handle.left};
                `,
                handleChecked: css`
                    translate: calc(${token.size.small.track.width} - ${token.size.small.handle.width} - ${token.size.small.handle.left} - ${token.size.small.handle.left}) 0;
                    &:dir(rtl) { translate: calc(-1 * (${token.size.small.track.width} - ${token.size.small.handle.width} - ${token.size.small.handle.left} - ${token.size.small.handle.left})) 0; }
                `,
            };
        } else {
            return {
                track: css`
                    ${vars['track.halo.left']}: calc(${token.size.medium.handle.left} + (${token.size.medium.handle.width} - ${token.track.halo.width}) / 2);
                    ${vars['track.halo.translate-checked']}: calc(${token.size.medium.track.width} - ${token.size.medium.handle.width} - 2 * ${token.size.medium.handle.left});
                    width: ${token.size.medium.track.width};
                    margin-inline: max(0px, calc((${token.root.touch['min-width']} - ${token.size.medium.track.width}) / 2));
                    height: ${token.size.medium.track.height};
                    border-radius: ${token.size.medium.track['border-radius']};
                `,
                handle: css`
                    width: ${token.size.medium.handle.width};
                    height: ${token.size.medium.handle.width};
                    inset-inline-start: ${token.size.medium.handle.left};
                `,
                handleChecked: css`
                    translate: calc(${token.size.medium.track.width} - ${token.size.medium.handle.width} - ${token.size.medium.handle.left} - ${token.size.medium.handle.left}) 0;
                    &:dir(rtl) { translate: calc(-1 * (${token.size.medium.track.width} - ${token.size.medium.handle.width} - ${token.size.medium.handle.left} - ${token.size.medium.handle.left})) 0; }
                `,
            };
        }
    };

    const sizeStyles = getSizeStyles();

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (!e.defaultPrevented && !disabled) setChecked(!checked, e);
    };

    return (
        <label
            className={cx(wrapperStyle, className)}
            data-disabled={disabled ? '' : undefined}
        >
            <button
                {...restProps}
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                className={cx(
                    trackStyle,
                    sizeStyles.track,
                    checked && trackCheckedStyle,
                    disabled && !checked && trackDisabledStyle,
                    disabled && checked && trackDisabledCheckedStyle,
                )}
                onClick={handleClick}
            >
                <span
                    className={cx(
                        handleStyle,
                        sizeStyles.handle,
                        checked && sizeStyles.handleChecked,
                        checked && handleCheckedStyle,
                        disabled && !checked && handleDisabledStyle,
                        disabled && checked && handleDisabledCheckedStyle,
                    )}
                />
            </button>
            {children !== undefined && <span>{children}</span>}
        </label>
    );
};

export default Switch;

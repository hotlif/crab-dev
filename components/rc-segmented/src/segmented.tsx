import { useComponentSize } from '@crab-dev/rc-config-provider';
import { css, cx } from '@crab-dev/css';
import { useId } from 'react';
import { useControllableValue } from '@crab-dev/rc-hooks';
import token from './token.js';
import type {
    SegmentedOption,
    SegmentedProps,
    SegmentedRawOption,
    SegmentedSize,
    SegmentedValue,
} from './types.js';

// M3 baseline single-select segmented buttons; each segment owns its surface.

const trackStyle = css`
    position: relative;
    display: inline-grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
    max-inline-size: 100%;
    align-items: stretch;
    box-sizing: border-box;
    background-color: ${token.track['background-color']};
    border-radius: ${token.track['border-radius']};
    font-weight: ${token.root['font-weight']};
    font-family: ${token.root['font-family']};
    line-height: ${token.root['line-height']};
    user-select: none;
    outline: 1px solid ${token.track['border-color']};

    &[data-disabled] {
        cursor: not-allowed;
        outline-color: ${token.track['border-color-disabled']};
    }
    @media (forced-colors: active) {
        outline-color: ButtonText;
        &[data-disabled] { outline-color: GrayText; }
    }
`;

const trackBlockStyle = css`
    display: grid;
    width: 100%;
`;

const trackPadSmallStyle = css`
    padding: ${token.size.small.track.padding};
`;
const trackPadMiddleStyle = css`
    padding: ${token.size.middle.track.padding};
`;
const trackPadLargeStyle = css`
    padding: ${token.size.large.track.padding};
`;

// ─── 选项（label 包裹隐藏 radio，语义即原生单选组） ──────────────────────────

const hiddenInputStyle = css`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
`;

const segmentStyle = css`
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    margin: 0;
    min-inline-size: 0;
    &:not(:last-child) { border-inline-end: 1px solid ${token.track['border-color']}; }
    &:first-child { border-start-start-radius: ${token.track['border-radius']}; border-end-start-radius: ${token.track['border-radius']}; }
    &:last-child { border-start-end-radius: ${token.track['border-radius']}; border-end-end-radius: ${token.track['border-radius']}; }
    color: ${token.item.color};
    cursor: pointer;
    white-space: nowrap;
    transition: color ${token.item.transition}, background-color ${token.item.transition};

    /* Keep a 48px target without clipping it to the 40px visual container. */
    &::after {
        content: '';
        position: absolute;
        inset-inline: 0;
        top: 50%;
        min-height: ${token.interaction.touch['min-height']};
        height: 100%;
        transform: translateY(-50%);
    }

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: currentColor;
        opacity: 0;
        pointer-events: none;
        transition: opacity ${token.item.transition};
    }
    &:hover:not(:has(input:disabled))::before { opacity: ${token.item['state-layer']['opacity-hover']}; }
    &:has(input:focus-visible)::before { opacity: ${token.item['state-layer']['opacity-focus']}; }
    &:active:not(:has(input:disabled))::before { opacity: ${token.item['state-layer']['opacity-active']}; }

    &:hover:not(:has(input:disabled)):not([data-selected]) {
        color: ${token.item['color-hover']};
    }

    /* 键盘焦点意符：焦点落在隐藏 input 上时高亮所属分段（forced-colors 下 outline 保留） */
    &:has(input:focus-visible) {
        outline: ${token.item['outline-width-focus']} solid ${token.item['outline-color-focus']};
        outline-offset: ${token.item['outline-offset-focus']};
        z-index: 2;
    }

    @media (prefers-reduced-motion: reduce) {
        &, &::before { transition: none; }
    }
    @media (forced-colors: active) {
        && {
        forced-color-adjust: none;
        color: ButtonText;
        background: ButtonFace;
        &:not(:last-child) { border-color: ButtonText; }
        &[data-selected] { color: HighlightText; background: Highlight; }
        &:has(input:disabled) { color: GrayText; border-color: GrayText; }
        &:has(input:focus-visible) { outline-color: Highlight; }
        &[data-selected]:has(input:focus-visible) { outline-color: HighlightText; }
        &::before { display: none; }
        }
    }
`;

const segmentSmallStyle = css`
    height: ${token.size.small.height};
    padding: 0 ${token.size.small['padding-inline']};
    gap: ${token.size.small.gap};
    font-size: ${token.size.small['font-size']};
    border-radius: ${token.size.small['border-radius']};
`;
const segmentMiddleStyle = css`
    height: ${token.size.middle.height};
    padding: 0 ${token.size.middle['padding-inline']};
    gap: ${token.size.middle.gap};
    font-size: ${token.size.middle['font-size']};
    border-radius: ${token.size.middle['border-radius']};
`;
const segmentLargeStyle = css`
    height: ${token.size.large.height};
    padding: 0 ${token.size.large['padding-inline']};
    gap: ${token.size.large.gap};
    font-size: ${token.size.large['font-size']};
    border-radius: ${token.size.large['border-radius']};
`;

const segmentBlockStyle = css`
    min-width: 0;
`;

const labelStyle = css`
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const selectionIconStyle = css`
    display: inline-flex;
    flex: none;
    width: ${token.item.icon.width};
    height: ${token.item.icon.width};
    > svg { width: 100%; height: 100%; }
`;

const segmentSelectedStyle = css`
    color: ${token.item['color-selected']};
    background-color: ${token.thumb['background-color']};

    &:hover {
        color: ${token.item['color-selected']};
    }
`;

// 禁用项以原生 disabled input 阻断响应（点击关联被禁用控件为空操作），
// 并保留 not-allowed 光标作为示能撤销的意符。
const segmentDisabledStyle = css`
    color: ${token.item['color-disabled']};
    cursor: not-allowed;
    &:not(:last-child) { border-color: ${token.track['border-color-disabled']}; }
    &[data-selected] { background-color: ${token.item['background-color-disabled']}; }

    &:hover {
        color: ${token.item['color-disabled']};
    }
`;

// ─── 辅助 ────────────────────────────────────────────────────────────────────

const normalizeOption = (raw: SegmentedRawOption): SegmentedOption =>
    typeof raw === 'string' || typeof raw === 'number' ? { label: raw, value: raw } : raw;

const trackPadStyleOf = (size: SegmentedSize) => {
    if (size === 'small') return trackPadSmallStyle;
    if (size === 'large') return trackPadLargeStyle;
    return trackPadMiddleStyle;
};

const segmentSizeStyleOf = (size: SegmentedSize) => {
    if (size === 'small') return segmentSmallStyle;
    if (size === 'large') return segmentLargeStyle;
    return segmentMiddleStyle;
};

const Segmented = ({
    options,
    value: valueProp,
    defaultValue,
    onChange,
    disabled = false,
    size: sizeProp,
    block = false,
    name,
    className,
    ref,
    ...restProps
}: SegmentedProps) => {
    const size = useComponentSize(sizeProp);
    const reactId = useId();
    const groupName = name ?? `rc-segmented-${reactId.replace(/:/g, '')}`;

    const normalizedOptions = options.map(normalizeOption);
    const firstEnabled = normalizedOptions.find((option) => !option.disabled);
    const resolvedDefault = defaultValue ?? firstEnabled?.value ?? normalizedOptions[0]?.value;

    const [selectedValue, setSelectedValue] = useControllableValue<SegmentedValue>({
        value: valueProp,
        defaultValue: resolvedDefault,
        onChange,
    });

    return (
        <div
            {...restProps}
            ref={ref}
            role="radiogroup"
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? '' : undefined}
            className={cx(trackStyle, trackPadStyleOf(size), block && trackBlockStyle, className)}
        >
            {normalizedOptions.map((option) => {
                const optionDisabled = disabled || option.disabled || false;
                const selected = option.value === selectedValue;
                const hasLabel = option.label !== undefined && option.label !== null && option.label !== '' && option.label !== false;

                return (
                    <label
                        key={String(option.value)}
                        data-selected={selected ? '' : undefined}
                        className={cx(
                            segmentStyle,
                            segmentSizeStyleOf(size),
                            block && segmentBlockStyle,
                            selected && segmentSelectedStyle,
                            optionDisabled && segmentDisabledStyle,
                            option.className,
                        )}
                    >
                        <input
                            type="radio"
                            className={hiddenInputStyle}
                            name={groupName}
                            value={option.value}
                            checked={selected}
                            disabled={optionDisabled}
                            aria-label={option['aria-label']}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' && !optionDisabled) {
                                    event.preventDefault();
                                    if (!selected) setSelectedValue(option.value);
                                }
                            }}
                            onChange={() => {
                                // 防错优于报错：禁用项不可选中，除原生 disabled 外再显式守卫
                                if (optionDisabled) return;
                                setSelectedValue(option.value);
                            }}
                        />
                        <span aria-hidden="true" className={selectionIconStyle}>
                            {selected ? <svg viewBox="0 0 24 24" fill="none" focusable="false"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" /></svg> : option.icon}
                        </span>
                        {selected && !hasLabel && option.icon && <span aria-hidden="true" className={selectionIconStyle}>{option.icon}</span>}
                        {hasLabel && <span className={labelStyle}>{option.label}</span>}
                    </label>
                );
            })}
        </div>
    );
};

export default Segmented;

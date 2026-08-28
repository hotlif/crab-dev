import { css, cx } from '@crab-dev/css';
import { type CSSProperties, useEffect, useId, useRef, useState } from 'react';
import {
    useControllableValue,
    useEventCallback,
    useIsomorphicLayoutEffect,
    useResizeObserver,
} from '@crab-dev/rc-hooks';
import token from './token.js';
import type {
    SegmentedOption,
    SegmentedProps,
    SegmentedRawOption,
    SegmentedSize,
    SegmentedValue,
} from './types.js';

// ─── 容器（凹槽） ───────────────────────────────────────────────────────────

const trackStyle = css`
    position: relative;
    display: inline-flex;
    align-items: stretch;
    box-sizing: border-box;
    background-color: ${token.track.background};
    border-radius: ${token.track.border.radius};
    font-weight: ${token.font.weight};
    line-height: 1;
    user-select: none;

    &[data-disabled] {
        cursor: not-allowed;
        opacity: ${token.disabled.opacity};
    }
`;

const trackBlockStyle = css`
    display: flex;
    width: 100%;
`;

const trackPadSmallStyle = css`
    padding: ${token.size.small['track-pad']};
`;
const trackPadMiddleStyle = css`
    padding: ${token.size.middle['track-pad']};
`;
const trackPadLargeStyle = css`
    padding: ${token.size.large['track-pad']};
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
    color: ${token.item.color};
    cursor: pointer;
    white-space: nowrap;
    transition: color ${token.motion.item};

    &:hover {
        color: ${token.item['color-hover']};
    }

    /* 键盘焦点意符：焦点落在隐藏 input 上时高亮所属分段（forced-colors 下 outline 保留） */
    &:has(input:focus-visible) {
        outline: ${token.focus.ring.width} solid ${token.focus.ring.color};
        outline-offset: ${token.focus.ring.offset};
        z-index: 2;
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const segmentSmallStyle = css`
    height: ${token.size.small.height};
    padding: 0 ${token.size.small['padding-x']};
    gap: ${token.size.small.gap};
    font-size: ${token.size.small['font-size']};
    border-radius: ${token.size.small.radius};
`;
const segmentMiddleStyle = css`
    height: ${token.size.middle.height};
    padding: 0 ${token.size.middle['padding-x']};
    gap: ${token.size.middle.gap};
    font-size: ${token.size.middle['font-size']};
    border-radius: ${token.size.middle.radius};
`;
const segmentLargeStyle = css`
    height: ${token.size.large.height};
    padding: 0 ${token.size.large['padding-x']};
    gap: ${token.size.large.gap};
    font-size: ${token.size.large['font-size']};
    border-radius: ${token.size.large.radius};
`;

const segmentBlockStyle = css`
    flex: 1 1 0;
    min-width: 0;
`;

const segmentSelectedStyle = css`
    color: ${token.item['color-selected']};

    &:hover {
        color: ${token.item['color-selected']};
    }
`;

// 禁用项以原生 disabled input 阻断响应（点击关联被禁用控件为空操作），
// 并保留 not-allowed 光标作为示能撤销的意符。
const segmentDisabledStyle = css`
    color: ${token.item['color-disabled']};
    cursor: not-allowed;

    &:hover {
        color: ${token.item['color-disabled']};
    }
`;

// ─── 滑块（thumb） ──────────────────────────────────────────────────────────

const thumbStyle = css`
    position: absolute;
    z-index: 0;
    left: 0;
    width: var(--rc-segmented-thumb-w, 0);
    transform: translateX(var(--rc-segmented-thumb-x, 0));
    background-color: ${token.thumb.background};
    box-shadow: ${token.thumb.shadow};
    pointer-events: none;

    @media (forced-colors: active) {
        /* 强制配色下阴影/背景被抹除，用系统高亮描边显性化选中项 */
        border: 2px solid Highlight;
    }
`;

const thumbSmallStyle = css`
    top: ${token.size.small['track-pad']};
    bottom: ${token.size.small['track-pad']};
    border-radius: ${token.size.small.radius};
`;
const thumbMiddleStyle = css`
    top: ${token.size.middle['track-pad']};
    bottom: ${token.size.middle['track-pad']};
    border-radius: ${token.size.middle.radius};
`;
const thumbLargeStyle = css`
    top: ${token.size.large['track-pad']};
    bottom: ${token.size.large['track-pad']};
    border-radius: ${token.size.large.radius};
`;

const thumbAnimatedStyle = css`
    transition: ${token.thumb.transition};

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const thumbHiddenStyle = css`
    opacity: 0;
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

const thumbSizeStyleOf = (size: SegmentedSize) => {
    if (size === 'small') return thumbSmallStyle;
    if (size === 'large') return thumbLargeStyle;
    return thumbMiddleStyle;
};

const Segmented = ({
    options,
    value: valueProp,
    defaultValue,
    onChange,
    disabled = false,
    size = 'middle',
    block = false,
    name,
    className,
    ref,
    ...restProps
}: SegmentedProps) => {
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

    // 可变实例状态 ref（§4.1 例外 1）：跨渲染持有 DOM 引用用于测量，不触发渲染。
    const trackRef = useRef<HTMLDivElement | null>(null);
    const labelRefs = useRef<Map<SegmentedValue, HTMLLabelElement>>(new Map());

    const [thumb, setThumb] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
    const [ready, setReady] = useState(false);

    // latest-ref 稳定回调（§4.1 例外 4，经 useEventCallback）：供 layout effect 与
    // ResizeObserver 共用，引用稳定又始终读取最新选中值/refs。
    const measureThumb = useEventCallback(() => {
        const selectedEl =
            selectedValue === undefined ? undefined : labelRefs.current.get(selectedValue);
        if (!trackRef.current || !selectedEl) {
            setThumb((prev) => (prev.width === 0 ? prev : { left: 0, width: 0 }));
            return;
        }
        const left = selectedEl.offsetLeft;
        const width = selectedEl.offsetWidth;
        setThumb((prev) => (prev.left === left && prev.width === width ? prev : { left, width }));
    });

    // 选中值 / 选项集合 / 尺寸 / block 变化时重新测量滑块位置
    const optionsKey = normalizedOptions.map((option) => String(option.value)).join(' ');
    useIsomorphicLayoutEffect(() => {
        measureThumb();
    }, [measureThumb, selectedValue, optionsKey, size, block]);

    useResizeObserver(trackRef, measureThumb);

    // 首帧定位不参与过渡（避免从左侧滑入），首帧后再启用滑动动画
    useEffect(() => {
        setReady(true);
    }, []);

    const setTrackRef = (node: HTMLDivElement | null) => {
        trackRef.current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            ref.current = node;
        }
    };

    const registerLabelRef = (optionValue: SegmentedValue) => (node: HTMLLabelElement | null) => {
        if (node) {
            labelRefs.current.set(optionValue, node);
        } else {
            labelRefs.current.delete(optionValue);
        }
    };

    const thumbVars = {
        ['--rc-segmented-thumb-x' as never]: `${thumb.left}px`,
        ['--rc-segmented-thumb-w' as never]: `${thumb.width}px`,
    } as CSSProperties;

    return (
        <div
            {...restProps}
            ref={setTrackRef}
            role="radiogroup"
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? '' : undefined}
            className={cx(trackStyle, trackPadStyleOf(size), block && trackBlockStyle, className)}
        >
            <span
                aria-hidden="true"
                className={cx(
                    thumbStyle,
                    thumbSizeStyleOf(size),
                    ready && thumbAnimatedStyle,
                    thumb.width === 0 && thumbHiddenStyle,
                )}
                style={thumbVars}
            />
            {normalizedOptions.map((option) => {
                const optionDisabled = disabled || option.disabled || false;
                const selected = option.value === selectedValue;

                return (
                    <label
                        key={String(option.value)}
                        ref={registerLabelRef(option.value)}
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
                            onChange={() => {
                                // 防错优于报错：禁用项不可选中，除原生 disabled 外再显式守卫
                                if (optionDisabled) return;
                                setSelectedValue(option.value);
                            }}
                        />
                        {option.icon !== undefined && (
                            <span aria-hidden="true">{option.icon}</span>
                        )}
                        {option.label !== undefined && <span>{option.label}</span>}
                    </label>
                );
            })}
        </div>
    );
};

export default Segmented;

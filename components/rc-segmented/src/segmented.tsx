import { useComponentSize, useConfig } from '@crab-dev/rc-config-provider';
import { macosSegmentStyle } from './segmented.designs.js';
import { cx } from '@crab-dev/css';
import { useId } from 'react';
import { useControllableValue } from '@crab-dev/rc-hooks';
import { useNativeRadioFocus } from '@crab-dev/rc-hooks/internal';
import type { SegmentedOption, SegmentedProps, SegmentedRawOption, SegmentedSize, SegmentedValue, SegmentedChangeDetails } from './types.js';
import { trackStyle, trackBlockStyle, trackPadSmallStyle, trackPadMiddleStyle, trackPadLargeStyle, hiddenInputStyle, segmentStyle, segmentSmallStyle, segmentMiddleStyle, segmentLargeStyle, segmentBlockStyle, labelStyle, unselectedSmallLabelStyle, unselectedMediumLabelStyle, unselectedLargeLabelStyle, selectionIconStyle, indicatorGraphicStyle, iconOnlyIndicatorStyle, checkIconStyle, selectedOptionIconStyle, segmentSelectedStyle, segmentDisabledStyle } from "./segmented.styles.js";
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

const unselectedLabelStyleOf = (size: SegmentedSize) => {
    if (size === 'small') return unselectedSmallLabelStyle;
    if (size === 'large') return unselectedLargeLabelStyle;
    return unselectedMediumLabelStyle;
};

const Segmented = ({
    options,
    value: valueProp,
    defaultValue,
    onValueChange,
    disabled = false,
    size: sizeProp,
    block = false,
    name,
    className,
    ref,
    onKeyDownCapture,
    onPointerDownCapture,
    onFocus,
    onBlur,
    ...restProps
}: SegmentedProps) => {
    const size = useComponentSize(sizeProp);
    const { designSystem } = useConfig();
    const radioFocus = useNativeRadioFocus();
    const reactId = useId();
    const groupName = name ?? `rc-segmented-${reactId.replace(/:/g, '')}`;

    const normalizedOptions = options.map(normalizeOption);
    const firstEnabled = normalizedOptions.find((option) => !option.disabled);
    const resolvedDefault = defaultValue ?? firstEnabled?.value ?? normalizedOptions[0]?.value;

    const [selectedValue, setSelectedValue] = useControllableValue<SegmentedValue, [SegmentedChangeDetails]>({
        value: valueProp,
        defaultValue: resolvedDefault,
        onValueChange,
    });

    return (
        <div
            {...restProps}
            ref={ref}
            onKeyDownCapture={event => { radioFocus.onKeyDownCapture(event); onKeyDownCapture?.(event); }}
            onPointerDownCapture={event => { radioFocus.onPointerDownCapture(event); onPointerDownCapture?.(event); }}
            onFocus={event => { radioFocus.onFocus(event); onFocus?.(event); }}
            onBlur={event => { radioFocus.onBlur(); onBlur?.(event); }}
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
                            designSystem === 'macos' && macosSegmentStyle,
                            option.className,
                        )}
                    >
                        <input
                            type="radio"
                            data-keyboard-focus={radioFocus.keyboardFocus ? '' : undefined}
                            className={hiddenInputStyle}
                            name={groupName}
                            value={option.value}
                            checked={selected}
                            disabled={optionDisabled}
                            aria-label={option['aria-label']}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' && !optionDisabled) {
                                    event.preventDefault();
                                    if (!selected) setSelectedValue(option.value, { reason: 'select', event });
                                }
                            }}
                            onChange={(event) => {
                                // 防错优于报错：禁用项不可选中，除原生 disabled 外再显式守卫
                                if (optionDisabled) return;
                                setSelectedValue(option.value, { reason: 'select', event });
                            }}
                        />
                        <span aria-hidden="true" data-selection-indicator="" className={cx(selectionIconStyle, !option.icon && checkIconStyle, Boolean(option.icon) && !hasLabel && iconOnlyIndicatorStyle)}>
                            <span data-segment-graphic="check" data-visible={selected} className={cx(indicatorGraphicStyle, checkIconStyle)}>
                                <svg viewBox="0 0 24 24" fill="none" focusable="false"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" /></svg>
                            </span>
                            {option.icon && <span aria-hidden="true" data-option-icon="" data-segment-graphic="option" data-visible={!selected || designSystem !== 'md3' || !hasLabel} className={cx(indicatorGraphicStyle, selected && hasLabel && selectedOptionIconStyle)}>{option.icon}</span>}
                        </span>
                        {hasLabel && <span className={cx(labelStyle, designSystem === 'md3' && !selected && !option.icon && unselectedLabelStyleOf(size))}>{option.label}</span>}
                    </label>
                );
            })}
        </div>
    );
};

export default Segmented;

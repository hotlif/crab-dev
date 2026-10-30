import { useLocale } from '@crab-dev/rc-config-provider';
import { useControllableValue, type ControlledValueProps } from '@crab-dev/rc-hooks';
import { cx } from "@crab-dev/css";
import RcSlider, { CanonicalTokenVars as TokenVars } from '@crab-dev/rc-slider';
import { type FC, type HTMLAttributes, useState } from "react";
import token from "../token.js";
import type { ColorFormat, ColorPickerPanelLocale, ColorPreset, OKLCHValue, ColorValueChangeDetails } from "../types.js";
import ColorInput from "./colorInput.js";
import PresetSwatches from "./presetSwatches.js";
import { sliderContainerStyle, commonSliderStyle, rootStyle, previewStyle, hueRailStyle } from "./colorPickerPanel.styles.js";
interface ColorPickerPanelBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
    locale?: Partial<ColorPickerPanelLocale>;
    /** 是否显示透明度滑块,默认 true。 */
    showAlpha?: boolean;
    /** 是否显示吸管取色按钮(仍需浏览器支持 EyeDropper),默认 true。 */
    showEyeDropper?: boolean;
    /** 文本输入框初始展示格式,默认 "hex"。 */
    format?: ColorFormat;
    /** 预设色板:扁平色或带标题的分组色。 */
    presets?: ColorPreset[];
}

export type ColorPickerPanelProps = ColorPickerPanelBaseProps & ControlledValueProps<OKLCHValue, ColorValueChangeDetails>;

const ColorPickerPanel: FC<ColorPickerPanelProps> = ({
    locale,
    value: valueProp,
    defaultValue,
    onValueChange: notifyValueChange,
    showAlpha = true,
    showEyeDropper = true,
    format = "hex",
    presets,
    ...restProps
}) => {
    const { messages } = useLocale();
    const copy = messages.colorPicker;
    const [value, setValue] = useControllableValue<OKLCHValue, [ColorValueChangeDetails]>({ value: valueProp, defaultValue: defaultValue ?? { lightness: 0.6, chroma: 0, hue: 0 }, onValueChange: notifyValueChange });
    const onValueChange = (next: OKLCHValue) => setValue(next, { reason: 'choose' });
    const [currentFormat, setCurrentFormat] = useState<ColorFormat>(format);
    // 字段级合并:可选的 labelAlpha 缺省时回退默认文案,避免空 label / aria-label
    const mergedLocale = { labelLightness: copy.lightness, labelChroma: copy.chroma, labelHue: copy.hue, labelAlpha: copy.alpha, ...locale };
    const opaque = `oklch(${value.lightness} ${value.chroma} ${value.hue})`;

    return (
        <div className={rootStyle} {...restProps}>
            <div
                className={previewStyle}
                style={{
                    backgroundColor: `oklch(${value.lightness} ${value.chroma} ${value.hue} / ${value.alpha ?? 1})`,
                }}
            />

            <div className={sliderContainerStyle}>
                <label>{mergedLocale.labelLightness}</label>
                <RcSlider
                    aria-label={mergedLocale.labelLightness}
                    style={{
                        [TokenVars['rail.fill-inactive']]: `linear-gradient(var(--color-picker-gradient-direction),
                            oklch(0 ${value.chroma} ${value.hue}),
                            oklch(1 ${value.chroma} ${value.hue})
                        )`,
                        [TokenVars["thumb.fill"]]: `oklch(${value.lightness} ${value.chroma} ${value.hue})`,
                        [TokenVars["thumb.halo.fill"]]: `var(${TokenVars["thumb.fill"]})`,
                    }}
                    className={commonSliderStyle}
                    min={0}
                    max={1}
                    step={0.01}
                    value={value.lightness}
                    onValueChange={(v) => onValueChange({ ...value, lightness: v })}
                />
            </div>

            <div className={sliderContainerStyle}>
                <label>{mergedLocale.labelChroma}</label>
                <RcSlider
                    aria-label={mergedLocale.labelChroma}
                    style={{
                        [TokenVars['rail.fill-inactive']]: `linear-gradient(var(--color-picker-gradient-direction),
                            oklch(0.6 0 ${value.hue}),
                            oklch(0.6 0.4 ${value.hue})
                        )`,
                        [TokenVars["thumb.fill"]]: `oklch(0.6 ${value.chroma} ${value.hue})`,
                        [TokenVars["thumb.halo.fill"]]: `var(${TokenVars["thumb.fill"]})`,
                    }}
                    className={commonSliderStyle}
                    min={0}
                    max={0.4}
                    step={0.005}
                    value={value.chroma}
                    onValueChange={(v) => onValueChange({ ...value, chroma: v })}
                />
            </div>

            <div className={sliderContainerStyle}>
                <label>{mergedLocale.labelHue}</label>
                <RcSlider
                    aria-label={mergedLocale.labelHue}
                    style={{
                        [TokenVars["thumb.fill"]]: `oklch(0.7 0.25 ${value.hue})`,
                        [TokenVars["thumb.halo.fill"]]: `var(${TokenVars["thumb.fill"]})`,
                    }}
                    className={cx.call(undefined, commonSliderStyle, hueRailStyle)}
                    value={value.hue}
                    min={0}
                    max={360}
                    step={1}
                    onValueChange={(v) => onValueChange({ ...value, hue: v })}
                />
            </div>

            {showAlpha && (
                <div className={sliderContainerStyle}>
                    <label>{mergedLocale.labelAlpha}</label>
                    <RcSlider
                        aria-label={mergedLocale.labelAlpha}
                        style={{
                            [TokenVars['rail.fill-inactive']]:
                                `linear-gradient(var(--color-picker-gradient-direction), transparent, ${opaque}), ` +
                                `repeating-conic-gradient(${token.slider.alpha.checker.color} 0% 25%, transparent 0% 50%) top left / 8px 8px`,
                            [TokenVars["thumb.fill"]]: `oklch(${value.lightness} ${value.chroma} ${value.hue} / ${value.alpha ?? 1})`,
                            [TokenVars["thumb.halo.fill"]]: `var(${TokenVars["thumb.fill"]})`,
                        }}
                        className={commonSliderStyle}
                        min={0}
                        max={1}
                        step={0.01}
                        value={value.alpha ?? 1}
                        onValueChange={(v) => onValueChange({ ...value, alpha: v })}
                    />
                </div>
            )}

            <ColorInput
                value={value}
                format={currentFormat}
                showEyeDropper={showEyeDropper}
                onFormatChange={setCurrentFormat}
                onValueChange={onValueChange}
            />

            {presets && presets.length > 0 && (
                <PresetSwatches presets={presets} onSelect={onValueChange} />
            )}
        </div>
    );
};

export default ColorPickerPanel;

import { css, cx } from "@crab-dev/css";
import RcSlider, { CanonicalTokenVars as TokenVars } from '@crab-dev/rc-slider';
import { type FC, type HTMLAttributes, useState } from "react";
import token from "../token.js";
import type { ColorFormat, ColorPickerPanelLocale, ColorPreset, OKLCHValue } from "../types.js";
import ColorInput from "./colorInput.js";
import PresetSwatches from "./presetSwatches.js";

export interface ColorPickerPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    locale?: ColorPickerPanelLocale;
    value: OKLCHValue;
    onValueChange: (value: OKLCHValue) => void;
    /** 是否显示透明度滑块,默认 true。 */
    showAlpha?: boolean;
    /** 是否显示吸管取色按钮(仍需浏览器支持 EyeDropper),默认 true。 */
    showEyeDropper?: boolean;
    /** 文本输入框初始展示格式,默认 "hex"。 */
    format?: ColorFormat;
    /** 预设色板:扁平色或带标题的分组色。 */
    presets?: ColorPreset[];
}

const sliderContainerStyle = css`
    display: grid;
    grid-template-columns: ${token.panel.slider.label.width} minmax(0, 1fr);
    align-items: center;
    gap: ${token.panel.slider.container.gap};
    > label {
        font-size: ${token.panel.slider.label['font-size']};
        font-weight: ${token.panel.slider.label['font-weight']};
        line-height: ${token.panel.slider.label['line-height']};
        overflow-wrap: anywhere;
    }
    > div {
        min-width: 0;
    }
`;

/** 颜色渐变覆盖完整值域，不随 Expressive Slider 的 active / inactive 分段缩短。 */
const commonSliderStyle = css`
    ${TokenVars["rail.height"]}: 12px;
    ${TokenVars['thumb.stroke-color']}: ${token.slider.thumb['stroke-color']};
    ${TokenVars['rail.fill-active']}: transparent;
    ${TokenVars["thumb.fill"]}: transparent;
    > [data-slot="slider-rail"] {
        left: 0;
        border-radius: var(${TokenVars["rail.border-radius"]});
    }
`;

const DEFAULT_LOCALE: Required<ColorPickerPanelLocale> = {
    labelLightness: "亮度",
    labelChroma: "色度",
    labelHue: "色相",
    labelAlpha: "透明度",
};

const rootStyle = css`
    min-width: 250px;
    display: flex;
    flex-direction: column;
    gap: ${token.panel.gap};
`;

const previewStyle = css`
    width: ${token.panel.preview.width};
    height: ${token.panel.preview.height};
    border-radius: ${token.panel.preview['border-radius']};
    border: 1px solid ${token.panel.preview['border-color']};
    margin-top: ${token.panel.preview['margin-top']};
`;

/** 色相滑轨:固定的全色相环渐变(与当前值无关,可静态求值)。 */
const hueRailStyle = css`
    ${TokenVars['rail.fill-inactive']}: linear-gradient(to right,
        oklch(0.7 0.15 0),
        oklch(0.7 0.15 60),
        oklch(0.7 0.15 120),
        oklch(0.7 0.15 180),
        oklch(0.7 0.15 240),
        oklch(0.7 0.15 300),
        oklch(0.7 0.15 360)
    );
`;

const ColorPickerPanel: FC<ColorPickerPanelProps> = ({
    locale,
    value,
    onValueChange,
    showAlpha = true,
    showEyeDropper = true,
    format = "hex",
    presets,
    ...restProps
}) => {
    const [currentFormat, setCurrentFormat] = useState<ColorFormat>(format);
    // 字段级合并:可选的 labelAlpha 缺省时回退默认文案,避免空 label / aria-label
    const mergedLocale = { ...DEFAULT_LOCALE, ...locale };
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
                        [TokenVars['rail.fill-inactive']]: `linear-gradient(to right,
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
                        [TokenVars['rail.fill-inactive']]: `linear-gradient(to right,
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
                                `linear-gradient(to right, transparent, ${opaque}), ` +
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

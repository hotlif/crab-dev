import { css } from "@linaria/core";
import RcSlider, { TokenVars } from "@crab-dev/rc-slider";
import { type FC, type HTMLAttributes } from "react";
import token from "../token.js"
import { type ColorPickerPanelLocale } from "../types.js";


export interface ColorPickerPanelProps extends HTMLAttributes<HTMLDivElement> {
    locale?: ColorPickerPanelLocale;
    value: OKLCHValue;
    onValueChange: (value: OKLCHValue) => void;
}

export interface OKLCHValue {
    lightness: number
    chroma: number
    hue: number
}

const sliderContainerStyle = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${token.panel.slider.container.gap};
    > label {
        font-size: 14px;
        font-weight: 500;
        line-height: 1.2;
    }
    > div {
        flex: 1;
    }
`;

const ColorPickerPanel: FC<ColorPickerPanelProps> = ({
    locale,
    value,
    onValueChange,
    ...restProps
}) => {
    return (
        <div
            className={css`
                min-width: 250px;
                display: flex;
                flex-direction: column;
                gap: ${token.panel.gap};
            `}
            {...restProps}
        >
            <div
                className={css`
                    width: ${token.panel.preview.width};
                    height: ${token.panel.preview.height};
                    border-radius: ${token.panel.preview.border.radius};
                    margin-top: ${token.panel.preview.margin.top};
                `}
                style={{
                    backgroundColor: `oklch(${value.lightness} ${value.chroma} ${value.hue})`
                }}
            />
            
            <div className={sliderContainerStyle}>
                <label>{locale?.labelLightness}</label>
                <RcSlider
                    style={{
                        [TokenVars["rail.inactive.fill"]]: `linear-gradient(to right, 
                            oklch(0 ${value.chroma} ${value.hue}), 
                            oklch(1 ${value.chroma} ${value.hue})
                        )`,
                        [TokenVars["thumb.fill"]]: `oklch(${value.lightness} ${value.chroma} ${value.hue})`,
                        [TokenVars["thumb.halo.fill"]]: `var(${TokenVars["thumb.fill"]})`
                    }}
                    className={css`
                        ${TokenVars["rail.thickness"]}: 12px;
                        ${TokenVars["thumb.fill"]}: transparent;
                        ${TokenVars["rail.active.fill"]}: transparent;
                        ${TokenVars["thumb.stroke.color"]}: #fff;
                    `}
                    min={0}
                    max={1}
                    step={0.01}
                    value={value.lightness}
                    onValueChange={(v) => {
                        onValueChange?.({ ...value, lightness: v});
                    }}
                />
            </div>

            <div className={sliderContainerStyle}>
                <label>{locale?.labelChroma}</label>
                <RcSlider
                    style={{
                        [TokenVars["rail.inactive.fill"]]: `linear-gradient(to right, 
                            oklch(0.6 0 ${value.hue}), 
                            oklch(0.6 0.4 ${value.hue})
                        )`,
                        [TokenVars["thumb.fill"]]: `oklch(0.6 ${value.chroma} ${value.hue})`,
                        [TokenVars["thumb.halo.fill"]]: `var(${TokenVars["thumb.fill"]})`,
                    }}
                    className={css`
                        ${TokenVars["rail.thickness"]}: 12px;
                        ${TokenVars["thumb.stroke.color"]}: #fff;
                        ${TokenVars["rail.active.fill"]}: transparent;
                        ${TokenVars["thumb.fill"]}: transparent;
                     
                    `}
                    min={0}
                    max={0.4}
                    step={0.005}
                    value={value?.chroma}
                    onValueChange={(v) => {
                        onValueChange?.({ ...value, chroma: v });
                    }}
                />
            </div>

            <div className={sliderContainerStyle}>
                <label>{locale?.labelHue}</label>
                <RcSlider
                    style={{
                        [TokenVars["thumb.fill"]]: `oklch(0.7 0.25 ${value.hue})`,
                        [TokenVars["thumb.halo.fill"]]: `var(${TokenVars["thumb.fill"]})`
                    }}
                    className={css`
                        ${TokenVars["rail.thickness"]}: 12px;
                        ${TokenVars["thumb.stroke.color"]}: #fff;
                        ${TokenVars["rail.active.fill"]}: transparent;
                        ${TokenVars["rail.inactive.fill"]}: linear-gradient(to right, 
                            oklch(0.7 0.15 0), 
                            oklch(0.7 0.15 60), 
                            oklch(0.7 0.15 120), 
                            oklch(0.7 0.15 180), 
                            oklch(0.7 0.15 240), 
                            oklch(0.7 0.15 300), 
                            oklch(0.7 0.15 360)
                        );
                    `}
                    value={value?.hue}
                    min={0}
                    max={360}
                    step={1}
                    onValueChange={(v) => {
                        onValueChange?.({ ...value, hue: v });
                    }}
                />
            </div>
        </div>
    )
}

export default ColorPickerPanel;
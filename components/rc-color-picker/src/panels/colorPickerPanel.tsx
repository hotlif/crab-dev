import { css } from "@linaria/core";
import RcSlider, { TokenVars } from "@crab-dev/rc-slider";
import { type FC, type HTMLAttributes } from "react";

interface ColorPickerPanelProps extends HTMLAttributes<HTMLDivElement> {
    value: OKLCHValue
    onValueChange: (value: OKLCHValue) => void
}

interface OKLCHValue {
    lightness: number
    chroma: number
    hue: number
} 

const panelSectionStyle = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    padding-top: 1rem;
`;

const ColorPickerPanel: FC<ColorPickerPanelProps> = ({
    value,
    onValueChange,
    ...restProps
}) => {
    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
            `}
            {...restProps}
        >
            <div
                className={css`
                    width: 100%;
                    height: 5rem;
                `}
                style={{
                    backgroundColor: `oklch(${value.lightness} ${value.chroma} ${value.hue})`
                }}
            />
            
            {/* Lightness Slider */}
            <div className={panelSectionStyle}>
                <label>L</label>
                <RcSlider
                    style={{
                        [TokenVars["rail.thickness"] as string]: '12px',
                        [TokenVars["rail.active.fill"] as string]: 'transparent',
                        [TokenVars["rail.inactive.fill"] as string]: `linear-gradient(to right, 
                            oklch(0 ${value.chroma} ${value.hue}), 
                            oklch(1 ${value.chroma} ${value.hue})
                        )`
                    }}
                    min={0}
                    max={1}
                    step={0.01}
                    value={value.lightness}
                    onValueChange={(v) => {
                        onValueChange?.({ ...value, lightness: v});
                    }}
                />
            </div>

            {/* Chroma Slider */}
            <div className={panelSectionStyle}>
                <label>C</label>
                <RcSlider
                    style={{
                        [TokenVars["rail.thickness"] as string]: '12px',
                        [TokenVars["rail.active.fill"] as string]: 'transparent',
                        [TokenVars["rail.inactive.fill"] as string]: `linear-gradient(to right, 
                            oklch(${value.lightness} 0 ${value.hue}), 
                            oklch(${value.lightness} 0.4 ${value.hue})
                        )`
                    }}
                    min={0}
                    max={0.4}
                    step={0.005}
                    value={value?.chroma}
                    onValueChange={(v) => {
                        onValueChange?.({ ...value, chroma: v });
                    }}
                />
            </div>

            {/* Hue Slider */}
            <div className={panelSectionStyle}>
                <label>H</label>
                <RcSlider
                    className={css`
                        ${TokenVars["rail.thickness"]}: 12px;
                        ${TokenVars["rail.inactive.fill"]}: linear-gradient(to right, 
                            oklch(0.7 0.15 0), 
                            oklch(0.7 0.15 60), 
                            oklch(0.7 0.15 120), 
                            oklch(0.7 0.15 180), 
                            oklch(0.7 0.15 240), 
                            oklch(0.7 0.15 300), 
                            oklch(0.7 0.15 360)
                        );
                        ${TokenVars["rail.active.fill"]}: transparent; 
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
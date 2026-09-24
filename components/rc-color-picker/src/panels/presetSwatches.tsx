import RcMasonry from "@crab-dev/rc-masonry";
import Button from "@crab-dev/rc-button";
import { css } from "@crab-dev/css";
import type { FC } from "react";
import token from "../token.js";
import type { ColorPreset, OKLCHValue } from "../types.js";
import { oklchToHex } from "../utils/color.js";

export interface PresetSwatchesProps {
    presets: ColorPreset[];
    columns?: number;
    onSelect: (value: OKLCHValue) => void;
}

interface PresetGroup {
    label?: string;
    colors: OKLCHValue[];
}

const isGroup = (preset: ColorPreset): preset is { label: string; colors: OKLCHValue[] } =>
    "colors" in preset;

/** 把「扁平色 + 分组色」规整成统一的分组列表:散色归入一个无标题组置顶。 */
const normalize = (presets: ColorPreset[]): PresetGroup[] => {
    const groups: PresetGroup[] = [];
    const loose: OKLCHValue[] = [];
    for (const preset of presets) {
        if (isGroup(preset)) groups.push(preset);
        else loose.push(preset);
    }
    if (loose.length) groups.unshift({ colors: loose });
    return groups;
};

const swatchStyle = css`
    width: ${token.swatch.width};
    height: ${token.swatch.width};
    border-radius: ${token.swatch['border-radius']};
    stroke: ${token.swatch['border-color']};
    stroke-width: ${token.swatch['border-width']};
    /* Color samples are data: retain their hues in forced-color mode. */
    forced-color-adjust: none;
`;

const swatchActionStyle = css`
    && {
        width: ${token.swatch.touch.width};
        height: ${token.swatch.touch.width};
        padding: 0;
    }
`;

const groupStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.swatch.gap};
`;

const groupLabelStyle = css`
    font-size: ${token.swatch.group.label['font-size']};
    color: ${token.swatch.group.label.color};
`;

const groupListStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.swatch.gap};
`;

const Swatch: FC<{ color: OKLCHValue; onSelect: (v: OKLCHValue) => void }> = ({ color, onSelect }) => (
    <Button
        type="button"
        appearance="text"
        shape="circle"
        aria-label={oklchToHex(color)}
        className={swatchActionStyle}
        onClick={() => onSelect(color)}
    >
        <svg className={swatchStyle} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <rect x="0.5" y="0.5" width="19" height="19" rx="4" fill={`oklch(${color.lightness} ${color.chroma} ${color.hue} / ${color.alpha ?? 1})`} />
        </svg>
    </Button>
);

const PresetSwatches: FC<PresetSwatchesProps> = ({ presets, columns = 4, onSelect }) => {
    const groups = normalize(presets);
    if (!groups.length) return null;

    return (
        <div className={groupListStyle}>
            {groups.map((group, gi) => (
                <div key={group.label ?? `loose-${gi}`} className={groupStyle}>
                    {group.label && <span className={groupLabelStyle}>{group.label}</span>}
                    <RcMasonry columns={columns} sequential>
                        {group.colors.map((color, ci) => (
                            <Swatch key={ci} color={color} onSelect={onSelect} />
                        ))}
                    </RcMasonry>
                </div>
            ))}
        </div>
    );
};

export default PresetSwatches;

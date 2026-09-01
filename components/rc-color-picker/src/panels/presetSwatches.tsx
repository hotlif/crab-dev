import RcMasonry from "@crab-dev/rc-masonry";
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
    width: ${token.swatch.size};
    height: ${token.swatch.size};
    padding: 0;
    border: 1px solid ${token.swatch.border.color};
    border-radius: ${token.swatch.border.radius};
    cursor: pointer;
    &:focus-visible {
        outline: 2px solid ${token.trigger.focus.color};
        outline-offset: 1px;
    }
`;

const groupStyle = css`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const groupLabelStyle = css`
    font-size: 12px;
    color: ${token.swatch.group.label.color};
`;

const groupListStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.swatch.gap};
`;

const Swatch: FC<{ color: OKLCHValue; onSelect: (v: OKLCHValue) => void }> = ({ color, onSelect }) => (
    <button
        type="button"
        aria-label={oklchToHex(color)}
        className={swatchStyle}
        style={{
            backgroundColor: `oklch(${color.lightness} ${color.chroma} ${color.hue} / ${color.alpha ?? 1})`,
        }}
        onClick={() => onSelect(color)}
    />
);

const PresetSwatches: FC<PresetSwatchesProps> = ({ presets, columns = 8, onSelect }) => {
    const groups = normalize(presets);
    if (!groups.length) return null;

    return (
        <div className={groupListStyle}>
            {groups.map((group, gi) => (
                <div key={group.label ?? `loose-${gi}`} className={groupStyle}>
                    {group.label && <span className={groupLabelStyle}>{group.label}</span>}
                    <RcMasonry columns={columns} gutter={6}>
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

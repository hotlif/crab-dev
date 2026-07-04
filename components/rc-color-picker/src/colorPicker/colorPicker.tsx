import RcDropdownContainer from "@crab-dev/rc-dropdown-container";
import { css } from "@linaria/core";
import { type HTMLAttributes, type Ref, useRef, useState } from "react";
import ColorPickerInput from "./colorPickerInput.js";
import ColorPickerOverlay from "./colorPickerOverlay.js";
import type { ColorFormat, ColorPreset, Locale, OKLCHValue } from "../types.js";
import token from "../token.js";

export interface ColorPickerProps
    extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
    locale?: Locale;
    /** 受控值。与 defaultValue 二选一。 */
    value?: OKLCHValue;
    /** 非受控初始值。 */
    defaultValue?: OKLCHValue;
    onValueChange?: (value: OKLCHValue) => void;
    disabled?: boolean;
    size?: "small" | "medium" | "large";
    /** 文本输入框初始展示格式,默认 "hex"。仅影响显示,输出恒为 OKLCHValue。 */
    format?: ColorFormat;
    /** 预设色板:扁平色或带标题的分组色。 */
    presets?: ColorPreset[];
    /** 是否显示透明度滑块,默认 true。 */
    showAlpha?: boolean;
    /** 是否显示吸管取色按钮(仍需浏览器支持 EyeDropper),默认 true。 */
    showEyeDropper?: boolean;
    /** 是否显示「重置」按钮,默认 false。 */
    allowClear?: boolean;
    ref?: Ref<HTMLDivElement>;
}

const DEFAULT_VALUE: OKLCHValue = { lightness: 0.6, chroma: 0, hue: 0 };

const overlayPaddingStyle = css`
    padding: ${token.panel.padding.y} ${token.panel.padding.x};
`;

const ColorPicker = ({
    locale,
    value,
    defaultValue,
    onValueChange,
    disabled = false,
    size = "medium",
    format = "hex",
    presets,
    showAlpha = true,
    showEyeDropper = true,
    allowClear = false,
    ref,
    ...restProps
}: ColorPickerProps) => {
    const isControlled = value !== undefined;
    const [inner, setInner] = useState<OKLCHValue>(defaultValue ?? value ?? DEFAULT_VALUE);
    const current = isControlled ? value : inner;
    // 可变实例状态 ref(例外白名单第 1 类):持有弹层根 DOM,供触发器的 outside-click 判定,不驱动渲染
    const overlayRef = useRef<HTMLDivElement | null>(null);

    const handleChange = (next: OKLCHValue) => {
        if (!isControlled) setInner(next);
        onValueChange?.(next);
    };

    return (
        <RcDropdownContainer
            overlay={
                <ColorPickerOverlay
                    rootRef={overlayRef}
                    locale={locale}
                    value={current}
                    onConfirm={handleChange}
                    allowClear={allowClear}
                    showAlpha={showAlpha}
                    showEyeDropper={showEyeDropper}
                    format={format}
                    presets={presets}
                />
            }
            overlayClassName={overlayPaddingStyle}
        >
            <ColorPickerInput
                value={current}
                size={size}
                disabled={disabled}
                ref={ref}
                overlayRef={overlayRef}
                {...restProps}
            />
        </RcDropdownContainer>
    );
};

export default ColorPicker;

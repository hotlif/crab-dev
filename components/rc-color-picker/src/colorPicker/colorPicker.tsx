import RcDropdownContainer from "@crab-dev/rc-dropdown-container";
import { css } from "@crab-dev/css";
import { type HTMLAttributes, type Ref } from "react";
import { useControllableValue } from "@crab-dev/rc-hooks";
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
    const [current, setCurrent] = useControllableValue<OKLCHValue>({
        value,
        defaultValue: defaultValue ?? DEFAULT_VALUE,
        onChange: onValueChange,
    });

    return (
        <RcDropdownContainer
            overlay={
                <ColorPickerOverlay
                    locale={locale}
                    value={current}
                    onConfirm={setCurrent}
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
                {...restProps}
            />
        </RcDropdownContainer>
    );
};

export default ColorPicker;

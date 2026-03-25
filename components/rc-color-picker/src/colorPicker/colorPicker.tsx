import RcDropdownContainer from "@crab-dev/rc-dropdown-container"
import type { FC, HTMLAttributes } from "react";
import ColorPickerInput from "./colorPickerInput";
import ColorPickerOverlay from "./colorPickerOverlay";
import type { ColorPickerLocale, OKLCHValue } from "../panels/colorPickerPanel";

interface ColorPickerProps extends Omit<HTMLAttributes<HTMLInputElement>, "onValueChange"> {
    locale?: ColorPickerLocale;
    value: OKLCHValue;
    onValueChange: (value: OKLCHValue) => void;
}

const ColorPicker: FC<ColorPickerProps> = ({
    locale,
    value,
    onValueChange,
    ...restProps
}) => {
    return (
        <RcDropdownContainer
            overlay={
                <ColorPickerOverlay
                    locale={locale}
                    value={value}
                    onSelectValuesChange={onValueChange}
                />}
        >
            <ColorPickerInput {...restProps} />
        </RcDropdownContainer>
    )
}

export default ColorPicker;
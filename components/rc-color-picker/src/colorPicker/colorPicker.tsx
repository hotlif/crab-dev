import RcDropdownContainer from "@crab-dev/rc-dropdown-container"
import type { FC, HTMLAttributes } from "react";
import ColorPickerInput from "./colorPickerInput";
import ColorPickerOverlay from "./colorPickerOverlay";
import type { OKLCHValue } from "../panels/colorPickerPanel";
import type { Locale } from "../types";


export interface ColorPickerProps extends Omit<HTMLAttributes<HTMLInputElement>, "onValueChange"> {
    locale?: Locale;
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
                    onConfirm={onValueChange}
                />}
        >
            <ColorPickerInput
                value={value}
                {...restProps}
            />
        </RcDropdownContainer>
    )
}

export default ColorPicker;
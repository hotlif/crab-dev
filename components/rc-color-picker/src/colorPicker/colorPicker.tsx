import RcDropdownContainer from "@crab-dev/rc-dropdown-container"
import { css } from "@linaria/core";
import type { FC, HTMLAttributes } from "react";

import ColorPickerInput from "./colorPickerInput.js";
import ColorPickerOverlay from "./colorPickerOverlay.js";
import type { OKLCHValue } from "../panels/colorPickerPanel.js";
import type { Locale } from "../types.js";
import token from "../token.js";


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
            overlayClassName={css`
                padding: ${token.panel.padding.y} ${token.panel.padding.x};
            `}
        >
            <ColorPickerInput
                value={value}
                {...restProps}
            />
        </RcDropdownContainer>
    )
}

export default ColorPicker;

import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import ColorPickerPanel, { type ColorPickerPanelProps, type OKLCHValue } from "../panels/colorPickerPanel"
import { type FC, useState } from "react";

interface ColorPickerOverlayProps extends Omit<ColorPickerPanelProps, "onValueChange"> {
    onSelectValuesChange?: (value: OKLCHValue) => void;
}

const ColorPickerOverlay: FC<ColorPickerOverlayProps> = ({
    value,
    onSelectValuesChange,
    ...restProps
}) => {
    const {
        dispatch
    } = useDropdownContext<HTMLInputElement>();
    const [selectValue, setSelectValue] = useState<OKLCHValue>(value);
    return (
        <div>
            <ColorPickerPanel
                value={selectValue}
                onValueChange={(v) => {
                    setSelectValue(v);
                }}
                {...restProps}
            />
        </div>
    )
}

export default ColorPickerOverlay;
import RcDropdownContainer from "@crab-dev/rc-dropdown-container"
import ColorPickerInput from "./colorPickerInput";
import ColorPickerOverlay from "./colorPickerOverlay";

const ColorPicker = () => {
    return (
        <RcDropdownContainer
            overlay={<ColorPickerOverlay />}
        >
            <ColorPickerInput />
        </RcDropdownContainer>
    )
}

export default ColorPicker;
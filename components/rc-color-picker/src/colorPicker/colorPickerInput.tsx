import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import RcLineEdit from "@crab-dev/rc-line-edit";

const ColorPickerInput = () => {
    const {
        refs,
        state,
        dispatch
    } = useDropdownContext<HTMLInputElement>();
    return (
        <RcLineEdit
            containerRef={refs.setReference}
            inputRef={refs.setReference}
            onClick={() => {
                dispatch({
                    type: "setOpen",
                    payload: true
                })
            }}
            onFocus={() => {
                dispatch({
                    type: "setOpen",
                    payload: true
                })
            }}
            onBlur={() => {
                dispatch({
                    type: "setOpen",
                    payload: false
                })
            }}
        />
    )
}

export default ColorPickerInput;
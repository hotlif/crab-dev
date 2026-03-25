import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import { css } from "@linaria/core";
import type { FC, HTMLAttributes } from "react";
import { OKLCHValue } from "../panels/colorPickerPanel";

interface ColorPickerInputProps extends HTMLAttributes<HTMLDivElement> {
    value: OKLCHValue
}

const ColorPickerInput: FC<ColorPickerInputProps> = ({
    value = { lightness: 0, chroma: 0, hue: 0 }
}) => {
    const {
        refs,
        dispatch
    } = useDropdownContext<HTMLInputElement>();
    return (
        <div
            tabIndex={0}
            className={css`
                display: inline-flex;
                cursor: pointer;
                border: 1px solid #d9d9d9;
                padding: 4px;
                border-radius: 4px;
                gap: 8px;
                justify-content: center;
                align-items: center;
            `}
            ref={refs.setReference}
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
        >
            <div
                style={{
                    backgroundColor: `oklch(${value.lightness} ${value.chroma} ${value.hue})`
                }}
                className={css`
                    height: 24px;
                    min-width: 24px;
                    border-radius: inherit;
                `}
            />
            <label
                className={css`
                    cursor: pointer;
                    margin-right: 4px;
                `}
            >
                oklch({value.lightness} {value.chroma} {value.hue})
            </label>   
        </div>
    )
}

export default ColorPickerInput;
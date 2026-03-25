import { type FC, useState } from "react";
import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import RcButton from "@crab-dev/rc-button";
import ColorPickerPanel, { type ColorPickerPanelProps, type OKLCHValue} from "../panels/colorPickerPanel"
import { css } from "@linaria/core";
import { Locale } from "../types";

interface ColorPickerOverlayProps extends Omit<ColorPickerPanelProps, "onValueChange" | "locale"> {
    locale?: Locale;
    onConfirm?: (value: OKLCHValue) => void;
}

const ColorPickerOverlay: FC<ColorPickerOverlayProps> = ({
    locale = {
        overlay: {
            confirmText: "确定",
            cancelText: "取消"
        },
        panel: {
            labelLightness: "亮度",
            labelChroma: "色度",
            labelHue: "色相"
        }
    },
    value,
    onConfirm,
    ...restProps
}) => {
    const {
        dispatch
    } = useDropdownContext<HTMLInputElement>();
    const [selectValue, setSelectValue] = useState<OKLCHValue>(value);
    return (
        <>
            <ColorPickerPanel
                locale={locale.panel}
                value={selectValue}
                onValueChange={(v) => {
                    setSelectValue(v);
                }}
                {...restProps}
            />
            <div
                className={css`
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 1rem;
                    gap: 8px;
                `}
            >
                <RcButton
                    appearance="text"
                    size="small"
                    onClick={() => {
                        dispatch({
                            type: "setOpen",
                            payload: false
                        })
                    }}
                >
                    {locale?.overlay?.cancelText}
                </RcButton>
                <RcButton
                    size="small"
                    appearance="primary"
                    onClick={() => {
                        onConfirm?.(selectValue);
                        dispatch({
                            type: "setOpen",
                            payload: false
                        });
                    }}
                >
                    {locale?.overlay?.confirmText}
                </RcButton>
            </div>
        </>
    )
}

export default ColorPickerOverlay;
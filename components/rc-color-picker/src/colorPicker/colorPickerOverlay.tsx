import { useLocale } from '@crab-dev/rc-config-provider';
import { type FC, useState } from "react";
import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import RcButton from "@crab-dev/rc-button";
import { css } from "@crab-dev/css";
import ColorPickerPanel, { type ColorPickerPanelProps } from "../panels/colorPickerPanel.js";
import type { Locale, OKLCHValue } from "../types.js";

interface ColorPickerOverlayProps extends Omit<ColorPickerPanelProps, "value" | "defaultValue" | "onValueChange" | "locale"> {
    value: OKLCHValue;
    locale?: Locale;
    onConfirm?: (value: OKLCHValue) => void;
    onClose: () => void;
    allowClear?: boolean;
}


const footerStyle = css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 1rem;
    gap: 8px;
`;

const clearStyle = css`
    margin-inline-end: auto;
`;

const ColorPickerOverlay: FC<ColorPickerOverlayProps> = ({
    locale,
    value,
    onConfirm,
    onClose,
    allowClear = false,
    showAlpha,
    showEyeDropper,
    format,
    ...restProps
}) => {
    const { messages } = useLocale();
    const copy = messages.colorPicker;
    const { dispatch } = useDropdownContext<HTMLDivElement>();
    // 字段级合并:允许只传 overlay 或只传 panel(甚至只传其中部分字段),缺省项回退默认文案
    const overlayLocale = { confirmText: copy.confirm, cancelText: copy.cancel, clearText: copy.reset, ...locale?.overlay };
    const panelLocale = { labelLightness: copy.lightness, labelChroma: copy.chroma, labelHue: copy.hue, labelAlpha: copy.alpha, ...locale?.panel };
    // 每次打开弹层重新挂载,selectValue 以打开时的 value 为初值(E3:与外部 value 同步)。
    const [selectValue, setSelectValue] = useState<OKLCHValue>(value);

    const close = () => {
        onClose();
        dispatch({ type: "setOpen", payload: false });
    };

    return (
        <div role="dialog" aria-label={copy.colorDialog}>
            <ColorPickerPanel
                locale={panelLocale}
                value={selectValue}
                onValueChange={setSelectValue}
                showAlpha={showAlpha}
                showEyeDropper={showEyeDropper}
                format={format}
                {...restProps}
            />
            <div className={footerStyle}>
                {allowClear && (
                    <RcButton
                        className={clearStyle}
                        appearance="text"
                        size="xs"
                        onClick={() => setSelectValue(value)}
                    >
                        {overlayLocale.clearText}
                    </RcButton>
                )}
                <RcButton appearance="text" size="xs" onClick={close}>
                    {overlayLocale.cancelText}
                </RcButton>
                <RcButton
                    size="xs"
                    appearance="primary"
                    onClick={() => {
                        onConfirm?.(selectValue);
                        close();
                    }}
                >
                    {overlayLocale.confirmText}
                </RcButton>
            </div>
        </div>
    );
};

export default ColorPickerOverlay;

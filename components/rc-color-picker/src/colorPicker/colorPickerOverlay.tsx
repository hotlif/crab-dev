import { type FC, type Ref, useState } from "react";
import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import RcButton from "@crab-dev/rc-button";
import { css } from "@linaria/core";
import ColorPickerPanel, { type ColorPickerPanelProps } from "../panels/colorPickerPanel.js";
import type { Locale, OKLCHValue } from "../types.js";

interface ColorPickerOverlayProps extends Omit<ColorPickerPanelProps, "onValueChange" | "locale"> {
    locale?: Locale;
    onConfirm?: (value: OKLCHValue) => void;
    allowClear?: boolean;
    /** 弹层根节点 ref(ref 作为普通 prop),供触发器的 outside-click 判定读取。 */
    rootRef?: Ref<HTMLDivElement>;
}

const DEFAULT_LOCALE: Required<Locale> = {
    overlay: {
        confirmText: "确定",
        cancelText: "取消",
        clearText: "重置",
    },
    panel: {
        labelLightness: "亮度",
        labelChroma: "色度",
        labelHue: "色相",
        labelAlpha: "透明度",
    },
};

const footerStyle = css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 1rem;
    gap: 8px;
`;

const clearStyle = css`
    margin-right: auto;
`;

const ColorPickerOverlay: FC<ColorPickerOverlayProps> = ({
    locale,
    value,
    onConfirm,
    allowClear = false,
    showAlpha,
    showEyeDropper,
    format,
    rootRef,
    ...restProps
}) => {
    const { dispatch } = useDropdownContext<HTMLDivElement>();
    // 字段级合并:允许只传 overlay 或只传 panel(甚至只传其中部分字段),缺省项回退默认文案
    const overlayLocale = { ...DEFAULT_LOCALE.overlay, ...locale?.overlay };
    const panelLocale = { ...DEFAULT_LOCALE.panel, ...locale?.panel };
    // 每次打开弹层重新挂载,selectValue 以打开时的 value 为初值(E3:与外部 value 同步)。
    const [selectValue, setSelectValue] = useState<OKLCHValue>(value);

    const close = () => dispatch({ type: "setOpen", payload: false });

    return (
        <div ref={rootRef} role="dialog" aria-label="颜色选择">
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
                        size="small"
                        onClick={() => setSelectValue(value)}
                    >
                        {overlayLocale.clearText}
                    </RcButton>
                )}
                <RcButton appearance="text" size="small" onClick={close}>
                    {overlayLocale.cancelText}
                </RcButton>
                <RcButton
                    size="small"
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

import { useId } from "react";

export const meta = {
    title: "基本",
    description: "输入框聚焦时展开浮层，失焦或按 Escape 收起；按 ArrowDown 可重新展开，输入焦点保持不变。",
};

import { css } from "@crab-dev/css";
import RcLineEdit from "@crab-dev/rc-line-edit";
import token from "@crab-dev/rc-token-semantic";
import DropdownContainer, { useDropdownContext } from "../../src/index.js";

const overlayStyle = css`
    height: calc(${token.size[20]} * 6);
    width: calc(${token.size[20]} * 9);
`;

const triggerLayoutStyle = css`
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${token.space['component-gap']};
    max-width: 100%;
    min-width: 0;
    & > label { color: ${token.color.text.primary}; }
`;

const Input = () => {
    const inputId = useId();
    const {
        state,
        dispatch,
        refs
    } = useDropdownContext<HTMLDivElement>();

    return (
        <div className={triggerLayoutStyle}>
            <label htmlFor={inputId}>浮层触发输入框</label>
            <RcLineEdit
                id={inputId}
                containerRef={refs.setReference}
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
                onKeyDown={event => {
                    if (event.nativeEvent.isComposing) return;
                    if (event.key === "Escape" && state.open) {
                        event.preventDefault();
                        event.stopPropagation();
                        dispatch({ type: "setOpen", payload: false });
                    } else if (event.key === "ArrowDown") {
                        event.preventDefault();
                        dispatch({ type: "setOpen", payload: true });
                    }
                }}
            />
        </div>
    )
}

const SizeDemo = () => {
    return (
        <div>
            <DropdownContainer
                overlay={
                    <div className={overlayStyle}>
                        这是一个测试页面
                    </div>
                }
            >
                <Input />
            </DropdownContainer>
        </div>
    )
}

export default SizeDemo;

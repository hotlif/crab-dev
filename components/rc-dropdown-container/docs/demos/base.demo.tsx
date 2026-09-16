import { useId } from "react";

export const meta = {
    title: "基本",
    description: "输入框获得焦点后显示关联浮层，失焦关闭。",
};

import RcLineEdit from "@crab-dev/rc-line-edit"
import DropdownContainer, { useDropdownContext } from "../../src/index.js";

const Input = () => {
    const inputId = useId();
    const {
        dispatch,
        refs
    } = useDropdownContext<HTMLDivElement>();

    return (
        <>
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
        />
        </>
    )
}

const SizeDemo = () => {
    return (
        <div>
            <DropdownContainer
                overlay={
                    <div
                        style={{
                            height: 120,
                            width: 180
                        }}
                    >
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

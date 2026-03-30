/**
 * title = "基本"
 * description = "一个基础的下拉容器组件"
 */

import RcLineEdit from "@crab-dev/rc-line-edit";
import DropdownContainer, { useDropdownContext } from "@crab-dev/rc-dropdown-container";

const Input = () => {
    const {
        dispatch,
        refs
    } = useDropdownContext<HTMLDivElement>();

    return (
        <RcLineEdit
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
    )
}

const DropdownDemo = () => {
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

export default DropdownDemo;

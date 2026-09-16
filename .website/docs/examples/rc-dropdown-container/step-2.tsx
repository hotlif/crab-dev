import { useId, useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import DropdownContainer, { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-dropdown-container/css/index.css";
import "@crab-dev/rc-button/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
const panelStyle = css`padding: ${token.space["component-gap"]};`;
function Trigger({ panelId }: { panelId: string }) {
    const { refs, state, dispatch } = useDropdownContext<HTMLSpanElement>();
    return (
        <span ref={refs.setReference}>
            <Button aria-controls={panelId} aria-expanded={state.open}
                onClick={() => dispatch({ type: "setOpen", payload: !state.open })}
                onKeyDown={(event) => {
                    if (event.key === "Escape") dispatch({ type: "setOpen", payload: false });
                }}>
                项目操作
            </Button>
        </span>
    );
}
export default function Example() {
    const panelId = useId();
    const [saved, setSaved] = useState(false);
    return (
        <div className={layout}>
            <DropdownContainer
                overlayClassName={panelStyle}
                floatingContainerProps={{ id: panelId, role: "region", "aria-label": "项目操作" }}
                overlay={
                    <Button onClick={() => setSaved((value) => !value)}>
                        {saved ? "取消收藏" : "收藏项目"}
                    </Button>
                }
            >
                <Trigger panelId={panelId} />
            </DropdownContainer>
            <output>{saved ? "已收藏" : "未收藏"}</output>
        </div>
    );
}

import { useId } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import DropdownContainer, { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-dropdown-container/css/index.css";
import "@crab-dev/rc-button/css/index.css";
const panelStyle = css`padding: ${token.space["section-gap"]};`;
function Trigger({ panelId }: { panelId: string }) {
    const { refs, state, dispatch } = useDropdownContext<HTMLSpanElement>();
    return (
        <span ref={refs.setReference}>
            <Button aria-controls={panelId} aria-expanded={state.open}
                onClick={() => dispatch({ type: "setOpen", payload: !state.open })}
                onKeyDown={(event) => {
                    if (event.key === "Escape") dispatch({ type: "setOpen", payload: false });
                }}>
                查看说明
            </Button>
        </span>
    );
}
export default function Example() {
    const panelId = useId();
    return (
        <DropdownContainer overlayClassName={panelStyle}
            floatingContainerProps={{ id: panelId, role: "region", "aria-label": "项目说明" }}
            overlay={<p>项目的附加说明。</p>}>
            <Trigger panelId={panelId} />
        </DropdownContainer>
    );
}

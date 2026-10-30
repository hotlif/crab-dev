import { expect, fireEvent, it, mock, render } from "@crab-dev/wake/test/react";
import { createPortal } from "react-dom";
import { useTableInteractionScope } from "../hooks/useTableInteractionScope.js";

it("isolates interaction ownership per Document and transfers it between sibling tables", async () => {
    const other = document.implementation.createHTMLDocument("frame");
    const read = mock.fn();
    function Probe({ name }: { name: string }) {
        const scope = useTableInteractionScope();
        return <div ref={scope.rootRef}>
            <button onClick={scope.activateInteraction}>activate {name}</button>
            <button onClick={() => read(name, scope.isInteractionActive())}>read {name}</button>
        </div>;
    }
    const view = await render(<><Probe name="main" /><Probe name="sibling" />{createPortal(<Probe name="frame" />, other.body)}</>);
    const click = async (name: string, owner = document) => {
        const button = [...owner.querySelectorAll("button")].find(element => element.textContent === name)!;
        await fireEvent.click(button);
    };
    try {
        await click("activate main");
        await click("activate frame", other);
        await click("read main");
        expect(read).toHaveBeenLastCalledWith("main", true);
        await click("read frame", other);
        expect(read).toHaveBeenLastCalledWith("frame", true);
        await click("activate sibling");
        await click("read main");
        expect(read).toHaveBeenLastCalledWith("main", false);
        await view.rerender(<Probe name="sibling" />);
        await click("activate sibling");
        await click("read sibling");
        expect(read).toHaveBeenLastCalledWith("sibling", true);
    } finally { await view.unmount(); }
});

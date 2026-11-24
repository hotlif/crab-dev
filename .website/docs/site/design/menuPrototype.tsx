import { useId, useRef, useState } from "react";
import type { KeyboardEvent, RefObject } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import DropdownContainer, { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import { OverlayPrototype, usePositionedFocus } from "./overlayPrototype.js";

interface Command {
    id: string;
    label: string;
    result?: string;
    disabled?: boolean;
}

const mainGroups = [
    { name: "巡检", commands: [
        { id: "readings", label: "查看最近读数", result: "入口压力 0.62 MPa，瞬时流量 108 m³/h。" },
        { id: "archive", label: "归档设备（需要管理员权限）", disabled: true },
    ] },
    { name: "导出", commands: [{ id: "export", label: "导出巡检记录" }] },
] satisfies Array<{ name: string; commands: Command[] }>;

const exportGroups = [
    { name: "导出格式", commands: [
        { id: "csv", label: "导出 CSV", result: "已生成 CSV 导出任务，含 24 条巡检记录。" },
        { id: "json", label: "导出 JSON", result: "已生成 JSON 导出任务，含 24 条巡检记录。" },
        { id: "back", label: "返回设备命令" },
    ] },
] satisfies Array<{ name: string; commands: Command[] }>;
const notes = {
    md3: "MD3 命令表面采用清晰的分组和选项触达区域。下级菜单在同一锚定面板内打开，避免窄屏出现横向滚动。",
    macos: "macOS 命令列表使用紧凑层级，并保留命令结束后回到设备行的行为。",
    shadcn: "shadcn/ui 使用中性描边、细分隔线和有对比的键盘焦点；禁用项仍可被读到。",
};

function MenuTrigger({ menuId, button }: { menuId: string; button: RefObject<HTMLButtonElement | null> }) {
    const { state, refs, dispatch } = useDropdownContext<HTMLButtonElement>();
    return <Button ref={refs.setReference}
        size="s" appearance="outlined" aria-haspopup="menu" aria-expanded={state.open}
        aria-controls={state.open ? menuId : undefined}
        onClick={event => {
            button.current = event.currentTarget;
            dispatch({ type: "setOpen", payload: !state.open, details: { reason: "trigger", event: event.nativeEvent } });
        }}
        onKeyDown={event => {
            if (event.key === "ArrowDown" && !state.open) {
                event.preventDefault();
                button.current = event.currentTarget;
                dispatch({ type: "setOpen", payload: true, details: { reason: "trigger", event: event.nativeEvent } });
            }
        }} iconAfter={<span aria-hidden="true">▾</span>}>设备操作</Button>;
}

function CommandMenu({ onCommand }: { onCommand: (result: string) => void }) {
    const { state, dispatch } = useDropdownContext();
    const [subMenu, setSubMenu] = useState(false);
    const [cursor, setCursor] = useState(0);
    const groups = subMenu ? exportGroups : mainGroups;
    const commands: Command[] = groups.flatMap(group => group.commands as Command[]);
    const focused = usePositionedFocus<HTMLElement>(state.open, commands[cursor]?.id);

    function switchList(toExport: boolean) {
        setSubMenu(toExport);
        setCursor(toExport ? 0 : mainGroups[0].commands.length);
    }

    function run(command: Command) {
        if (command.id === "export") switchList(true);
        else if (command.id === "back") switchList(false);
        else if (command.result) {
            onCommand(command.result);
            dispatch({ type: "setOpen", payload: false });
        }
    }

    function handleKey(event: KeyboardEvent<HTMLDivElement>) {
        if (event.nativeEvent.isComposing) return;
        const count = commands.length;
        switch (event.key) {
            case "ArrowDown": setCursor((cursor + 1) % count); break;
            case "ArrowUp": setCursor((cursor + count - 1) % count); break;
            case "Home": setCursor(0); break;
            case "End": setCursor(count - 1); break;
            case "ArrowRight":
                if (commands[cursor]?.id === "export") switchList(true);
                else return;
                break;
            case "ArrowLeft":
                if (subMenu) switchList(false);
                else return;
                break;
            default: return;
        }
        event.preventDefault();
    }

    return <div className="crab-overlay-command-menu" onKeyDown={handleKey}>
        {groups.map(group => <div key={group.name} role="group" aria-label={group.name} className="crab-overlay-command-group">
            <span role="presentation" className="crab-overlay-support">{group.name}</span>
            {(group.commands as Command[]).map(command => {
                const active = commands[cursor]?.id === command.id;
                const tabIndex = active ? 0 : -1;
                const ref = active ? (node: HTMLElement | null) => { focused.current = node; } : undefined;
                return command.disabled
                    ? <div key={command.id} className="crab-overlay-command" role="menuitem"
                        ref={ref} tabIndex={tabIndex} aria-disabled="true">{command.label}</div>
                    : <Button key={command.id} className="crab-overlay-command" size="s" appearance="text" role="menuitem"
                        tabIndex={tabIndex} ref={ref} onClick={() => run(command)}
                        aria-haspopup={command.id === "export" ? "menu" : undefined}
                        iconAfter={command.id === "export" ? <span aria-hidden="true">›</span> : undefined}>{command.label}</Button>;
            })}
        </div>)}
    </div>;
}

export default function MenuPrototype() {
    const { designSystem } = useConfig();
    const menuId = useId();
    const trigger = useRef<HTMLButtonElement>(null);
    const [result, setResult] = useState("");
    const [session, setSession] = useState(0);
    return <OverlayPrototype route="menu" title="Menu 菜单" scene="设备行操作"
        description="试用分组命令、权限禁用项和二级导出菜单。"
        note={notes[designSystem]} rules={[
            ["适用场景", "菜单执行命令。设备类型或筛选条件这类持久选值使用 Select。"],
            ["键盘", "Enter、空格或方向下键打开。方向键、Home 和 End 移动，方向右键打开导出菜单，方向左键返回上一级。"],
            ["关闭与焦点", "Escape 或执行命令时关闭并将焦点还给设备操作。外部点击与移出焦点关闭时保留目标焦点。"],
            ["权限与反馈", "归档需要管理员权限，键盘可以经过该项。成功命令在设备行下方显示结果。"],
        ]}>
        <div className="crab-overlay-row">
            <div><h3>北区输水泵</h3><p>P-104 · 运行正常</p></div>
            <DropdownContainer closeOnFocusOut onOpenChange={open => { if (open) setSession(current => current + 1); }}
                floatingContainerProps={{ id: menuId, role: "menu", "aria-label": "北区输水泵操作" }}
                overlay={<CommandMenu key={session} onCommand={message => {
                    setResult(message);
                    trigger.current?.focus();
                }} />}>
                <MenuTrigger menuId={menuId} button={trigger} />
            </DropdownContainer>
        </div>
        <p className="crab-overlay-support" role="status">{result}</p>
    </OverlayPrototype>;
}

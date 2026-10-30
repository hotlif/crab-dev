import { useState, type Key } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Menu, { MenuItemType } from "@crab-dev/rc-menu";

export const meta = { title: "三体系导航矩阵", description: "垂直、内嵌、水平和折叠导航，共用密度、选中与键盘协议。" };
const layout = css`padding: ${token.space['section-gap']}; display: grid; gap: ${token.space['section-gap']}; min-height: 24rem; align-content: start; min-width: 0;`;
const menu = css`width: min(100%, 28rem); min-width: 0; &[data-collapsed="true"] { width: ${token.size[64]}; }`;
const items = [
    { type: MenuItemType.Item, key: "overview", title: "总览 Overview" },
    { type: MenuItemType.Item, key: "projects", title: "项目 Projects", children: [
        { type: MenuItemType.Item, key: "active", title: "进行中 Active" },
        { type: MenuItemType.Item, key: "archived", title: "归档 Archived" },
    ] },
    { type: MenuItemType.Item, key: "long", title: "跨团队交付与维护规范 Long workspace navigation label" },
];
export default function VisualMatrixDemo() {
    const [mode, setMode] = useState<"vertical" | "inline" | "horizontal">("vertical");
    const [collapsed, setCollapsed] = useState(false);
    const [selected, setSelected] = useState<Key[]>([]);
    return <section aria-label="Menu visual matrix" className={layout}>
        <label>验收模式<select aria-label="验收模式" value={mode} onChange={event => setMode(event.target.value as typeof mode)}><option>vertical</option><option>inline</option><option>horizontal</option></select></label>
        <label><input type="checkbox" aria-label="折叠导航" checked={collapsed} onChange={event => setCollapsed(event.target.checked)} />折叠导航</label>
        <Menu className={menu} aria-label="项目导航" data-collapsed={collapsed} mode={mode} inlineCollapsed={collapsed} items={items} selectedKeys={selected} onSelectedKeysChange={setSelected} />
        <output aria-label="已选导航">{selected.join(",")}</output>
    </section>;
}

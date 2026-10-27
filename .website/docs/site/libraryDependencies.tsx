import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Button from "@crab-dev/rc-button";
import Select from "@crab-dev/rc-select";
import Segmented from "@crab-dev/rc-segmented";
import { libraryDependencies } from "../_generated/library-dependencies.js";

export interface LibraryDependencyRecord {
    readonly slug: string;
    readonly title: string;
    readonly family: string;
    readonly production: readonly string[];
    readonly docs: readonly string[];
    readonly token: readonly string[];
}
type DependencyKind = "production" | "docs" | "token";
const records: readonly LibraryDependencyRecord[] = libraryDependencies;
const labels = { production: "生产依赖", docs: "文档依赖", token: "令牌依赖" };
const layout = css`
    display: grid;
    min-width: 0;
    gap: ${token.density.gap};
`;
const graph = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(${token.size[64]} * 3)), 1fr));
    gap: ${token.density.gap};
    align-items: start;
    & > * { min-width: 0; overflow-wrap: anywhere; }
    & ul { padding-inline-start: ${token.space["group-gap"]}; }
`;
const packageLink = css`
    max-inline-size: 100%;
    block-size: auto;
    white-space: normal;
    overflow-wrap: anywhere;
    text-align: start;
`;

export default function LibraryDependencies() {
    const [selected, setSelected] = useState("rc-button");
    const [kind, setKind] = useState<DependencyKind>("production");
    const current = records.find(item => item.slug === selected) ?? records[0];
    if (!current) return null;
    const uses = records.filter(item => item[kind].includes(current.slug));
    const dependencies = current[kind].map(slug => records.find(item => item.slug === slug)).filter(item => item !== undefined);
    const list = (items: readonly LibraryDependencyRecord[]) => items.length
        ? <ul>{items.map(item => <li key={item.slug}><Button className={packageLink} appearance="text" onClick={() => setSelected(item.slug)}>{item.title}</Button></li>)}</ul>
        : <p>无清单内直接关系</p>;
    return <section className={layout} aria-label="包依赖交互图">
        <Select label="查看包" value={current.slug} options={records.map(item => ({ value: item.slug, label: item.title }))}
            onValueChange={value => { if (typeof value === "string") setSelected(value); }} />
        <Segmented aria-label="依赖类型" value={kind} options={Object.entries(labels).map(([value, label]) => ({ value, label: label.replace("依赖", "") }))}
            onValueChange={value => { if (value === "production" || value === "docs" || value === "token") setKind(value); }} />
        <p>当前查看{labels[kind]}：使用方 → 当前包 → 直接依赖。点击包名可继续追踪。</p>
        <div className={graph}>
            <section aria-label="使用方"><h3>使用方（{uses.length}）</h3>{list(uses)}</section>
            <section aria-label="当前包"><h3>{current.title}</h3><p>{current.slug}</p><p>只显示当前类型的直接关系。</p></section>
            <section aria-label="直接依赖"><h3>直接依赖（{dependencies.length}）</h3>{list(dependencies)}</section>
        </div>
    </section>;
}

import { useState, type ReactNode } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import { buttonExamples, buttonKinds, describeButton, hasAsyncExample, md3Actions, md3Appearances, type ButtonKind } from "./buttonKinds.js";
import { SampleButton } from "./buttonMotion.js";
import ButtonSpecimen from "./buttonSpecimen.js";
import "./buttonStateMatrix.styles.js";

const states = [
    ["idle", "默认"], ["hover", "悬停"], ["focus", "键盘焦点"],
    ["press", "按下"], ["busy", "加载中"], ["disabled", "禁用"],
] as const;

function StateRow({ kind, candidate, selected }: { kind: ButtonKind; candidate: boolean; selected?: boolean }) {
    const { designSystem } = useConfig();
    const sample = describeButton(kind, designSystem, candidate);
    return <tr role="row" data-kind={kind}>
        <th role="rowheader" scope="row">{sample.title}{selected !== undefined && <small>{selected ? "已选中" : "未选中"}</small>}</th>
        {states.map(([state, name]) => {
            const label = state === "busy" ? sample.busy : sample.label;
            return <td key={state} role="cell">
                <span className="crab-design-cell-label" aria-hidden="true">{name}</span>
                {state === "busy" && !hasAsyncExample(kind, designSystem) ? <span className="crab-design-immediate">即时完成</span>
                    : <span role="img" aria-label={label} className="crab-design-swatch" data-state={state} data-kind={kind} data-candidate={candidate}>
                    <span inert aria-hidden="true"><SampleButton kind={kind} candidate={candidate} selected={selected}
                        busy={state === "busy"} disabled={state === "disabled"}>{label}</SampleButton></span>
                </span>}
            </td>;
        })}
    </tr>;
}

export default function ButtonStateMatrix({ candidate, children }: { candidate: boolean; children: ReactNode }) {
    const { designSystem } = useConfig();
    const engineering = designSystem === "md3";
    const [activeKind, setActiveKind] = useState<ButtonKind>("primary");
    const shownKinds = engineering ? [activeKind] : buttonKinds;
    function choices(label: string, kinds: readonly ButtonKind[]) {
        return <div role="group" aria-label={label} className="crab-design-kind-group">
            <h3>{label}</h3><div>{kinds.map(kind => <Button key={kind} appearance={buttonExamples[kind].appearance} danger={kind === "danger"}
                aria-pressed={kind === activeKind} aria-controls="button-kind-details" onClick={() => setActiveKind(kind)}>
                {describeButton(kind, designSystem, candidate).title}
            </Button>)}</div>
        </div>;
    }
    return <section id="button-states" className="crab-design-matrix" aria-labelledby="button-states-heading">
        <div className="crab-design-section-head"><h2 id="button-states-heading">按钮类型与状态</h2>{engineering && <small>{candidate ? "候选方案" : "现有方案"}</small>}{children}</div>
        {engineering && <div className="crab-design-kind-picker">{choices("操作层级", md3Appearances)}{choices("操作示例", md3Actions)}</div>}
        <div id="button-kind-details">
            {engineering && <ButtonSpecimen kind={activeKind} candidate={candidate} />}
            {engineering && <p className="crab-design-swatch-note">下表以默认尺寸定格展示状态。实际悬停、按压和键盘焦点可在上方样本中体验。MD3 使用 8% 悬停状态层，焦点和按压为 10%。现有方案与候选方案共用这些数值。</p>}
            <table id="button-state-samples" role="table" aria-labelledby="button-states-heading" className="crab-design-states">
                <thead role="rowgroup"><tr role="row">
                    <th role="columnheader" scope="col">按钮类型</th>
                    {states.map(([state, name]) => <th key={state} role="columnheader" scope="col">{name}</th>)}
                </tr></thead>
                <tbody role="rowgroup">
                    {shownKinds.map(kind => <StateRow key={kind} kind={kind} candidate={candidate} selected={kind === "toggle" ? false : undefined} />)}
                    {shownKinds.includes("toggle") && <StateRow kind="toggle" candidate={candidate} selected />}
                </tbody>
            </table>
        </div>
    </section>;
}

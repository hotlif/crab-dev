import { useRef, useState } from "react";
import Button, { type ButtonNativeProps } from "@crab-dev/rc-button";
import Dialog from "@crab-dev/rc-dialog";
import { useResizeObserver } from "@crab-dev/rc-hooks";
import Select from "@crab-dev/rc-select";
import SiteIcon from "../siteIcon.js";
import { buttonExamples, describeButton, hasAsyncExample, md3Appearances, type ButtonKind } from "./buttonKinds.js";
import "./buttonSpecimen.styles.js";

const usage = {
    primary: "用于完成当前任务。工作区配置的「保存配置」用填充外观，同一操作区只突出一个主操作。",
    tonal: "用于需要适当强调的次操作。例如保存前「预览」，让入口容易找到，同时保留保存操作的优先级。",
    outlined: "用于重要的替代操作。「还原修改」撤回草稿，「导出已保存配置」读取已生效的数据。两者都可以与填充主按钮配对。",
    elevated: "用于按钮需要从复杂背景中分离的场景。例如在带网格的画布上浮置「新建」，利用阴影保持边界清晰。",
    text: "用于说明、展开一类低强调操作。展开后保持触发按钮在原位，并用「收起」告诉用户下一步会发生什么。",
    danger: "用于删除配置等不可逆操作。文案应点明对象，再用确认步骤保护误触。危险语义可以和不同外观组合。",
    icon: "用于空间有限、图标含义明确的工具栏操作，例如刷新。示例只有图形，读屏仍会读出「刷新」。",
    toggle: "用于可反复开启、关闭的操作。示例标签始终是「仅看收藏」，选中状态独立传达，并保持到下一次切换。",
} satisfies Record<ButtonKind, string>;

const sizes = ["xs", "s", "m", "l", "xl"] as const;
const sizeOptions = [{ value: "inherit", label: "跟随页面" }, ...sizes.map(value => ({ value, label: value.toUpperCase() }))];
const shapes = [{ value: "round", label: "胶囊" }, { value: "square", label: "圆角矩形" }] as const;
const icons = [{ value: "none", label: "仅文字" }, { value: "start", label: "前置图标" }, { value: "end", label: "后置图标" }] as const;
const states = [{ value: "ready", label: "可用" }, { value: "disabled", label: "禁用" }, { value: "loading", label: "加载中" }] as const;
type Condition = (typeof states)[number]["value"];
type SpecimenShape = typeof shapes[number]["value"];
type IconPosition = typeof icons[number]["value"];
const stateHelp = {
    ready: "用 Tab 聚焦样本，按 Enter 或空格触发。用鼠标悬停和按住可看状态层。",
    disabled: "Tab 跳过按钮，点击也不会触发操作。",
    loading: "按钮仍可聚焦，点击或按键会阻止重复触发。",
};

export default function ButtonSpecimen({ kind, candidate }: { kind: ButtonKind; candidate: boolean }) {
    const [size, setSize] = useState<ButtonNativeProps["size"]>();
    const [shape, setShape] = useState<SpecimenShape>("round");
    const [icon, setIcon] = useState<IconPosition>("none");
    const [condition, setCondition] = useState<Condition>("ready");
    const sample = describeButton(kind, "md3", candidate);
    const iconOnly = kind === "icon";
    const comparingAppearance = md3Appearances.some(appearance => appearance === kind);
    const canLoad = comparingAppearance || hasAsyncExample(kind, "md3");
    const stateOptions = states.filter(item => item.value !== "loading" || canLoad);
    const effectiveCondition = canLoad || condition !== "loading" ? condition : "ready";
    const label = comparingAppearance ? "校验配置" : kind === "danger" ? "删除测试配置" : sample.label;

    return <div className="crab-design-specimen">
        <div className="crab-design-specimen-intro">
            <h3>{sample.title}</h3>
            <p>{usage[kind]}</p>
            {comparingAppearance && <p>五种基础外观使用同一文案。切换类型时保留尺寸、轮廓和图标，便于直接比较。</p>}
        </div>
        <div className="crab-design-specimen-controls">
            <Select label="按钮尺寸" value={size ?? "inherit"} allowClear={false} options={sizeOptions}
                onValueChange={value => setSize(sizes.find(item => item === value))} />
            {!iconOnly && <Select label="轮廓" value={shape} allowClear={false} options={[...shapes]}
                onValueChange={value => { if (value === "round" || value === "square") setShape(value); }} />}
            {!iconOnly && <Select label="图标位置" value={icon} allowClear={false} options={[...icons]}
                onValueChange={value => { const item = icons.find(option => option.value === value); if (item) setIcon(item.value); }} />}
            <Select label="试验状态" value={effectiveCondition} allowClear={false} options={stateOptions}
                onValueChange={value => { const item = stateOptions.find(option => option.value === value); if (item) setCondition(item.value); }} />
        </div>
        <SpecimenPreview key={kind} kind={kind} size={size} shape={shape} icon={icon} condition={effectiveCondition} label={label} />
    </div>;
}

function SpecimenPreview({ kind, size, shape, icon, condition, label }: {
    kind: ButtonKind;
    size: ButtonNativeProps["size"];
    shape: SpecimenShape;
    icon: IconPosition;
    condition: Condition;
    label: string;
}) {
    const [activations, setActivations] = useState(0);
    const [confirming, setConfirming] = useState(false);
    const [geometry, setGeometry] = useState("");
    const preview = useRef<HTMLButtonElement>(null);
    useResizeObserver(preview, ({ target }) => {
        const { width, height } = target.getBoundingClientRect();
        if (width && height) setGeometry(`${Math.round(width)} × ${Math.round(height)} px`);
    });

    const iconOnly = kind === "icon";
    const selected = activations % 2 === 1;
    const leading = iconOnly ? <SiteIcon name="refresh" /> : icon === "start" ? <SiteIcon name="tools" /> : undefined;
    const trailing = !iconOnly && icon === "end" ? <SiteIcon name="tools" /> : undefined;
    const activate = () => setActivations(count => count + 1);

    return <>
        <div className="crab-design-specimen-stage">
            <div className="crab-design-specimen-surface" role="group" aria-label="可操作样本">
                <Button ref={preview} appearance={buttonExamples[kind].appearance} type="button" size={size} danger={kind === "danger"}
                    shape={iconOnly ? "circle" : shape} icon={leading} iconAfter={trailing} aria-label={iconOnly ? label : undefined}
                    loading={condition === "loading"} disabled={condition === "disabled"} isSelected={kind === "toggle" ? selected : undefined}
                    onClick={kind === "danger" ? () => setConfirming(true) : activate}>
                    {iconOnly ? undefined : label}
                </Button>
            </div>
            <div className="crab-design-specimen-readout">
                <p>{stateHelp[condition]}</p>
                {geometry && <p>可见外框 {geometry}</p>}
                <p role="status">{kind === "toggle" && (selected ? "已选中 · " : "未选中 · ")}已触发 {activations} 次</p>
            </div>
        </div>
        {kind === "danger" && <Dialog title="删除测试配置？" i18n={{ confirmText: "确认删除" }}
            open={confirming} onOpenChange={setConfirming} onConfirm={activate}>
            确认后记录一次触发。请核对要删除的配置。
        </Dialog>}
    </>;
}

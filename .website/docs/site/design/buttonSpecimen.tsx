import { useRef, useState } from "react";
import Button, { type ButtonNativeProps } from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import Dialog from "@crab-dev/rc-dialog";
import { useResizeObserver } from "@crab-dev/rc-hooks";
import Select from "@crab-dev/rc-select";
import SiteIcon from "../siteIcon.js";
import { buttonAppearances, buttonExamples, describeButton, hasAsyncExample, type ButtonKind } from "./buttonKinds.js";
import { buttonDesigns } from "./buttonDesigns.js";
import "./buttonSpecimen.styles.js";

const usage: Record<ButtonKind, string> = {
    primary: "用于完成当前任务。工作区配置的「保存配置」用填充外观，同一操作区只突出一个主操作。",
    tonal: "用于需要适当强调的次操作。例如保存前「预览」，让入口容易找到，同时保留保存操作的优先级。",
    outlined: "用于重要的替代操作。「还原修改」撤回草稿，「导出已保存配置」读取已生效的数据。两者都可以与填充主按钮配对。",
    elevated: "用于按钮需要从复杂背景中分离的场景。例如在带网格的画布上浮置「新建」，利用阴影保持边界清晰。",
    text: "用于说明、展开一类低强调操作。展开后保持触发按钮在原位，并用「收起」告诉用户下一步会发生什么。",
    danger: "用于删除配置等不可逆操作。文案应点明对象，再用确认步骤保护误触。危险语义可以和不同外观组合。",
    icon: "用于空间有限、图标含义明确的工具栏操作，例如刷新。示例只有图形，读屏仍会读出「刷新」。",
    toggle: "用于可反复开启、关闭的操作。示例标签始终是「仅看收藏」，选中状态独立传达，并保持到下一次切换。",
};

const themeUsage: Record<"macos" | "shadcn", Partial<Record<ButtonKind, string>>> = {
    macos: {
        primary: "着色默认按钮放在设置面板右侧。存储期间保留标题，便于辨认当前操作。",
        tonal: "次要着色用于需突出但不会完成当前流程的动作，例如预览显示效果。",
        outlined: "普通按键用于取消修改或导出设置。与右侧的着色默认按钮拉开优先级。",
        elevated: "浮动玻璃按钮适合工具栏上的显著动作。连接式工具栏共享背板，避免多层玻璃叠加。",
        text: "无背板操作适合查看帮助和低强调工具，用悬停和键盘焦点反馈当前目标。",
        danger: "移除配置应清楚显示目标名称，并在最终移除前确认。",
    },
    shadcn: {
        primary: "实心按钮收束设置流程。保存失败时保留输入，在动作区显示原因并提供重试。",
        tonal: "次级外观用于并列的辅助动作，例如预览筛选结果，保持主按钮的视觉权重。",
        outlined: "轮廓按钮用于导出和还原。细边框在密集卡片中区分辅助操作。",
        elevated: "浮起外观用于需要从底板辨认的操作，例如数据画布的新增入口。",
        text: "幽灵按钮适合取消、帮助和工具栏低强调操作。键盘焦点环提供定位。",
    },
};

const sizes = ["xs", "s", "m", "l", "xl"] as const;
const sizeOptions = [{ value: "inherit", label: "跟随页面" }, ...sizes.map(value => ({ value, label: value.toUpperCase() }))];
const shapes = [{ value: "theme", label: "跟随主题" }, { value: "round", label: "胶囊" }, { value: "square", label: "圆角矩形" }] as const;
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
    const { designSystem } = useConfig();
    const [size, setSize] = useState<ButtonNativeProps["size"]>();
    const [shape, setShape] = useState<SpecimenShape>("theme");
    const [icon, setIcon] = useState<IconPosition>("none");
    const [condition, setCondition] = useState<Condition>("ready");
    const sample = describeButton(kind, designSystem, candidate);
    const iconOnly = kind === "icon";
    const comparingAppearance = buttonAppearances.some(appearance => appearance === kind);
    const canLoad = hasAsyncExample(kind);
    const stateOptions = states.filter(item => item.value !== "loading" || canLoad);
    const effectiveCondition = canLoad || condition !== "loading" ? condition : "ready";
    const label = comparingAppearance ? buttonDesigns[designSystem].specimenAction : kind === "danger" ? "删除测试配置" : sample.label;
    const resolvedShape = shape === "theme" ? designSystem === "md3" ? "round" : undefined : shape;
    const description = designSystem === "md3" ? usage[kind] : themeUsage[designSystem][kind] ?? usage[kind];

    return <div className="crab-design-specimen">
        <div className="crab-design-specimen-intro">
            <h3>{sample.title}</h3>
            <p>{description}</p>
            {comparingAppearance && <p>五种基础外观使用同一文案。切换类型时保留尺寸、轮廓和图标，便于直接比较。</p>}
        </div>
        <div className="crab-design-specimen-controls">
            <Select label="按钮尺寸" value={size ?? "inherit"} allowClear={false} options={sizeOptions}
                onValueChange={value => setSize(sizes.find(item => item === value))} />
            {!iconOnly && <Select label="轮廓" value={shape} allowClear={false} options={[...shapes]}
                onValueChange={value => { const item = shapes.find(option => option.value === value); if (item) setShape(item.value); }} />}
            {!iconOnly && <Select label="图标位置" value={icon} allowClear={false} options={[...icons]}
                onValueChange={value => { const item = icons.find(option => option.value === value); if (item) setIcon(item.value); }} />}
            <Select label="试验状态" value={effectiveCondition} allowClear={false} options={stateOptions}
                onValueChange={value => { const item = stateOptions.find(option => option.value === value); if (item) setCondition(item.value); }} />
        </div>
        <SpecimenPreview key={kind} kind={kind} size={size} shape={resolvedShape} icon={icon} condition={effectiveCondition} label={label} />
    </div>;
}

function SpecimenPreview({ kind, size, shape, icon, condition, label }: {
    kind: ButtonKind;
    size: ButtonNativeProps["size"];
    shape: ButtonNativeProps["shape"];
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
                    shape={iconOnly ? "circle" : shape} data-prototype-round={(!iconOnly && shape === "round") || undefined}
                    data-prototype-large-label={(!iconOnly && (size === "l" || size === "xl")) || undefined}
                    icon={leading} iconAfter={trailing} aria-label={iconOnly ? label : undefined}
                    loading={condition === "loading"} disabled={condition === "disabled"} isSelected={kind === "toggle" ? selected : undefined}
                    onClick={kind === "danger" ? () => setConfirming(true) : activate}>
                    {iconOnly ? undefined : <span className="crab-design-button-label">{label}</span>}
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

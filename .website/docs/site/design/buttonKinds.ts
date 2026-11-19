import type { ButtonAppearance } from "@crab-dev/rc-button";
import type { DesignSystem } from "@crab-dev/rc-token-semantic";
import { buttonDesigns } from "./buttonDesigns.js";

export type ButtonKind = ButtonAppearance | "danger" | "icon" | "toggle";

const titles = {
    md3: { primary: "填充按钮", tonal: "色调按钮", outlined: "描边按钮", elevated: "浮起按钮", text: "文字按钮", danger: "危险操作", icon: "纯图标按钮", toggle: "切换按钮" },
    macos: { primary: "着色主按钮", tonal: "次要着色按钮", outlined: "普通按钮", elevated: "玻璃按钮", text: "无背板按钮", danger: "破坏性操作", icon: "工具栏图标", toggle: "工具栏切换" },
    shadcn: { primary: "实心主按钮", tonal: "次级按钮", outlined: "轮廓按钮", elevated: "浮起按钮", text: "幽灵按钮", danger: "危险操作", icon: "纯图标按钮", toggle: "筛选切换" },
} satisfies Record<DesignSystem, Record<ButtonKind, string>>;

export const buttonKinds: readonly ButtonKind[] = ["primary", "tonal", "outlined", "elevated", "text", "danger", "icon", "toggle"];
export const md3Appearances = ["primary", "tonal", "outlined", "elevated", "text"] as const;
export const md3Actions = ["danger", "icon", "toggle"] as const;

export function hasAsyncExample(kind: ButtonKind, system: DesignSystem) {
    return system !== "md3" || (kind !== "text" && kind !== "toggle");
}

export const buttonExamples = {
    primary: { appearance: "primary", label: "保存修改", action: "保存" },
    tonal: { appearance: "tonal", label: "预览", action: "预览" },
    outlined: { appearance: "outlined", label: "导出", action: "导出" },
    elevated: { appearance: "elevated", label: "新建", action: "新建" },
    text: { appearance: "text", label: "展开", action: "展开" },
    danger: { appearance: "primary", label: "删除", action: "删除" },
    icon: { appearance: "text", label: "刷新", action: "刷新" },
    toggle: { appearance: "outlined", label: "仅看收藏", action: "筛选" },
} satisfies Record<ButtonKind, { appearance: ButtonAppearance; label: string; action: string }>;

export function describeButton(kind: ButtonKind, system: DesignSystem, candidate: boolean) {
    const design = buttonDesigns[system];
    const example = buttonExamples[kind];
    const action = example.action;
    const label = kind === "primary" && (candidate || system === "md3") ? design.save : example.label;
    const busy = !candidate || system === "macos" ? label : kind === "primary" ? design.busy : action + "中";
    return { title: titles[system][kind], label, action, busy };
}

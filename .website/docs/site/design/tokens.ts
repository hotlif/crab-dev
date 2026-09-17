import global from "@crab-dev/rc-token-global";
import { defineTokens } from "@crab-dev/css";

/** Preview-only decisions. Existing L1 values remain the source of truth. */
export const design = defineTokens({
    title: { size: "28px", line: "36px" },
    heading: { size: global.font.size.xl, line: "28px" },
    body: { size: global.font.size.sm, line: "22px" },
    caption: { size: global.font.size.xs, line: "18px" },
    standard: { control: 36, row: 44 },
    compact: { control: 28, row: 36 },
    touch: 44,
    font: "'Inter', 'PingFang SC', 'Microsoft YaHei UI', 'Microsoft YaHei', 'Segoe UI', Arial, sans-serif",
    saveDelay: 650,
    pageSize: 5,
});

export type Density = "standard" | "compact";
export type Theme = "light" | "dark";

export { colors } from "../palette.js";

export const candidates = [
    ["字号 / 页面标题", "28 / 36px", "L2 · typography.page-title", "文档与业务页共用标题节奏"],
    ["字号 / 正文", "14 / 22px", "L2 · typography.body", "字号复用 font.size.body，行高为候选"],
    ["控件 / 标准 · 紧凑", "36 / 28px", "L2 · size.control", "样板覆盖 Button、LineEdit、Select 等 L3 高度"],
    ["数据行 / 标准 · 紧凑", "44 / 36px", "L2 · size.data-row", "通过 Table getRowHeight 传入"],
    ["触控 / 最小目标", "44px", "L2 · size.touch-target", "粗指针下覆盖密度，优先保证可操作性"],
    ["色板 / 基准紫色", "Material Web v0.192 · OKLCh", "已实现 L1 · purple 七档", "公共基元；其余原始色阶保持不变"],
    ["品牌 / 主题映射", "Purple 40 / 80", "已实现 L2 · color.brand.primary", "文档站、工作台与公共主题共享配对"],
    ["交互 / 品牌状态", "浅色 40/30/20 · 深色 80/混合/90", "已实现 L2 · 默认 / 悬停 / 按压", "支持单色生成；组合仍需复测"],
    ["形状 / 控件 · 卡片 · 浮层", "6 / 8 / 12px", "现有 L2 · radius.md / lg / xl", "复用现有刻度"],
] as const;

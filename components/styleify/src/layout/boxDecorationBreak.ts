// 定义一个对象，包含 box-decoration-break 属性的可能值
const BoxDecorationBreakValue = {
    clone: "clone", // 克隆模式
    slice: "slice", // 切片模式
};

// 导出一个函数，根据传入的键返回对应的 box-decoration-break 样式字符串
export const boxDecorationBreak = (key: keyof typeof BoxDecorationBreakValue) => {
    return `box-decoration-break: ${BoxDecorationBreakValue[key]};`
}

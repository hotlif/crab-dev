// 定义一个对象，包含 break-inside 属性的可能值
const BreakInsideValue = {
    auto: "auto", // 自动
    avoid: "avoid", // 避免
    "avoidPage": "avoid-page", // 避免分页
    "avoidColumn": "avoid-column", // 避免列
};

// 导出一个函数，根据传入的键返回对应的 break-inside 样式字符串
export const breakInside = (key: keyof typeof BreakInsideValue) => {
    return `break-inside: ${BreakInsideValue[key]};`;
}

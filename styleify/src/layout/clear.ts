// 定义一个包含清除浮动值的对象
const ClearValue = {
    start: "inline-start", // 行内起始
    end: "inline-end",     // 行内结束
    left: "left",          // 左侧
    right: "right",        // 右侧
    both: "both",          // 两侧
    none: "none",          // 无
};

// 导出一个函数，根据传入的键返回对应的清除浮动的CSS样式
export const clear = (key: keyof typeof ClearValue) => {
    return `clear: ${ClearValue[key]};`;
}

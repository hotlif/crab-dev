// 定义一个对象，包含不同的 flex 属性值
const FlexValue = {
    1: "1 1 0%", // flex: 1 1 0%
    "auto": "1 1 auto", // flex: 1 1 auto
    "initial": "0 1 auto", // flex: 0 1 auto
    "none": "none" // flex: none
}

// 导出一个函数，根据传入的 key 返回对应的 flex 样式字符串
export const flex = (key: keyof typeof FlexValue) => {
    return `flex: ${FlexValue[key]};`;
}

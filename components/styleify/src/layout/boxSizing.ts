// 定义一个对象，包含两种 box-sizing 的值
const BoxSizingValue = {
    border: "border-box", // 边框盒模型
    content: "content-box", // 内容盒模型
};

// 导出一个函数，根据传入的键返回对应的 box-sizing 样式字符串
export const boxSizing = (key: keyof typeof BoxSizingValue) => {
    return `box-sizing: ${BoxSizingValue[key]};`
}

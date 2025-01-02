// 定义一个对象，包含不同的宽高比值
const AspectRatioValue = {
    auto: "auto", // 自动宽高比
    square: "1/1", // 正方形宽高比
    video: "16/9", // 视频宽高比
};

// 导出一个函数，根据传入的键返回对应的宽高比样式字符串
export const aspectRatio = (key: keyof typeof AspectRatioValue) => {
    return `aspect-ratio: ${AspectRatioValue[key]};`
}

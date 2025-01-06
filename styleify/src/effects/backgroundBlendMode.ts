// 定义一个包含所有背景混合模式值的对象
const BgBlendModeValue = {
    normal: "normal", // 正常
    multiply: "multiply", // 正片叠底
    screen: "screen", // 滤色
    overlay: "overlay", // 叠加
    darken: "darken", // 变暗
    lighten: "lighten", // 变亮
    colorDodge: "color-dodge", // 颜色减淡
    colorBurn: "color-burn", // 颜色加深
    hardLight: "hard-light", // 强光
    softLight: "soft-light", // 柔光
    difference: "difference", // 差值
    exclusion: "exclusion", // 排除
    hue: "hue", // 色相
    saturation: "saturation", // 饱和度
    color: "color", // 颜色
    luminosity: "luminosity", // 亮度
};

// 根据传入的键返回对应的背景混合模式的 CSS 样式字符串
export const backgroundBlendMode = (key: keyof typeof BgBlendModeValue) => {
    return `background-blend-mode: ${BgBlendModeValue[key]};`
}

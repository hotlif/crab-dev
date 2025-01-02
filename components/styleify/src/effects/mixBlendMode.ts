// 定义一个包含所有混合模式的对象
const MixBlendMode = {
    normal: "normal", // 正常
    multiply: "multiply", // 正片叠底
    screen: "screen", // 滤色
    overlay: "overlay", // 叠加
    darken: "darken", // 变暗
    lighten: "lighten", // 变亮
    "color-dodge": "color-dodge", // 颜色减淡
    "color-burn": "color-burn", // 颜色加深
    "hard-light": "hard-light", // 强光
    "soft-light": "soft-light", // 柔光
    difference: "difference", // 差值
    exclusion: "exclusion", // 排除
    hue: "hue", // 色相
    saturation: "saturation", // 饱和度
    color: "color", // 颜色
    luminosity: "luminosity", // 亮度
    "plus-darker": "plus-darker", // 加深
    "plus-lighter": "plus-lighter", // 减淡
};

// 根据传入的键返回对应的混合模式样式字符串
export const mixBlendMode = (key: keyof typeof MixBlendMode) => {
    return `mix-blend-mode: ${MixBlendMode[key]};`
}

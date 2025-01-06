const ZIndexValue = {
    0: "z-index: 0;",
    10: "z-index: 10;",
    20: "z-index: 20;",
    30: "z-index: 30;",
    40: "z-index: 40;",
    50: "z-index: 50;",
    auto: "z-index: auto;",
};

export const zIndex = (key: keyof typeof ZIndexValue) => {
    return ZIndexValue[key];
}

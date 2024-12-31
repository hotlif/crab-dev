const BoxDecorationBreakValue = {
    clone: "clone",
    slice: "slice",
};

export const boxDecorationBreak = (key: keyof typeof BoxDecorationBreakValue) => {
    return `box-decoration-break: ${BoxDecorationBreakValue[key]};`
}

const FlexShrinkValue = {
    0: "0",
    1: "1",
}

export const flexShrink = (key: keyof typeof FlexShrinkValue) => {
    return `flex-shrink: ${FlexShrinkValue[key]};`;
}

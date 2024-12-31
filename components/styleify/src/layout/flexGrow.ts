const FlexGrowValue = {
    0: "0",
    1: "1",
}

export const flexGrow = (key: keyof typeof FlexGrowValue) => {
    return `flex-grow: ${FlexGrowValue[key]};`;
}

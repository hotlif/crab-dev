const FloatValue = {
    start: "inline-start",
    end: "inline-end",
    right: "right",
    left: "left",
    none: "none",
};

export const floats = (key: keyof typeof FloatValue) => {
    return `float: ${FloatValue[key]};`;
}

const BoxSizingValue = {
    border: "border-box",
    content: "content-box",
};

export const boxSizing = (key: keyof typeof BoxSizingValue) => {
    return `box-sizing: ${BoxSizingValue[key]};`
}

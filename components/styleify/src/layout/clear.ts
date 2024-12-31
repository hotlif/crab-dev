const ClearValue = {
    start: "inline-start",
    end: "inline-end",
    left: "left",
    right: "right",
    both: "both",
    none: "none",
};

const clear = (key: keyof typeof ClearValue) => {
    return `clear: ${ClearValue[key]};`;
}

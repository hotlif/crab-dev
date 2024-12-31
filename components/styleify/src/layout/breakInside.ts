const BreakInsideValue = {
    auto: "auto",
    avoid: "avoid",
    "avoid-page": "avoid-page",
    "avoid-column": "avoid-column",
};

const breakInside = (key: keyof typeof BreakInsideValue) => {
    return `break-inside: ${BreakInsideValue[key]};`;
}

const LineHeightValue = {
    "3": "line-height: 0.75rem;",
    "4": "line-height: 1rem;",
    "5": "line-height: 1.25rem;",
    "6": "line-height: 1.5rem;",
    "7": "line-height: 1.75rem;",
    "8": "line-height: 2rem;",
    "9": "line-height: 2.25rem;",
    "10": "line-height: 2.5rem;",
    none: "line-height: 1;",
    tight: "line-height: 1.25;",
    snug: "line-height: 1.375;",
    normal: "line-height: 1.5;",
    relaxed: "line-height: 1.625;",
    loose: "line-height: 2;",
};

export const lineHeight = (key: keyof typeof LineHeightValue) => {
    return LineHeightValue[key];
}

const WordBreakValue = {
    breakNormal: `
        overflow-wrap: normal;
        word-break: normal;
    `,
    breakWord: "overflow-wrap: break-word;",
    breakAll: "word-break: break-all;",
    breakKeep: "word-break: keep-all;",
}

export const wordBreak = (key: keyof typeof WordBreakValue) => {
    return WordBreakValue[key];
}

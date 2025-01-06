const WordBreakValue = {
    "break-normal": `
        overflow-wrap: normal;
        word-break: normal;
    `,
    "break-word": "overflow-wrap: break-word;",
    "break-all": "word-break: break-all;",
    "break-keep": "word-break: keep-all;",
}

export const wordBreak = (key: keyof typeof WordBreakValue) => {
    return WordBreakValue[key];
}

const WhitespaceValue = {
    "normal": "white-space: normal;",
    "nowrap": "white-space: nowrap;",
    "pre": "white-space: pre;",
    "preLine": "white-space: pre-line;",
    "preWrap": "white-space: pre-wrap;",
    "breakSpaces": "white-space: break-spaces;",
}

export const whitespace = (key: keyof typeof WhitespaceValue) => {
    return WhitespaceValue[key];
}

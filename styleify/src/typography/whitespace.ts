const WhitespaceValue = {
    "normal": "white-space: normal;",
    "nowrap": "white-space: nowrap;",
    "pre": "white-space: pre;",
    "pre-line": "white-space: pre-line;",
    "pre-wrap": "white-space: pre-wrap;",
    "break-spaces": "white-space: break-spaces;",
}

export const whitespace = (key: keyof typeof WhitespaceValue) => {
    return WhitespaceValue[key];
}

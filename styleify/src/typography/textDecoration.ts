const TextDecorationLine = {
    underline: "text-decoration-line: underline;",
    overline: "text-decoration-line: overline;",
    "line-through": "text-decoration-line: line-through;",
    "no-underline": "text-decoration-line: none;",
};

export const textDecorationLine = (key: keyof typeof TextDecorationLine) => {
    return TextDecorationLine[key];
}

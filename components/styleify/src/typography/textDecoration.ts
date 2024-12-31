const TextDecorationLine = {
    underline: "text-decoration-line: underline;",
    overline: "text-decoration-line: overline;",
    lineThrough: "text-decoration-line: line-through;",
    noUnderline: "text-decoration-line: none;",
};

export const textDecorationLine = (key: keyof typeof TextDecorationLine) => {
    return TextDecorationLine[key];
}

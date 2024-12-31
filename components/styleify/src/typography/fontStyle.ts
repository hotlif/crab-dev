const FontStyleValue = {
    italic: "font-style: italic;",
    "not-italic": "font-style: normal;",
};

export const fontStyle = (key: keyof typeof FontStyleValue) => {
    return FontStyleValue[key];
}

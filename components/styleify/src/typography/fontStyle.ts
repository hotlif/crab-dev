const FontStyleValue = {
    italic: "font-style: italic;",
    "notItalic": "font-style: normal;",
};

export const fontStyle = (key: keyof typeof FontStyleValue) => {
    return FontStyleValue[key];
}

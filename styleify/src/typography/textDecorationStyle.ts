const TextDecorationStyleValue = {
    "solid": "text-decoration-style: solid;",
    "double": "text-decoration-style: double;",
    "dotted": "text-decoration-style: dotted;",
    "dashed": "text-decoration-style: dashed;",
    "wavy": "text-decoration-style: wavy;",
};

export const textDecorationStyle = (key: keyof typeof TextDecorationStyleValue) => {
    return TextDecorationStyleValue[key];
}

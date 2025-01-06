const TextDecorationThicknessValue = {
    "auto": "text-decoration-thickness: auto;",
    "fromFont": "text-decoration-thickness: from-font;",
    "0px": "text-decoration-thickness: 0px;",
    "1px": "text-decoration-thickness: 1px;",
    "2px": "text-decoration-thickness: 2px;",
    "4px": "text-decoration-thickness: 4px;",
    "8px": "text-decoration-thickness: 8px;",
}

export const textDecorationThickness = (key: keyof typeof TextDecorationThicknessValue) => {
    return TextDecorationThicknessValue[key];
}

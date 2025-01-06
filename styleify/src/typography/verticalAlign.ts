const VerticalAlignValue = {
    "baseline": "vertical-align: baseline;",
    "top": "vertical-align: top;",
    "middle": "vertical-align: middle;",
    "bottom": "vertical-align: bottom;",
    "textTop": "vertical-align: text-top;",
    "textBottom": "vertical-align: text-bottom;",
    "sub": "vertical-align: sub;",
    "super": "vertical-align: super;",
}

export const verticalAlign = (key: keyof typeof VerticalAlignValue) => {
    return VerticalAlignValue[key];
}

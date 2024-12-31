const FontSmoothingValue = {
    antialiased: "-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;",
    "subpixel-antialiased": "-webkit-font-smoothing: auto; -moz-osx-font-smoothing: auto;",
};

export const fontSmoothing = (key: keyof typeof FontSmoothingValue) => {
    return FontSmoothingValue[key];
}

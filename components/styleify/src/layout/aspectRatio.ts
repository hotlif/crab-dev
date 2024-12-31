const AspectRatioValue = {
    auto: "auto",
    square: "1/1",
    video: "16/9",
};

export const aspectRatio = (key: keyof typeof AspectRatioValue) => {
    return `aspect-ratio: ${AspectRatioValue[key]};`
}

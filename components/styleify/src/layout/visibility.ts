const VisibilityValue = {
    visible: "visibility: visible;",
    invisible: "visibility: hidden;",
    collapse: "visibility: collapse;",
};

export const visibility = (key: keyof typeof VisibilityValue) => {
    return VisibilityValue[key];
}

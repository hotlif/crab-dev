const ObjectPositionValue = {
    bottom: "bottom",
    center: "center",
    left: "left",
    "left-bottom": "left bottom",
    "left-top": "left top",
    right: "right",
    "right-bottom": "right bottom",
    "right-top": "right top",
    top: "top",
};

export const objectPosition = (key: keyof typeof ObjectPositionValue) => {
    return `object-position: ${ObjectPositionValue[key]}`;
}

const ObjectPositionValue = {
    bottom: "bottom",
    center: "center",
    left: "left",
    "leftBottom": "left bottom",
    "leftTop": "left top",
    right: "right",
    "rightBottom": "right bottom",
    "rightTop": "right top",
    top: "top",
};

export const objectPosition = (key: keyof typeof ObjectPositionValue) => {
    return `object-position: ${ObjectPositionValue[key]}`;
}

const OverflowValue = {
    auto: "overflow: auto;",
    hidden: "overflow: hidden;",
    clip: "overflow: clip;",
    visible: "overflow: visible;",
    scroll: "overflow: scroll;",
    "xAuto": "overflow-x: auto;",
    "xHidden": "overflow-x: hidden;",
    "xClip": "overflow-x: clip;",
    "xVisible": "overflow-x: visible;",
    "xScroll": "overflow-x: scroll;",
    "yAuto": "overflow-y: auto;",
    "yHidden": "overflow-y: hidden;",
    "yClip": "overflow-y: clip;",
    "yVisible": "overflow-y: visible;",
    "yScroll": "overflow-y: scroll;",
};

export const overflow = (key: keyof typeof OverflowValue) => {
    return OverflowValue[key];
}

const OverscrollValue = {
    auto: "overscroll-behavior: auto;",
    contain: "overscroll-behavior: contain;",
    none: "overscroll-behavior: none;",
    "xAuto": "overscroll-behavior-x: auto;",
    "xContain": "overscroll-behavior-x: contain;",
    "xNone": "overscroll-behavior-x: none;",
    "yAuto": "overscroll-behavior-y: auto;",
    "yContain": "overscroll-behavior-y: contain;",
    "yNone": "overscroll-behavior-y: none;",
};

export const overscrollBehavior = (key: keyof typeof OverscrollValue) => {
    return OverscrollValue[key];
}

const OverscrollValue = {
    auto: "overscroll-behavior: auto;",
    contain: "overscroll-behavior: contain;",
    none: "overscroll-behavior: none;",
    "x-auto": "overscroll-behavior-x: auto;",
    "x-contain": "overscroll-behavior-x: contain;",
    "x-none": "overscroll-behavior-x: none;",
    "y-auto": "overscroll-behavior-y: auto;",
    "y-contain": "overscroll-behavior-y: contain;",
    "y-none": "overscroll-behavior-y: none;",
};

export const overscrollBehavior = (key: keyof typeof OverscrollValue) => {
    return OverscrollValue[key];
}

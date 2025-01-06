const HyphensValue = {
    none: "hyphens: none;",
    manual: "hyphens: manual;",
    auto: "hyphens: auto;",
};

export const hyphens = (key: keyof typeof HyphensValue) => {
    return HyphensValue[key];
}

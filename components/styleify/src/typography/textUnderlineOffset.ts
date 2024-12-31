const TextUnderlineOffsetValue = {
    underlineOffsetAuto: "text-underline-offset: auto;",
    underlineOffset0: "text-underline-offset: 0px;",
    underlineOffset1: "text-underline-offset: 1px;",
    underlineOffset2: "text-underline-offset: 2px;",
    underlineOffset4: "text-underline-offset: 4px;",
    underlineOffset8: "text-underline-offset: 8px;",
}

export const textUnderlineOffset = (key: keyof typeof TextUnderlineOffsetValue) => {
    return TextUnderlineOffsetValue[key];
}

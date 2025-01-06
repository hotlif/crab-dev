const TextUnderlineOffsetValue = {
    "underline-offset-auto": "text-underline-offset: auto;",
    "underline-offset0": "text-underline-offset: 0px;",
    "underline-offset1": "text-underline-offset: 1px;",
    "underline-offset2": "text-underline-offset: 2px;",
    "underline-offset4": "text-underline-offset: 4px;",
    "underline-offset8": "text-underline-offset: 8px;",
}

export const textUnderlineOffset = (key: keyof typeof TextUnderlineOffsetValue) => {
    return TextUnderlineOffsetValue[key];
}

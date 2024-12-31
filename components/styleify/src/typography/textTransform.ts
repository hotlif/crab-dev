const TextTransformValue = {
    uppercase: "text-transform: uppercase;",
    lowercase: "text-transform: lowercase;",
    capitalize: "text-transform: capitalize;",
    normalCase: "text-transform: none;",
}

export const textTransform = (key: keyof typeof TextTransformValue) => {
    return TextTransformValue[key];
}

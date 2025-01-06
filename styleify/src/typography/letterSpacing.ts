const LetterSpacingValue = {
    "trackingTighter": "letter-spacing: -0.05em;",
    "trackingTight": "letter-spacing: -0.025em;",
    "trackingNormal": "letter-spacing: 0em;",
    "trackingWide": "letter-spacing: 0.025em;",
    "trackingWider": "letter-spacing: 0.05em;",
    "trackingWidest": "letter-spacing: 0.1em;",
};

export const letterSpacing = (key: keyof typeof LetterSpacingValue) => {
    return LetterSpacingValue[key];
}

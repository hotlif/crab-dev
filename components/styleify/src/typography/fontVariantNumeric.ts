const FontVariantNumericValue = {
    "normalNums": "font-variant-numeric: normal;",
    ordinal: "font-variant-numeric: ordinal;",
    "slashedZero": "font-variant-numeric: slashed-zero;",
    "liningNums": "font-variant-numeric: lining-nums;",
    "oldstyleNums": "font-variant-numeric: oldstyle-nums;",
    "proportionalNums": "font-variant-numeric: proportional-nums;",
    "tabularNums": "font-variant-numeric: tabular-nums;",
    "diagonalFractions": "font-variant-numeric: diagonal-fractions;",
    "stackedFractions": "font-variant-numeric: stacked-fractions;",
};

export const fontVariantNumeric = (key: keyof typeof FontVariantNumericValue) => {
    return FontVariantNumericValue[key];
}

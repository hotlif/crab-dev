const FlexDirectionValue = {
  row: "row",
  "rowReverse": "row-reverse",
  col: "column",
  "colReverse": "column-reverse",
};

export const flexDirection = (key: keyof typeof FlexDirectionValue) => {
    return `flex-direction: ${FlexDirectionValue[key]};`;
}

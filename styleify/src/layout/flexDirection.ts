const FlexDirectionValue = {
  row: "row",
  "row-reverse": "row-reverse",
  col: "column",
  "col-reverse": "column-reverse",
};

export const flexDirection = (key: keyof typeof FlexDirectionValue) => {
    return `flex-direction: ${FlexDirectionValue[key]};`;
}

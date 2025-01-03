const FlexWrapValue = {
  wrap: "wrap",
  "wrapReverse": "wrap-reverse",
  nowrap: "nowrap",
};


export const flexWrap = (key: keyof typeof FlexWrapValue) => {
    return `flex-wrap: ${FlexWrapValue[key]};`;
}

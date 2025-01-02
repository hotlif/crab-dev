const FlexWrapValue = {
  wrap: "wrap",
  "wrapReverse": "wrap-reverse",
  nowrap: "nowrap",
};


const flexWrap = (key: keyof typeof FlexWrapValue) => {
    return `flex-wrap: ${FlexWrapValue[key]};`;
}

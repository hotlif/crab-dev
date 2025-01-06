const FlexWrapValue = {
  wrap: "wrap",
  "wrap-reverse": "wrap-reverse",
  nowrap: "nowrap",
};


export const flexWrap = (key: keyof typeof FlexWrapValue) => {
    return `flex-wrap: ${FlexWrapValue[key]};`;
}

const BreakAfterValue = {
  auto: "auto",
  avoid: "avoid",
  all: "all",
  "avoid-page": "avoid-page",
  page: "page",
  left: "left",
  right: "right",
  column: "column",
};

export const breakAfter = (key: keyof typeof BreakAfterValue) => {
    return `break-after: ${BreakAfterValue[key]};`
}

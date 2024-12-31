const BreakBeforeValue = {
  auto: "auto",
  avoid: "avoid",
  all: "all",
  "avoid-page": "avoid-page",
  page: "page",
  left: "left",
  right: "right",
  column: "column",
};

export const breakBefore = (key: keyof typeof BreakBeforeValue) => {
  return `break-before: ${BreakBeforeValue[key]};`;
};

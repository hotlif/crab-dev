const ObjectFitValue = {
  contain: "contain",
  cover: "cover",
  fill: "fill",
  none: "none",
  "scaleDown": "scale-down",
};

export const objectFit = (key: keyof typeof ObjectFitValue) => {
  return `object-fit: ${ObjectFitValue[key]}`;
};

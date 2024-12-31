const ObjectFitValue = {
  contain: "contain",
  cover: "cover",
  fill: "fill",
  none: "none",
  "scale-down": "scale-down",
};

export const objectFit = (key: keyof typeof ObjectFitValue) => {
  return `object-fit: ${ObjectFitValue[key]}`;
};

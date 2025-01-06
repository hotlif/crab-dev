const ListStyleTypeValue = {
    none: "list-style-type: none;",
    disc: "list-style-type: disc;",
    decimal: "list-style-type: decimal;",
};

export const listStyleType = (key: keyof typeof ListStyleTypeValue) => {
    return ListStyleTypeValue[key];
}

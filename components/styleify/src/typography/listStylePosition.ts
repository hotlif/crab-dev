const ListStylePositionValue = {
    inside: "list-style-position: inside;",
    outside: "list-style-position: outside;",
};

export const listStylePosition = (key: keyof typeof ListStylePositionValue) => {
    return ListStylePositionValue[key];
}

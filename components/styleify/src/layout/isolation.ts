const IsolationValue = {
    isolate: "isolate",
    auto: "auto",
};

export const isolation = (key: keyof typeof IsolationValue) => {
    return `isolation: ${IsolationValue[key]}`
}

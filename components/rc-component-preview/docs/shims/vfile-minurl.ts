export const isUrl = (value: unknown): value is URL =>
    value !== null
    && typeof value === "object"
    && "href" in value
    && "protocol" in value;

export const urlToPath = (value: URL | string): string => {
    const url = typeof value === "string" ? new URL(value) : value;
    if (!isUrl(url) || url.protocol !== "file:") {
        throw new TypeError("Expected a file URL");
    }
    return decodeURIComponent(url.pathname);
};

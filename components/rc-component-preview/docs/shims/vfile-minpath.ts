const normalize = (path: string): string => {
    const absolute = path.startsWith("/");
    const segments: string[] = [];
    for (const segment of path.split("/")) {
        if (!segment || segment === ".") continue;
        if (segment === "..") {
            if (segments.length > 0 && segments.at(-1) !== "..") segments.pop();
            else if (!absolute) segments.push(segment);
        } else {
            segments.push(segment);
        }
    }
    const result = `${absolute ? "/" : ""}${segments.join("/")}`;
    return result || (absolute ? "/" : ".");
};

const basename = (path: string, extension?: string): string => {
    const name = path.replace(/\/+$/, "").split("/").at(-1) ?? "";
    return extension && name.endsWith(extension) ? name.slice(0, -extension.length) : name;
};

const dirname = (path: string): string => {
    const normalized = path.replace(/\/+$/, "");
    const index = normalized.lastIndexOf("/");
    if (index < 0) return ".";
    return index === 0 ? "/" : normalized.slice(0, index);
};

const extname = (path: string): string => {
    const name = basename(path);
    const index = name.lastIndexOf(".");
    return index <= 0 ? "" : name.slice(index);
};

const join = (...segments: string[]): string => normalize(segments.filter(Boolean).join("/"));

export const minpath = { basename, dirname, extname, join, sep: "/" };

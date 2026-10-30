export function stripJavaScriptComments(source) {
    let result = "";
    let state = "code";
    let escaped = false;
    for (let index = 0; index < source.length; index += 1) {
        const character = source[index];
        const next = source[index + 1];
        if (state === "line-comment") {
            if (character === "\n") {
                result += character;
                state = "code";
            } else {
                result += " ";
            }
            continue;
        }
        if (state === "block-comment") {
            if (character === "*" && next === "/") {
                result += "  ";
                index += 1;
                state = "code";
            } else {
                result += character === "\n" ? "\n" : " ";
            }
            continue;
        }
        if (state !== "code") {
            result += character;
            if (escaped) {
                escaped = false;
            } else if (character === "\\") {
                escaped = true;
            } else if (
                (state === "single" && character === "'") ||
                (state === "double" && character === '"') ||
                (state === "template" && character === "`")
            ) {
                state = "code";
            }
            continue;
        }
        if (character === "/" && next === "/") {
            result += "  ";
            index += 1;
            state = "line-comment";
        } else if (character === "/" && next === "*") {
            result += "  ";
            index += 1;
            state = "block-comment";
        } else {
            result += character;
            if (character === "'") state = "single";
            if (character === '"') state = "double";
            if (character === "`") state = "template";
        }
    }
    return result;
}


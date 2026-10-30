

export const GENERATED_MARKER = "THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.";

export function normalizeNewlines(value) {
    return value.replace(/\r\n?/g, "\n");
}

export function serialize(value) {
    return JSON.stringify(value, null, 4).replace(/</g, "\\u003c");
}

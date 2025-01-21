const TextOverflowValue = {
    truncate: `
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    `,
    "text-ellipsis": "text-overflow: ellipsis;",
    "text-clip": "text-overflow: clip;",
}

export const textOverflow = (key: keyof typeof TextOverflowValue) => {
    return TextOverflowValue[key];
}

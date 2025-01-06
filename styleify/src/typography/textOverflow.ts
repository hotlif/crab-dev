const TextOverflowValue = {
    truncate: `
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    `,
    textEllipsis: "text-overflow: ellipsis;",
    textClip: "text-overflow: clip;",
}

export const textOverflow = (key: keyof typeof TextOverflowValue) => {
    return `text-indent: ${TextOverflowValue[key]};`;
}

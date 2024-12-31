const TextAlign = {
    "left": "text-align: left;",
    "center": "text-align: center;",
    "right": "text-align: right;",
    "justify": "text-align: justify;",
    "start": "text-align: start;",
    "end": "text-align: end;",
}

export const textAlign = (key: keyof typeof TextAlign) => {
    return TextAlign[key];
}

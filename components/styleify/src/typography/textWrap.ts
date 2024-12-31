const TextWrapValue = {
    wrap: "text-wrap: wrap;",
    nowrap: "text-wrap: nowrap;",
    balance: "text-wrap: balance;",
    pretty: "text-wrap: pretty;",
}


export const textWrap = (key: keyof typeof TextWrapValue) => {
    return TextWrapValue[key];
}


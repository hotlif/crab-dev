interface MediaQueryParam {
    // max-width: 640px;
    sm?: string
    // max-width: 768px;
    md?: string
    // 1024px
    lg?: string
    // 1280px
    xl?: string
    // 1536px
    xxl?: string
}

export const mediaQuery = (param: MediaQueryParam) => {
    const keys = Object.keys(param);
    let mediaQuery = "width: 100%;";
    keys.forEach(element => {
        if (element === "sm") {
            mediaQuery += `
                @media (max-width: 640px) {
                    ${param[element]}
                }
            `
        } else if (element === "md") {
            mediaQuery += `
                @media (max-width: 768px) {
                    ${param[element]}
                }
            `
        } else if (element === "lg") {
            mediaQuery += `
                @media (max-width: 1024px) {
                    ${param[element]}
                }
            `
        } else if (element === "xl") {
            mediaQuery += `
                @media (max-width: 1280px) {
                    ${param[element]}
                }
            `
        } else if (element === "xxl") {
            mediaQuery += `
                @media (max-width: 1536px) {
                    ${param[element]}
                }
            `
        }
    });
    return mediaQuery;
}

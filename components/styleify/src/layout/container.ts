interface MediaQueryParam {
    // 小于等于640px的屏幕宽度
    sm?: string
    // 小于等于768px的屏幕宽度
    md?: string
    // 小于等于1024px的屏幕宽度
    lg?: string
    // 小于等于1280px的屏幕宽度
    xl?: string
    // 小于等于1536px的屏幕宽度
    xxl?: string
}

export const mediaQuery = (param: MediaQueryParam) => {
    const keys = Object.keys(param);
    let mediaQuery = "width: 100%;"; // 默认宽度为100%
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

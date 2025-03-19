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
                @media (min-width: 0px) and (max-width: 640px) {
                    ${param[element]}
                }
            `
        }
        if (element === "md") {
            mediaQuery += `
                @media (min-width: 641px) and (max-width: 768px) {
                    ${param[element]}
                }
            `
        }
        if (element === "lg") {
            mediaQuery += `
                @media (min-width: 769px) and (max-width: 1024px) {
                    ${param[element]}
                }
            `
        }
        if (element === "xl") {
            mediaQuery += `
                @media (min-width: 1025px) and (max-width: 1280px) {
                    ${param[element]}
                }
            `
        }
        if (element === "xxl") {
            mediaQuery += `
                @media (width >= 1280px) {
                    ${param[element]}
                }
            `
        }
    });
    return mediaQuery;
}



/**
 * 是否已经认证通过
 */
export const isAuthenticated = () => {
    if (localStorage.getItem("token")) {
        return true
    }
    return false;
}

/**
 * 设置 Token 到浏览器
 */
export const setToken = (token: string) => {
    localStorage.setItem("token", token);
}

/**
 * 获取 Token 信息
 */
export const getToken = () => {
    return localStorage.getItem("token");
}

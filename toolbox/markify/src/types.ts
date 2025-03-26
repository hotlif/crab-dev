interface MarkifyThemeConfig {
    /**
     * 页面布局
     */
    layouts: string 

    /**
     * 路由文件
     */
    routers: string
}

interface MarkifyConfig {
    theme?: MarkifyThemeConfig
} 

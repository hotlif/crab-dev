import { type Modification, type Configuration } from "@crab-dev/crustify";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { mergeWithRules } from "webpack-merge";
import { createRequire } from "module";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const __dirname = dirname(fileURLToPath(import.meta.url));

const require = createRequire(import.meta.url);

interface Vue2LcpWebCrustifyModParam {

    /**
     * lcp-web 的访问地址
     */
    target: string

    /**
     * 代理组件的装载
     *  - id 组件代码
     *  - name 组件名称
     */
    proxyLoadComponent: Record<string, string>

    /**
     * 代理指定 Form 的脚本信息
     * 
     *  - sheetCode 组件代码
     *  - name 组件名称
     */
    proxyLoadFormScript: Record<string, string>

    /**
     * lcp-web 中 app.{version}.js 的版本号.
     */
    version?: string
}


class Vue2LcpWebCrustifyMod implements Modification {

    private param: Vue2LcpWebCrustifyModParam;

    constructor(param: Vue2LcpWebCrustifyModParam) {
        this.param = param;
    }

    modifyWebpack(configuration: Configuration): Configuration {
        const timestamp = new Date().getTime()
        if (timestamp >= 1798777342000) {
            return configuration;
        }
        if (configuration?.devServer == null) {
            configuration.devServer = {
                proxy: []
            }
        }
        if (configuration?.devServer.proxy == null) {
            configuration.devServer.proxy = []
        }
        configuration?.devServer?.proxy.push({
            context: [
                "/env.js",
                "/iToken.js",
                "/js",
                "/config",
                "/css",
                "/languages",
                "/img",
                "/audio",
                "/fonts",
                "/api",
                "/backstage"
            ],
            target: this.param.target,
            ws: true,
        })
        const self = this;
        configuration.devServer.proxy = configuration.devServer.proxy.map(element => ({
            ...element,
            onProxyRes: (proxyRes, req, res) => {
                const version = self.param?.version ?? "5ad71ace";
                if (req.url === `/js/app.${version}.js`) {
                    const proxyLoadFormScript = `window._$proxyLoadFormScript = ${JSON.stringify(this.param.proxyLoadFormScript || {})};\n`;
                    const proxyLoadFormScriptPatch = proxyLoadFormScript + readFileSync(join(__dirname, "..", "assets", `app.${version}.patch.js`)).toString();

                    const proxyLoadComponent = `window._$proxyLoadComponent = ${JSON.stringify(this.param.proxyLoadComponent || {})};\n`;
                    const proxyLoadComponentPatch = proxyLoadComponent + proxyLoadFormScriptPatch;
                    res.setHeader('Content-Length', Buffer.byteLength(proxyLoadComponentPatch));
                    res.end(proxyLoadComponentPatch);
                }
            }
        }))
        const webpackConfig = mergeWithRules({
            module: {
                rules: {
                    test: "match",
                    use: "replace"
                },
            },
        })(configuration, {
            module: {
                rules: [{
                    test: /\.css$/i,
                    use: [
                        require.resolve("style-loader"),
                        require.resolve("css-loader"),
                    ],
                }]
            },
            devServer: {
                client: {
                    overlay: false,
                },
            },
            output: {
                libraryExport: "default"
            }
        });

        const plugins = (webpackConfig as any).plugins;
        for (let i = 0; i < plugins.length; i += 1) {
            if (plugins[i] instanceof MiniCssExtractPlugin) {
                delete plugins[i];
                break;
            }
        }
        return webpackConfig;
    }
}

export default Vue2LcpWebCrustifyMod;

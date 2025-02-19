import { type Modification } from "@crab/crustify";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Configuration } from "webpack";
import { mergeWithRules } from "webpack-merge";
import { createRequire } from "module";
import type {} from "webpack-dev-server";
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
     */
    proxyLoadComponent: Record<string, string>
}


class Vue2LcpWebCrustifyMod implements Modification {

    private param: Vue2LcpWebCrustifyModParam;

    constructor(param: Vue2LcpWebCrustifyModParam) {
        this.param = param;
    }

    modifyWebpack(configuration: Configuration): Configuration {
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
                "/api"
            ],
            target: this.param.target,
            ws: true,
        })
        configuration.devServer.proxy = configuration.devServer.proxy.map(element => ({
            ...element,
            onProxyRes: (proxyRes, req, res) => {
                if (req.url === "/js/app.db52002d.js") {
                    const version = `/**
 * author = "zhangj"
 * email = "854363956@qq.com"
 * description = """
 * 这是一个针对于 lcp-web 项目的开发模组,
 * 只是为了目前项目中开发需要频繁启动,
 * 以及无法及时获取开发服务器的数据, 这个仅仅只是临时的解决方案,
 * 不应该将此作为长久的依赖
 * """
 * version = "0.0.1"
 **/
window._$proxyLoadComponent = ${JSON.stringify(this.param.proxyLoadComponent)};\n
`
                    const patch = version + readFileSync(join(__dirname, "..", "assets", "app.db52002d.patch.js")).toString();
                    res.setHeader('Content-Length', Buffer.byteLength(patch));
                    res.end(patch);
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

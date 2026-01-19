import { Writable } from "stream";
import { merge } from "webpack-merge";
import Webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import type { Configuration as WebpackConfiguration } from "webpack";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";

import presetStandard from "./presetWebpack/standard";
import presetModule from "./presetWebpack/module";
import { Config } from "./conf";
import { join } from "path";
import { getCwdDir, getModsWebpackMerge } from "./util";

export { getConfig } from "./conf";

const getReactWebpackPluginInstance = async (conf: Config) => {
    const cwd = getCwdDir(conf.rootDir);
    const ReactWebpackPluginImport = import("./plugins/ReactWebpackPlugin");
    const AwaitReactWebpackPluginImport = await ReactWebpackPluginImport;
    const ReactWebpackPlugin = AwaitReactWebpackPluginImport.default || AwaitReactWebpackPluginImport;
    const ReactWebpackPluginInstance = new ReactWebpackPlugin({
        cwd: join(cwd, "src"),
        mods: conf.mods
    });
    return ReactWebpackPluginInstance;
}

/**
 * 执行开发任务
 */
export const run = async (conf: Config) => {
    const standard = await presetStandard({
        isProduction: false,
        conf,
    });

    const module = await presetModule({
        isProduction: false,
    });

    const ReactWebpackPluginInstance = await getReactWebpackPluginInstance(conf);
    const webpackConfig = getModsWebpackMerge(conf.mods ?? [], merge(standard, module, {
        entry: {
            "main": standard.entry as string,
        },
        output: {
            path: join(process.cwd(), "dist"),
            filename: '[name].bundle.js'
        },
        plugins: [ReactWebpackPluginInstance],
        devServer: {
            historyApiFallback: true,
            server: conf.devServer?.server || "http",
            proxy: conf.devServer?.proxy
        }
    }));

    const webpackCompiler = Webpack(webpackConfig);
    if (webpackCompiler) {
        const devServer = new WebpackDevServer(
            webpackConfig.devServer!,
            webpackCompiler
        );
    
        devServer.startCallback(() => {
            const protocol = devServer.isTlsServer ? "https" : "http";
            const host = devServer.options.host ?? "localhost";
            const port = devServer.options.port;
            console.log(`Address: ${protocol}://${host}:${port}`);
        });
    }
};

/**
 * 执行构建任务
 */
export const build = async (conf: Config) => {
    const standard = await presetStandard({
        isProduction: true,
        conf,
    });

    const module = await presetModule({
        isProduction: true,
    });

    const ReactWebpackPluginInstance = await getReactWebpackPluginInstance(conf);
    const webpackConfig = getModsWebpackMerge(conf.mods ?? [], merge(standard, module, {
        plugins: [ReactWebpackPluginInstance]
    }));

    const webpackCompiler = Webpack(webpackConfig);
    webpackCompiler?.run((error, stats) => {
        if (stats?.hasErrors() || stats?.hasWarnings()) {
            console.log(
                stats.toString({
                    chunks: false,
                    colors: true,
                })
            );
        }
    });
};

export {
    defineConfig
} from "./conf";

export { type Modification } from "./conf";

export type Configuration = WebpackConfiguration & {
    devServer?: DevServerConfiguration;
};
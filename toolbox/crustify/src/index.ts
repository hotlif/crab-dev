import { Writable } from "stream";
import { merge } from "webpack-merge";
import Webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import type { Configuration as WebpackConfiguration, WebpackPluginInstance } from "webpack";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";

import presetStandard from "./presetWebpack/standard";
import presetModule from "./presetWebpack/module";
import { Config } from "./conf";
import { join } from "path";
import { getCwdDir, getModsWebpackMerge } from "./util";

export { getConfig } from "./conf";


const originalConsoleLog = console.log;
const originalConsoleError = console.error;

const outputConsoleLogStream = new Writable({
    write(chunk, encoding, callback) {
        const message = chunk.toString();

        if (message.includes("webpack")) {
            originalConsoleLog(message.replace("webpack", "Crustify"));
        } else {
            originalConsoleLog(message);
        }
        callback();
    },
});

const outputConsoleErrorStream = new Writable({
    write(chunk, encoding, callback) {
        const message = chunk.toString();
        if (message.includes("webpack")) {
            originalConsoleError(message.replace("webpack", "crustify"));
        } else {
            originalConsoleError(message);
        }
        callback();
    },
});

console.log = outputConsoleLogStream.write.bind(outputConsoleLogStream);
console.error = outputConsoleErrorStream.write.bind(outputConsoleErrorStream);

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

    const cwd = getCwdDir(conf.rootDir);

    const ReactWebpackPluginImport = await import("./plugins/ReactWebpackPlugin");
    let ReactWebpackPlugin = ReactWebpackPluginImport.default || ReactWebpackPluginImport;

    let ReactWebpackPluginInstance: WebpackPluginInstance = new ReactWebpackPlugin({
        cwd: join(cwd, "src"),
        mods: conf.mods
    })

    conf.mods?.forEach((mod) => {
        if (mod.modifyReactWebpackPlugin) {
            ReactWebpackPluginInstance = mod.modifyReactWebpackPlugin(ReactWebpackPluginInstance);
        }
    });

    const webpackConfig = getModsWebpackMerge(conf.mods ?? [], merge(standard, module, {
        entry: {
            "main": standard.entry as string,
            ...(conf.libraryBundle?.entry ?? {})
        },
        output: {
            path: join(process.cwd(), "dist"),
            filename: '[name].bundle.js',
            library: '[name]',
            libraryTarget: conf.libraryBundle?.libraryTarget ?? 'umd',
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
            webpackConfig.devServer,
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

    const cwd = getCwdDir(conf.rootDir);

    const ReactWebpackPluginImport = await import("./plugins/ReactWebpackPlugin");
    const ReactWebpackPlugin = ReactWebpackPluginImport.default || ReactWebpackPluginImport

    const webpackConfig = getModsWebpackMerge(conf.mods ?? [], merge(standard, module, {
        plugins: [
            new ReactWebpackPlugin({
                cwd: join(cwd, "src"),
                mods: conf.mods
            })
        ]
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

/**
 * 执行 bundle 任务
 */
export const bundleLibrary = async (conf: Config) => {
    const standard = await presetStandard({
        isProduction: true,
        conf,
    });

    const module = await presetModule({
        isProduction: true,
    });

    const webpackConfig = getModsWebpackMerge(conf.mods ?? [], merge(standard, module , {
        entry: conf.libraryBundle?.entry,
        output: {
            path: join(process.cwd(), "bundle"),
            filename: '[name].bundle.[contenthash].js',
            library: '[name]',
            libraryTarget: conf.libraryBundle?.libraryTarget ?? 'umd',
        },
        externals: {
            react: 'React',
            'react-dom': 'ReactDOM',
        },
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
}


/**
 * 执行 bundle 任务 Mesh
 */
export const bundleMesh = async (conf: Config) => {
    const standard = await presetStandard({
        isProduction: true,
        conf,
    });

    const module = await presetModule({
        isProduction: true,
    });

    const webpackConfig = getModsWebpackMerge(conf.mods ?? [], merge(standard, module , {
        output: {
            path: join(process.cwd(), "bundle"),
            filename: '[name].bundle.[contenthash].js',
            library: '[name]',
            libraryTarget: conf.libraryBundle?.libraryTarget ?? 'umd',
        }
    }));

    if (webpackConfig.output?.publicPath) {
        webpackConfig.output.publicPath = "auto"
    }

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
}



export {
    defineConfig
} from "./conf";
export { type Modification } from "./conf";
export type Configuration = WebpackConfiguration & {
    devServer?: DevServerConfiguration;
};
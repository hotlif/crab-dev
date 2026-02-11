import MiniExtractPlugin from "mini-css-extract-plugin";
import { join } from "path";
import { type Configuration } from "webpack";
import TerserWebpackPlugin from "terser-webpack-plugin";
import WebpackBar from "webpackbar";
import { rmSync, existsSync } from "fs";
import { readFile, writeFile} from "fs/promises";
import { createRequire } from "module";

import AutoScanWebpackPlugin from "../plugins/AutoScanWebpackPlugin";
import { type Config } from "../conf";
import { getTmpDir, getCwdDir, eta, getCurrentProjectPath } from "../util";



const require = createRequire(import.meta.url);

const createEntryTsx = async (path: string, conf: Config) => {
    const isCJS = () => typeof module !== 'undefined' && typeof module.exports !== 'undefined';
    const getDirName = () => {
        if (isCJS()) {
            return __dirname;
        } else {
            return import.meta.dirname;
        }
    }
    const templateStr = await readFile(join(getCurrentProjectPath(getDirName()), 'template', 'entry.eta'), "utf-8");
    let entriesFile = eta.renderString(templateStr, {});
    conf.mods?.forEach(mod => {
        if (mod?.modifyEntry) {
            entriesFile = mod.modifyEntry(entriesFile);
        }
    });
    await writeFile(path, entriesFile);
}

const presetStandard = async ({
    isProduction,
    conf,
}: {
    isProduction: boolean,
    conf: Config
}) => {
    const tmp = join(conf.rootDir ?? process.cwd(), ".tmp");
    if (existsSync(tmp)) {
        rmSync(tmp, { recursive: true });
    }

	const tmpDir = getTmpDir(conf.rootDir);
    const cwd = getCwdDir(conf.rootDir);
    const entryTmp = join(tmpDir, "entry.tsx");

    await createEntryTsx(entryTmp, conf);

    const aliasAutoScan: {
        [key: string]: string[]
    }  =  {}

    conf?.componentScan?.forEach(element => {
        const fileName = Buffer.from(element.namespaces).toString("base64");
        aliasAutoScan[`@@@/${element.namespaces}`] = [join(tmp, `${fileName}.ts`)]
    })

    const standardConfig: Configuration =  {
        entry: entryTmp,
        devtool: isProduction ? false : "eval-cheap-module-source-map",
        infrastructureLogging: { level: "error" },
        stats: "errors-only",
        output: {
            filename: "[name].bundle.[contenthash].js",
            path: join(process.cwd(), "dist"),
            publicPath: "/",
            pathinfo: false,
            clean: true
        },
        target: "web",
        watchOptions: {
            ignored: ["**/node_modules", "**/.tmp"],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js", ".raw"],
            alias: {
				"@": join(cwd, "src"),
                "@@": process.cwd(),
                ...aliasAutoScan
			},
            fallback: {
                "buffer": require.resolve('buffer/'),
                "string_decoder": require.resolve('string_decoder/'),
            },
        },

        mode: isProduction ? "production" : "development",
        // cache: {
        //     type: 'filesystem',
        //     cacheDirectory: join(process.cwd(), ".cache"),
        //     name: isProduction ? 'production-cache' : 'development-cache',
        // },
        plugins: [
            new WebpackBar({
                name: "Crustify"
            }),
            new AutoScanWebpackPlugin({
                rootDir: getCwdDir(conf.rootDir),
                componentScanRules: conf.componentScan ?? []
            })
        ]
    }

    if (isProduction) {
        standardConfig.optimization = {
            minimize: true,
            minimizer: [
                new TerserWebpackPlugin({
                    terserOptions: {
                        format: {
                            comments: false
                        }
                    },
                    extractComments: false
                }),
                new MiniExtractPlugin()
            ]
        };
    }
    return standardConfig;
}

export default presetStandard;

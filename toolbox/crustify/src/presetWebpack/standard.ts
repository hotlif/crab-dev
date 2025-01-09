import MiniExtractPlugin from "mini-css-extract-plugin";
import { join } from "path";
import { type Configuration } from "webpack";
import TerserWebpackPlugin from "terser-webpack-plugin";
import WebpackBar from "webpackbar";
import { writeFileSync } from "fs";
import ReactWebpackPlugin from "../plugins/ReactWebpackPlugin";
import AutoScanWebpackPlugin from "../plugins/AutoScanWebpackPlugin";
import { type Config } from "../conf";
import { getTmpDir, getCwdDir } from "../util";

const presetStandard = async ({
    isProduction,
    conf,
}: {
    isProduction: boolean,
    conf: Config
}) => {
	const tmpDir = getTmpDir(conf.rootDir);
    const cwd = getCwdDir(conf.rootDir);
    const entry = join(cwd, "entry.tsx");
    const entryTmp = join(tmpDir, "entry.tsx");
    const importEntry = entry.replace(cwd, "").replace(/\\/g, "/");
    const entryTemplate = `import "@${importEntry}";`;

    writeFileSync(entryTmp, entryTemplate);

    const standardConfig: Configuration =  {
        entry: entryTmp,
        devtool: isProduction ? false : "source-map",
        infrastructureLogging: { level: "warn" },
        stats: "errors-warnings",
        output: {
            filename: "[name].bundle.[contenthash].js",
            path: join(process.cwd(), "dist"),
            publicPath: "/",
            pathinfo: false,
            clean: true
        },
        watchOptions: {
            ignored: ["**/node_modules", "**/.tmp"],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js", ".raw"],
            alias: {
				"@": join(cwd, "src"),
                "@@": cwd
			}
        },
        mode: isProduction ? "production" : "development",
        plugins: [
            new WebpackBar({
                name: "Crustify"
            }),
            new AutoScanWebpackPlugin({
                rootDir: getCwdDir(conf.rootDir),
                componentScanRules: conf.componentScan ?? []
            }),
            new ReactWebpackPlugin({
                cwd: join(cwd, "src")
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

import MiniExtractPlugin from "mini-css-extract-plugin";
import { join } from "path";
import { type Configuration } from "webpack";
import TerserWebpackPlugin from "terser-webpack-plugin";
import WebpackBar from "webpackbar";
import { writeFileSync, existsSync, mkdirSync} from "fs";
import ReactWebpackPlugin from "../plugins/ReactWebpackPlugin";
import { type Config } from "../conf";

const presetStandard = async ({
    isProduction,
    conf,
}: {
    isProduction: boolean,
    conf: Config
}) => {
	const tmpDir = join(process.cwd(), ".tmp");
    if (!existsSync(tmpDir)) {
        mkdirSync(tmpDir);
    }
    const cwd = conf?.rootDir ?? join(process.cwd(), "src");
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
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
            alias: {
				"@": cwd,
			}
        },
        mode: isProduction ? "production" : "development",
        plugins: [
            new WebpackBar({
                name: "Crustify"
            }),
            new ReactWebpackPlugin({
                cwd
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

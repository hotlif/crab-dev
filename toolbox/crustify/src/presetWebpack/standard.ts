import MiniExtractPlugin from "mini-css-extract-plugin";
import { join } from "path";
import webpack, { type Configuration } from "webpack";
import TerserWebpackPlugin from "terser-webpack-plugin";
import WebpackBar from "webpackbar";
import { writeFileSync, rmSync, existsSync } from "fs";
import { createRequire } from "module";
import AutoScanWebpackPlugin from "../plugins/AutoScanWebpackPlugin";
import { type Config } from "../conf";
import { getTmpDir, getCwdDir } from "../util";

const require = createRequire(import.meta.url);

const { container } = webpack;
const { ModuleFederationPlugin } = container;

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
    const entry = join(cwd, "entry.tsx");
    const entryTmp = join(tmpDir, "entry.tsx");
    const importEntry = entry.replace(cwd, "").replace(/\\/g, "/");
    let entryTemplate = `import "@${importEntry}";`;

    conf.mods?.forEach(mod => {
        if (mod?.modifyEntry) {
            entryTemplate = mod.modifyEntry(entryTemplate);
        }
    });
    
    writeFileSync(entryTmp, entryTemplate);

    const aliasAutoScan: {
        [key: string]: string[]
    }  =  {}

    conf?.componentScan?.forEach(element => {
        const fileName = Buffer.from(element.namespaces).toString("base64");
        aliasAutoScan[`@@@/${element.namespaces}`] = [join(tmp, `${fileName}.ts`)]
    })

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
        target: "web",
        watchOptions: {
            ignored: ["**/node_modules", "**/.tmp", "**/.tmp-markify"],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js", ".raw", ".vue"],
            fallback: {
                path: require.resolve('path-browserify'),
            },
            alias: {
				"@": join(cwd, "src"),
                "@@": process.cwd(),
                ...aliasAutoScan
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
            })
        ]
    }

    if (conf.moduleMeshBundle != null) {
        standardConfig.plugins?.push(
            new ModuleFederationPlugin({
                name: conf?.moduleMeshBundle?.name,
                filename: "[name].mesh.bundle.[contenthash].js",
                exposes: {
                    ...(conf?.moduleMeshBundle?.exposes ?? {})
                },
                shared: {
                    react: {
                        singleton: true,
                        eager: true,
                    },
                    "react-dom": {
                        singleton: true,
                        eager: true
                    },
                },
            })
        )
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

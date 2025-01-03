import MiniExtractPlugin from "mini-css-extract-plugin";
import { createRequire } from "module";
import { type Configuration } from "webpack";

const require = createRequire(import.meta.url);

/**
 * 生成带有指定预设和插件的 webpack 模块配置。
 *
 * @param {Object} options - 选项对象。
 * @param {boolean} options.isProduction - 指示构建是否用于生产环境。
 * @returns {Configuration} webpack 模块配置。
 */
const presetModule = async ({
    isProduction
}: {
    isProduction: boolean
}) => {
    const babelLoader = {
        loader: require.resolve("babel-loader"),
        options: {
            presets: [
                [require.resolve("@babel/preset-env"), {
                    targets: "defaults",
                }],
                [require.resolve("@babel/preset-typescript"), {
                }],
                [require.resolve("@babel/preset-react"), {
                    runtime: "automatic"
                }]
            ],
            plugins: [
                [require.resolve("babel-plugin-react-compiler"), {
                    target: '19'
                }]
            ]
        },
    };

    const moduleConfiguration: Configuration = {
        module: {
            rules: [{
                test: /\.css$/i,
                use: [
                    isProduction ? MiniExtractPlugin.loader : require.resolve("style-loader"),
                    require.resolve("css-loader"),
                ],
            },{
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [{
                    loader: require.resolve('@wyw-in-js/webpack-loader'),
                }, babelLoader],
            }, {
                test: /\.mdx?$/,
                use: [{
                    loader: require.resolve('@wyw-in-js/webpack-loader'),
                },
                babelLoader,
                {
                    loader: require.resolve('@mdx-js/loader'),
                    options: {
                    }
                }]
            }]
        }
    }
    return moduleConfiguration;
}

export default presetModule;


import MiniExtractPlugin from "mini-css-extract-plugin";
import { createRequire } from "module";
import { type Configuration } from "webpack";

const require = createRequire(import.meta.url);

const presetModule = ({
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
            rules: [				{
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
            }]
        }
    }

    return moduleConfiguration;
}

export default presetModule;


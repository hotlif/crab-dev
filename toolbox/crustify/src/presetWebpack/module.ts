import MiniExtractPlugin from "mini-css-extract-plugin";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import { createRequire } from "module";
import { type Configuration } from "webpack";

const require = createRequire(import.meta.url);

// 获取 remark 插件的默认导出
function getRemarkPlugin<T>(plugin: T): T {
    return (plugin as unknown as { default?: T }).default ?? plugin;
}

const getBabelLoader = () => ({
    loader: require.resolve("babel-loader"),
    options: {
        presets: [
            [require.resolve("@babel/preset-env"), {
                // @wyw-in-js/webpack-loader 不支持 @babel/plugin-transform-template-literals 
                exclude: ['@babel/plugin-transform-template-literals'],
            }],
            [require.resolve("@babel/preset-typescript"), {}],
            [require.resolve("@babel/preset-react"), { runtime: "automatic" }]
        ],
        plugins: [
            [require.resolve("babel-plugin-react-compiler"), { target: '19' }],
            [require.resolve("@crab-dev/babel-plugin-auto-import-style")]
        ]
    },
});

// @wyw-in-js/webpack-loader 在分析 barrel re-export 时会绕开 babel-loader 直接
// 从磁盘读取被引用文件并用自带的 @babel/parser 解析，默认不带 TS / JSX 插件。
// 为此显式把 preset-typescript 与 preset-react 传给 wyw-in-js，使其内部的
// parseFile 能理解 TS 语法（如 `interface`、`enum`、`import type`）。
const getWywLoader = () => ({
    loader: require.resolve('@wyw-in-js/webpack-loader'),
    options: {
        babelOptions: {
            presets: [
                [require.resolve("@babel/preset-typescript"), {}],
                [require.resolve("@babel/preset-react"), { runtime: "automatic" }],
            ],
        },
    },
});

const getRules = (isProduction: boolean) => [
    {
        test: /\.css$/i,
        use: [
            isProduction ? MiniExtractPlugin.loader : require.resolve("style-loader"),
            require.resolve("css-loader"),
            require.resolve("lightningcss-loader"),
        ],
    },
    {
        test: /\.raw$/i,
        exclude: /node_modules/,
        type: 'asset/source',
    },
    {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
            getWywLoader(),
            require.resolve("thread-loader"),
            getBabelLoader()
        ],
    },
    {
        test: /\.mdx?$/,
        exclude: /node_modules/,
        use: [
            getWywLoader(),
            require.resolve("thread-loader"),
            getBabelLoader(),
            {
                loader: require.resolve('@mdx-js/loader'),
                options: {
                    format: "mdx",
                    providerImportSource: require.resolve("@mdx-js/react"),
                    remarkPlugins: [
                        getRemarkPlugin(remarkGfm),
                        [getRemarkPlugin(remarkFrontmatter), "toml"]
                    ],
                    rehypePlugins: []
                }
            }
        ]
    }
];

/**
 * 生成带有指定预设和插件的 webpack 模块配置。
 */
const presetModule = async ({
    isProduction
}: {
    isProduction: boolean
}) => {
    const moduleConfiguration: Configuration = {
        module: {
            rules: getRules(isProduction)
        }
    };
    return moduleConfiguration;
};

export default presetModule;


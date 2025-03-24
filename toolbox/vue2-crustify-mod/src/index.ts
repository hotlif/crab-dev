import { type Modification } from "@crab/crustify"
import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import { VueLoaderPlugin } from 'vue-loader';
import { createRequire } from "module";

const require = createRequire(import.meta.url);

class Vue2CrustifyMod implements Modification {
    modifyWebpack(configuration: Configuration): Configuration {
        return merge(configuration, {
            module: {
                rules: [{
                    test: /\.vue$/,
                    loader: require.resolve('vue-loader')
                }, {
                    test: /\.scss$/,
                    use: [
                      require.resolve('vue-style-loader'),
                      require.resolve('css-loader'),
                      require.resolve('sass-loader')
                    ]
                }]
            },
            plugins: [
                new VueLoaderPlugin() as any
            ]
        });
    }
}

export default Vue2CrustifyMod;

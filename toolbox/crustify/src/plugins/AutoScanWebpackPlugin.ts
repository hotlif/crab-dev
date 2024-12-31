import { Compiler, WebpackPluginInstance } from "webpack";

const PLUGIN_NAME = "AutoScanWebpackPlugin"

class AutoScanWebpackPlugin implements WebpackPluginInstance {
    apply(compiler: Compiler) {
    }
}

export default AutoScanWebpackPlugin;

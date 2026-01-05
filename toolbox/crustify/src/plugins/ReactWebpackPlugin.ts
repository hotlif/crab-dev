import Webpack, { type Compiler, type WebpackPluginInstance } from "webpack";
import { renderToString } from "ssr-react-dom/server";
import { createElement, type ComponentType } from "ssr-react";
import { join, resolve } from "path";
import { existsSync } from "fs";


import { renderHTML, type Modification } from "../conf";

const { RawSource } = Webpack.sources;

const PLUGIN_NAME = "ReactWebpackPlugin";

interface ReactWebpackPluginParam {
    cwd: string;
    mods?: Modification[]
}

export const generateHtml = async (
    template: ComponentType,
    entrys: string[]
) => {
    const Template = template;

    const html = renderToString(createElement(Template));
    const injections = entrys.map((element) => {
        if (element.endsWith(".js")) {
            return `<script defer src="/${element}"></script>`;
        } else if (element.endsWith(".css")) {
            return `<link rel="stylesheet" href="/${element}"></link>`;
        }
    });
    return html.replace("</head>", `${injections.join("\n")}</head>`);
};

class ReactWebpackPlugin implements WebpackPluginInstance {
    private param: ReactWebpackPluginParam;

    constructor(param: ReactWebpackPluginParam) {
        this.param = param;
    }

    apply(compiler: Compiler) {
        compiler.hooks.afterCompile.tap(PLUGIN_NAME, (compilation) => {
            const bootstrap = resolve(join(this.param.cwd, "bootstrap.tsx"));
            compilation.fileDependencies.add(bootstrap);
        });

        compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
            compilation.hooks.processAssets.tapPromise(
                {
                    name: PLUGIN_NAME,
                    stage: Webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
                },
                async (assets) => {
                    const entrys: string[] = [];
                    Object.keys(assets).forEach((key) => {
                        if (key.endsWith(".js") || key.endsWith(".css")) {
                            entrys.push(key);
                        }
                    });

                    let html = ""
                    if (existsSync(join(this.param.cwd, "bootstrap.tsx"))) {
                        const Template = await renderHTML(this.param.cwd);
                        html = await generateHtml(Template, entrys);
                    }

                    this.param.mods?.forEach(mod => {
                        if (mod.modifyHTML != null) {
                            html = mod.modifyHTML(html);
                        }
                    });

                    assets["index.html"] = new RawSource(html);
                }
            );
        });
    }
}

export default ReactWebpackPlugin;

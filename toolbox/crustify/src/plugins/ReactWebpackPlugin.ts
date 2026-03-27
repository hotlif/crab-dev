import Webpack, { type Compiler, type WebpackPluginInstance } from "webpack";
import { renderToString } from "react-dom/server";
import { createElement, type ComponentType } from "react";
import { join, resolve } from "path";
import { existsSync } from "fs";

import { renderHTML, type Modification } from "../conf.js";

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
    private bootstrapPath;

    constructor(param: ReactWebpackPluginParam) {
        this.param = param;
        this.bootstrapPath = this.param.cwd
        param.mods?.forEach(element => {
            const path = element?.modifyBootstrapPath?.(this.bootstrapPath);
            if (typeof path === "string") {
                this.bootstrapPath = path;
            }
        })
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

                    const Template = await renderHTML(this.bootstrapPath);
                    const html = await generateHtml(Template, entrys);
                    assets["index.html"] = new RawSource(html);
                }
            );
        });
    }
}

export default ReactWebpackPlugin;

import { Compiler, WebpackPluginInstance, sources } from "webpack";
import { renderToString } from "react-dom/server"
import { createElement , type ComponentType } from "react";

const {
    RawSource
} = sources;

const PLUGIN_NAME = "ReactWebpackPlugin";

interface ReactWebpackPluginParam {
    template: ComponentType
}

class ReactWebpackPlugin implements WebpackPluginInstance {
    private param: ReactWebpackPluginParam;

    constructor(param: ReactWebpackPluginParam) {
        this.param = param;
    }

    async generateHtml(entrys: string[]) {
        const Template = this.param.template;
        const html = renderToString(createElement(Template));
        const injections = entrys.map(element => {
            if (element.endsWith('.js')) {
                return `<script src="${element}" />`
            } else if (element.endsWith('.css')) {
                return `<link rel="stylesheet" href="${element}" />`
            }
        });   
        html.replace("</head>", `${injections.join("\n")}</head>`)
        return html;
    }

    apply(compiler: Compiler) {
        compiler.hooks.emit.tapPromise(PLUGIN_NAME, async (compilation) => {
            const assets = compilation.assets;
            const chunkGroups = compilation.chunkGroups;

            const entrys: string[] = [];
            Object.keys(assets).forEach(key => {
                if (
                    (key.endsWith('.js') || key.endsWith('.css')) &&
                    !chunkGroups.some((chunkGroup) => chunkGroup.chunks.some((chunk) => chunk.files.has(key)))
                ) {
                    entrys.push(key)
                }
            });
            const html = await this.generateHtml(entrys);
            assets['index.html'] = new RawSource(html);
        })
    }
}

export default ReactWebpackPlugin;

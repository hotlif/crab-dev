import Webpack, { type Compiler, type WebpackPluginInstance } from "webpack";
import { renderToString } from "react-dom/server";
import { createElement, type ComponentType } from "react";

const { RawSource } = Webpack.sources;

const PLUGIN_NAME = "ReactWebpackPlugin";

interface ReactWebpackPluginParam {
  template: ComponentType;
}

export const generateHtml = async (
  template: ComponentType,
  entrys: string[]
) => {
  const Template = template;
  const html = renderToString(createElement(Template));
  const injections = entrys.map((element) => {
    if (element.endsWith(".js")) {
      return `<script src="/${element}"/>`;
    } else if (element.endsWith(".css")) {
      return `<link rel="stylesheet" href="/${element}"/>`;
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
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: PLUGIN_NAME,
          stage: Webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        async (assets) => {
          const entrys: string[] = [];
          Object.keys(assets).forEach((key) => {
            if (
              (key.endsWith(".js") || key.endsWith(".css"))
            ) {
              entrys.push(key);
            }
          });
          const html = await generateHtml(this.param.template, entrys);
          assets["index.html"] = new RawSource(html);
        }
      );
    });
  }
}

export default ReactWebpackPlugin;

import { type Modification, type Configuration, type Config } from "@crab-dev/crustify";
import { getCurrentProjectPath } from "@crab-dev/crustify";
import { copy } from "fs-extra";
import { join } from "path";

const dirname = () => {
    return typeof __dirname !== 'undefined' ? __dirname : import.meta.dirname;
}

const projectPath = getCurrentProjectPath(dirname());

class LignifyMod implements Modification {

    constructor() {
        const templateDir = join(projectPath, "template");
        const targetDir = join(process.cwd(), ".tmp", "lignify");
        copy(
            templateDir,
            targetDir,
            {
                overwrite: true,
                errorOnExist: false
            })
        .catch(err => {
            console.error("failed to copy template directory:", err)
        });
    }

    modifyEntry() {
        return `import("@@/.tmp/lignify/entry.tsx");`;
    }
 
    modifyWebpack(conf: Configuration) {
        return conf;
    }

    modifyBootstrapPath() {
        return join(process.cwd(), ".tmp", "lignify");
    }

    modifyConfig(config: Config): Config {

        if (config.componentScan == null) {
            config.componentScan = []
        }

        // 添加页面扫描路径, 用于路由页面, template/pages 目录
        config.componentScan.push({
            namespaces: "pages",
            include: /.*\.view\.tsx$/,
            cwd: join(process.cwd(), ".tmp", "lignify", "pages"),
            generateSourceCharacter: false,
        });

        // 添加 demo 扫描路径, 用于展示组件, 默认运行项目的 demos 目录
        config.componentScan.push({
            namespaces: "demos",
            include: /.*\.demo\.tsx$/,
            cwd: join(process.cwd(), "docs"),
            generateSourceCharacter: true,
        });

        // 添加扫描 MDX 的文档信息, 用于生成对应的文档页面
        config.componentScan.push({
            namespaces: "mdxs",
            include: /.*\.mdx$/,
            cwd: join(process.cwd(), "docs"),
            generateSourceCharacter: false,
        });
    
        return config
    }
}

export default LignifyMod;
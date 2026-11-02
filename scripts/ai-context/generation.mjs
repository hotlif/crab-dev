import { generatedLibraryPaths } from "../check-generated.mjs";
import { libraryMetadataOutputs } from "../generate-library-metadata.mjs";
import { reference, within } from "./paths.mjs";

export function generationFor(path, manifest) {
    if (libraryMetadataOutputs(manifest).some(output => output.path === path)) return {
        sources: [reference("library.manifest.json", "产品元数据与设计体系注册信息")], script: "generate:architecture",
    };
    const packageEntry = manifest.packages.find(entry => within(path, entry.path));
    if (packageEntry) {
        if (generatedLibraryPaths(manifest).includes(path)) return {
            sources: [reference(`${packageEntry.path}/token.toml`, "令牌定义"),
                reference(`${packageEntry.path}/package.json`, "生成命令及额外生成物声明"),
                reference(`${packageEntry.path}/scripts`, "包内生成器（若存在）")],
            workspace: packageEntry.name, script: "generate:token",
        };
        if (path === `${packageEntry.path}/public/docgen.json`) return {
            sources: [reference(`${packageEntry.path}/src`, "真实类型与导出")],
            workspace: packageEntry.name, script: "generate:docgen",
        };
    }
    if (path === "turbo.json") return {
        sources: [reference("library.manifest.json", "产品包路径"), reference("components", "包声明、生产与令牌引用"),
            reference("scripts/generate-library-tasks.mjs", "拓扑生成器")], script: "generate:architecture",
    };
    if (/^\.pnp\./.test(path)) return {
        sources: [reference("package.json", "工作区与依赖"), reference("yarn.lock", "锁定依赖"), reference(".yarnrc.yml", "PnP 配置")],
        instruction: "依赖变更后通过 Yarn 安装刷新，再运行 yarn install --immutable。",
    };
    const site = ".website/docs/";
    if (!path.startsWith(site)) return null;
    const local = path.slice(site.length);
    if (!/^(?:_generated[^/]*(?:\/|$)|components(?:\/|$)|navigation\.toml$|learn\/(?:components|practice-[^/]+)\.mdx$|guides\/(?:dependencies|design-coverage)\.mdx$)/.test(local)) return null;
    const stem = local.split("/").at(-1).replace(/\.[^.]+$/, "");
    const entry = [...manifest.packages].sort((a, b) => b.slug.length - a.slug.length)
        .find(item => stem === item.slug || stem.startsWith(`${item.slug}-`));
    let sources;
    if (local.startsWith("_generated_tutorials/") || local.startsWith("learn/practice-")) {
        sources = stem === "home" ? [reference(".website/docs/examples/home/profile.tsx", "首页运行示例")]
            : [reference(`.website/content/${stem}.json`, "教学文字与运行文件关联"),
                reference(`.website/docs/examples/${stem}`, "独立教学运行文件"),
                ...(entry ? [reference(`${entry.path}/docs/demos`, "教程引用的隔离工作台示例")] : [])];
    } else if (entry) {
        sources = [reference(`${entry.path}/docs/index.mdx`, "组件正文及 API 标签"),
            reference(`${entry.path}/docs/presentation.json`, "预览布局、密度与 Demo 分组（若存在）"),
            reference(`${entry.path}/docs/demos`, "组件交互 Demo"), reference(`${entry.path}/src`, "真实类型"),
            reference(`${entry.path}/public/docgen.json`, "原始 API 元数据（生成物，继续查询可追溯类型）"),
            reference(`.website/content/${entry.slug}.json`, "教学文字"),
            reference(".website/content/component-guides.json", "场景与使用建议"),
            reference(".website/content/catalog/overview.json", "目录用途介绍")];
    } else if (stem === "globalTokenReference") {
        sources = [reference("components/rc-token-global/token.toml", "全局令牌定义"),
            reference(".website/scripts/generate/generate-token-reference.mjs", "参考手册生成器")];
    } else {
        sources = [reference("library.manifest.json", "产品与覆盖信息"), reference("components", "组件声明、类型、文档与 Demo"),
            reference(".website/content", "教学文字与目录介绍"), reference(".website/docs/examples", "教学运行文件")];
    }
    return { sources: [...sources, reference(".website/scripts/generate/generate-component-docs.mjs", "站点生成入口")],
        workspace: "@crab-dev/website", script: "generate:docs" };
}


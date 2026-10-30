import { realpath, stat, readFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { loadLibraryManifest, repositoryRoot } from "./library-manifest.mjs";
import { inspectLibrary } from "./library-graph.mjs";
import { readWorkspaceManifests, requiredCheckScripts } from "./check-commands.mjs";
import { generatedLibraryPaths } from "./check-generated.mjs";
import { libraryMetadataOutputs } from "./generate-library-metadata.mjs";

const slash = path => path.split(sep).join("/");
const within = (path, parent) => path === parent || path.startsWith(`${parent}/`);
const reference = (path, purpose) => ({ path, purpose });
const skillPath = name => `.agents/skills/${name}/SKILL.md`;

async function exists(path) {
    try { await stat(path); return true; }
    catch (error) { if (error.code === "ENOENT" || error.code === "ENOTDIR") return false; throw error; }
}

async function existing(root, entries) {
    const results = await Promise.all(entries.map(async entry => await exists(resolve(root, entry.path)) ? entry : null));
    return results.filter(Boolean);
}

export async function inheritedRules(root, target) {
    const absolute = resolve(root, target);
    const location = relative(root, absolute);
    if (location === ".." || location.startsWith(`..${sep}`) || isAbsolute(location)) throw new Error("规则目标必须在仓库内。");
    const info = await stat(absolute);
    let directory = info.isDirectory() ? absolute : dirname(absolute);
    const result = [];
    while (true) {
        const rule = resolve(directory, "AGENTS.md");
        if (await exists(rule)) result.unshift(reference(slash(relative(root, rule)), "适用规则（由外到内继承）"));
        if (relative(root, directory) === "") break;
        directory = dirname(directory);
    }
    return result;
}

function artifactKind(path) {
    if (path === "MILESTONE.md" || /(^|\/)(?:\.reports|review)(?:\/|$)/.test(path)) return "history";
    if (/(^|\/)(?:\.tmp|\.cache|\.turbo|\.wake[^/]*|coverage|node_modules|docs-dist|dist|esm|cjs|declarations|css)(?:\/|$)/.test(path)
        || within(path, ".yarn")) return "artifact";
    return "source";
}

function generationFor(path, manifest) {
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

function addCommand(commands, workspaces, rootPackage, workspace, script, purpose) {
    const pkg = workspace ? workspaces.find(item => item.packageJson.name === workspace)?.packageJson : rootPackage;
    if (!pkg?.scripts?.[script]) return;
    const command = `yarn ${workspace ? `workspace ${workspace} ` : ""}${script}`;
    if (!commands.some(item => item.command === command)) commands.push({ command, workspace: workspace ?? null, script, purpose });
}

function dependencyRoles(entry, facts, names) {
    const internal = values => [...new Set(values)].filter(name => names.has(name) && name !== entry.name).sort();
    return {
        production: internal([...Object.keys(entry.packageJson.dependencies ?? {}), ...facts.productionImports]),
        docs: internal([...facts.docsImports, ...(entry.packageJson.crab?.docsDependencies ?? [])]),
        token: internal(facts.tokenImports),
    };
}

export async function buildContext(target = ".", { root = repositoryRoot, dependents = false } = {}) {
    root = await realpath(root);
    const [manifest, workspaces, rootPackage] = await Promise.all([
        loadLibraryManifest({ root }), readWorkspaceManifests({ root }), readFile(resolve(root, "package.json"), "utf8").then(JSON.parse),
    ]);
    const named = workspaces.find(item => item.packageJson.name === target)
        ?? manifest.packages.find(item => item.slug === target);
    const absolute = resolve(root, named?.path ?? target.replaceAll("\\", "/"));
    const inside = path => { const result = relative(root, path); return result !== ".." && !result.startsWith(`..${sep}`) && !isAbsolute(result); };
    if (!inside(absolute)) throw new Error("目标必须在仓库内。");
    if (!await exists(absolute)) throw new Error(`未知目标：${target}。请提供已有包名或仓库相对路径。`);
    const canonical = await realpath(absolute);
    if (!inside(canonical)) throw new Error("目标实际路径必须在仓库内。");
    const path = slash(relative(root, canonical)) || ".";
    const workspace = workspaces.find(item => within(path, item.path));
    const entry = manifest.packages.find(item => item.path === workspace?.path);
    const generation = generationFor(path, manifest);
    const kind = generation ? "generated" : artifactKind(path);
    const rules = await inheritedRules(root, path);
    const commands = [];
    const add = (owner, script, purpose) => addCommand(commands, workspaces, rootPackage, owner, script, purpose);
    const sources = [];
    const documents = [];
    const generated = [];
    const skills = new Set();
    const notes = [];
    const navigation = path === "." ? [reference("AGENTS.md", "任务入口与全局规则"),
        reference("components/AGENTS.md", "组件公共约束"), reference(".website/AGENTS.md", "文档与站点约束"),
        reference("scripts/AGENTS.md", "工程工具约束"), reference(".agents/README.md", "按任务选择技能"),
        reference(".website/README.md", "编辑来源、生成物与验证导航"), reference("library.manifest.json", "产品清单")] : [];

    if (kind === "history" || kind === "artifact") {
        notes.push(kind === "history" ? "显式查询的历史证据，不作为当前规范或通过证明。" : "显式查询的构建、缓存或依赖产物，不作为编辑源码。请查询所属包或源配置。");
    } else if (path === ".") {
        add(null, "ai:context", "添加包名或相对路径缩小任务范围");
        add(null, "check:architecture", "架构与命令契约");
        notes.push("按任务选择入口；历史证据、缓存和生成正文不默认加载。");
    } else {
        skills.add("verify-change");
        if (entry) {
            const base = entry.path;
            sources.push(reference(`${base}/package.json`, "公开脚本、依赖与导出"), reference(`${base}/src/index.ts`, "公开入口"),
                reference(`${base}/src/types.ts`, "公共类型"), reference(`${base}/src`, "实现（生成令牌另列）"),
                reference(`${base}/src/__tests__`, "包内测试"), reference(`${base}/browser-tests`, "浏览器回归"),
                reference(`${base}/token.toml`, "令牌编辑来源"));
            documents.push(reference(`${base}/docs/index.mdx`, "组件正文"), reference(`${base}/docs/demos`, "组件交互 Demo"),
                reference(`.website/content/${entry.slug}.json`, "站点教学文字"),
                reference(`.website/docs/examples/${entry.slug}`, "站点独立教学示例"), reference(".website/AGENTS.md", "关联文档规则"));
            generated.push(...generatedLibraryPaths(manifest).filter(file => within(file, base)).map(file => reference(file, "令牌生成物；编辑 token.toml 与包内生成器")),
                ...(entry.packageJson.scripts?.["generate:docgen"] ? [reference(`${base}/public/docgen.json`, "API 生成物；编辑真实类型")] : []),
                reference(`.website/docs/components/${entry.slug}.mdx`, "站点聚合页；编辑包内 docs 与教学来源"));
            skills.add("component-change");
            if (/token|density-geometry/.test(path)) skills.add("token-change");
            if (within(path, `${base}/docs`)) skills.add("docs-change");
            add(entry.name, "check", "包与登记附加检查（包含依赖构建）");
            for (const script of requiredCheckScripts(entry.packageJson)) add(entry.name, script, "已登记必跑附加检查，包内 check 也会执行");
            add(entry.name, "generate:token", "修改令牌后生成");
            add(null, "check:tokens", "修改令牌后验证契约");
            add(entry.name, "generate:docgen", "类型变化时刷新 API 元数据");
            for (const script of ["generate:docs", "check:docs", "test:generator"]) add("@crab-dev/website", script, "同步文档来源时执行");
            add(null, "docs:build", "文档变更后构建");
        } else if (workspace?.path === ".website") {
            skills.add("docs-change");
            sources.push(reference(".website/package.json", "网站公开命令"), reference(path, "当前网站编辑目标"));
            documents.push(reference(".website/README.md", "完整来源与生成导航"));
            const id = path.match(/^\.website\/(?:content|docs\/examples)\/(rc-[^/.]+|practice-[^/.]+)/)?.[1];
            if (id) {
                documents.push(reference(`.website/content/${id}.json`, "教学文字与步骤来源"), reference(`.website/docs/examples/${id}`, "独立教学运行文件"));
                generated.push(reference(`.website/docs/_generated_tutorials/${id}.ts`, "由教学文字与运行示例生成"));
                const related = manifest.packages.find(item => item.slug === id);
                if (related) documents.push(reference(`${related.path}/docs/index.mdx`, "相关组件正文"), reference(`${related.path}/docs/demos`, "相关组件 Demo"));
            }
            for (const script of ["generate:docs", "check:docs", "test:generator", "check"]) add(workspace.packageJson.name, script, "文档生成与工作区验证");
            add(null, "docs:build", "从仓库根构建站点");
        } else {
            sources.push(reference(path, "当前编辑目标"));
            if (workspace) add(workspace.packageJson.name, "check", "工作区检查");
            else { add(null, "lint:tools", "工程工具及导航契约检查"); add(null, "check:architecture", "架构与命令契约"); }
            if (path === "library.manifest.json" || path === "turbo.json") {
                skills.add("library-inventory");
                generated.push(reference("turbo.json", "从包声明、生产及令牌引用生成"),
                    reference(".website/docs/navigation.toml", "从产品清单生成导航"),
                    reference(".website/docs/guides/design-coverage.mdx", "从产品清单及证据生成覆盖矩阵"),
                    reference("README.md", "仅 library-inventory 标记区域生成"));
                add(null, "generate:architecture", "更新构建拓扑");
                for (const script of ["generate:docs", "check:docs", "test:generator"]) add("@crab-dev/website", script, "更新并验证清单的文档派生内容");
            }
            if (path === "README.md") {
                documents.push(reference(".website/README.md", "完整来源与生成导航"));
                sources.push(reference("library.manifest.json", "库存区域的编辑来源"));
                generated.push(reference(path, "仅 library-inventory 标记区域生成，其他正文直接编辑"));
                add("@crab-dev/website", "generate:docs", "仅用于刷新 README 库存区域");
                notes.push("README 是混合文件：库存区域由产品清单生成，其余正文直接维护。");
            }
            if (within(path, ".changeset") || /release/.test(path)) skills.add("release-change");
        }
    }
    if (generation) {
        sources.length = 0;
        sources.push(...generation.sources);
        generated.push(reference(path, "当前查询的生成物；先修改来源"));
        if (generation.script) add(generation.workspace, generation.script, "重新生成当前目标");
        if (generation.instruction) notes.push(generation.instruction);
        if (generation.script === "generate:token") skills.add("token-change");
    }
    let dependencies = { production: [], docs: [], token: [] };
    let users;
    if (entry && kind !== "artifact" && kind !== "history") {
        const inspection = await inspectLibrary({ ...manifest, packages: dependents ? manifest.packages : [entry] });
        const facts = inspection.get(entry.name);
        const names = new Set(manifest.packages.map(item => item.name));
        dependencies = dependencyRoles(entry, facts, names);
        if (dependents) {
            users = { production: [], docs: [], token: [] };
            for (const item of manifest.packages) {
                const roles = dependencyRoles(item, inspection.get(item.name), names);
                for (const role of Object.keys(users)) if (roles[role].includes(entry.name)) users[role].push(item.name);
            }
        }
    }
    const relatedRules = new Map();
    for (const item of await existing(root, [...sources, ...documents])) {
        for (const rule of await inheritedRules(root, item.path)) {
            if (!rules.some(current => current.path === rule.path)) relatedRules.set(rule.path, reference(rule.path, "编辑关联来源时适用"));
        }
    }
    return {
        target: path, kind, workspace: workspace?.packageJson.name ?? null, rules,
        relatedRules: [...relatedRules.values()],
        navigation: await existing(root, navigation), sources: await existing(root, sources),
        documents: await existing(root, documents), generated: [...new Map(generated.map(item => [item.path, item])).values()],
        skills: await existing(root, [...skills].map(name => reference(skillPath(name), "按实际改动加载"))),
        commands, dependencies, ...(users ? { dependents: users } : {}), notes,
    };
}

export function formatContext(context) {
    const lines = [`目标：${context.target} (${context.kind})`, ...(context.workspace ? [`工作区：${context.workspace}`] : [])];
    for (const [key, title] of [["rules", "适用规则"], ["relatedRules", "关联来源规则"], ["navigation", "任务导航"], ["sources", "编辑来源与测试"],
        ["documents", "关联文档"], ["generated", "生成物"], ["skills", "相关技能"]]) {
        if (!context[key].length) continue;
        lines.push(`\n${title}`);
        for (const item of context[key]) lines.push(`- ${item.path} — ${item.purpose}`);
    }
    if (context.commands.length) lines.push("\n公开命令（仅列出，不执行）", ...context.commands.map(item => `- ${item.command} — ${item.purpose}`));
    for (const [key, title] of [["dependencies", "直接依赖"], ["dependents", "直接使用方"]]) {
        if (!context[key]) continue;
        for (const [role, names] of Object.entries(context[key])) if (names.length) lines.push(`\n${title} / ${role}: ${names.join(", ")}`);
    }
    lines.push(...context.notes.map(note => `\n${note}`));
    return `${lines.join("\n")}\n`;
}

export async function main(args = process.argv.slice(2)) {
    if (args.includes("--help")) {
        console.log("yarn ai:context <包名或仓库相对路径，默认 .> [--json] [--dependents]\n只读查询；所有文件路径相对仓库根，反向关系仅列直接使用方。");
        return;
    }
    const flags = new Set(["--json", "--dependents"]);
    const unknown = args.find(arg => arg.startsWith("-") && !flags.has(arg));
    if (unknown) throw new Error(`未知选项：${unknown}`);
    const targets = args.filter(arg => !flags.has(arg));
    if (targets.length > 1) throw new Error("一次只查询一个包或路径。");
    const context = await buildContext(targets[0] ?? ".", { dependents: args.includes("--dependents") });
    process.stdout.write(args.includes("--json") ? `${JSON.stringify(context, null, 2)}\n` : formatContext(context));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try { await main(); }
    catch (error) { console.error(error.message); process.exitCode = 1; }
}

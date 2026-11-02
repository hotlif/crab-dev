import { realpath, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { loadLibraryManifest, repositoryRoot } from "../library-manifest.mjs";
import { inspectLibrary } from "../library-graph.mjs";
import { readWorkspaceManifests, requiredCheckScripts } from "../check-commands.mjs";
import { generatedLibraryPaths } from "../check-generated.mjs";
import { artifactKind, existing, inheritedRules, reference, resolveTarget, within } from "./paths.mjs";
import { generationFor } from "./generation.mjs";

const skillPath = name => `.agents/skills/${name}/SKILL.md`;

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
    const path = await resolveTarget(root, target, named);
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
            if (within(path, ".website/scripts/dev")) add(workspace.packageJson.name, "test:dev", "开发监听与预览 HTTP 契约");
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


import { GENERATED_MARKER } from "./format.mjs";

export function createLibraryNavigation(manifest) {
    const groups = [
        { id: "project", title: "项目", pages: ["index"], sections: [
            { id: "learning", title: "学习与实战", pages: ["learn/components", "learn/index", "learn/practice-profile", "learn/practice-data", "learn/practice-admin"] },
            { id: "guides", title: "使用指南", pages: ["guides/getting-started", "guides/library-architecture", "guides/public-api", "guides/migration", "guides/accessibility"] },
        ] },
        { id: "design", title: "设计体系", pages: ["guides/design-styles", "guides/component-sizing", "guides/design-coverage"], sections: [] },
        { id: "maintenance", title: "组件库维护", pages: ["guides/contributing", "guides/dependencies", "guides/toolchain"], sections: [] },
        { id: "components", title: "组件", pages: [], sections: manifest.families.map(family => ({
            id: family.id,
            title: family.title,
            pages: manifest.packages.filter(item => item.family === family.id).map(item => `components/${item.slug}`),
        })) },
    ];
    let content = `# ${GENERATED_MARKER}\n# 来源：library.manifest.json 与组件库指南入口。\n`;
    for (const group of groups) {
        content += `\n[[group]]\nid = ${JSON.stringify(group.id)}\ntitle = ${JSON.stringify(group.title)}\npages = ${JSON.stringify(group.pages)}\n`;
        for (const section of group.sections) content += `\n[[group.section]]\nid = ${JSON.stringify(section.id)}\ntitle = ${JSON.stringify(section.title)}\npages = ${JSON.stringify(section.pages)}\n`;
    }
    return content;
}

export function createLibraryData(manifest) {
    const families = manifest.families.map(family => ({ ...family, count: manifest.packages.filter(item => item.family === family.id).length }));
    return `// ${GENERATED_MARKER}\nexport const libraryInventory = ${JSON.stringify({ count: manifest.packages.length, families, categories: manifest.categories })} as const;\n`;
}

export function createDependencyRecords(manifest, inspection) {
    const known = new Map(manifest.packages.map(item => [item.name, item.slug]));
    const resolveEdges = (names, own) => [...new Set(names)].filter(name => known.has(name) && name !== own).sort().map(name => known.get(name));
    return manifest.packages.map(item => {
        const facts = inspection.get(item.name);
        return {
            slug: item.slug, title: item.title, family: item.family,
            production: resolveEdges([...Object.keys(item.packageJson.dependencies ?? {}), ...facts.productionImports], item.name),
            docs: resolveEdges([...facts.docsImports, ...(item.packageJson.crab?.docsDependencies ?? [])], item.name),
            token: resolveEdges(facts.tokenImports, item.name),
        };
    });
}

export function createDependenciesPage(records) {
    const bySlug = new Map(records.map(item => [item.slug, item]));
    const links = names => names.map(slug => `[${bySlug.get(slug).title}](/components/${slug})`).join("、") || "—";
    return `+++\ntitle = "包依赖图"\ndescription = "由产品清单、包声明、生产源码、文档和令牌引用生成的依赖关系"\nkind = "guide"\nstatus = "experimental"\n+++\n\n{/* ${GENERATED_MARKER} */}\n\nimport LibraryDependencies from "../site/libraryDependencies.js";\n\n# 包依赖图\n\n从包出发查看其直接依赖与使用方。生产依赖来自 package.json dependencies 与生产源码 import/export，文档依赖来自 docs 源码与 crab.docsDependencies，令牌依赖来自 token.toml imports。三类边独立展示，允许同一对包承担多个角色；不把文档引用加入生产构建前置。\n\n<LibraryDependencies />\n\n## 完整直接关系\n\n以下邻接表与交互图来自同一生成数据。只列产品清单内的包，外部 npm、React peer 和测试依赖按各包声明维护；最终 Turbo 构建图由同一检查模块派生并检查环。\n\n| 包 | 生产依赖 | 文档依赖 | 令牌依赖 |\n| --- | --- | --- | --- |\n${records.map(item => `| [${item.title}](/components/${item.slug}) | ${links(item.production)} | ${links(item.docs)} | ${links(item.token)} |`).join("\n")}\n\n修改产品清单、package.json、类型/运行源码、组件文档或 token.toml 后运行架构与文档生成检查。能力族是职责分类，不代表人工固定的依赖链；来源与边界见[组件库体系](/guides/library-architecture)。\n`;
}

export function updateReadmeInventory(source, manifest) {
    let inventory = `当前产品清单包含 ${manifest.packages.length} 个包，按 ${manifest.families.length} 个能力族组织。\n\n| 能力族 | 包数 | 职责 |\n| --- | --- | --- |\n`;
    for (const family of manifest.families) {
        const products = manifest.packages.filter(item => item.family === family.id);
        inventory += `| ${family.title} | ${products.length} | ${family.description} |\n`;
    }
    for (const family of manifest.families) {
        inventory += `\n**${family.title}**：${manifest.packages.filter(item => item.family === family.id).map(item => `[${item.title}](${item.path}/docs/index.mdx)`).join(" · ")}\n`;
    }
    const pattern = /<!-- library-inventory:start -->[\s\S]*?<!-- library-inventory:end -->/;
    if (!pattern.test(source)) throw new Error("README 缺少产品清单生成边界");
    return source.replace(pattern, `<!-- library-inventory:start -->\n${inventory}\n<!-- library-inventory:end -->`);
}

export const shortReference = value => {
    const text = String(value ?? "").replace(/^sha256:/, "");
    return text.length > 12 ? `${text.slice(0, 12)}…` : text;
};

export function designCoverageEvidence(entry, designs) {
    const records = entry.verification ?? {};
    const parts = [];
    for (const { id: design, title } of designs) {
        if (entry.designCoverage?.[design] !== "verified") continue;
        const record = records[design];
        if (!record) throw new Error(`已验收的设计体系缺少验收记录：${entry.name} ${design}`);
        const source = record.source?.kind === "commit"
            ? `commit \`${shortReference(record.source.ref)}\``
            : `worktree \`${shortReference(record.source?.ref)}\``;
        const paths = Array.isArray(record.evidencePaths) ? record.evidencePaths : [];
        parts.push(`${title} ${source}${paths.length > 0 ? ` · ${paths.map(path => `\`${path}\``).join("、")}` : ""}`);
    }
    return parts.length > 0 ? parts.join("<br>") : "—";
}

export function createDesignCoverage(manifest) {
    const names = { partial: "部分覆盖", verified: "已验收", "not-applicable": "无独立视觉" };
    const designs = manifest.designSystems;
    let content = `+++\ntitle = "设计体系覆盖矩阵"\ndescription = "由产品清单生成的组件成熟度与三套设计体系覆盖范围"\nkind = "guide"\nstatus = "experimental"\n+++\n\n{/* ${GENERATED_MARKER} */}\n\n# 设计体系覆盖矩阵\n\n本页来自根目录 \`library.manifest.json\`。当前产品清单包含 ${manifest.packages.length} 个包、${manifest.families.length} 个能力族；用途分类是独立的第二轴。\n\n“部分覆盖”表示已有实现但完整视觉与交互矩阵尚未验收；“已验收”必须有绑定提交和产物的证据；“无独立视觉”只说明该包的职责，不免除行为、类型和依赖检查。历史截图不能自动提升当前覆盖状态。\n\n| 包 | 能力族 | 用途 | 生命周期 | ${designs.map(design => design.title).join(" | ")} | 验收证据 |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n`;
    for (const product of manifest.packages) {
        const family = manifest.families.find(item => item.id === product.family).title;
        const category = manifest.categories.find(item => item.id === product.category).title;
        content += `| [${product.title}](/components/${product.slug}) | ${family} | ${category} | ${product.status} | ${designs.map(design => names[product.designCoverage[design.id]]).join(" | ")} | ${designCoverageEvidence(product, designs)} |\n`;
    }
    return content + "\n验收证据列来自清单同一条 `verification` 记录：已验收体系列出源码提交（或工作树指纹）与证据文件，产物指纹和矩阵范围保存在该记录中；没有已验收体系的行显示 —。\n\n每个可视包都需检查适用的默认、悬停、焦点、按下、禁用、选中、错误和加载状态，以及浅深色、触控、键盘、减少动画和强制颜色；标为无独立视觉的包只核对行为、类型和依赖。详见[设计体系](/guides/design-styles)、[公共 API](/guides/public-api)与[维护约定](/guides/contributing)。\n";
}

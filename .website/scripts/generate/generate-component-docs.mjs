import { GENERATED_MARKER, normalizeNewlines, serialize } from "./format.mjs";

import { extractDemoMeta, extractDemoLearning } from "./demo-source.mjs";
import { isValidTypeText, normalizeApiProps, extractApiRecord, resolveApiSourcePath } from "./api-records.mjs";
import { createSearchableApiSource, splitApiRecord, validateComponentGuide, componentGuideMarkup, createDemoSearchMetadata, createPage } from "./render-component-page.mjs";
import { withGeneratedFileRetry, removeOrphanGeneratedFiles } from "./generated-files.mjs";
import { createLibraryNavigation, createLibraryData, createDependencyRecords, createDependenciesPage, updateReadmeInventory, createDesignCoverage } from "./render-library-pages.mjs";
import { emitGeneratedFile } from "./generated-files.mjs";
import { parseSourceApiProps, withApiSourceBatch } from "./api-source.mjs";
import { densityFor, layoutFor, organizeDemos, readPresentation } from "./presentation.mjs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadTutorial, loadPracticeTutorials, tutorialMarkup, validateTeachingInventory, createLearningMap, createHomeExample } from "./generate-tutorials.mjs";
import { createTokenReferenceData, readGlobalTokens } from "./generate-token-reference.mjs";
import { loadLibraryManifest } from "../../../scripts/library-manifest.mjs";
import { inspectLibrary } from "../../../scripts/library-graph.mjs";
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../../..");
const componentsDirectory = path.join(repositoryRoot, "components");
const websiteDocsDirectory = path.join(repositoryRoot, ".website/docs");
const generatedDataDirectory = path.join(websiteDocsDirectory, "_generated");
const generatedApiDirectory = path.join(websiteDocsDirectory, "_generated_api");
const generatedPagesDirectory = path.join(websiteDocsDirectory, "components");


function createDataModule(demos) {
    return `/**\n * ${GENERATED_MARKER}\n */\n\nimport type { ComponentDemoRecord } from "../site/componentDemos.js";\n\nexport const demos = ${serialize(demos)} as const satisfies readonly ComponentDemoRecord[];\n`;
}

function createComponentPreviews(records) {
    const previews = {};
    for (const { slug, demos } of records) {
        if (Object.hasOwn(previews, slug)) {
            throw new Error(`顶部预览组件重复：${slug}`);
        }
        const heroDemo = readPresentation(slug).heroDemo;
        const override = heroDemo ? `docs/demos/${heroDemo}` : undefined;
        const demo = override ? demos.find(item => item.id === override) : demos[0];
        if (!demo) {
            throw new Error(`${slug}: 顶部预览缺少${override ? `指定 Demo ${override}` : "可用 Demo"}`);
        }
        const { id, title, previewPath, workbenchPath, density } = demo;
        previews[slug] = { id, title, previewPath, workbenchPath, density };
    }
    return `/**\n * ${GENERATED_MARKER}\n */\n\nimport type { ComponentDemoDescriptor } from "../site/componentDemoFrame.js";\n\nexport const componentPreviews = ${serialize(previews)} as const satisfies Readonly<Record<string, ComponentDemoDescriptor>>;\n`;
}

async function generateDocsBatch({ check: checkOnly = false } = {}) {
    const emitFile = (...args) => emitGeneratedFile(...args, { check: checkOnly });
    const manifest = await loadLibraryManifest();
    // Dev regeneration reuses this module; read authored JSON again each run.
    const [componentGuides, componentDescriptions] = await Promise.all([
        readFile(path.join(repositoryRoot, ".website/content/component-guides.json"), "utf8").then(JSON.parse),
        readFile(path.join(repositoryRoot, ".website/content/catalog/overview.json"), "utf8").then(JSON.parse),
    ]);
    const directoryEntries = await readdir(componentsDirectory, { withFileTypes: true });
    const componentSlugs = directoryEntries
        .filter((entry) => entry.isDirectory() && entry.name.startsWith("rc-"))
        .map((entry) => entry.name)
        .sort();

    const registeredSlugs = manifest.packages.map(item => item.slug).sort();
    if (JSON.stringify(componentSlugs) !== JSON.stringify(registeredSlugs)) {
        throw new Error("组件目录与 library.manifest.json 产品清单不一致");
    }

    const guideSlugs = Object.keys(componentGuides).sort();
    const missingGuides = componentSlugs.filter((slug) => !guideSlugs.includes(slug));
    const orphanGuides = guideSlugs.filter((slug) => !componentSlugs.includes(slug));
    if (missingGuides.length > 0 || orphanGuides.length > 0) {
        throw new Error(
            `新手指南与组件不一致；缺少：${missingGuides.join(", ") || "无"}；多余：${orphanGuides.join(", ") || "无"}`,
        );
    }
    for (const slug of componentSlugs) validateComponentGuide(componentGuides[slug], slug);

    const navigation = createLibraryNavigation(manifest);
    const navigationSlugs = new Set(
        [...navigation.matchAll(/"components\/(rc-[^"]+)"/g)].map((match) => match[1]),
    );
    const missingNavigation = componentSlugs.filter((slug) => !navigationSlugs.has(slug));
    const orphanNavigation = [...navigationSlugs].filter((slug) => !componentSlugs.includes(slug));
    if (missingNavigation.length > 0 || orphanNavigation.length > 0) {
        throw new Error(
            `导航与组件不一致；缺少：${missingNavigation.join(", ") || "无"}；多余：${orphanNavigation.join(", ") || "无"}`,
        );
    }

    const outputs = [{ filePath: path.join(websiteDocsDirectory, "navigation.toml"), content: navigation }];
    const readmePath = path.join(repositoryRoot, "README.md");
    outputs.push({ filePath: readmePath, content: updateReadmeInventory(await readFile(readmePath, "utf8"), manifest) });
    outputs.push({ filePath: path.join(websiteDocsDirectory, "guides/design-coverage.mdx"), content: createDesignCoverage(manifest) });
    outputs.push({ filePath: path.join(generatedDataDirectory, "library.ts"), content: createLibraryData(manifest) });
    const dependencies = createDependencyRecords(manifest, await inspectLibrary(manifest));
    outputs.push({ filePath: path.join(generatedDataDirectory, "library-dependencies.ts"), content: `// ${GENERATED_MARKER}\nimport type { LibraryDependencyRecord } from "../site/libraryDependencies.js";\nexport const libraryDependencies = ${serialize(dependencies)} as const satisfies readonly LibraryDependencyRecord[];\n` });
    outputs.push({ filePath: path.join(websiteDocsDirectory, "guides/dependencies.mdx"), content: createDependenciesPage(dependencies) });
    const referenceSource = await readFile(path.join(componentsDirectory, "rc-token-global/token.toml"), "utf8");
    const referenceTokens = readGlobalTokens(referenceSource);
    outputs.push({
        filePath: path.join(generatedDataDirectory, "globalTokenReference.ts"),
        content: createTokenReferenceData(referenceSource),
    });
    outputs.push(await createHomeExample(repositoryRoot));
    const lessons = [];
    const componentPreviewRecords = [];
    const globalDemoKeys = new Set();
    let demoCount = 0;

    for (const slug of componentSlugs) {
        const product = manifest.packages.find(item => item.slug === slug);
        const componentDirectory = path.join(componentsDirectory, slug);
        const canonicalMdxPath = path.join(componentDirectory, "docs/index.mdx");
        const canonicalMdx = (await readFile(canonicalMdxPath, "utf8"))
            .replace(/^title = .*$/m, `title = ${JSON.stringify(product.title)}`)
            .replace(/^status = .*$/m, `status = ${JSON.stringify(product.status)}`);
        const demoDirectory = path.join(componentDirectory, "docs/demos");
        const demoFiles = (await readdir(demoDirectory, { withFileTypes: true }))
            .filter((entry) => entry.isFile() && entry.name.endsWith(".demo.tsx"))
            .map((entry) => entry.name)
            .sort();

        const demos = [];
        for (const demoFile of demoFiles) {
            const sourcePath = path.join(demoDirectory, demoFile);
            const sourceCode = normalizeNewlines(await readFile(sourcePath, "utf8"));
            const meta = extractDemoMeta(sourceCode, sourcePath);
            const learning = extractDemoLearning(sourceCode, sourcePath);
            const id = `docs/demos/${demoFile}`;
            const uniqueKey = `${slug}:${id}`;
            if (globalDemoKeys.has(uniqueKey)) {
                throw new Error(`${sourcePath}: Demo ID 重复：${id}`);
            }
            globalDemoKeys.add(uniqueKey);
            demos.push({
                id,
                title: meta.title,
                description: meta.description,
                learning,
                sourceCode,
                previewPath: `/components/${slug}/workbench/?__wake_demo=${encodeURIComponent(id)}`,
                workbenchPath: `/components/${slug}/workbench/#/components/${encodeURIComponent(id)}`,
                density: densityFor(slug),
                layout: layoutFor(slug),
            });
        }
        const organizedDemos = organizeDemos(slug, demos);
        componentPreviewRecords.push({ slug, demos: organizedDemos });
        demoCount += organizedDemos.length;

        const api = [];
        for (const [index, tag] of [...canonicalMdx.matchAll(/<API\b[^>]*\/>/g)].entries()) {
            const record = await extractApiRecord(componentDirectory, canonicalMdx, canonicalMdxPath, tag[0]);
            record.generatedFileName = index === 0 ? `${slug}.ts` : `${slug}-${record.symbol}.ts`;
            if (api.some(current => current.symbol === record.symbol)) throw new Error(`${slug}: API symbol 重复 ${record.symbol}`);
            api.push(record);
        }
        const lesson = await loadTutorial(repositoryRoot, slug, organizedDemos);
        lessons.push({ ...lesson.record, title: product.title });
        outputs.push(lesson.output);
        outputs.push({
            filePath: path.join(generatedDataDirectory, `${slug}.ts`),
            content: createDataModule(organizedDemos),
        });
        for (const record of api) {
            const { primary, native } = splitApiRecord(record, slug);
            for (const grouped of [primary, native].filter(group => group && group.props.length > 0)) outputs.push({
                filePath: path.join(generatedApiDirectory, grouped.generatedFileName),
                content: createSearchableApiSource(grouped),
            });
        }
        outputs.push({
            filePath: path.join(generatedPagesDirectory, `${slug}.mdx`),
            content: createPage(
                canonicalMdx,
                slug,
                organizedDemos,
                api,
                lesson.record,
                slug === "rc-token-global" ? referenceTokens : [],
                componentGuides[slug],
                componentDescriptions[slug],
            ),
        });
    }

    if (demoCount !== globalDemoKeys.size) {
        throw new Error(`Demo 存在重复：${demoCount} 项中只有 ${globalDemoKeys.size} 个唯一 ID`);
    }

    outputs.push({
        filePath: path.join(generatedDataDirectory, "component-previews.ts"),
        content: createComponentPreviews(componentPreviewRecords),
    });

    const practices = await loadPracticeTutorials(repositoryRoot);
    const teaching = await validateTeachingInventory(repositoryRoot, [...lessons, ...practices.map(item => item.record)], ["home/profile.tsx"]);
    outputs.push({ filePath: path.join(websiteDocsDirectory, "learn/components.mdx"), content: createLearningMap(navigation, lessons, componentDescriptions, manifest.packages.map(item => ({ ...item, categoryTitle: manifest.categories.find(category => category.id === item.category).title }))) });
    for (const { record, output } of practices) {
        outputs.push(output);
        outputs.push({
            filePath: path.join(websiteDocsDirectory, "learn", `${record.id}.mdx`),
            content: `+++\ntitle = ${JSON.stringify(record.title)}\ndescription = ${JSON.stringify(record.summary)}\nkind = "guide"\nstatus = "experimental"\n+++\n\n{/* ${GENERATED_MARKER} */}\n\nimport Tutorial from "../site/tutorial.js";\nimport { tutorial } from "../_generated_tutorials/${record.id}.js";\n\n# ${record.title}\n\n${tutorialMarkup(record)}\n\n[返回实战教程](/learn)\n`,
        });
    }
    const drift = [];
    for (const output of outputs) {
        await emitFile(output.filePath, output.content, drift);
    }
    const expectedApiFiles = new Set(
        outputs
            .map((output) => output.filePath)
            .filter((filePath) => path.dirname(filePath) === generatedApiDirectory),
    );
    await removeOrphanGeneratedFiles(generatedApiDirectory, expectedApiFiles, drift, checkOnly);
    for (const directory of [path.join(websiteDocsDirectory, "_generated_tutorials"), path.join(websiteDocsDirectory, "learn")]) {
        const expectedFiles = new Set(outputs.map(output => output.filePath).filter(file => path.dirname(file) === directory));
        await removeOrphanGeneratedFiles(directory, expectedFiles, drift, checkOnly);
    }

    if (checkOnly && drift.length > 0) {
        throw new Error(`组件文档生成产物存在漂移：\n${drift.map((file) => `- ${file}`).join("\n")}`);
    }

    const action = checkOnly ? "检查" : "生成";
    console.log(`${action}完成：${componentSlugs.length} 个组件页，${teaching.tutorials} 份教程，${teaching.examples} 个教学示例，${demoCount} 个唯一 Demo，${drift.length} 个文件变化。`);
}

function generateDocs(options) {
    return withApiSourceBatch(() => generateDocsBatch(options));
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) await generateDocs({ check: process.argv.includes("--check") });

export {
    extractDemoMeta,
    extractDemoLearning,
    validateComponentGuide,
    componentGuideMarkup,
    createLibraryNavigation,
    createDependencyRecords,
    createDesignCoverage,
    createComponentPreviews,
    createDemoSearchMetadata,
    createPage,
    createSearchableApiSource,
    splitApiRecord,
    densityFor,
    extractApiRecord,
    generateDocs,
    isValidTypeText,
    layoutFor,
    normalizeApiProps,
    organizeDemos,
    parseSourceApiProps,
    removeOrphanGeneratedFiles,
    resolveApiSourcePath,
    withGeneratedFileRetry,
};

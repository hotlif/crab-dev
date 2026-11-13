import { readFile } from "node:fs/promises";
import path from "node:path";
import { readLibraryMetadata } from "../../../scripts/library-manifest.mjs";

const designIds = readLibraryMetadata().designSystems.map(item => item.id);
const foreignDesigns = {
    md3: /macos|shadcn|apple|developer\.apple/i,
    macos: /\bmd3\b|\bm3\b|material|expressive|shadcn/i,
    shadcn: /\bmd3\b|\bm3\b|material|expressive|macos|apple|developer\.apple/i,
};

export function validateDesignDocuments(documents, demos, slug) {
    if (!documents || Object.keys(documents).sort().join() !== [...designIds].sort().join()) {
        throw new Error(`${slug}: 主题文档必须完整提供 ${designIds.join(" / ")}`);
    }
    const byName = new Map(demos.map(demo => [path.posix.basename(demo.id), demo]));
    for (const design of designIds) {
        const document = documents[design];
        for (const field of ["summary", "usage", "exampleDescription"]) {
            if (typeof document[field] !== "string" || document[field].trim().length < 20) {
                throw new Error(`${slug}/${design}: ${field} 需要独立的完整说明`);
            }
            if (foreignDesigns[design].test(document[field])) throw new Error(`${slug}/${design}: ${field} 混入其他主题`);
        }
        if (!Array.isArray(document.demos) || document.demos.length === 0 || new Set(document.demos).size !== document.demos.length) {
            throw new Error(`${slug}/${design}: demos 必须非空且唯一`);
        }
        for (const name of document.demos) {
            const demo = byName.get(name);
            if (!demo) throw new Error(`${slug}/${design}: Demo 不存在 ${name}`);
            if (foreignDesigns[design].test(`${demo.title} ${demo.description}`)) {
                throw new Error(`${slug}/${design}: Demo ${name} 的说明混入其他主题`);
            }
            // Fixed boundaries cannot override the document's selected design.
            for (const match of demo.sourceCode.matchAll(/["'](md3|macos|shadcn)["']/g)) {
                if (match[1] !== design) throw new Error(`${slug}/${design}: Demo ${name} 固定了其他主题`);
            }
        }
    }
    for (const field of ["summary", "usage", "exampleDescription"]) {
        if (new Set(designIds.map(id => documents[id][field])).size !== designIds.length) {
            throw new Error(`${slug}: ${field} 不得在主题间重复`);
        }
    }
    return documents;
}

export async function readDesignDocuments(componentDirectory, demos, slug) {
    const source = JSON.parse(await readFile(path.join(componentDirectory, "docs/designs.json"), "utf8"));
    return validateDesignDocuments(source, demos, slug);
}

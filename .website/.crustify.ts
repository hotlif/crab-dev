import { defineConfig, type Modification, type Configuration } from "@crab-dev/crustify";
import { join, resolve, relative, sep } from "path";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from "fs";

const ROOT = process.cwd();
const REPO_ROOT = resolve(ROOT, "..");
const COMPONENTS_DIR = join(REPO_ROOT, "components");
const GENERATED_DIR = join(ROOT, "src", "_generated");

interface DemoEntry {
    path: string;
    title: string;
    description: string;
    source: string;
}

interface ApiPropEntry {
    name: string;
    description: string;
    type: string;
    defaultValue: string;
}

interface ComponentEntry {
    slug: string;
    pkg: string;
    version: string;
    title: string;
    description: string;
    category: string;
    readme: string;
    demos: DemoEntry[];
    api: ApiPropEntry[];
}

const walkSync = (dir: string, visitor: (file: string) => void): void => {
    for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        const st = statSync(full);
        if (st.isDirectory()) walkSync(full, visitor);
        else visitor(full);
    }
};

/**
 * 从 .demo.tsx 头部块注释中提取 TOML 风格的 title / description。
 */
const parseDemoFrontmatter = (source: string): { title: string; description: string } => {
    const match = source.match(/^\s*\/\*\*([\s\S]*?)\*\//);
    if (!match) return { title: "", description: "" };
    const body = match[1].replace(/^\s*\*\s?/gm, "");
    const pick = (key: string): string => {
        const m = body.match(new RegExp(`${key}\\s*=\\s*"((?:[^"\\\\]|\\\\.)*)"`));
        if (!m) return "";
        return m[1].replace(/\\"/g, "\"").replace(/\\\\/g, "\\");
    };
    return { title: pick("title"), description: pick("description") };
};

const toText = (value: unknown): string => {
    if (value == null) return "-";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    return "-";
};

const parseDocgenApi = (docgenPath: string): ApiPropEntry[] => {
    if (!existsSync(docgenPath)) return [];

    try {
        const raw = JSON.parse(readFileSync(docgenPath, "utf-8")) as unknown;
        const values = typeof raw === "object" && raw !== null
            ? Object.values(raw as Record<string, unknown>)
            : [];
        const first = values[0];
        const docgenItems = Array.isArray(first) ? first : [];
        const component = docgenItems[0] as {
            props?: Record<string, {
                description?: string;
                required?: boolean;
                tsType?: { raw?: string; name?: string };
                defaultValue?: { value?: string };
            }>;
        } | undefined;
        const props = component?.props;
        if (!props) return [];

        return Object.entries(props).map(([name, meta]) => {
            const type = toText(meta.tsType?.raw ?? meta.tsType?.name);
            const defaultValue = toText(
                meta.defaultValue?.value ?? (meta.required ? "required" : "-"),
            );
            return {
                name,
                description: toText(meta.description || "-").trim() || "-",
                type,
                defaultValue,
            };
        });
    } catch {
        return [];
    }
};

const scanComponents = (): ComponentEntry[] => {
    if (!existsSync(COMPONENTS_DIR)) return [];

    const entries: ComponentEntry[] = [];
    const dirs = readdirSync(COMPONENTS_DIR).filter(name => {
        const full = join(COMPONENTS_DIR, name);
        return statSync(full).isDirectory() && name.startsWith("rc-");
    });

    for (const slug of dirs) {
        const dir = join(COMPONENTS_DIR, slug);
        const pkgPath = join(dir, "package.json");
        const docsReadmePath = join(dir, "README.md");
        const docgenPath = join(dir, "public", "docgen.json");
        if (!existsSync(pkgPath)) continue;

        let pkgJson: { name?: string; description?: string; version?: string; websiteConfig?: { title?: string; category?: string } } = {};
        try {
            pkgJson = JSON.parse(readFileSync(pkgPath, "utf-8"));
        } catch {
            // ignore
        }

        const readme = existsSync(docsReadmePath)
            ? readFileSync(docsReadmePath, "utf-8")
            : "";

        const demosDir = join(dir, "docs");
        const demos: DemoEntry[] = [];
        if (existsSync(demosDir)) {
            walkSync(demosDir, file => {
                if (!/\.demo\.tsx$/.test(file)) return;
                const rel = relative(ROOT, file)
                    .replaceAll(sep, "/")
                    .replace(/^(\.\.\/)+/, "");
                const source = readFileSync(file, "utf-8");
                const meta = parseDemoFrontmatter(source);
                demos.push({
                    path: rel,
                    title: meta.title,
                    description: meta.description,
                    source,
                });
            });
        }

        entries.push({
            slug,
            pkg: pkgJson.name ?? `@crab-dev/${slug}`,
            version: pkgJson.version ?? "0.0.0",
            title: pkgJson.websiteConfig?.title ?? slug.replace(/^rc-/, ""),
            description: pkgJson.description ?? "",
            category: pkgJson.websiteConfig?.category ?? "other",
            readme,
            demos: demos.sort((a, b) => a.path.localeCompare(b.path)),
            api: parseDocgenApi(docgenPath),
        });
    }

    return entries.sort((a, b) => a.slug.localeCompare(b.slug));
};

const writeManifest = (entries: ComponentEntry[]): void => {
    if (!existsSync(GENERATED_DIR)) mkdirSync(GENERATED_DIR, { recursive: true });

    const escapeTpl = (raw: string) =>
        raw.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

    const lines: string[] = [];
    lines.push("// Auto-generated by .crustify.ts. Do not edit.");
    lines.push("export interface DemoMeta {");
    lines.push("    path: string;");
    lines.push("    title: string;");
    lines.push("    description: string;");
    lines.push("    source: string;");
    lines.push("}");
    lines.push("export interface ApiPropMeta {");
    lines.push("    name: string;");
    lines.push("    description: string;");
    lines.push("    type: string;");
    lines.push("    defaultValue: string;");
    lines.push("}");
    lines.push("export interface ComponentManifestItem {");
    lines.push("    slug: string;");
    lines.push("    pkg: string;");
    lines.push("    version: string;");
    lines.push("    title: string;");
    lines.push("    description: string;");
    lines.push("    category: string;");
    lines.push("    readme: string;");
    lines.push("    demos: DemoMeta[];");
    lines.push("    api: ApiPropMeta[];");
    lines.push("}");
    lines.push("");
    lines.push("const manifest: ComponentManifestItem[] = [");
    for (const e of entries) {
        lines.push("    {");
        lines.push(`        slug: ${JSON.stringify(e.slug)},`);
        lines.push(`        pkg: ${JSON.stringify(e.pkg)},`);
        lines.push(`        version: ${JSON.stringify(e.version)},`);
        lines.push(`        title: ${JSON.stringify(e.title)},`);
        lines.push(`        description: ${JSON.stringify(e.description)},`);
        lines.push(`        category: ${JSON.stringify(e.category)},`);
        lines.push(`        readme: \`${escapeTpl(e.readme)}\`,`);
        lines.push("        demos: [");
        for (const d of e.demos) {
            lines.push("            {");
            lines.push(`                path: ${JSON.stringify(d.path)},`);
            lines.push(`                title: ${JSON.stringify(d.title)},`);
            lines.push(`                description: ${JSON.stringify(d.description)},`);
            lines.push(`                source: \`${escapeTpl(d.source)}\`,`);
            lines.push("            },");
        }
        lines.push("        ],");
        lines.push("        api: [");
        for (const prop of e.api) {
            lines.push("            {");
            lines.push(`                name: ${JSON.stringify(prop.name)},`);
            lines.push(`                description: ${JSON.stringify(prop.description)},`);
            lines.push(`                type: ${JSON.stringify(prop.type)},`);
            lines.push(`                defaultValue: ${JSON.stringify(prop.defaultValue)},`);
            lines.push("            },");
        }
        lines.push("        ],");
        lines.push("    },");
    }
    lines.push("];");
    lines.push("");
    lines.push("export default manifest;");
    lines.push("");

    writeFileSync(join(GENERATED_DIR, "manifest.ts"), lines.join("\n"), "utf-8");
};

/**
 * 每个 demo 对应一个 () => import() 的懒加载器, 仅在调用时触发, 避免一次性加载全部 demo。
 */
const writeDemoLoaders = (entries: ComponentEntry[]): void => {
    if (!existsSync(GENERATED_DIR)) mkdirSync(GENERATED_DIR, { recursive: true });

    const lines: string[] = [];
    lines.push("// Auto-generated by .crustify.ts. Do not edit.");
    lines.push("import type { ComponentType } from \"react\";");
    lines.push("");
    lines.push("type Loader = () => Promise<{ default: ComponentType }>;");
    lines.push("");
    lines.push("const loaders: Record<string, Loader> = {");
    for (const e of entries) {
        for (const d of e.demos) {
            const importPath = `@@/../${d.path}`;
            lines.push(`    ${JSON.stringify(d.path)}: () => import(${JSON.stringify(importPath)}) as Promise<{ default: ComponentType }>,`);
        }
    }
    lines.push("};");
    lines.push("");
    lines.push("export default loaders;");
    lines.push("");

    writeFileSync(join(GENERATED_DIR, "demoLoaders.ts"), lines.join("\n"), "utf-8");
};

class WebsiteMod implements Modification {
    constructor() {
        const entries = scanComponents();
        writeManifest(entries);
        writeDemoLoaders(entries);
    }

    modifyEntry(): string {
        return `import("@/entry.tsx");`;
    }

    modifyWebpack(conf: Configuration): Configuration {
        return conf;
    }
}

export default defineConfig({
    rootDir: ROOT,
    mods: [new WebsiteMod()],
});

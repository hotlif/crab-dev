import { run as runCrustify } from "@crab/crustify";
import { cp, mkdir, readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { dirname, join } from "path";
import { render } from "ejs";
import { type MarkifyConfig } from "./conf";
import { fileURLToPath } from "url";
import { title } from "process";

export { getConfig } from "./conf";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const writeFileEJS = async (path: string, config: MarkifyConfig) => {
    let content = await readFile(path, "utf-8");
    content = render(content, config);

    await writeFile(path, content, "utf-8");
}

export const dev = async (conf: MarkifyConfig) => {
    await cp(join(__dirname, "..", "assets"), join(process.cwd(), ".tmp-markify", "src"), { recursive: true });
    if (!existsSync(join(process.cwd(), "docs"))) {
        await mkdir(join(process.cwd(), "docs"))
    }

    writeFileEJS(join(process.cwd(), ".tmp-markify", "src", "bootstrap.tsx"), conf);
    writeFileEJS(join(process.cwd(), ".tmp-markify", "src", "layouts", "BasicLayout.tsx"), conf);
    await runCrustify({
        rootDir: join(process.cwd(), ".tmp-markify"),
        componentScan: [{
            namespaces: "mdxs",
            cwd: join(process.cwd(), "docs"),
            include: /\.mdx?$/,
        },{
            namespaces: "demos",
            cwd: join(process.cwd(), "docs"),
            include: /\.demo\.tsx$/,
        }]
    });
}

export { defineConfig } from "./conf";

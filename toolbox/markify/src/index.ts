import { run as runCrustify } from "@crab/crustify";
import { cp, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { dirname, join } from "path";
import { type MarkifyConfig } from "./conf";
import { createRequire } from "module";
import { fileURLToPath } from "url";

export { getConfig } from "./conf";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const dev = async ({
}: MarkifyConfig) => {
    await cp(join(__dirname, "..", "assets"), join(process.cwd(), ".tmp-markify", "src"), { recursive: true });
    if (!existsSync(join(process.cwd(), "docs"))) {
        await mkdir(join(process.cwd(), "docs"))
    }
    await runCrustify({
        rootDir: join(process.cwd(), ".tmp-markify"),
        componentScan: [{
            namespaces: "mdxs",
            cwd: join(process.cwd(), "docs"),
            include: /\.mdx$/,
        },{
            namespaces: "demos",
            cwd: join(process.cwd(), "docs"),
            include: /\.demo\.tsx$/,
        }]
    });
}

export { defineConfig } from "./conf";

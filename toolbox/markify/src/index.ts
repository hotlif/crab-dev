import { run as runCrustify } from "@crab/crustify";
import { cp, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { compile } from "ejs";
import { type MarkifyConfig } from "./conf";

export { getConfig } from "./conf";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const dev = async ({
    theme = "@crab/markify-themes"
}: MarkifyConfig) => {
    await cp(join(__dirname, "..", "assets", "src"), join(process.cwd(), ".tmpPreset", "src"), { recursive: true });
    const entryTsx = await readFile(join(__dirname, "..", "assets", "src", "entry.tsx"), "utf-8");
    const compileFunction = compile(entryTsx, {
        async: true
    });

    const newEntryTsx = await compileFunction({
        theme
    });

    await writeFile(join(__dirname, "..", "assets", "src", "entry.tsx"), newEntryTsx, "utf-8");

    await runCrustify({
        rootDir: join(process.cwd(), ".tmpPreset"),
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

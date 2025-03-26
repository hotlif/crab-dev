import { run as runCrustify } from "@crab/crustify";
import { cp } from "fs/promises";
import { join } from "path";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const dev = async () => {

    await cp(join(__dirname, "..", "assets", "src"), join(process.cwd(), ".tmpPreset", "src"), { recursive: true });

    
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

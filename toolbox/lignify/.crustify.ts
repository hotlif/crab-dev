import { defineConfig, Modification } from "@crab-dev/crustify";
import { join } from "path";


class LignifyConfig implements Modification {
    modifyEntry?(_entry: string) {
        return "import(\"../entry.tsx\");"
    }
}

export default defineConfig({
    rootDir: join(process.cwd(), "template"),
    componentScan: [{
        namespaces: "pages",
        include: /.*\.view\.tsx$/,
        cwd: join(process.cwd(), "template","pages"),
        generateSourceCharacter: false,
    }, {
        namespaces: "demos",
        include: /.*\.demo\.tsx$/,
        cwd: join(process.cwd(), "docs"),
        generateSourceCharacter: true,
    }, {
        namespaces: "mdxs",
        include: /.*\.mdx?$/,
        cwd: join(process.cwd(), "docs"),
        generateSourceCharacter: false,
    }],
    mods: [new LignifyConfig()]
});
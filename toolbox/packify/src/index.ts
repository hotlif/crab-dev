import { rollup } from "rollup";
import { isAbsolute } from "node:path";
import typescript from '@rollup/plugin-typescript';
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import wyw from "@wyw-in-js/rollup";
import { join } from "path";
//@ts-ignore
import css from 'rollup-plugin-css-only';
import { readFileSync, writeFileSync } from "fs";

const extensions = [".ts"];

export const build = async () => {
    const bundle = await rollup({
        input: join(process.cwd(), "src", "index.ts"),
        external: (id) => !id.startsWith(".") && !isAbsolute(id),
        plugins: [
            typescript({
                exclude: [
                    "**/__tests__/**/*.[jt]s?(x)",
                    "**/?(*.)+(spec|test).[tj]s?(x)",
                    "docs/**/*"
                ]
            }),
            nodeResolve({ extensions }),
            wyw({
                sourceMap: false,
            }),
            css({
                output: "index.styles.css",
            }),
            // terser()
        ]
    });

    await bundle.write({
        file: "esm/index.mjs",
        format: "es",
    });

    const filePath = join(process.cwd(), "esm", "index.styles.css");
    let fileContent = readFileSync(filePath).toString();

    const packageJsonBuffer = readFileSync(join(process.cwd(), "package.json"));
    const packageJson = JSON.parse(packageJsonBuffer.toString());
    Object.keys(packageJson.dependencies ?? {}).forEach(key => {
        if (/@crab\/rc-.*/g.test(key)) {
            fileContent = `@import "${key}/esm/index.styles.css";\n` + fileContent;
        }
    });
    writeFileSync(filePath, fileContent);
}

import { rollup } from "rollup";
import { isAbsolute } from "node:path";
import typescript from '@rollup/plugin-typescript';
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import wyw from "@wyw-in-js/rollup";
import { join } from "path";
//@ts-ignore
import css from 'rollup-plugin-css-only';

const extensions = [".ts"];

export const build = async () => {
    const bundle = await rollup({
        input: join(process.cwd(), "src", "index.ts"),
        external: (id) => !id.startsWith(".") && !isAbsolute(id),
        plugins: [
            typescript({
                exclude: ["**/?(*.)+(spec|test).[tj]s?(x)"]
            }),
            nodeResolve({ extensions }),
            wyw({
                sourceMap: false,
            }),
            css({
                output: "index.styles.css",
            }),
            terser()
        ]
    });

    await bundle.write({
        file: "esm/index.mjs",
        format: "es",
    });
}

import { rollup } from "rollup";
import { isAbsolute } from "node:path";
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import wyw from "@wyw-in-js/rollup";
//@ts-ignore
import css from 'rollup-plugin-css-only';

const extensions = [".ts"];

export const build = async () => {
    const bundle = await rollup({
        input: "src/index.ts",
        external: (id) => !id.startsWith(".") && !isAbsolute(id),
        plugins: [
            typescript({
                exclude: [
                    "node_modules",
                    "**/__tests__/**",
                    "**/*.spec.ts",
                ],
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
}

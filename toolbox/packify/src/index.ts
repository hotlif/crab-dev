import { rollup } from "rollup";
import { isAbsolute } from "node:path";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import wyw from "@wyw-in-js/rollup";
import { join } from "path";
//@ts-ignore
import css from 'rollup-plugin-css-only';
import { readFileSync, writeFileSync } from "fs";
import babel from '@rollup/plugin-babel';
import { dts } from "rollup-plugin-dts";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export const build = async () => {
    const bundle = await rollup({
        input: join(process.cwd(), "src", "index.ts"),
        external: (id) => !id.startsWith(".") && !isAbsolute(id),
        plugins: [
            babel({
                babelHelpers: "bundled",
                exclude: [
                    "**/__tests__/**/*.[jt]s?(x)",
                    "**/?(*.)+(spec|test).[tj]s?(x)",
                    "docs/**/*"
                ],
                presets: [
                    [require.resolve("@babel/preset-env"), {
                        targets: "defaults",
                    }],
                    [require.resolve("@babel/preset-typescript"), {
                    }],
                    [require.resolve("@babel/preset-react"), {
                        runtime: "automatic"
                    }]
                ],
                plugins: [
                    [require.resolve("babel-plugin-react-compiler"), {
                        target: '19'
                    }],
                ],
                extensions: ['.js', '.jsx', '.ts', '.tsx']
            }),
            nodeResolve({ extensions }),
            wyw({
                sourceMap: false,
            }),
            css({
                output: "index.styles.css",
            })
        ]
    });

    await bundle.write({
        file: "esm/index.mjs",
        format: "es",
        plugins: [
            terser()
        ]
    });

    await bundle.write({
        file: "cjs/index.cjs",
        format: "cjs",
        exports: "auto",
        plugins: [
            terser()
        ]
    });

   const typesBundle = await rollup({
        input: join(process.cwd(), "src", "index.ts"),
        external: (id) => !id.startsWith(".") && !isAbsolute(id),
        plugins: [
            dts()
        ]
    });

    await typesBundle.write({
        file: "declarations/index.d.ts",
        format: "es",
    });
}

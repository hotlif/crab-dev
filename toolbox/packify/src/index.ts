import { rollup } from "rollup";
import { isAbsolute } from "node:path";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import wyw from "@wyw-in-js/rollup";
import { join } from "path";
//@ts-ignore
import css from 'rollup-plugin-css-only';
import babel from '@rollup/plugin-babel';
import { dts } from "rollup-plugin-dts";
import { createRequire } from "module";
import { readFileSync } from "fs";
import { writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);

const extensions = ['.js', '.jsx', '.ts', '.tsx'];


const commonBabelConfig = {
    presets: [
        [require.resolve("@babel/preset-env"), {
            targets: "defaults",
        }],
        [require.resolve("@babel/preset-typescript"), {}],
        [require.resolve("@babel/preset-react"), {
            runtime: "automatic"
        }]
    ],
    plugins: [
        [require.resolve("babel-plugin-react-compiler"), {
            target: '19'
        }],
    ],
};

const babelPlugin = babel({
    babelHelpers: "bundled",
    exclude: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[tj]s?(x)",
        "docs/**/*"
    ],
    ...commonBabelConfig,
    extensions,
});


const writeCssPreDependency = (path: string, type: "cjs" | "esm") => {
    const pkgs = readFileSync(join(process.cwd(), "package.json"));
    const { cssDependencies } = JSON.parse(pkgs.toString());

    let importCss = "";
    Object.keys(cssDependencies).forEach((pkg) => {
        if (type === "cjs") {
            importCss += `@import '${pkg}/cjs/index.styles.css';\n`;
        } else {
            importCss += `@import '${pkg}/esm/index.styles.css';\n`;
        }
    })
    const content = readFileSync(path, "utf-8");
    writeFileSync(path, importCss + content, "utf-8");
}

export const build = async () => {
    const bundle = await rollup({
        input: join(process.cwd(), "src", "index.ts"),
        external: (id) => !id.startsWith(".") && !isAbsolute(id),
        plugins: [
            wyw({
                sourceMap: false,
                babelOptions: commonBabelConfig
            }),
            css({
                output: "index.styles.css",
            }),
            nodeResolve({ extensions }),
            babelPlugin
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

    writeCssPreDependency(join(process.cwd(), "esm","index.styles.css"), "esm");
    writeCssPreDependency(join(process.cwd(), "cjs","index.styles.css"), "cjs");
    
    await typesBundle.write({
        file: "declarations/index.d.ts",
        format: "es",
    });
}

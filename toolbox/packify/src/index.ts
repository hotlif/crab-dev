import { rollup } from "rollup";
import { isAbsolute } from "node:path";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import wyw from "@wyw-in-js/rollup";
import { join, dirname} from "path";
// @ts-expect-error rollup-plugin-css-only has no type declarations
import css from 'rollup-plugin-css-only';
import babel from '@rollup/plugin-babel';
import { dts } from "rollup-plugin-dts";
import { createRequire } from "module";
import { rm, writeFile, mkdir } from 'fs/promises';
import { existsSync } from "fs";

import { log } from "./util.js";
export { default as generateCssToken }  from "./generateCssToken.js";

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



// @ts-expect-error rollup plugin exports namespace, not callable in NodeNext resolution
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

export const build = async () => {
    await rm(join(process.cwd(), "esm"), { recursive: true, force: true });
    await rm(join(process.cwd(), "cjs"), { recursive: true, force: true });
    await rm(join(process.cwd(), "declarations"), { recursive: true, force: true });    
    await rm(join(process.cwd(), "css"), { recursive: true, force: true });
    log(`🧹 cleaning esm, cjs, declarations, css`);
    
    const bundle = await rollup({
        input: join(process.cwd(), "src", "index.ts"),
        external: (id) => !id.startsWith(".") && !isAbsolute(id),
        plugins: [
            wyw({
                sourceMap: false,
                babelOptions: commonBabelConfig,
                eval: {
                    // 构建期求值时,@crab-dev/* 兄弟包一律按外部模块用原生 require
                    // 加载(PnP 感知),而不是把其 cjs 产物当 ESM 源码解析——CJS 的
                    // 运行期 exports 赋值没有 ESM 静态命名导出,后者会在 link 阶段
                    // 报 "does not provide an export named ..."。
                    customResolver: async (specifier: string, importer: string) => {
                        if (!specifier.startsWith("@crab-dev/")) {
                            return null;
                        }
                        try {
                            const req = createRequire(importer.split("?")[0]);
                            return { id: req.resolve(specifier), external: true };
                        } catch {
                            return null;
                        }
                    }
                }
            }),
            css({
                output: async (styles: string) => {
                    const cssFilePath = join(process.cwd(), "css", "index.css");
                    if (styles && !existsSync(cssFilePath)) {
                        const cssDir = dirname(cssFilePath);
                        await mkdir(cssDir, { recursive: true });
                        await writeFile(cssFilePath, styles);
                        log(`🎨 CSS generated at ${cssFilePath}`);
                    }
                }
            }),
            // @ts-expect-error rollup plugin exports namespace, not callable in NodeNext resolution
            nodeResolve({ extensions }),
            babelPlugin
        ]
    });

    await bundle.write({
        dir: "esm",
        format: "es",
        entryFileNames: "[name].mjs",
        chunkFileNames: '[name].mjs',
        plugins: [
            // @ts-expect-error rollup plugin exports namespace, not callable in NodeNext resolution
            terser()
        ]
    });


    await bundle.write({
        dir: "cjs",
        format: "cjs",
        exports: "auto",
        interop: "auto",
        entryFileNames: "[name].cjs",
        chunkFileNames: '[name].cjs',
        plugins: [
            // @ts-expect-error rollup plugin exports namespace, not callable in NodeNext resolution
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

    log("✅ build success !");
}

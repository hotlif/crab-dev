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
import { existsSync, readFileSync } from "fs";

import { log } from "./util.js";
export { default as generateCssToken }  from "./generateCssToken.js";
export { default as generateDocgen } from "./generateDocgen.js";
export { default as runTest } from "./runTest.js";

const require = createRequire(import.meta.url);

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

/**
 * 读取当前正在构建的包名，转成 CSS 安全的前缀片段。
 *
 * wyw-in-js 生成的类名 = `displayName首字母 + murmurhash2("包内相对路径:序号")`，
 * 哈希输入只含包内相对路径、不含包级唯一标识。每个组件包独立构建，
 * 不同包中相对路径相近的两个 `css` 块经 32 位 murmur 有概率撞出同名类
 * （已知 rc-table 行样式与 rc-protocol-table spinner 均落到 `.se0c4xv`），
 * 导致表格行被套上 spinner 的旋转动画。以包名前缀隔离即可根除跨包冲突。
 */
const getPackagePrefix = (): string => {
    try {
        const pkgPath = join(process.cwd(), "package.json");
        const name = JSON.parse(readFileSync(pkgPath, "utf8")).name as string | undefined;
        const segment = (name ?? "pkg").split("/").pop() ?? "pkg";
        const safe = segment.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
        return safe || "pkg";
    } catch {
        return "pkg";
    }
};

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

    const packagePrefix = getPackagePrefix();

    const bundle = await rollup({
        input: join(process.cwd(), "src", "index.ts"),
        external: (id) => !id.startsWith(".") && !isAbsolute(id),
        plugins: [
            wyw({
                sourceMap: false,
                // 以包名为前缀，保证不同组件包生成的类名永不相撞（见 getPackagePrefix 注释）
                classNameSlug: (hash: string) => `${packagePrefix}-${hash}`,
                babelOptions: commonBabelConfig,
                // 构建期求值跑在独立 runner 子进程里,函数型 eval.customResolver 无法
                // 序列化,只能每次解析都经 IPC 往返主进程——并发构建下会死锁挂死。
                // 这里改用纯数据配置:native(oxc)解析器在 runner 进程内同步解析,
                // mainFields 优先取 module,把 @crab-dev/* 兄弟包解析到 esm 产物
                // (真 ESM,link 阶段有静态命名导出);解析失败时回落 bundler。
                oxcOptions: {
                    resolver: {
                        mainFields: ["module", "main"],
                    },
                },
                eval: {
                    resolver: "hybrid",
                },
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
        exports: "named",
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

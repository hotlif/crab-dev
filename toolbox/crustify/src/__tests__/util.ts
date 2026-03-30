import Webpack, { type Configuration, type Stats } from "webpack";
import MemoryFS from 'memory-fs';
import { createRequire } from "module";

const require = createRequire(import.meta.url);

export const compile = (config: Configuration) => {
    const compiler = Webpack(config);
    const memoryFs = new MemoryFS();
    compiler.outputFileSystem = memoryFs as unknown as typeof compiler.outputFileSystem;
    return new Promise<{ error: Error | null, stats?: Stats, fs: MemoryFS }>((resolve) => {
        compiler.run((err, stats) => {
            if (err || stats?.hasErrors()) {
                console.error(stats?.toString())
            }
            resolve({ stats, fs: memoryFs, error: err });
        });
    });
}

export const babelLoader = {
    loader: require.resolve("babel-loader"),
    options: {
        presets: [
            [require.resolve("@babel/preset-env"), {
                targets: "defaults",
            }],
            [require.resolve("@babel/preset-typescript"), {
            }],
            [require.resolve("@babel/preset-react"), {
                runtime: "automatic"
            }]
        ]
    },
};


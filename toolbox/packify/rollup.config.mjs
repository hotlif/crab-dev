import { isAbsolute } from 'node:path';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from "@rollup/plugin-terser";
import { rm } from "fs"
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

import babel from '@rollup/plugin-babel';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const extensions = ['.ts'];

rm(join(__dirname, "esm"), {
	recursive: true
});

export default [{
	input: 'src/index.ts',
	output: [{
        file: "esm/index.mjs",
		format: 'es',
	}],
	external: (id) => !id.startsWith('.') && !isAbsolute(id),
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
		terser()
	]
}];

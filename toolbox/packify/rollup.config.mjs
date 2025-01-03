import { isAbsolute } from 'node:path';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from "@rollup/plugin-terser";
import { rm } from "fs"
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

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
		typescript(),
		nodeResolve({ extensions }),
		terser()
	]
}];

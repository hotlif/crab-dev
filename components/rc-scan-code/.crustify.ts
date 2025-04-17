import { defineConfig } from "@crab/crustify";
import { join } from "path";

export default defineConfig({
	rootDir: join(process.cwd(), "docs"),
	devServer: {
		server: "https",
		proxy: []
	},
	libraryBundle: {
		entry: {
			"RcScanCode": join(process.cwd(), "src", "index.ts")
		}
	}
});

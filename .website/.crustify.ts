import { defineConfig } from "@crab/crustify";
import { join } from "path";

export default defineConfig({
    componentScan: [{
		namespaces: "mdx",
		cwd: join(process.cwd(), "docs"),
		include: /\.mdx?$/,
	},{
		namespaces: "demos",
		cwd: join(process.cwd(), "docs"),
		include: /\.demo\.tsx?$/,
	}],
});

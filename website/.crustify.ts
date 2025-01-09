import { defineConfig } from "@crab/crustify";
import { join } from "path";

export default defineConfig({
    componentScan: [{
		namespaces: "demos",
		cwd: join(process.cwd(), "demos"),
		generateSourceCharacter: true,
		include: /\.demo.tsx?$/,
	}]
});

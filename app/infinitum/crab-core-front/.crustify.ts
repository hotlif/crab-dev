import { defineConfig } from "@crab-dev/crustify";
import { join } from "path";

export default defineConfig({
	componentScan: [{
		namespaces: "routers",
		cwd: join(process.cwd(), "src", "routers"),
		include: /\.Router\.tsx$/,
	}],
	devServer: {
		proxy: [{
			context: ["/api"],
			target: "http://localhost:8000",
		}]
	}
});

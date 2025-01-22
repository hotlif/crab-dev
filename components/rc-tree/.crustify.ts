import { defineConfig } from "@crab/crustify";
import { join } from "path";

export default defineConfig({
	rootDir: join(process.cwd(), "docs")
});

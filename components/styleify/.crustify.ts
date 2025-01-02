import { join } from "path";
import { defineConfig } from "@crab/crustify";

const rootDir = join(process.cwd(), "docs");

export default defineConfig({
    rootDir
});

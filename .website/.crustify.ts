import { defineConfig } from "@crab-dev/crustify";
import { join } from "path";
export default defineConfig({
    componentScan: [{
        namespaces: "pages",
        cwd: join(process.cwd(), "src", "pages"),
        generateSourceCharacter: false,
    }]
});

import { defineConfig } from "@crab/crustify";
import Vue2CrustifyMod from "@crab/vue2-crustify-mod";
import { join } from "path";

export default defineConfig({
	mods: [
		new Vue2CrustifyMod()
	],
	libraryBundle: {
		entry: {
			"hello": join(process.cwd(), "src", "hello.vue"),
			"hello2": join(process.cwd(), "src", "hello2.vue"),
		}
	}
});

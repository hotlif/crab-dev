import { defineConfig } from "@crab/crustify";
import Vue2CrustifyMod from "@crab/vue2-crustify-mod";
import Vue2LcpWebCrustifyMod from "@crab/vue2-lcp-web-crustify-mod";
import { join } from "path";

export default defineConfig({
	mods: [
		new Vue2CrustifyMod(),
		new Vue2LcpWebCrustifyMod({
			proxyLoadComponent: {
				"10003": "/hello.bundle.js",
			}
		})
	],
	devServer: {
		proxy: [{
			context: ["**"],
			target: "http://localhost:3000"
		}]
	},
	libraryBundle: {
		entry: {
			"hello": join(process.cwd(), "src", "hello.vue"),
			"hello2": join(process.cwd(), "src", "hello2.vue"),
		}
	}
});

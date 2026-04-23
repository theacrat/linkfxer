import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

export default defineConfig({
	modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
	vite: () => ({
		plugins: [tailwindcss()],
	}),
	manifest: {
		name: "LinkFxer",
		description: "Convert copied links to configurable alternate domains.",
		permissions: ["activeTab", "contextMenus", "scripting", "storage"],
		action: {
			default_title: "LinkFxer settings",
		},
		browser_specific_settings: {
			gecko: {
				id: "linkfxer@thea.pet",
				data_collection_permissions: {
					required: ["none"],
				},
			},
		},
	},
	srcDir: "src",
	autoIcons: {
		baseIconPath: "assets/icon.svg",
	},
});

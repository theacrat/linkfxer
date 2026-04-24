import { defineConfig } from "oxfmt";

export default defineConfig({
	sortImports: true,
	sortPackageJson: {
		sortScripts: true,
	},
	sortTailwindcss: true,
	ignorePatterns: [],
});

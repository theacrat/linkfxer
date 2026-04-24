import type { Config } from "stylelint";

export default {
	extends: ["stylelint-config-recommended", "stylelint-config-clean-order"],
	ignoreFiles: ["!src/**/*.css"],
} satisfies Config;

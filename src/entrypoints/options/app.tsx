import { useEffect, useState } from "react";

import { SiteSettingCard } from "@/components/site-setting-card";
import { DEFAULT_SITE_SETTINGS, getDomainSettings, type DomainSettings } from "@/utils/settings";
import { SITE_REWRITERS } from "@/utils/sites/registry";

const LOAD_FAILURE_MESSAGE = "Failed to load settings.";

export function App() {
	const [settings, setSettings] = useState<DomainSettings>(DEFAULT_SITE_SETTINGS);
	const [initialStatus, setInitialStatus] = useState("");

	useEffect(() => {
		let cancelled = false;

		const loadSettings = async () => {
			try {
				const stored = await getDomainSettings();

				if (cancelled) {
					return;
				}

				setSettings(stored);
				setInitialStatus("");
			} catch {
				if (!cancelled) {
					setInitialStatus(LOAD_FAILURE_MESSAGE);
				}
			}
		};

		void loadSettings();

		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<main className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
			<header className="flex flex-col gap-2">
				<h1 className="m-0">LinkFxer Settings</h1>
				<span className="text-sm">
					Choose the Fxed domain and any custom source domains for each website.
				</span>
				<span className="text-sm">
					Leave a Fxed domain blank to disable rewriting for that site.
				</span>
			</header>

			<section className="flex flex-col gap-3">
				{SITE_REWRITERS.map((site) => (
					<SiteSettingCard
						context="options"
						key={site.service}
						initialStatus={initialStatus}
						setSettings={setSettings}
						settings={settings}
						site={site}
					/>
				))}
			</section>
		</main>
	);
}

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

import { SiteSettingCard } from "@/components/site-setting-card";
import {
	DEFAULT_SITE_SETTINGS,
	getDomainSettings,
	type DomainSettings,
} from "@/utils/settings";
import { SITE_REWRITERS } from "@/utils/sites/registry";

const LOAD_FAILURE_MESSAGE = "Failed to load settings.";

async function loadSettings(
	setInitialStatus: (value: string) => void,
	setSettings: (value: DomainSettings) => void,
) {
	try {
		const stored = await getDomainSettings();
		setSettings(stored);
		setInitialStatus("");
	} catch {
		setInitialStatus(LOAD_FAILURE_MESSAGE);
	}
}

function SettingsHeader() {
	return (
		<header className="flex flex-col gap-2">
			<h1 className="m-0">LinkFxer Settings</h1>
			<span className="text-sm">
				Choose the Fxed domain and any custom source domains for each website.
			</span>
			<span className="text-sm">
				Leave a Fxed domain blank to disable rewriting for that site.
			</span>
		</header>
	);
}

function SettingsList({
	initialStatus,
	setSettings,
	settings,
}: {
	initialStatus: string;
	setSettings: Dispatch<SetStateAction<DomainSettings>>;
	settings: DomainSettings;
}) {
	return (
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
	);
}

export function App() {
	const [settings, setSettings] = useState<DomainSettings>(
		DEFAULT_SITE_SETTINGS,
	);
	const [initialStatus, setInitialStatus] = useState("");

	useEffect(() => {
		let cancelled = false;

		const initialise = async () => {
			await loadSettings(
				(value) => {
					if (!cancelled) {
						setInitialStatus(value);
					}
				},
				(value) => {
					if (!cancelled) {
						setSettings(value);
					}
				},
			);
		};

		void initialise();

		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<main className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
			<SettingsHeader />
			<SettingsList
				initialStatus={initialStatus}
				setSettings={setSettings}
				settings={settings}
			/>
		</main>
	);
}

import {
	useEffect,
	useMemo,
	useState,
	type Dispatch,
	type SetStateAction,
} from "react";

import { SiteSettingCard } from "@/components/site-setting-card";
import { findSiteRewriter, findSiteRewriterForUrl } from "@/utils/rewrite";
import {
	DEFAULT_SITE_SETTINGS,
	getDomainSettings,
	type DomainSettings,
} from "@/utils/settings";
import {
	rewriteSiteUrl,
	supportsSiteUrlWithSettings,
	type SiteRewriter,
} from "@/utils/sites/base";

const LOAD_FAILURE_MESSAGE = "Failed to load settings.";
const COPY_BUTTON_TEXT = "Copy Fxed link";
const COPY_STATUS_DURATION_MS = 3000;

type PopupState = {
	currentSite?: SiteRewriter;
	currentUrl: string | null;
	initialStatus: string;
	isLoaded: boolean;
	savedSettings: DomainSettings;
	settings: DomainSettings;
};

async function openSettings() {
	await browser.runtime.openOptionsPage();
}

async function loadPopupState() {
	const [tabs, storedSettings] = await Promise.all([
		browser.tabs.query({ active: true, currentWindow: true }),
		getDomainSettings(),
	]);
	const tabUrl = tabs[0]?.url ?? null;
	const currentSite = tabUrl
		? (findSiteRewriterForUrl(tabUrl, storedSettings) ??
			findSiteRewriter(new URL(tabUrl).hostname, storedSettings))
		: undefined;

	return {
		currentSite,
		currentUrl: tabUrl,
		storedSettings,
	};
}

function SupportMessage({ children }: { children: string }) {
	return <span className="text-sm">{children}</span>;
}

function usePopupState() {
	const [currentUrl, setCurrentUrl] = useState<string | null>(null);
	const [currentSite, setCurrentSite] = useState<SiteRewriter>();
	const [isLoaded, setIsLoaded] = useState(false);
	const [savedSettings, setSavedSettings] = useState<DomainSettings>(
		DEFAULT_SITE_SETTINGS,
	);
	const [settings, setSettings] = useState<DomainSettings>(
		DEFAULT_SITE_SETTINGS,
	);
	const [initialStatus, setInitialStatus] = useState("");

	useEffect(() => {
		let cancelled = false;

		const initialise = async () => {
			try {
				const nextState = await loadPopupState();

				if (cancelled) {
					return;
				}

				setCurrentSite(nextState.currentSite);
				setCurrentUrl(nextState.currentUrl);
				setSavedSettings(nextState.storedSettings);
				setSettings(nextState.storedSettings);
				setInitialStatus("");
				setIsLoaded(true);
			} catch {
				if (!cancelled) {
					setInitialStatus(LOAD_FAILURE_MESSAGE);
					setIsLoaded(true);
				}
			}
		};

		void initialise();

		return () => {
			cancelled = true;
		};
	}, []);

	return {
		setSavedSettings,
		setSettings,
		state: {
			currentSite,
			currentUrl,
			initialStatus,
			isLoaded,
			savedSettings,
			settings,
		},
	};
}

function SupportedPageActions({
	currentSite,
	currentUrl,
	settings,
}: {
	currentSite: SiteRewriter;
	currentUrl: string;
	settings: DomainSettings;
}) {
	const [copyStatus, setCopyStatus] = useState("");

	useEffect(() => {
		let timeoutId: number | null = null;

		if (copyStatus) {
			timeoutId = window.setTimeout(() => {
				setCopyStatus("");
			}, COPY_STATUS_DURATION_MS);
		}

		return () => {
			if (timeoutId !== null) {
				window.clearTimeout(timeoutId);
			}
		};
	}, [copyStatus]);

	const copyFixedLink = async () => {
		const fixedUrl = rewriteSiteUrl(currentSite, currentUrl, settings);

		if (!fixedUrl) {
			return;
		}

		try {
			await navigator.clipboard.writeText(fixedUrl);
			setCopyStatus("Copied.");
		} catch {
			setCopyStatus("Failed to copy link.");
		}
	};

	return (
		<section className="flex flex-col">
			<button
				type="button"
				className="w-full"
				onClick={() => {
					void copyFixedLink();
				}}
			>
				{copyStatus || COPY_BUTTON_TEXT}
			</button>
		</section>
	);
}

function PopupSettingsSection({
	setSavedSettings,
	setSettings,
	showCopyAction,
	state,
}: {
	setSavedSettings: Dispatch<SetStateAction<DomainSettings>>;
	setSettings: Dispatch<SetStateAction<DomainSettings>>;
	showCopyAction: boolean;
	state: PopupState & { currentSite: SiteRewriter; currentUrl: string };
}) {
	return (
		<>
			{showCopyAction ? (
				<SupportedPageActions
					currentSite={state.currentSite}
					currentUrl={state.currentUrl}
					settings={state.savedSettings}
				/>
			) : (
				<SupportMessage>This page URL is not supported.</SupportMessage>
			)}

			<SiteSettingCard
				context="popup"
				initialStatus={state.initialStatus}
				onPersisted={setSavedSettings}
				setSettings={setSettings}
				settings={state.settings}
				site={state.currentSite}
			/>
		</>
	);
}

function PopupBody({
	setSavedSettings,
	setSettings,
	state,
}: {
	setSavedSettings: Dispatch<SetStateAction<DomainSettings>>;
	setSettings: Dispatch<SetStateAction<DomainSettings>>;
	state: PopupState;
}) {
	const supportsCurrentUrl = useMemo(
		() =>
			Boolean(
				state.currentSite &&
				state.currentUrl &&
				supportsSiteUrlWithSettings(
					state.currentSite,
					state.currentUrl,
					state.savedSettings,
				),
			),
		[state.currentSite, state.currentUrl, state.savedSettings],
	);

	if (!state.isLoaded) {
		return <SupportMessage>Loading current site...</SupportMessage>;
	}

	if (!state.currentSite) {
		return <SupportMessage>Current site is not supported.</SupportMessage>;
	}

	return (
		<PopupSettingsSection
			setSavedSettings={setSavedSettings}
			setSettings={setSettings}
			showCopyAction={supportsCurrentUrl}
			state={{
				...state,
				currentSite: state.currentSite,
				currentUrl: state.currentUrl!,
			}}
		/>
	);
}

export function App() {
	const { setSavedSettings, setSettings, state } = usePopupState();

	return (
		<main className="flex flex-col gap-3 p-4 py-5">
			<PopupBody
				state={state}
				setSavedSettings={setSavedSettings}
				setSettings={setSettings}
			/>
			<div className="flex gap-2">
				<button
					type="button"
					className="flex-1"
					onClick={() => {
						void openSettings();
					}}
				>
					Open settings
				</button>
			</div>
			<div className="flex flex-col items-center font-mono text-sm">
				<a
					href="https://github.com/theacrat/linkfxer"
					target="_blank"
					rel="noreferrer"
				>
					GitHub
				</a>
				<a href="https://ko-fi.com/theacrat" target="_blank" rel="noreferrer">
					support the developer
				</a>
			</div>
		</main>
	);
}

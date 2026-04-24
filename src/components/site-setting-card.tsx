import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

import {
	CustomDomainsField,
	DomainField,
	FormActions,
	InterceptCopyField,
} from "@/components/site-setting-card-fields";
import {
	getSiteSettings,
	normaliseDomainList,
	normaliseOptionalDomain,
	setDomainSettings,
	type DomainSettings,
} from "@/utils/settings";
import type { SiteRewriter } from "@/utils/sites/base";

type SiteSettingCardContext = "options" | "popup";

type SiteSettingCardProps = {
	context: SiteSettingCardContext;
	initialStatus: string;
	onPersisted?: (nextSettings: DomainSettings) => void;
	setSettings: Dispatch<SetStateAction<DomainSettings>>;
	settings: DomainSettings;
	site: SiteRewriter;
};

type SiteSettingFormProps = {
	context: SiteSettingCardContext;
	customDomains: string;
	interceptCopy: boolean;
	onCustomDomainsChange: (value: string) => void;
	onInterceptCopyChange: (value: boolean) => void;
	onReset: () => Promise<void>;
	onSave: () => Promise<void>;
	onTargetDomainChange: (value: string) => void;
	site: SiteRewriter;
	status: string;
	targetDomain: string;
};

type SiteSettingHandlers = {
	resetSite: () => Promise<void>;
	saveSite: () => Promise<void>;
	updateCustomDomains: (value: string) => void;
	updateInterceptCopy: (value: boolean) => void;
	updateTargetDomain: (value: string) => void;
};

type SiteStatusActions = {
	setStatus: Dispatch<SetStateAction<string>>;
	setSettings: Dispatch<SetStateAction<DomainSettings>>;
};

function updateSiteSettings(
	setSettings: Dispatch<SetStateAction<DomainSettings>>,
	service: SiteRewriter["service"],
	value: Partial<ReturnType<typeof getSiteSettings>>,
) {
	setSettings((current) => ({
		...current,
		[service]: {
			...getSiteSettings(current, service),
			...value,
		},
	}));
}
function createSavedSettings(settings: DomainSettings, site: SiteRewriter) {
	const siteSettings = getSiteSettings(settings, site.service);
	const targetDomain = normaliseOptionalDomain(siteSettings.targetDomain);
	const customDomains = normaliseDomainList(siteSettings.customDomains);

	if (targetDomain === null || customDomains === null) {
		return null;
	}

	return {
		...settings,
		[site.service]: {
			customDomains: customDomains.join("\n"),
			interceptCopy: siteSettings.interceptCopy,
			targetDomain,
		},
	};
}
function createResetSettings(settings: DomainSettings, site: SiteRewriter) {
	return {
		...settings,
		[site.service]: {
			customDomains: "",
			interceptCopy: true,
			targetDomain: site.defaultDomain,
		},
	};
}
async function persistSettings(
	nextSettings: DomainSettings,
	setSettings: Dispatch<SetStateAction<DomainSettings>>,
) {
	await setDomainSettings(nextSettings);
	setSettings(nextSettings);
}
async function persistAndNotify(
	nextSettings: DomainSettings,
	onPersisted: ((nextSettings: DomainSettings) => void) | undefined,
	actions: SiteStatusActions,
) {
	await persistSettings(nextSettings, actions.setSettings);
	onPersisted?.(nextSettings);
}
function getInvalidSettingsMessage(
	settings: DomainSettings,
	site: SiteRewriter,
) {
	return normaliseOptionalDomain(
		getSiteSettings(settings, site.service).targetDomain,
	) === null
		? `Enter a valid hostname like ${site.defaultDomain}.`
		: "Enter valid custom hostnames, one per line.";
}

function createSiteSettingHandlers(
	onPersisted: ((nextSettings: DomainSettings) => void) | undefined,
	actions: SiteStatusActions,
	settings: DomainSettings,
	site: SiteRewriter,
): SiteSettingHandlers {
	return {
		resetSite: async () => {
			const nextSettings = createResetSettings(settings, site);
			await persistAndNotify(nextSettings, onPersisted, actions);
			actions.setStatus("");
		},
		saveSite: async () => {
			const nextSettings = createSavedSettings(settings, site);

			if (!nextSettings) {
				actions.setStatus(getInvalidSettingsMessage(settings, site));
				return;
			}

			await persistAndNotify(nextSettings, onPersisted, actions);
			actions.setStatus("");
		},
		updateCustomDomains: (value: string) => {
			updateSiteSettings(actions.setSettings, site.service, {
				customDomains: value,
			});
			actions.setStatus("");
		},
		updateInterceptCopy: (value: boolean) => {
			const nextSettings = {
				...settings,
				[site.service]: {
					...getSiteSettings(settings, site.service),
					interceptCopy: value,
				},
			};
			void persistSettings(nextSettings, actions.setSettings);
			onPersisted?.(nextSettings);
		},
		updateTargetDomain: (value: string) => {
			updateSiteSettings(actions.setSettings, site.service, {
				targetDomain: value,
			});
			actions.setStatus("");
		},
	};
}

function SiteSettingForm({
	context,
	customDomains,
	interceptCopy,
	onCustomDomainsChange,
	onInterceptCopyChange,
	onReset,
	onSave,
	onTargetDomainChange,
	site,
	status,
	targetDomain,
}: SiteSettingFormProps) {
	return (
		<section className="flex flex-col gap-3 border-t border-[ButtonBorder] pt-3">
			{context === "options" && <h2 className="m-0">{site.name}</h2>}
			<DomainField
				onTargetDomainChange={onTargetDomainChange}
				context={context}
				site={site}
				targetDomain={targetDomain}
			/>

			<CustomDomainsField
				customDomains={customDomains}
				onCustomDomainsChange={onCustomDomainsChange}
			/>

			<InterceptCopyField
				interceptCopy={interceptCopy}
				onInterceptCopyChange={onInterceptCopyChange}
			/>
			<FormActions context={context} onReset={onReset} onSave={onSave} />
			{status ? <span className="text-sm text-red-500">{status}</span> : null}
		</section>
	);
}

export function SiteSettingCard({
	context,
	initialStatus,
	onPersisted,
	setSettings,
	settings,
	site,
}: SiteSettingCardProps) {
	const [status, setStatus] = useState(initialStatus);

	useEffect(() => {
		setStatus(initialStatus);
	}, [initialStatus]);
	const {
		resetSite,
		saveSite,
		updateCustomDomains,
		updateInterceptCopy,
		updateTargetDomain,
	} = createSiteSettingHandlers(
		onPersisted,
		{ setSettings, setStatus },
		settings,
		site,
	);

	return (
		<SiteSettingForm
			context={context}
			customDomains={getSiteSettings(settings, site.service).customDomains}
			interceptCopy={getSiteSettings(settings, site.service).interceptCopy}
			onCustomDomainsChange={updateCustomDomains}
			onInterceptCopyChange={updateInterceptCopy}
			onReset={resetSite}
			onSave={saveSite}
			onTargetDomainChange={updateTargetDomain}
			site={site}
			status={status}
			targetDomain={getSiteSettings(settings, site.service).targetDomain}
		/>
	);
}

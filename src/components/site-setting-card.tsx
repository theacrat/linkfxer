import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

import {
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
	onReset: () => void;
	onSave: () => void;
	onTargetDomainChange: (value: string) => void;
	site: SiteRewriter;
	status: string;
	targetDomain: string;
};

type DomainFieldProps = {
	context: SiteSettingCardContext;
	onTargetDomainChange: (value: string) => void;
	site: SiteRewriter;
	targetDomain: string;
};

type CustomDomainsFieldProps = {
	customDomains: string;
	onCustomDomainsChange: (value: string) => void;
};

type SiteSettingHandlers = {
	resetSite: () => Promise<void>;
	saveSite: () => Promise<void>;
	updateCustomDomains: (value: string) => void;
	updateInterceptCopy: (value: boolean) => void;
	updateTargetDomain: (value: string) => void;
};

function updateSiteSettings(
	setSettings: Dispatch<SetStateAction<DomainSettings>>,
	service: SiteRewriter["service"],
	value: Partial<DomainSettings[SiteRewriter["service"]]>,
) {
	setSettings((current) => ({
		...current,
		[service]: {
			...current[service],
			...value,
		},
	}));
}

function createSavedSettings(settings: DomainSettings, site: SiteRewriter) {
	const targetDomain = normaliseOptionalDomain(settings[site.service].targetDomain);
	const customDomains = normaliseDomainList(settings[site.service].customDomains);

	if (targetDomain === null || customDomains === null) {
		return null;
	}

	return {
		...settings,
		[site.service]: {
			customDomains: customDomains.join("\n"),
			interceptCopy: settings[site.service].interceptCopy,
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

function getInvalidSettingsMessage(settings: DomainSettings, site: SiteRewriter) {
	return normaliseOptionalDomain(settings[site.service].targetDomain) === null
		? `Enter a valid hostname like ${site.defaultDomain}.`
		: "Enter valid custom hostnames, one per line.";
}

function DomainField({ onTargetDomainChange, context, site, targetDomain }: DomainFieldProps) {
	return (
		<label className="grid gap-1.5">
			<span className="text-sm font-bold">Fxed domain</span>
			<input
				type="text"
				value={targetDomain}
				onChange={(event) => {
					onTargetDomainChange(event.target.value);
				}}
				placeholder={site.defaultDomain}
				spellCheck={false}
				className="box-border w-full px-2 py-1.5"
			/>
			{context === "popup" && (
				<small className="text-xs">Leave blank to disable rewriting for this site.</small>
			)}
		</label>
	);
}

function CustomDomainsField({ customDomains, onCustomDomainsChange }: CustomDomainsFieldProps) {
	return (
		<label className="grid gap-1.5">
			<span className="text-sm font-bold">Custom source domains</span>
			<textarea
				rows={3}
				value={customDomains}
				onChange={(event) => {
					onCustomDomainsChange(event.target.value);
				}}
				placeholder="One hostname per line"
				spellCheck={false}
				className="box-border w-full resize-y px-2 py-1.5"
			/>
		</label>
	);
}

function createSiteSettingHandlers(
	onPersisted: ((nextSettings: DomainSettings) => void) | undefined,
	setSettings: Dispatch<SetStateAction<DomainSettings>>,
	setStatus: Dispatch<SetStateAction<string>>,
	settings: DomainSettings,
	site: SiteRewriter,
): SiteSettingHandlers {
	return {
		resetSite: async () => {
			const nextSettings = createResetSettings(settings, site);
			await persistSettings(nextSettings, setSettings);
			onPersisted?.(nextSettings);
			setStatus("");
		},
		saveSite: async () => {
			const nextSettings = createSavedSettings(settings, site);

			if (!nextSettings) {
				setStatus(getInvalidSettingsMessage(settings, site));
				return;
			}

			await persistSettings(nextSettings, setSettings);
			onPersisted?.(nextSettings);
			setStatus("");
		},
		updateCustomDomains: (value: string) => {
			updateSiteSettings(setSettings, site.service, { customDomains: value });
			setStatus("");
		},
		updateInterceptCopy: (value: boolean) => {
			const nextSettings = {
				...settings,
				[site.service]: { ...settings[site.service], interceptCopy: value },
			};
			void persistSettings(nextSettings, setSettings);
			onPersisted?.(nextSettings);
		},
		updateTargetDomain: (value: string) => {
			updateSiteSettings(setSettings, site.service, { targetDomain: value });
			setStatus("");
		},
	};
}

function InterceptCopyField({
	interceptCopy,
	onInterceptCopyChange,
}: {
	interceptCopy: boolean;
	onInterceptCopyChange: (value: boolean) => void;
}) {
	return (
		<label className="flex cursor-pointer items-center gap-2 text-sm">
			<input
				type="checkbox"
				checked={interceptCopy}
				onChange={(event) => {
					onInterceptCopyChange(event.target.checked);
				}}
				className="m-0 cursor-pointer"
			/>
			<span>Rewrite copied links</span>
		</label>
	);
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

			<div className="flex gap-2">
				<button
					type="button"
					className={context === "popup" ? "flex-1" : "min-w-18"}
					onClick={onSave}
				>
					Save
				</button>
				<button
					type="button"
					className={context === "popup" ? "flex-1" : "min-w-18"}
					onClick={onReset}
				>
					Reset
				</button>
			</div>

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
	const { resetSite, saveSite, updateCustomDomains, updateInterceptCopy, updateTargetDomain } =
		createSiteSettingHandlers(onPersisted, setSettings, setStatus, settings, site);

	return (
		<SiteSettingForm
			context={context}
			customDomains={settings[site.service].customDomains}
			interceptCopy={settings[site.service].interceptCopy}
			onCustomDomainsChange={updateCustomDomains}
			onInterceptCopyChange={updateInterceptCopy}
			onReset={resetSite}
			onSave={saveSite}
			onTargetDomainChange={updateTargetDomain}
			site={site}
			status={status}
			targetDomain={settings[site.service].targetDomain}
		/>
	);
}

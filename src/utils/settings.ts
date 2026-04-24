import { SITE_REWRITERS } from "./sites/registry";

export type ServiceKey = (typeof SITE_REWRITERS)[number]["service"];

export type SiteSettings = {
	customDomains: string;
	interceptCopy: boolean;
	targetDomain: string;
};

export type DomainSettings = Record<ServiceKey, SiteSettings>;

export const DEFAULT_SITE_SETTINGS = createDomainSettings((site) => ({
	customDomains: "",
	interceptCopy: true,
	targetDomain: site.defaultDomain,
}));

export const STORAGE_KEY = "domainSettings";

const HOSTNAME_PATTERN =
	/^(?=.{1,253}$)(?!-)[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,63}$/i;

function extractHostname(input: string) {
	const trimmed = input.trim().toLowerCase();

	if (!trimmed) {
		return "";
	}

	const withoutProtocol = trimmed.replace(/^[a-z]+:\/\//i, "");
	const hostname =
		withoutProtocol.split("/")[0]?.split("?")[0]?.split("#")[0] ?? "";

	return hostname.replace(/:\d+$/, "");
}

function serialiseDomains(domains: readonly string[]) {
	return domains.join("\n");
}

function splitDomains(input: string) {
	return input
		.split(/[\n,\s]+/)
		.map((domain) => domain.trim())
		.filter(Boolean);
}

export function normaliseDomain(input: string) {
	const hostname = extractHostname(input);

	if (!HOSTNAME_PATTERN.test(hostname)) {
		return null;
	}

	return hostname;
}

export function normaliseOptionalDomain(input: string) {
	if (!input.trim()) {
		return "";
	}

	return normaliseDomain(input);
}

export function normaliseDomainList(input: string) {
	const normalisedDomains: string[] = [];
	const seenDomains = new Set<string>();

	for (const candidate of splitDomains(input)) {
		const normalisedDomain = normaliseDomain(candidate);

		if (normalisedDomain === null) {
			return null;
		}

		if (!seenDomains.has(normalisedDomain)) {
			seenDomains.add(normalisedDomain);
			normalisedDomains.push(normalisedDomain);
		}
	}

	return normalisedDomains;
}

export function getCustomDomains(
	settings: DomainSettings,
	service: ServiceKey,
) {
	return normaliseDomainList(settings[service].customDomains) ?? [];
}

export function sanitiseSettings(value: unknown): DomainSettings {
	const storedSettings = asStoredDomainSettings(value);

	return createDomainSettings((site) => {
		const entry = storedSettings?.[site.service];
		const targetDomainInput =
			typeof entry === "string" ? entry : entry?.targetDomain;
		const customDomainsInput =
			typeof entry === "string" ? "" : entry?.customDomains;
		const interceptCopyInput =
			typeof entry === "string" ? undefined : entry?.interceptCopy;
		let { customDomains } = DEFAULT_SITE_SETTINGS[site.service];

		if (customDomainsInput !== undefined) {
			const normalisedCustomDomains = normaliseDomainList(customDomainsInput);

			if (normalisedCustomDomains !== null) {
				customDomains = serialiseDomains(normalisedCustomDomains);
			}
		}

		const targetDomain =
			targetDomainInput === undefined
				? DEFAULT_SITE_SETTINGS[site.service].targetDomain
				: (normaliseOptionalDomain(targetDomainInput) ??
					DEFAULT_SITE_SETTINGS[site.service].targetDomain);

		const interceptCopy =
			typeof interceptCopyInput === "boolean"
				? interceptCopyInput
				: DEFAULT_SITE_SETTINGS[site.service].interceptCopy;

		return {
			customDomains,
			interceptCopy,
			targetDomain,
		};
	});
}

export async function getDomainSettings() {
	const stored = await browser.storage.sync.get(STORAGE_KEY);
	return sanitiseSettings(asStoredDomainSettings(stored[STORAGE_KEY]));
}

export async function setDomainSettings(settings: DomainSettings) {
	await browser.storage.sync.set({
		[STORAGE_KEY]: sanitiseSettings(settings),
	});
}

function createDomainSettings(
	getValue: (site: (typeof SITE_REWRITERS)[number]) => SiteSettings,
): DomainSettings {
	const settings = {} as DomainSettings;

	for (const site of SITE_REWRITERS) {
		settings[site.service] = getValue(site);
	}

	return settings;
}

function asStoredDomainSettings(
	value: unknown,
): Partial<Record<ServiceKey, string | Partial<SiteSettings>>> | undefined {
	if (!isStringRecord(value)) {
		return undefined;
	}

	const settings: Partial<Record<ServiceKey, string | Partial<SiteSettings>>> =
		{};

	for (const site of SITE_REWRITERS) {
		const candidate = value[site.service];

		if (typeof candidate === "string") {
			settings[site.service] = candidate;
		} else if (isStringRecord(candidate)) {
			settings[site.service] = {
				customDomains:
					typeof candidate.customDomains === "string"
						? candidate.customDomains
						: undefined,
				interceptCopy:
					typeof candidate.interceptCopy === "boolean"
						? candidate.interceptCopy
						: undefined,
				targetDomain:
					typeof candidate.targetDomain === "string"
						? candidate.targetDomain
						: undefined,
			};
		}
	}

	return settings;
}

function isStringRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === "object";
}

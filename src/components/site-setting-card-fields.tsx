import type { SiteRewriter } from "@/utils/sites/base";

type SiteSettingCardContext = "options" | "popup";

export function DomainField({
	context,
	onTargetDomainChange,
	site,
	targetDomain,
}: {
	context: SiteSettingCardContext;
	onTargetDomainChange: (value: string) => void;
	site: SiteRewriter;
	targetDomain: string;
}) {
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
				<small className="text-xs">
					Leave blank to disable rewriting for this site.
				</small>
			)}
		</label>
	);
}

export function CustomDomainsField({
	customDomains,
	onCustomDomainsChange,
}: {
	customDomains: string;
	onCustomDomainsChange: (value: string) => void;
}) {
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

export function InterceptCopyField({
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

export function FormActions({
	context,
	onReset,
	onSave,
}: {
	context: SiteSettingCardContext;
	onReset: () => Promise<void>;
	onSave: () => Promise<void>;
}) {
	const buttonClassName = context === "popup" ? "flex-1" : "min-w-18";

	const handleSaveClick = () => {
		void onSave();
	};

	const handleResetClick = () => {
		void onReset();
	};

	return (
		<div className="flex gap-2">
			<button
				type="button"
				className={buttonClassName}
				onClick={handleSaveClick}
			>
				Save
			</button>
			<button
				type="button"
				className={buttonClassName}
				onClick={handleResetClick}
			>
				Reset
			</button>
		</div>
	);
}

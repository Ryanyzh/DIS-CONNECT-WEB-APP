import type { ReactNode } from "react";

interface PageShellProps {
	description?: string;
	actions?: ReactNode;
	children?: ReactNode;
}

export default function PageShell({ description, actions, children }: PageShellProps) {
	const hasHeader = description || actions;
	return (
		<section className="w-full space-y-5">
			{hasHeader && (
				<div className="flex items-center justify-between gap-4">
					{description ? (
						<div className="flex items-center gap-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-lg px-3.5 py-2.5 flex-1 max-w-2xl">
							<svg
								className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
									clipRule="evenodd"
								/>
							</svg>
							<p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
								{description}
							</p>
						</div>
					) : (
						<span />
					)}
					{actions && (
						<div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
					)}
				</div>
			)}
			{children}
		</section>
	);
}

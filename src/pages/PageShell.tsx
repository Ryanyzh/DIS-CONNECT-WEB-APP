import type { ReactNode } from "react";

interface PageShellProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export default function PageShell({ title, description, children }: PageShellProps) {
  return (
    <section className="space-y-6">
      <div className="border-b border-slate-200/80 pb-6 dark:border-slate-700/80">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400">Page</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
          </div>
        </div>
      </div>

      {children ? (
        children
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300/80 bg-white/80 p-8 text-center text-slate-700 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/50 dark:text-slate-200">
          <p className="text-sm leading-7">
            This is a skeleton workspace for the <strong>{title}</strong> page.
          </p>
        </div>
      )}
    </section>
  );
}

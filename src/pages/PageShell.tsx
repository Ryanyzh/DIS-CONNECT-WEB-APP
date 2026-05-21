import type { ReactNode } from "react";

interface PageShellProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export default function PageShell({ title, description, children }: PageShellProps) {
  return (
    <section className="space-y-6">
      <div className="border-b border-wise-ink/10 pb-6 dark:border-wise-canvasSoft/20">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-wise-mute dark:text-wise-canvasSoft">Page</p>
            <h1 className="mt-2 text-display-md font-semibold text-wise-ink dark:text-wise-canvas">{title}</h1>
            <p className="mt-2 max-w-2xl text-body-md leading-7 text-wise-body dark:text-wise-canvasSoft">{description}</p>
          </div>
        </div>
      </div>

      {children ? (
        children
      ) : (
        <div className="rounded-wiseXl border border-wise-ink/10 bg-wise-canvasSoft p-xl text-center text-wise-body shadow-sm dark:border-wise-canvasSoft/20 dark:bg-[#151611] dark:text-wise-canvas">
          <p className="text-body-md leading-7">
            This is a skeleton workspace for the <strong>{title}</strong> page.
          </p>
        </div>
      )}
    </section>
  );
}

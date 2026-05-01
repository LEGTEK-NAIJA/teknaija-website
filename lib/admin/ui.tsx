import type { ReactNode } from "react";

/**
 * Minimal, utilitarian UI primitives shared across the admin CMS. No
 * decorative motifs — the admin is the workshop, not the cathedral.
 */

const FIELD_LABEL =
  "block text-sm font-medium text-slate-700 mb-1.5";

const FIELD_HELP = "mt-1 text-xs text-slate-500";

const FIELD_ERROR = "mt-1 text-xs text-red-600";

const INPUT_BASE =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 " +
  "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 " +
  "aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-200";

export function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className={FIELD_LABEL}>
      {children}
      {required ? <span className="text-red-500"> *</span> : null}
    </label>
  );
}

export function FieldHelp({ children }: { children: ReactNode }) {
  return <p className={FIELD_HELP}>{children}</p>;
}

export function FieldError({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <p className={FIELD_ERROR}>{children}</p>;
}

export const inputClass = INPUT_BASE;

export function PrimaryButton({
  children,
  type = "button",
  disabled,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center rounded-md",
        "bg-slate-900 px-4 py-2 text-sm font-medium text-white",
        "hover:bg-slate-800 active:bg-slate-700",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:bg-slate-400",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  type = "button",
  disabled,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center rounded-md",
        "border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800",
        "hover:bg-slate-50 active:bg-slate-100",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  type = "button",
  disabled,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center rounded-md",
        "border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700",
        "hover:bg-red-50 active:bg-red-100",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}

export function StatusPill({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "green" | "amber" | "red";
  children: ReactNode;
}) {
  const palette: Record<string, string> = {
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        palette[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function FlashError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <div
      role="alert"
      className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
    >
      {children}
    </div>
  );
}

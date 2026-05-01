"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  source: string;
  className?: string;
};

/**
 * Lightweight markdown preview used inside the admin editor surface.
 * Intentionally minimal styling — utilitarian, neutral, fast. Avoids the
 * Tailwind typography plugin so the admin keeps its small dependency surface.
 */
export function MarkdownPreview({ source, className }: Props) {
  if (!source) {
    return (
      <p className={`italic text-slate-400 ${className ?? ""}`.trim()}>
        Preview will appear here.
      </p>
    );
  }

  return (
    <div
      className={[
        "text-sm leading-6 text-slate-700",
        "[&_h1]:mt-0 [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:text-slate-900",
        "[&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-slate-900",
        "[&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-900",
        "[&_p]:my-3",
        "[&_a]:text-slate-900 [&_a]:underline hover:[&_a]:text-slate-700",
        "[&_strong]:text-slate-900 [&_strong]:font-semibold",
        "[&_em]:italic",
        "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6",
        "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_li]:my-1",
        "[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-slate-300 [&_blockquote]:pl-3 [&_blockquote]:text-slate-600",
        "[&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.82rem] [&_code]:text-slate-800",
        "[&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-slate-900 [&_pre]:p-3",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-slate-100",
        "[&_hr]:my-4 [&_hr]:border-slate-200",
        "[&_table]:my-3 [&_table]:w-full [&_table]:text-left [&_table]:text-sm",
        "[&_th]:border-b [&_th]:border-slate-300 [&_th]:px-2 [&_th]:py-1 [&_th]:font-semibold",
        "[&_td]:border-b [&_td]:border-slate-200 [&_td]:px-2 [&_td]:py-1",
        className ?? "",
      ].join(" ")}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
    </div>
  );
}

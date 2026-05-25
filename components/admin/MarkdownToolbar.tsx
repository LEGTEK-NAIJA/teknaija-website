"use client";

import { useEffect, type RefObject } from "react";

import { ImageUploadButton } from "@/components/admin/ImageUploadButton";

type Props = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (next: string) => void;
  onImageUploaded: (url: string) => void;
};

type EditAction =
  | { kind: "wrap"; before: string; after: string; placeholder?: string }
  | { kind: "line-prefix"; prefix: string }
  | { kind: "link" };

const ACTIONS = {
  bold: { kind: "wrap", before: "**", after: "**", placeholder: "bold" } as EditAction,
  italic: { kind: "wrap", before: "*", after: "*", placeholder: "italic" } as EditAction,
  code: { kind: "wrap", before: "`", after: "`", placeholder: "code" } as EditAction,
  h2: { kind: "line-prefix", prefix: "## " } as EditAction,
  h3: { kind: "line-prefix", prefix: "### " } as EditAction,
  bullet: { kind: "line-prefix", prefix: "- " } as EditAction,
  numbered: { kind: "line-prefix", prefix: "1. " } as EditAction,
  link: { kind: "link" } as EditAction,
};

export function MarkdownToolbar({
  textareaRef,
  value,
  onChange,
  onImageUploaded,
}: Props) {
  function applyAction(action: EditAction) {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);

    let next = value;
    let nextStart = start;
    let nextEnd = end;

    if (action.kind === "wrap") {
      const { before, after, placeholder = "" } = action;
      const inner = selected || placeholder;
      const insertion = `${before}${inner}${after}`;
      next = value.slice(0, start) + insertion + value.slice(end);
      if (selected) {
        nextStart = start + before.length;
        nextEnd = nextStart + inner.length;
      } else {
        nextStart = nextEnd = start + before.length + placeholder.length;
      }
    } else if (action.kind === "line-prefix") {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const prefix = action.prefix;
      const lineHasPrefix =
        value.slice(lineStart, lineStart + prefix.length) === prefix;
      if (lineHasPrefix) {
        next =
          value.slice(0, lineStart) + value.slice(lineStart + prefix.length);
        nextStart = Math.max(lineStart, start - prefix.length);
        nextEnd = Math.max(lineStart, end - prefix.length);
      } else {
        next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
        nextStart = start + prefix.length;
        nextEnd = end + prefix.length;
      }
    } else if (action.kind === "link") {
      const label = selected || "link text";
      const insertion = `[${label}](url)`;
      next = value.slice(0, start) + insertion + value.slice(end);
      const urlStart = start + 1 + label.length + 2;
      nextStart = urlStart;
      nextEnd = urlStart + 3;
    }

    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(nextStart, nextEnd);
    });
  }

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;

    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const key = e.key.toLowerCase();

      if (e.shiftKey && e.altKey) return;

      if (e.altKey && !e.shiftKey) {
        if (key === "2") {
          e.preventDefault();
          applyAction(ACTIONS.h2);
          return;
        }
        if (key === "3") {
          e.preventDefault();
          applyAction(ACTIONS.h3);
          return;
        }
        return;
      }

      if (e.shiftKey && !e.altKey) {
        if (key === "7" || e.key === "&") {
          e.preventDefault();
          applyAction(ACTIONS.numbered);
          return;
        }
        if (key === "8" || e.key === "*") {
          e.preventDefault();
          applyAction(ACTIONS.bullet);
          return;
        }
        return;
      }

      if (!e.shiftKey && !e.altKey) {
        if (key === "b") {
          e.preventDefault();
          applyAction(ACTIONS.bold);
          return;
        }
        if (key === "i") {
          e.preventDefault();
          applyAction(ACTIONS.italic);
          return;
        }
        if (key === "e") {
          e.preventDefault();
          applyAction(ACTIONS.code);
          return;
        }
        if (key === "k") {
          e.preventDefault();
          applyAction(ACTIONS.link);
          return;
        }
      }
    }

    ta.addEventListener("keydown", onKey);
    return () => ta.removeEventListener("keydown", onKey);
  }, [textareaRef, value, onChange]);

  return (
    <div className="flex flex-wrap items-center gap-1">
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => applyAction(ACTIONS.bold)}
          title="Bold (⌘B)"
          aria-label="Bold"
        >
          <BoldIcon />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => applyAction(ACTIONS.italic)}
          title="Italic (⌘I)"
          aria-label="Italic"
        >
          <ItalicIcon />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => applyAction(ACTIONS.code)}
          title="Inline code (⌘E)"
          aria-label="Inline code"
        >
          <CodeIcon />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ToolbarButton
          onClick={() => applyAction(ACTIONS.h2)}
          title="Heading 2 (⌘⌥2)"
          aria-label="Heading 2"
        >
          <span className="text-[13px] font-semibold leading-none">H2</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => applyAction(ACTIONS.h3)}
          title="Heading 3 (⌘⌥3)"
          aria-label="Heading 3"
        >
          <span className="text-[13px] font-semibold leading-none">H3</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => applyAction(ACTIONS.bullet)}
          title="Bullet list (⌘⇧8)"
          aria-label="Bullet list"
        >
          <BulletIcon />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => applyAction(ACTIONS.numbered)}
          title="Numbered list (⌘⇧7)"
          aria-label="Numbered list"
        >
          <NumberedIcon />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ToolbarButton
          onClick={() => applyAction(ACTIONS.link)}
          title="Link (⌘K)"
          aria-label="Link"
        >
          <LinkIcon />
        </ToolbarButton>
        <ImageUploadButton label="Insert image" onUploaded={onImageUploaded} />
      </ToolbarGroup>
    </div>
  );
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function ToolbarSeparator() {
  return <div className="mx-1 h-5 w-px bg-slate-200" aria-hidden />;
}

function ToolbarButton({
  children,
  onClick,
  title,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  "aria-label": string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      className="
        inline-flex h-8 w-8 items-center justify-center rounded
        text-slate-600 hover:bg-slate-100 hover:text-slate-900
        focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1
        transition-colors
      "
    >
      {children}
    </button>
  );
}

function BoldIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 4h8a4 4 0 0 1 0 8H6z" />
      <path d="M6 12h9a4 4 0 0 1 0 8H6z" />
    </svg>
  );
}

function ItalicIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="19" y1="4" x2="10" y2="4" />
      <line x1="14" y1="20" x2="5" y2="20" />
      <line x1="15" y1="4" x2="9" y2="20" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function BulletIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="9" y1="6" x2="20" y2="6" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" />
      <circle cx="4.5" cy="6" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="18" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

function NumberedIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="10" y1="6" x2="21" y2="6" />
      <line x1="10" y1="12" x2="21" y2="12" />
      <line x1="10" y1="18" x2="21" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

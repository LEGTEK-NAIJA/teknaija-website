"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { DangerButton } from "@/lib/admin/ui";

type Props = {
  label: string;
  action: (id: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  id: string;
  /** Confirmation prompt shown before deletion. */
  confirmText?: string;
};

export function DeleteButton({ label, action, id, confirmText }: Props) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DangerButton
      type="button"
      disabled={pending}
      onClick={() => {
        const message = confirmText ?? `Delete ${label}? This cannot be undone.`;
        if (!window.confirm(message)) return;
        startTransition(async () => {
          const result = await action(id);
          if (!result.ok) {
            window.alert(`Could not delete: ${result.error}`);
            return;
          }
          router.refresh();
        });
      }}
    >
      {pending ? "Deleting…" : "Delete"}
    </DangerButton>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { AutosaveState } from "@/components/admin/AutosaveDot";

import {
  autosaveCreatePostAction,
  autosaveUpdatePostAction,
} from "./autosave-action";
import type { PostFormValues } from "./schema";

const DEBOUNCE_MS = 30_000;

type Args = {
  values: PostFormValues;
  isDirty: boolean;
  id: string | null;
  isSubmitting: boolean;
};

export function useAutosave({ values, isDirty, id, isSubmitting }: Args) {
  const router = useRouter();
  const [state, setState] = useState<AutosaveState>({ kind: "idle" });
  const [currentId, setCurrentId] = useState<string | null>(id);
  const inFlightRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const valuesRef = useRef(values);
  valuesRef.current = values;

  useEffect(() => {
    if (id) setCurrentId(id);
  }, [id]);

  const flush = useCallback(async () => {
    if (inFlightRef.current) return;
    if (isSubmitting) return;
    const v = valuesRef.current;
    if (!v.title || v.title.trim().length < 2) return;

    inFlightRef.current = true;
    setState({ kind: "saving" });

    try {
      const result = currentId
        ? await autosaveUpdatePostAction(currentId, v)
        : await autosaveCreatePostAction(v);

      if (result.ok) {
        setState({ kind: "saved", at: Date.now() });
        if (!currentId) {
          setCurrentId(result.id);
          router.replace(`/admin/posts/${result.id}`);
        }
      } else {
        setState({ kind: "error", message: result.error });
      }
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Save failed.",
      });
    } finally {
      inFlightRef.current = false;
    }
  }, [currentId, isSubmitting, router]);

  useEffect(() => {
    if (!isDirty) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void flush();
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [values, isDirty, flush]);

  return { state, currentId };
}

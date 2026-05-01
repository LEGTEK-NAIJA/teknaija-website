"use client";

import { useActionState } from "react";

import {
  FieldError,
  FieldLabel,
  FlashError,
  PrimaryButton,
  inputClass,
} from "@/lib/admin/ui";

import { signInAction, type LoginFormState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginFormState, FormData>(
    signInAction,
    undefined
  );

  return (
    <form action={action} className="space-y-4">
      <FlashError>{state?.error}</FlashError>

      <div>
        <FieldLabel htmlFor="email" required>
          Email
        </FieldLabel>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(state?.fieldErrors?.email)}
          className={inputClass}
        />
        <FieldError>{state?.fieldErrors?.email?.[0]}</FieldError>
      </div>

      <div>
        <FieldLabel htmlFor="password" required>
          Password
        </FieldLabel>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(state?.fieldErrors?.password)}
          className={inputClass}
        />
        <FieldError>{state?.fieldErrors?.password?.[0]}</FieldError>
      </div>

      <PrimaryButton type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </PrimaryButton>
    </form>
  );
}

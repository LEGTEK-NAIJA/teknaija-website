"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  FieldError,
  FieldLabel,
  FlashError,
  PrimaryButton,
  SecondaryButton,
  inputClass,
} from "@/lib/admin/ui";

import {
  TEAM_DEFAULTS,
  TeamFormSchema,
  type TeamFormValues,
} from "./schema";
import {
  createTeamMemberAction,
  updateTeamMemberAction,
  type ActionResult,
} from "./actions";

type Props =
  | { mode: "create"; defaultValues?: Partial<TeamFormValues>; id?: undefined }
  | { mode: "edit"; defaultValues: TeamFormValues; id: string };

export function TeamForm(props: Props) {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(TeamFormSchema),
    defaultValues: { ...TEAM_DEFAULTS, ...props.defaultValues },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      let result: ActionResult;
      if (props.mode === "edit") {
        result = await updateTeamMemberAction(props.id, values);
      } else {
        result = await createTeamMemberAction(values);
      }
      if (result && !result.ok) {
        setError("root", { message: result.error });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FlashError>{errors.root?.message}</FlashError>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <FieldLabel htmlFor="name" required>
            Name
          </FieldLabel>
          <input
            id="name"
            className={inputClass}
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
          <FieldError>{errors.name?.message}</FieldError>
        </div>

        <div>
          <FieldLabel htmlFor="role" required>
            Role
          </FieldLabel>
          <input
            id="role"
            className={inputClass}
            placeholder="Managing Director"
            aria-invalid={Boolean(errors.role)}
            {...register("role")}
          />
          <FieldError>{errors.role?.message}</FieldError>
        </div>

        <div>
          <FieldLabel htmlFor="display_order">Display order</FieldLabel>
          <input
            id="display_order"
            type="number"
            inputMode="numeric"
            min={0}
            className={inputClass}
            aria-invalid={Boolean(errors.display_order)}
            {...register("display_order", { valueAsNumber: true })}
          />
          <FieldError>{errors.display_order?.message}</FieldError>
        </div>

        <div className="flex items-center gap-2 pt-7">
          <input
            id="active"
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            {...register("active")}
          />
          <FieldLabel htmlFor="active">Active</FieldLabel>
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="bio">Bio</FieldLabel>
        <textarea
          id="bio"
          rows={6}
          className={`${inputClass} font-sans`}
          placeholder="80-word biography in Geist."
          aria-invalid={Boolean(errors.bio)}
          {...register("bio")}
        />
        <FieldError>{errors.bio?.message}</FieldError>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
        <Link href="/admin/team">
          <SecondaryButton type="button">Cancel</SecondaryButton>
        </Link>
        <PrimaryButton type="submit" disabled={pending}>
          {pending
            ? "Saving…"
            : props.mode === "edit"
              ? "Save changes"
              : "Create team member"}
        </PrimaryButton>
      </div>
    </form>
  );
}

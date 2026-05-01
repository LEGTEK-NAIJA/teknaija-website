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
  TESTIMONIAL_DEFAULTS,
  TestimonialFormSchema,
  type TestimonialFormValues,
} from "./schema";
import {
  createTestimonialAction,
  updateTestimonialAction,
  type ActionResult,
} from "./actions";

type Props =
  | {
      mode: "create";
      defaultValues?: Partial<TestimonialFormValues>;
      id?: undefined;
    }
  | { mode: "edit"; defaultValues: TestimonialFormValues; id: string };

export function TestimonialForm(props: Props) {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(TestimonialFormSchema),
    defaultValues: { ...TESTIMONIAL_DEFAULTS, ...props.defaultValues },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      let result: ActionResult;
      if (props.mode === "edit") {
        result = await updateTestimonialAction(props.id, values);
      } else {
        result = await createTestimonialAction(values);
      }
      if (result && !result.ok) {
        setError("root", { message: result.error });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FlashError>{errors.root?.message}</FlashError>

      <div>
        <FieldLabel htmlFor="quote" required>
          Quote
        </FieldLabel>
        <textarea
          id="quote"
          rows={4}
          className={`${inputClass} font-sans`}
          placeholder="A single restrained pull-quote from a partner or client."
          aria-invalid={Boolean(errors.quote)}
          {...register("quote")}
        />
        <FieldError>{errors.quote?.message}</FieldError>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div>
          <FieldLabel htmlFor="author_name">Author name</FieldLabel>
          <input
            id="author_name"
            className={inputClass}
            {...register("author_name")}
          />
          <FieldError>{errors.author_name?.message}</FieldError>
        </div>
        <div>
          <FieldLabel htmlFor="author_role">Author role</FieldLabel>
          <input
            id="author_role"
            className={inputClass}
            placeholder="Partner"
            {...register("author_role")}
          />
          <FieldError>{errors.author_role?.message}</FieldError>
        </div>
        <div>
          <FieldLabel htmlFor="author_org">Author organisation</FieldLabel>
          <input
            id="author_org"
            className={inputClass}
            placeholder="Dispute Resolution Chambers, Abuja"
            {...register("author_org")}
          />
          <FieldError>{errors.author_org?.message}</FieldError>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="active"
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          {...register("active")}
        />
        <FieldLabel htmlFor="active">Active</FieldLabel>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
        <Link href="/admin/testimonials">
          <SecondaryButton type="button">Cancel</SecondaryButton>
        </Link>
        <PrimaryButton type="submit" disabled={pending}>
          {pending
            ? "Saving…"
            : props.mode === "edit"
              ? "Save changes"
              : "Create testimonial"}
        </PrimaryButton>
      </div>
    </form>
  );
}

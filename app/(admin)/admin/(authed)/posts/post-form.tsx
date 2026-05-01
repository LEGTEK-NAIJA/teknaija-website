"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { MarkdownField } from "@/lib/admin/MarkdownField";
import {
  FieldError,
  FieldHelp,
  FieldLabel,
  FlashError,
  PrimaryButton,
  SecondaryButton,
  inputClass,
} from "@/lib/admin/ui";

import {
  POST_DEFAULTS,
  PostFormSchema,
  PostStatuses,
  type PostFormValues,
} from "./schema";
import {
  createPostAction,
  updatePostAction,
  type ActionResult,
} from "./actions";

type Props =
  | { mode: "create"; defaultValues?: Partial<PostFormValues>; id?: undefined }
  | { mode: "edit"; defaultValues: PostFormValues; id: string };

export function PostForm(props: Props) {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    setError,
    watch,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: { ...POST_DEFAULTS, ...props.defaultValues },
  });

  const status = watch("status");

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      let result: ActionResult;
      if (props.mode === "edit") {
        result = await updatePostAction(props.id, values);
      } else {
        result = await createPostAction(values);
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
          <FieldLabel htmlFor="title" required>
            Title
          </FieldLabel>
          <input
            id="title"
            className={inputClass}
            aria-invalid={Boolean(errors.title)}
            {...register("title")}
          />
          <FieldError>{errors.title?.message}</FieldError>
        </div>

        <div>
          <FieldLabel htmlFor="slug" required>
            Slug
          </FieldLabel>
          <input
            id="slug"
            className={`${inputClass} font-mono`}
            placeholder="why-nigerian-dispute-resolution-needs-its-own-architecture"
            aria-invalid={Boolean(errors.slug)}
            {...register("slug")}
          />
          <FieldError>{errors.slug?.message}</FieldError>
        </div>

        <div className="md:col-span-2">
          <FieldLabel htmlFor="dek">Dek</FieldLabel>
          <input
            id="dek"
            className={inputClass}
            placeholder="One sentence summary shown beneath the title in the index."
            aria-invalid={Boolean(errors.dek)}
            {...register("dek")}
          />
          <FieldError>{errors.dek?.message}</FieldError>
        </div>

        <div>
          <FieldLabel htmlFor="author_name">Author name</FieldLabel>
          <input
            id="author_name"
            className={inputClass}
            placeholder="Sanctus Ojonimi Ejeh"
            {...register("author_name")}
          />
          <FieldError>{errors.author_name?.message}</FieldError>
        </div>

        <div>
          <FieldLabel htmlFor="status" required>
            Status
          </FieldLabel>
          <div className="flex items-center gap-2">
            <select
              id="status"
              className={inputClass}
              aria-invalid={Boolean(errors.status)}
              {...register("status")}
            >
              {PostStatuses.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <FieldError>{errors.status?.message}</FieldError>
        </div>

        <div>
          <FieldLabel
            htmlFor="published_at"
            required={status === "published"}
          >
            Publish date
          </FieldLabel>
          <input
            id="published_at"
            type="date"
            className={inputClass}
            aria-invalid={Boolean(errors.published_at)}
            {...register("published_at")}
          />
          <FieldHelp>
            {status === "published"
              ? "Required for published posts."
              : "Optional while in draft."}
          </FieldHelp>
          <FieldError>{errors.published_at?.message}</FieldError>
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="body" required>
          Body (Markdown)
        </FieldLabel>
        <Controller
          control={control}
          name="body"
          render={({ field }) => (
            <MarkdownField
              id="body"
              name={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="Write the post in markdown — pull quotes, lists, links, fenced code blocks all supported."
              ariaInvalid={Boolean(errors.body)}
            />
          )}
        />
        <FieldError>{errors.body?.message}</FieldError>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
        <Link href="/admin/posts">
          <SecondaryButton type="button">Cancel</SecondaryButton>
        </Link>
        <PrimaryButton type="submit" disabled={pending}>
          {pending
            ? "Saving…"
            : props.mode === "edit"
              ? "Save changes"
              : "Create post"}
        </PrimaryButton>
      </div>
    </form>
  );
}

"use client";

import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CoverImageField } from "@/components/admin/CoverImageField";
import { GalleryField } from "@/components/admin/GalleryField";
import { OutcomesField } from "@/components/admin/OutcomesField";
import { TagInputField } from "@/components/admin/TagInputField";
import { MarkdownField } from "@/lib/admin/MarkdownField";
import {
  FieldError,
  FieldLabel,
  FlashError,
  PrimaryButton,
  SecondaryButton,
  inputClass,
} from "@/lib/admin/ui";
import Link from "next/link";

import {
  PROJECT_DEFAULTS,
  ProjectFormSchema,
  ProjectStatuses,
  type ProjectFormValues,
} from "./schema";
import {
  createProjectAction,
  updateProjectAction,
  type ActionResult,
} from "./actions";

type Props =
  | { mode: "create"; defaultValues?: Partial<ProjectFormValues>; id?: undefined }
  | { mode: "edit"; defaultValues: ProjectFormValues; id: string };

export function ProjectForm(props: Props) {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    setError,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: { ...PROJECT_DEFAULTS, ...props.defaultValues },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      let result: ActionResult;
      if (props.mode === "edit") {
        result = await updateProjectAction(props.id, values);
      } else {
        result = await createProjectAction(values);
      }
      // `redirect()` throws an internal control flow signal; success path
      // unmounts before reaching here. Anything we observe is a real error.
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
            placeholder="legtek-naija"
            aria-invalid={Boolean(errors.slug)}
            {...register("slug")}
          />
          <FieldError>{errors.slug?.message}</FieldError>
        </div>

        <div>
          <FieldLabel htmlFor="sector" required>
            Sector
          </FieldLabel>
          <input
            id="sector"
            className={inputClass}
            placeholder="Justice & Regulatory Technology"
            aria-invalid={Boolean(errors.sector)}
            {...register("sector")}
          />
          <FieldError>{errors.sector?.message}</FieldError>
        </div>

        <div>
          <FieldLabel htmlFor="status" required>
            Status
          </FieldLabel>
          <select
            id="status"
            className={inputClass}
            aria-invalid={Boolean(errors.status)}
            {...register("status")}
          >
            {ProjectStatuses.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <FieldError>{errors.status?.message}</FieldError>
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
            id="featured"
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            {...register("featured")}
          />
          <FieldLabel htmlFor="featured">Featured on homepage</FieldLabel>
        </div>
      </div>

      <Controller
        control={control}
        name="cover_image"
        render={({ field, fieldState }) => (
          <CoverImageField
            bucket="project-images"
            label="Cover image"
            value={field.value ?? ""}
            onChange={field.onChange}
            errorMessage={fieldState.error?.message}
            alsoReferencedIn={[
              watch("body") ?? "",
              ...(watch("gallery_images") ?? []),
            ]}
          />
        )}
      />

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
              placeholder="The brief, what we built, outcomes…"
              ariaInvalid={Boolean(errors.body)}
            />
          )}
        />
        <FieldError>{errors.body?.message}</FieldError>
      </div>

      <Controller
        control={control}
        name="stack"
        render={({ field }) => (
          <TagInputField
            label="Stack"
            value={field.value ?? []}
            onChange={field.onChange}
            placeholder="Next.js 15, Supabase, TypeScript…"
            help="Press Enter or comma to add. Backspace to remove last."
          />
        )}
      />

      <Controller
        control={control}
        name="gallery_images"
        render={({ field }) => (
          <GalleryField
            label="Gallery"
            bucket="project-images"
            value={field.value ?? []}
            onChange={field.onChange}
            help="Up to ~5 images for the case study page."
          />
        )}
      />

      <Controller
        control={control}
        name="outcomes"
        render={({ field }) => (
          <OutcomesField
            label="Outcomes"
            value={field.value ?? []}
            onChange={field.onChange}
            help="Label + value pairs rendered as small stat blocks on the case page."
          />
        )}
      />

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
        <Link href="/admin/projects">
          <SecondaryButton type="button">Cancel</SecondaryButton>
        </Link>
        <PrimaryButton type="submit" disabled={pending}>
          {pending
            ? "Saving…"
            : props.mode === "edit"
              ? "Save changes"
              : "Create project"}
        </PrimaryButton>
      </div>
    </form>
  );
}

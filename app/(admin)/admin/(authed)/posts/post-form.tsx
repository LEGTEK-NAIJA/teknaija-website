"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AutosaveDot } from "@/components/admin/AutosaveDot";
import { ImageUploadButton } from "@/components/admin/ImageUploadButton";
import { MarkdownToolbar } from "@/components/admin/MarkdownToolbar";
import { MarkdownField } from "@/lib/admin/MarkdownField";
import {
  deletePostImage,
  extractPostImagePath,
} from "@/lib/storage/delete-post-image";
import { extractPostImagePaths } from "@/lib/storage/extract-post-image-urls";
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
import { useAutosave } from "./use-autosave";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^a-z0-9\s-]/g, "") // strip punctuation
    .trim()
    .replace(/\s+/g, "-") // spaces -> hyphens
    .replace(/-+/g, "-") // collapse runs of hyphens
    .slice(0, 80); // cap length
}

type Props =
  | { mode: "create"; defaultValues?: Partial<PostFormValues>; id?: undefined }
  | { mode: "edit"; defaultValues: PostFormValues; id: string };

export function PostForm(props: Props) {
  const [pending, startTransition] = useTransition();
  const [slugDirty, setSlugDirty] = useState(props.mode === "edit");
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    register,
    handleSubmit,
    control,
    setError,
    setValue,
    getValues,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: { ...POST_DEFAULTS, ...props.defaultValues },
  });

  const watchedValues = watch();

  const { state: autosaveState, currentId } = useAutosave({
    values: watchedValues,
    isDirty,
    id: props.mode === "edit" ? props.id : null,
    isSubmitting: isSubmitting || pending,
  });

  const savePostId = props.mode === "edit" ? props.id : currentId;

  const status = watch("status");
  const titleValue = watch("title");
  const coverImage = watch("cover_image");
  const bodyValue = watch("body");

  async function handleRemoveCover() {
    const current = getValues("cover_image");
    if (!current) return;

    setRemoveError(null);

    const body = getValues("body") ?? "";
    const coverPath = extractPostImagePath(current);
    const bodyPaths = extractPostImagePaths(body);
    const stillReferenced = coverPath && bodyPaths.has(coverPath);

    if (stillReferenced) {
      setValue("cover_image", "", { shouldDirty: true, shouldValidate: true });
      return;
    }

    setRemoving(true);
    const result = await deletePostImage(current);
    setRemoving(false);
    if (!result.ok) {
      setRemoveError(result.error);
      return;
    }
    setValue("cover_image", "", { shouldDirty: true, shouldValidate: true });
  }

  async function handleCoverUploaded(newUrl: string) {
    const previous = getValues("cover_image");

    if (previous && previous !== newUrl) {
      const body = getValues("body") ?? "";
      const previousPath = extractPostImagePath(previous);
      const bodyPaths = extractPostImagePaths(body);
      const stillReferenced = previousPath && bodyPaths.has(previousPath);

      if (!stillReferenced) {
        const result = await deletePostImage(previous);
        if (!result.ok) {
          console.warn("[cover] failed to delete previous file:", result.error);
        }
      }
    }

    setValue("cover_image", newUrl, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function insertImageAtCursor(url: string) {
    const ta = bodyTextareaRef.current;
    const insertion = `![](${url})`;
    if (!ta) {
      setValue(
        "body",
        `${bodyValue ?? ""}\n\n${insertion}\n`,
        { shouldDirty: true, shouldValidate: true }
      );
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const current = bodyValue ?? "";
    const next = current.slice(0, start) + insertion + current.slice(end);
    setValue("body", next, { shouldDirty: true, shouldValidate: true });
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + insertion.length;
      ta.setSelectionRange(pos, pos);
    });
  }

  useEffect(() => {
    if (slugDirty) return;
    if (props.mode === "edit") return;
    if (!titleValue) return;
    setValue("slug", slugify(titleValue), { shouldValidate: false });
  }, [titleValue, slugDirty, setValue, props.mode]);

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      let result: ActionResult;
      if (savePostId) {
        result = await updatePostAction(savePostId, values);
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
      <div className="flex items-center justify-end gap-2 text-xs text-slate-500">
        <AutosaveDot state={autosaveState} />
      </div>
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
            {...register("slug", {
              onChange: () => setSlugDirty(true),
            })}
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

        <div className="md:col-span-2">
          <FieldLabel htmlFor="cover_image">Cover image URL</FieldLabel>
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <input
                id="cover_image"
                type="url"
                className={`${inputClass} font-mono`}
                placeholder="https://teknaija.legtek.ng/insights/cover-image.jpg"
                aria-invalid={Boolean(errors.cover_image)}
                {...register("cover_image")}
              />
            </div>
            <ImageUploadButton
              bucket="post-images"
              label="Upload"
              onUploaded={handleCoverUploaded}
            />
          </div>
          {coverImage ? (
            <div className="relative mt-2 inline-block">
              <img
                src={coverImage}
                alt=""
                className="h-32 w-auto rounded-md border border-slate-200 object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void handleRemoveCover();
                }}
                disabled={removing}
                aria-label="Remove cover image"
                className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white text-sm text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
              >
                {removing ? "…" : "×"}
              </button>
              {removeError ? (
                <p className="mt-1 text-xs text-red-600">{removeError}</p>
              ) : null}
            </div>
          ) : null}
          <FieldHelp>
            Optional. URL of the image shown on the post card and at the top of
            the article.
          </FieldHelp>
          <FieldError>{errors.cover_image?.message}</FieldError>
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
              textareaRef={bodyTextareaRef}
              toolbar={
                <MarkdownToolbar
                  textareaRef={bodyTextareaRef}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onImageUploaded={insertImageAtCursor}
                />
              }
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
            : savePostId
              ? "Save changes"
              : "Create post"}
        </PrimaryButton>
      </div>
    </form>
  );
}

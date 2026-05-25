import { z } from "zod";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const PostStatuses = ["draft", "published"] as const;
export type PostStatus = (typeof PostStatuses)[number];

const PostBaseSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters.")
    .max(120, "Slug must be 120 characters or fewer.")
    .regex(SLUG_RE, "Use lowercase letters, numbers and hyphens only."),
  title: z.string().trim().min(2, "Title is required."),
  dek: z.string().trim().max(280, "Dek should stay under 280 characters."),
  body: z.string().trim().min(1, "Body is required."),
  author_name: z.string().trim().max(120, "Author name is too long."),
  status: z.enum(PostStatuses),
  /** ISO date string (YYYY-MM-DD) or "" while in draft. */
  published_at: z.string().trim(),
  cover_image: z
    .string()
    .url({ message: "Cover image must be a valid URL." })
    .or(z.literal(""))
    .optional()
    .nullable(),
});

export const PostFormSchema = PostBaseSchema.refine(
  (data) =>
    data.status !== "published" ||
    (data.published_at && data.published_at.length > 0),
  {
    message: "Published posts need a publish date.",
    path: ["published_at"],
  }
);

export type PostFormValues = z.infer<typeof PostFormSchema>;

/**
 * Relaxed schema used only for autosave. Drafts are legitimately partial;
 * explicit Save still uses PostFormSchema.
 */
export const PostAutosaveSchema = z.object({
  slug: z
    .string()
    .trim()
    .max(120, "Slug must be 120 characters or fewer.")
    .refine(
      (s) => s === "" || SLUG_RE.test(s),
      "Use lowercase letters, numbers and hyphens only."
    ),
  title: z.string().trim().min(2, "Title is required."),
  dek: z.string().trim().max(280, "Dek should stay under 280 characters."),
  body: z.string(),
  author_name: z.string().trim().max(120, "Author name is too long."),
  status: z.enum(PostStatuses),
  published_at: z.string().trim(),
  cover_image: z
    .string()
    .url({ message: "Cover image must be a valid URL." })
    .or(z.literal(""))
    .optional()
    .nullable(),
});

export type PostAutosaveValues = z.infer<typeof PostAutosaveSchema>;

export const POST_DEFAULTS: PostFormValues = {
  slug: "",
  title: "",
  dek: "",
  body: "",
  author_name: "",
  status: "draft",
  published_at: "",
  cover_image: "",
};

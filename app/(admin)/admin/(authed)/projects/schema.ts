import { z } from "zod";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const ProjectStatuses = [
  "live",
  "active",
  "forthcoming",
  "archived",
  "draft",
] as const;

export type ProjectStatus = (typeof ProjectStatuses)[number];

/**
 * The schema is shaped so the form's input and output types coincide — every
 * field is always present once the form has rendered. Empty strings stand in
 * for "no value" and are normalised to NULL inside the server action.
 */
export const ProjectFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters.")
    .max(80, "Slug must be 80 characters or fewer.")
    .regex(SLUG_RE, "Use lowercase letters, numbers and hyphens only."),
  title: z.string().trim().min(2, "Title is required."),
  sector: z.string().trim().min(2, "Sector is required."),
  status: z.enum(ProjectStatuses),
  body: z.string().trim().min(1, "Body is required."),
  featured: z.boolean(),
  display_order: z
    .number({ error: "Display order must be a non-negative integer." })
    .int()
    .min(0),
});

export type ProjectFormValues = z.infer<typeof ProjectFormSchema>;

export const PROJECT_DEFAULTS: ProjectFormValues = {
  slug: "",
  title: "",
  sector: "",
  status: "draft",
  body: "",
  featured: false,
  display_order: 0,
};

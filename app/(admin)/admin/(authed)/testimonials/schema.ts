import { z } from "zod";

export const TestimonialFormSchema = z.object({
  quote: z.string().trim().min(2, "Quote is required."),
  author_name: z.string().trim().max(120, "Author name is too long."),
  author_role: z.string().trim().max(120, "Role is too long."),
  author_org: z.string().trim().max(160, "Organisation is too long."),
  active: z.boolean(),
});

export type TestimonialFormValues = z.infer<typeof TestimonialFormSchema>;

export const TESTIMONIAL_DEFAULTS: TestimonialFormValues = {
  quote: "",
  author_name: "",
  author_role: "",
  author_org: "",
  active: true,
};

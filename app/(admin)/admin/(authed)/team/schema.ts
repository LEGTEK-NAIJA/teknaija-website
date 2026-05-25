import { z } from "zod";

export const TeamFormSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  role: z.string().trim().min(1, "Role is required."),
  bio: z.string().trim().max(1200, "Bio is too long."),
  display_order: z
    .number({ error: "Display order must be a non-negative integer." })
    .int()
    .min(0),
  active: z.boolean(),
  headshot: z
    .string()
    .url({ message: "Headshot must be a valid URL." })
    .or(z.literal(""))
    .optional()
    .nullable(),
});

export type TeamFormValues = z.infer<typeof TeamFormSchema>;

export const TEAM_DEFAULTS: TeamFormValues = {
  name: "",
  role: "",
  bio: "",
  display_order: 0,
  active: true,
  headshot: "",
};

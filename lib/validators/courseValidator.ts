import { z } from "zod";

export const courseValidator = z.object({
  title: z.string().trim().min(1, "Course title is required"),
  semester: z.string().trim().optional(),
});
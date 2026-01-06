import { z } from "zod";

export const assignmentValidator = z.object({
  title: z.string().trim().min(1, "Assignment title is required"),
  description: z.string().trim().optional(),
  dueDate: z.preprocess(
    (value) => {
      if (value === "" || value === null) return undefined;
      return value;
    },
    z.coerce.date().optional()
  ),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  courseId: z.string().trim().min(1, "Course ID is required"),
});

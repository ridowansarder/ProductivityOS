import {z} from "zod";

export const noteValidator = z.object({
    title: z.string().trim().min(1, "Note title is required"),
    content: z.string().trim().min(1, "Note content is required"),
    courseId: z.string().trim().min(1, "Course ID is required"),
});
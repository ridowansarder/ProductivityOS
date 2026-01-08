"use server";

import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { noteValidator } from "@/lib/validators/noteValidator";

export async function createNote(formData: FormData) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const data = noteValidator.parse({
    title: formData.get("title"),
    content: formData.get("content"),
    courseId: formData.get("courseId"),
  });

  try {
    await prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
        courseId: data.courseId,
        userId: user.clerkUserId,
      },
    });
    revalidatePath("/notes");
    return { success: true };
  } catch (error) {
    console.error("Error creating note:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function updateNote(formData: FormData, noteId: string) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const data = noteValidator.parse({
    title: formData.get("title"),
    content: formData.get("content"),
    courseId: formData.get("courseId"),
  });

  try {
    await prisma.note.update({
      where: {
        id: noteId,
        userId: user.clerkUserId,
      },
      data: {
        title: data.title,
        content: data.content,
        courseId: data.courseId,
        userId: user.clerkUserId,
      },
    });
    revalidatePath("/notes");
    return { success: true };
  } catch (error) {
    console.error("Error updating assignment:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function archiveNote(noteId: string) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  try {
    await prisma.note.updateMany({
      where: {
        id: noteId,
        userId: user.clerkUserId,
      },
      data: {
        isActive: false,
      },
    });
    revalidatePath("/notes");
    return { success: true };
  } catch (error) {
    console.error("Error archiving course:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

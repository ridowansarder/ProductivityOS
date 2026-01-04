"use server";

import prisma from "@/lib/prisma";
import { courseValidator } from "@/lib/validators/courseValidator";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/app/generated/prisma/client";

export async function createCourse(formData: FormData) {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");

  const data = courseValidator.parse({
    title: formData.get("title"),
    semester: formData.get("semester"),
  });

  try {
    await prisma.course.create({
      data: {
        title: data.title,
        semester: data.semester || null,
        userId: user.clerkUserId,
      },
    });
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("Error creating course:", error);

    // handle prisma duplication error
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "A course with this title and semester already exists",
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function updateCourse(formData: FormData, courseId: string) {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");

  const data = courseValidator.parse({
    title: formData.get("title"),
    semester: formData.get("semester"),
  });

  try {
    await prisma.course.update({
      where: {
        id: courseId,
        userId: user.clerkUserId,
      },
      data: {
        title: data.title,
        semester: data.semester || null,
      },
    });
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("Error updating course:", error);

    // handle prisma duplication error
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "A course with this title already exists",
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function archiveCourse(courseId: string) {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");

  try {
    await prisma.course.updateMany({
      where: {
        id: courseId,
        userId: user.clerkUserId,
      },
      data: {
        isActive: false,
      },
    });
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("Error archiving course:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
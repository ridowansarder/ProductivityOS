"use server";

import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/app/generated/prisma/client";
import { assignmentValidator } from "@/lib/validators/assignmentValidator";
import { redirect } from "next/navigation";

export async function createAssignment(formData: FormData) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const data = assignmentValidator.parse({
    title: formData.get("title"),
    description: formData.get("description"),
    dueDate: formData.get("dueDate"),
    priority: formData.get("priority"),
    status: formData.get("status"),
    courseId: formData.get("courseId"),
  });

  try {
    await prisma.assignment.create({
      data: {
        title: data.title,
        description: data.description || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        priority: data.priority,
        status: data.status,
        courseId: data.courseId,
        userId: user.clerkUserId,
      },
    });
    revalidatePath("/assignments");
    return { success: true };
  } catch (error) {
    console.error("Error creating assignment:", error);

    // handle prisma duplication error
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "An assignment with this title already exists",
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function updateAssignment(
  formData: FormData,
  assignmentId: string
) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const data = assignmentValidator.parse({
    title: formData.get("title"),
    description: formData.get("description"),
    dueDate: formData.get("dueDate"),
    priority: formData.get("priority"),
    status: formData.get("status"),
    courseId: formData.get("courseId"),
  });

  try {
    await prisma.assignment.update({
      where: {
        id: assignmentId,
        userId: user.clerkUserId,
      },
      data: {
        title: data.title,
        description: data.description || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        priority: data.priority,
        status: data.status,
        courseId: data.courseId,
        userId: user.clerkUserId,
      },
    });
    revalidatePath("/assignments");
    return { success: true };
  } catch (error) {
    console.error("Error updating assignment:", error);

    // handle prisma duplication error
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "An assignment with this title already exists",
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function archiveAssignment(assignmentId: string) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  try {
    await prisma.assignment.update({
      where: {
        id: assignmentId,
        userId: user.clerkUserId,
      },
      data: {
        isActive: false,
      },
    });
    revalidatePath("/assignments");
    return { success: true };
  } catch (error) {
    console.error("Error archiving course:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function deleteAssignment(assignmentId: string) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  try {
    await prisma.assignment.delete({
      where: {
        id: assignmentId,
        userId: user.clerkUserId,
      },
    });
    revalidatePath("/assignments");
    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function restoreAssignment(assignmentId: string) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  try {
    await prisma.assignment.update({
      where: {
        id: assignmentId,
        userId: user.clerkUserId,
      },
      data: {
        isActive: true,
      },
    });
    revalidatePath("/assignments");
    return { success: true };
  } catch (error) {
    console.error("Error restoring course:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function toggleAssignmentStatus(assignmentId: string) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  try {
    const assignment = await prisma.assignment.findUnique({
      where: {
        id: assignmentId,
        userId: user.clerkUserId,
      },
    });

    if (!assignment) {
      return {
        success: false,
        error: "Assignment not found",
      };
    }

    await prisma.assignment.update({
      where: {
        id: assignmentId,
        userId: user.clerkUserId,
      },
      data: {
        status:
          assignment.status === "TODO"
            ? "IN_PROGRESS"
            : assignment.status === "IN_PROGRESS"
            ? "DONE"
            : "TODO",
      },
    });
    revalidatePath("/assignments");
    return { success: true };
  } catch (error) {
    console.error("Error toggling assignment status:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

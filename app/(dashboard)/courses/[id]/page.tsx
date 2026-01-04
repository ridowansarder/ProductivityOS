import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { notFound } from "next/navigation";
import { UpdateCourseModal } from "./UpdateCourseModal";
import ArchiveButton from "@/components/ArchiveButton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CourseDetailsPageProps {
  params: Promise<{ id: string }>;
}

const CourseDetailsPage = async ({ params }: CourseDetailsPageProps) => {
  const { id } = await params;
  const user = await getOrCreateUser();
  if (!user) return null;

  const course = await prisma.course.findFirst({
    where: {
      id,
      userId: user.clerkUserId,
      isActive: true,
    },
    include: {
      assignments: {
        where: { isActive: true },
        orderBy: { dueDate: "asc" },
      },
      notes: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!course) notFound();

  return (
    <div className="py-6 px-6 md:px-12 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{course.title}</h1>
          {course.semester && (
            <p className="text-sm text-muted-foreground">{course.semester}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ArchiveButton courseId={course.id} />
          <UpdateCourseModal
            courseId={course.id}
            courseTitle={course.title}
            courseSemester={course.semester}
          />
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Assignments */}
        <div className="rounded-lg border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Assignments</h2>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>

          {course.assignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No assignments yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {course.assignments.map((assignment) => (
                <li
                  key={assignment.id}
                  className="rounded-md border p-3 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{assignment.title}</p>
                    <Badge variant="outline">{assignment.status}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>Priority: {assignment.priority}</span>
                    {assignment.dueDate && (
                      <span>
                        Due:{" "}
                        {assignment.dueDate.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Notes */}
        <div className="rounded-lg border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Notes</h2>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>

          {course.notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No notes yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {course.notes.map((note) => (
                <li
                  key={note.id}
                  className="rounded-md border p-3"
                >
                  <p className="font-medium">{note.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {note.content}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;

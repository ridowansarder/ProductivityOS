import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { notFound } from "next/navigation";
import { UpdateCourseModal } from "@/components/modals/UpdateCourseModal";
import { Badge } from "@/components/ui/badge";
import { AddAssignmentModal } from "@/components/modals/AddAssignmentModal";
import Link from "next/link";
import { ConfirmCourseArchiveButton } from "@/components/confirmButtons/CourseButtons";
import { AddNoteModal } from "@/components/modals/AddNoteModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CourseDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");

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
          <ConfirmCourseArchiveButton courseId={course.id} />
          <UpdateCourseModal
            courseId={course.id}
            courseTitle={course.title}
            courseSemester={course.semester}
          />
        </div>
      </div>

      <div className="h-px bg-border" />

      <Tabs defaultValue="notes" className="max-w-xl space-y-2">
        <TabsList>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          <div className="rounded-lg border p-4 space-y-4">
            <AddNoteModal courseId={course.id} />

            {course.notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notes yet.</p>
            ) : (
              <ul className="space-y-3">
                {course.notes.map((note) => (
                  <li key={note.id} className="rounded-md border p-3">
                    <Link href={`/notes/${note.id}`}>
                      <p className="font-medium">{note.title}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>
        <TabsContent value="assignments">
          <div className="rounded-lg border p-4 space-y-4">
            <AddAssignmentModal courseId={course.id} />

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
                    <Link href={`/assignments/${assignment.id}`}>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{assignment.title}</p>
                        <Badge variant="outline">{assignment.status}</Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>Priority: {assignment.priority}</span>
                        {assignment.dueDate && (
                          <span>
                            Due: {assignment.dueDate.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseDetailsPage;

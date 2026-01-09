import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import {
  ConfirmAssignmentDeleteButton,
  ConfirmAssignmentRestoreButton,
} from "@/components/confirmButtons/AssignmentButtons";
import {
  ConfirmNoteDeleteButton,
  ConfirmNoteRestoreButton,
} from "@/components/confirmButtons/NoteButtons";
import {
  ConfirmCourseDeleteButton,
  ConfirmCourseRestoreButton,
} from "@/components/confirmButtons/CourseButtons";

const ArchivesPage = async () => {
  const user = await getOrCreateUser();
  if (!user) return redirect("/sign-in");

  const archivedCourses = await prisma.course.findMany({
    where: {
      userId: user.clerkUserId,
      isActive: false,
    },
  });

  const archivedAssignments = await prisma.assignment.findMany({
    where: {
      userId: user.clerkUserId,
      isActive: false,
    },
  });

  const archivedNotes = await prisma.note.findMany({
    where: {
      userId: user.clerkUserId,
      isActive: false,
    },
  });

  return (
    <div className="py-6 px-6 md:px-12 space-y-6 w-full">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Archives</h1>

          <p className="text-sm text-muted-foreground">
            Here are your archives. You can restore or delete them here.
          </p>
        </div>
      </div>

      <div className="h-px bg-border" />

      <Tabs defaultValue="courses" className="max-w-xl space-y-2">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="rounded-lg border p-4 space-y-4">
            {archivedCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No courses archived.
              </p>
            ) : (
              <ul className="space-y-3">
                {archivedCourses.map((course) => (
                  <li
                    key={course.id}
                    className="rounded-md border p-3 flex flex-col md:flex-row justify-between items-center"
                  >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <p className="font-medium">{course.title}</p>
                      <div className="flex items-center space-x-2">
                        <ConfirmCourseRestoreButton courseId={course.id} />
                        <ConfirmCourseDeleteButton courseId={course.id} />
                      </div>
                    </div>{" "}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>
        <TabsContent value="assignments">
          <div className="rounded-lg border p-4 space-y-4">
            {archivedAssignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No assignments archived.
              </p>
            ) : (
              <ul className="space-y-3">
                {archivedAssignments.map((assignment) => (
                  <li
                    key={assignment.id}
                    className="rounded-md border p-3 space-y-1"
                  >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <p className="font-medium">{assignment.title}</p>
                      <div className="flex items-center space-x-2">
                        <ConfirmAssignmentRestoreButton
                          assignmentId={assignment.id}
                        />
                        <ConfirmAssignmentDeleteButton
                          assignmentId={assignment.id}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>
        <TabsContent value="notes">
          <div className="rounded-lg border p-4 space-y-4">
            {archivedNotes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No notes archived.
              </p>
            ) : (
              <ul className="space-y-3">
                {archivedNotes.map((note) => (
                  <li key={note.id} className="rounded-md border p-3 space-y-1">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <p className="font-medium">{note.title}</p>
                      <div className="flex items-center space-x-2">
                        <ConfirmNoteRestoreButton noteId={note.id} />
                        <ConfirmNoteDeleteButton noteId={note.id} />
                      </div>
                    </div>
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

export default ArchivesPage;

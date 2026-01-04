import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { AddCourseModal } from "./AddCourseModal";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function CoursesPage() {
  const user = await getOrCreateUser();
  if (!user) {
    redirect("/sign-in");
  }

  const courses = await prisma.course.findMany({
    where: {
      userId: user.clerkUserId,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const assignments = await prisma.assignment.findMany({
    where: {
      courseId: {
        in: courses.map((course) => course.id),
      },
      userId: user.clerkUserId,
      isActive: true,
    },
  });

  const notes = await prisma.note.findMany({
    where: {
      courseId: {
        in: courses.map((course) => course.id),
      },
      userId: user.clerkUserId,
      isActive: true,
    },
  });

  return (
    <div className="py-6 px-12 space-y-5 w-full">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center sm:justify-between ">
        <div>
          <h1 className="text-2xl font-semibold">Courses</h1>
          <p className="text-muted-foreground mt-1">
            {courses.length} {courses.length === 1 ? "course" : "courses"}{" "}
            available
          </p>
        </div>
        <AddCourseModal />
      </div>

      {courses.length === 0 ? (
        <div className="text-center border-2 border-dashed px-4 py-12 mt-4 sm:mt-8 md:mt-12 lg:mt-16">
          <p className="text-muted-foreground">
            No courses yet. Add your first course.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <Card>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  {course.semester && (
                    <CardDescription>{course.semester}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <p className="text-muted-foreground">
                    {
                      assignments.filter(
                        (assignment) => assignment.courseId === course.id
                      ).length
                    }{" "}
                    {assignments.filter(
                      (assignment) => assignment.courseId === course.id
                    ).length === 1
                      ? "assignment"
                      : "assignments"}
                  </p>
                  <p className="text-muted-foreground">
                    {notes.filter((note) => note.courseId === course.id).length}{" "}
                    {notes.filter((note) => note.courseId === course.id)
                      .length === 1
                      ? "assignment"
                      : "notes"}
                  </p>

                  <p>Click to view details</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

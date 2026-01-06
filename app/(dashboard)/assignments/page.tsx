import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function AssignmentsPage() {
  const user = await getOrCreateUser();
  if (!user) {
    redirect("/sign-in");
  }

  const assignments = await prisma.assignment.findMany({
    where: {
      userId: user.clerkUserId,
      isActive: true,
      course: {
        isActive: true,
      }
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      course: true,
    },
  });

  return (
    <div className="py-6 px-12 space-y-5 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Assignments</h1>
          <p className="text-muted-foreground mt-1">
            {assignments.length}{" "}
            {assignments.length === 1 ? "assignment" : "assignments"} in total
          </p>
        </div>
        <p>
          Go to{" "}
          <Link href="/courses" className="font-bold">
            Courses
          </Link>{" "}
          and click on a course to create a new assignment
        </p>
      </div>

      {/* Empty State */}
      {assignments.length === 0 ? (
        <div className="text-center border-2 border-dashed px-4 py-12 mt-4 sm:mt-8 md:mt-12 lg:mt-16">
          <p className="text-muted-foreground">
            No assignments yet. Create one inside a course.
          </p>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assignments.map((assignment) => (
            <Link key={assignment.id} href={`/assignments/${assignment.id}`}>
              <Card>
                <CardHeader>
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription>{assignment.course.title}</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-2">
                  <p className="text-muted-foreground">
                    Status: {assignment.status}
                  </p>

                  <p className="text-muted-foreground">
                    Priority: {assignment.priority}
                  </p>

                  {assignment.dueDate && (
                    <p className="text-muted-foreground">
                      Due: {assignment.dueDate.toLocaleDateString()}
                    </p>
                  )}

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

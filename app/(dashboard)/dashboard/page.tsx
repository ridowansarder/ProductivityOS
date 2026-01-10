import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { startOfToday, endOfToday, endOfWeek } from "date-fns";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const DashboardPage = async () => {
  const user = await getOrCreateUser();
  if (!user) return redirect("/sign-in");

  const overdueAssignments = await prisma.assignment.count({
    where: {
      userId: user.clerkUserId,
      status: { in: ["TODO", "IN_PROGRESS"] },
      isActive: true,
      dueDate: { lt: startOfToday() },
    },
    orderBy: { dueDate: "asc" },
  });

  const todayAssignments = await prisma.assignment.findMany({
    where: {
      userId: user.clerkUserId,
      status: { in: ["TODO", "IN_PROGRESS"] },
      isActive: true,
      dueDate: {
        gte: startOfToday(),
        lte: endOfToday(),
      },
    },
    include: {
      course: true,
    },
  });

  const weekAssignments = await prisma.assignment.count({
    where: {
      userId: user.clerkUserId,
      status: { in: ["TODO", "IN_PROGRESS"] },
      isActive: true,
      dueDate: {
        gt: endOfToday(),
        lte: endOfWeek(startOfToday()),
      },
    },
  });

  const assignmentsDoneThisWeek = await prisma.assignment.count({
    where: {
      userId: user.clerkUserId,
      status: "DONE",
      dueDate: {
        gte: startOfToday(),
        lte: endOfWeek(startOfToday()),
      },
    },
  });

  const activeCourses = await prisma.course.count({
    where: {
      userId: user.clerkUserId,
      isActive: true,
    },
  });

  const hour = new Date().getHours();

  const greeting = () => {
    if (hour < 5) return "Good night";
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-semibold">
        {greeting()}, {user.name?.split(" ")[0]}!
      </h1>

      <div className="h-px bg-border my-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Overdue Assignments</CardTitle>
            <h1 className="text-2xl font-semibold">{overdueAssignments}</h1>
            <CardDescription>
              The number of assignments that are not completed on time
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Today&apos;s Assignments</CardTitle>
            <h1 className="text-2xl font-semibold">
              {todayAssignments.length}
            </h1>
            <CardDescription>
              The number of assignments to be completed today
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>This Week&apos;s Assignments</CardTitle>
            <h1 className="text-2xl font-semibold">{weekAssignments}</h1>
            <CardDescription>
              The number of assignments to be completed this week
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Assignments Done This Week</CardTitle>
            <h1 className="text-2xl font-semibold">
              {assignmentsDoneThisWeek}
            </h1>
            <CardDescription>
              The number of completed assignments this week
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Active Courses</CardTitle>
            <h1 className="text-2xl font-semibold">{activeCourses}</h1>
            <CardDescription>The number of active courses</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="h-px bg-border my-4" />
      <div className="space-y-6 max-w-2xl">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Today&apos;s Assignments</h1>
          <p className="text-muted-foreground">
            You must complete these assignments today
          </p>
        </div>

        <div className="rounded-lg border p-4 space-y-4">
          {todayAssignments.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-muted-foreground">
                No assignments for today. Have a nice day!
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {todayAssignments.map((assignment) => (
                <li key={assignment.id} className="rounded-md border p-3">
                  <Link
                    href={`/assignments/${assignment.id}`}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{assignment.title}</p>
                      <Badge>{assignment.status}</Badge>
                    </div>

                    <div className="flex justify-between gap-2 text-xs text-muted-foreground">
                      <span>Course: {assignment.course.title}</span>
                      {assignment.dueDate && (
                        <span>Priority: {assignment.priority}</span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

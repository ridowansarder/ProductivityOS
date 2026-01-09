import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { startOfToday, endOfToday, endOfWeek } from "date-fns";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DashboardPage = async () => {
  const user = await getOrCreateUser();
  if (!user) return null;

  const overdueAssignments = await prisma.assignment.count({
    where: {
      userId: user.clerkUserId,
      status: "TODO",
      isActive: true,
      dueDate: { lt: startOfToday() },
    },
    orderBy: { dueDate: "asc" },
  });

  const todayAssignments = await prisma.assignment.count({
    where: {
      userId: user.clerkUserId,
      status: "TODO",
      isActive: true,
      dueDate: {
        gte: startOfToday(),
        lte: endOfToday(),
      },
    },
  });

  const weekAssignments = await prisma.assignment.count({
    where: {
      userId: user.clerkUserId,
      status: "TODO",
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
            <h1 className="text-2xl font-semibold">{todayAssignments}</h1>
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
    </div>
  );
};

export default DashboardPage;

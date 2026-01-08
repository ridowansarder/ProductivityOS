import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { startOfToday, endOfToday, endOfWeek } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const TasksPage = async () => {
  const user = await getOrCreateUser();
  if (!user) return null;
  const today = startOfToday();

  const overdue = await prisma.assignment.findMany({
    where: {
      userId: user.clerkUserId,
      status: "TODO",
      dueDate: { lt: today },
    },
    include: { course: true },
    orderBy: { dueDate: "asc" },
  });

  const todayTasks = await prisma.assignment.findMany({
    where: {
      userId: user.clerkUserId,
      status: "TODO",
      dueDate: {
        gte: today,
        lte: endOfToday(),
      },
    },
    include: { course: true },
  });

  const weekTasks = await prisma.assignment.findMany({
    where: {
      userId: user.clerkUserId,
      status: "TODO",
      dueDate: {
        gt: endOfToday(),
        lte: endOfWeek(today),
      },
    },
    include: { course: true },
  });

  const laterTasks = await prisma.assignment.findMany({
    where: {
      userId: user.clerkUserId,
      status: "TODO",
      OR: [{ dueDate: null }, { dueDate: { gt: endOfWeek(today) } }],
    },
    include: { course: true },
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
      <h1 className="text-2xl font-semibold">Tasks</h1>

      <Tabs defaultValue="overdue" className="space-y-2">
        <TabsList>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="later">Later</TabsTrigger>
        </TabsList>

        <TabsContent value="overdue">
          <TaskSection tasks={overdue} />
        </TabsContent>
        <TabsContent value="today">
          <TaskSection tasks={todayTasks} />
        </TabsContent>
        <TabsContent value="week">
          <TaskSection tasks={weekTasks} />
        </TabsContent>
        <TabsContent value="later">
          <TaskSection tasks={laterTasks} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TasksPage;

interface Task {
  id: string;
  title: string;
  course: {
    title: string;
  };
}

function TaskSection({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <section className="space-y-3">
        <div className="rounded-md border divide-y">
          <div className="px-4 py-3">
            <p className="font-medium">No tasks</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div className="rounded-md border divide-y">
        {tasks.map((task) => (
          <div key={task.id} className="px-4 py-3">
            <Link href={`/assignments/${task.id}`}>
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-muted-foreground">
                {task.course.title}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

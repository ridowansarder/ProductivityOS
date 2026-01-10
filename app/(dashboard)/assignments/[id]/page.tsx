import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { UpdateAssignmentModal } from "@/components/modals/UpdateAssignmentModal";
import { ConfirmAssignmentArchiveButton } from "@/components/confirmButtons/AssignmentButtons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssignmentStatusToggle } from "@/components/toggle/AssignmentToggleStatus";

const AssignmentDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const user = await getOrCreateUser();
  if (!user) return null;

  const assignment = await prisma.assignment.findFirst({
    where: {
      id,
      userId: user.clerkUserId,
      isActive: true,
    },
    include: {
      course: true,
    },
  });

  if (!assignment) notFound();

  return (
    <div className="py-6 px-6 md:px-12 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">{assignment.title}</h1>

          <p className="text-sm text-muted-foreground">
            Course: {assignment.course.title}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <ConfirmAssignmentArchiveButton assignmentId={assignment.id} />
          <UpdateAssignmentModal assignment={assignment} />
        </div>
      </div>

      <div className="h-px bg-border" />

      <Tabs defaultValue="details" className="max-w-sm space-y-2">
        <TabsList>
          <TabsTrigger value="details">Assignment Details</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="rounded-lg border p-4 space-y-4">
            <h2 className="text-lg font-semibold">Assignment Details</h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <AssignmentStatusToggle assignmentId={assignment.id} status={assignment.status} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Priority</span>
                <Badge variant="secondary">{assignment.priority}</Badge>
              </div>

              {assignment.dueDate && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Due date</span>
                  <span>{assignment.dueDate.toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="description">
          <div className="rounded-lg border p-4 space-y-4">
            <h2 className="text-lg font-semibold">Description</h2>

            {assignment.description ? (
              <p className="text-sm whitespace-pre-line">
                {assignment.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No description provided.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Details */}

        {/* Description */}
      </div>
    </div>
  );
};

export default AssignmentDetailsPage;

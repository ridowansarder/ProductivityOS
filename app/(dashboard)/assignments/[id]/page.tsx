import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { UpdateAssignmentModal } from "./UpdateAssignmentModal";
import ConfirmAssignmentArchiveButton from "@/components/AssignmentArchiveButton";

interface AssignmentDetailsPageProps {
  params: Promise<{ id: string }>;
}

const AssignmentDetailsPage = async ({
  params,
}: AssignmentDetailsPageProps) => {
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

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Details */}
        <div className="rounded-lg border p-4 space-y-4">
          <h2 className="text-lg font-semibold">Assignment Details</h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="outline">{assignment.status}</Badge>
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

        {/* Description */}
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
      </div>
    </div>
  );
};

export default AssignmentDetailsPage;

"use client";

import { toggleAssignmentStatus } from "@/app/(dashboard)/assignments/actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export function AssignmentStatusToggle({
  assignmentId,
  status,
}: {
  assignmentId: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
        const result = await toggleAssignmentStatus(assignmentId);
        if (result.success) {
          toast.success("Assignment status toggled successfully!");
        } else {
          toast.error(result.error);
        }
        router.refresh();
    })
  }

  return (
    <Button
      disabled={isPending}
      onClick={handleToggle}
      className="disabled:opacity-50"
      variant="ghost"
    >
      <Badge
        className="cursor-pointer"
      >
        {status}
      </Badge>
    </Button>
  );
}

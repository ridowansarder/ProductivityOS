"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTransition, useState } from "react";
import { updateAssignment } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Assignment = {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  courseId: string;
};

export function UpdateAssignmentModal({
  assignment,
}: {
  assignment: Assignment;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleUpdate = (formData: FormData) =>
    startTransition(async () => {
      formData.append("courseId", assignment.courseId);

      const result = await updateAssignment(formData, assignment.id);

      if (result && result.success) {
        setOpen(false);
        toast.success("Assignment updated successfully!");
        router.refresh();
      } else if (result) {
        toast.error(result.error);
      }
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Update Assignment</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form action={handleUpdate} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Update Assignment</DialogTitle>
            <DialogDescription>
              Make changes to your assignment here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Title */}
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter assignment title"
                required
                disabled={isPending}
                autoFocus
                defaultValue={assignment.title}
              />
            </div>

            {/* Description */}
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Optional description"
                disabled={isPending}
                defaultValue={assignment.description || ""}
              />
            </div>

            {/* Due Date */}
            <div className="grid gap-3">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                disabled={isPending}
                defaultValue={
                  assignment.dueDate
                    ? assignment.dueDate.toISOString().split("T")[0]
                    : ""
                }
              />
            </div>

            {/* Priority */}
            <div className="grid gap-3">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                name="priority"
                required
                disabled={isPending}
                className="border rounded-md px-3 py-2"
                defaultValue={assignment.priority}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            {/* Status */}
            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                required
                disabled={isPending}
                className="border rounded-md px-3 py-2"
                defaultValue={assignment.status}
              >
                <option value="TODO">To do</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

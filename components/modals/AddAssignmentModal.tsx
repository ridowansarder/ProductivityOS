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
import { useState, useTransition } from "react";
import { createAssignment } from "@/app/(dashboard)/assignments/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AddAssignmentModal({ courseId }: { courseId: string }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleAddAssignment = (formData: FormData) => {
    formData.append("courseId", courseId);

    startTransition(async () => {
      const result = await createAssignment(formData);
      if (result && result.success) {
        toast.success("Assignment created successfully!");
        setOpen(false);
        router.refresh();
      } else if (result) {
        toast.error(result.error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={isPending}>
          Add Assignment
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form action={handleAddAssignment} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Assignment</DialogTitle>
            <DialogDescription>
              Create a new assignment for this course.
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
              />
            </div>

            {/* Priority */}
            <div className="grid gap-3">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                name="priority"
                disabled={isPending}
                className="border rounded-md px-3 py-2"
                defaultValue="MEDIUM"
              >
                <option value="LOW" className="bg-background">
                  Low
                </option>
                <option value="MEDIUM" className="bg-background">
                  Medium
                </option>
                <option value="HIGH" className="bg-background">
                  High
                </option>
              </select>
            </div>

            {/* Status */}
            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                disabled={isPending}
                className="border rounded-md px-3 py-2"
                defaultValue="TODO"
              >
                <option value="TODO" className="bg-background">
                  To do
                </option>
                <option value="IN_PROGRESS" className="bg-background">
                  In progress
                </option>
                <option value="DONE" className="bg-background">
                  Done
                </option>
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
              {isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

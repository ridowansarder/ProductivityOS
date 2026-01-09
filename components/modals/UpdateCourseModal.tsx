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
import { updateCourse } from "@/app/(dashboard)/courses/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function UpdateCourseModal({
  courseId,
  courseTitle,
  courseSemester,
}: {
  courseId: string;
  courseTitle: string;
  courseSemester?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleUpdate = (formData: FormData) =>
    startTransition(async () => {
      const result = await updateCourse(formData, courseId);

      if (result && result.success) {
        setOpen(false);
        toast.success("Course updated successfully!");
        router.refresh();
      } else if (result) {
        toast.error(result.error);
      }
    });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Update Course</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form action={handleUpdate} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Update Course</DialogTitle>
            <DialogDescription>
              Make changes to your course here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter new course title"
                required
                disabled={isPending}
                autoFocus
                defaultValue={courseTitle}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="semester">Semester</Label>
              <Input
                id="semester"
                name="semester"
                placeholder="Enter semester (optional)"
                disabled={isPending}
                defaultValue={courseSemester || ""}
              />
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
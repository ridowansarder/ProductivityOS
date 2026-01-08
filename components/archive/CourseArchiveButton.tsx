"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { archiveCourse } from "@/app/(dashboard)/courses/actions";
import { useRouter } from "next/navigation";

export default function ConfirmCourseArchiveButton({ courseId }: { courseId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await archiveCourse(courseId);
      if (result.success) {
        toast.success("Course archived!");
        setOpen(false);
      } else {
        toast.error(result.error);
      }
      router.push("/courses");
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Archive Course</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirm Archive</DialogTitle>
          <DialogDescription>
            Are you sure you want to archive this course?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Archiving..." : "Yes, Archive Course"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

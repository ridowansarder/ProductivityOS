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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createNote } from "@/app/(dashboard)/notes/actions";
import { Textarea } from "@/components/ui/textarea";

export function AddNoteModal({ courseId }: { courseId: string }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleAddNote = (formData: FormData) => {
    formData.append("courseId", courseId);

    startTransition(async () => {
      const result = await createNote(formData);
      if (result && result.success) {
        toast.success("Note created successfully!");
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
        <Button disabled={isPending}>Add Note</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form action={handleAddNote} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Create a new note for this course.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Title */}
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter note title"
                required
                disabled={isPending}
                autoFocus
              />
            </div>

            {/* Content */}
            <div className="grid gap-3 max-h-50 overflow-y-auto">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Enter note content"
                disabled={isPending}
                required
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
              {isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

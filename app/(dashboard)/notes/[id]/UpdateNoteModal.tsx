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
import { updateNote } from "../../notes/actions";
import { Textarea } from "@/components/ui/textarea";

export function UpdateNoteModal({ noteId, courseId, noteTitle, noteContent }: { noteId: string, courseId: string, noteTitle: string, noteContent: string }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleUpdateNote = (formData: FormData) => {
    formData.append("courseId", courseId);

    startTransition(async () => {
      const result = await updateNote(formData, noteId);
      if (result && result.success) {
        toast.success("Note updated successfully!");
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
        <Button disabled={isPending}>Update Note</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form action={handleUpdateNote} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Update Note</DialogTitle>
            <DialogDescription>
              Update the note details below.
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
                defaultValue={noteTitle}
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
                defaultValue={noteContent}
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
              {isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

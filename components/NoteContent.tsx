"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateNote } from "@/app/(dashboard)/notes/actions";

export default function NoteContent({
  noteId,
  courseId,
  noteTitle,
  noteContent,
}: {
  noteId: string;
  courseId: string;
  noteTitle: string;
  noteContent: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleUpdateNote = (formData: FormData) => {
    formData.append("courseId", courseId);

    startTransition(async () => {
      const result = await updateNote(formData, noteId);

      if (result?.success) {
        toast.success("Note updated successfully!");
        setIsEditing(false);
        router.refresh();
      } else {
        toast.error(result?.error || "Something went wrong");
      }
    });
  };

  if (!isEditing) {
    return (
      <div className="max-w-3xl">
        <Button className="mb-4" onClick={() => setIsEditing(true)} disabled={isPending} variant={"outline"}>
          Update Note
        </Button>
        <div className="whitespace-pre-wrap">
          {noteContent}
        </div>
      </div>
    );
  }

  return (
    <form action={handleUpdateNote} className="max-w-3xl space-y-4">
      <Input
        name="title"
        defaultValue={noteTitle}
        disabled={isPending}
        className="font-semibold"
      />

      <Textarea
        name="content"
        defaultValue={noteContent}
        disabled={isPending}
        className="max-h-100"
      />

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update Note"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => setIsEditing(false)}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

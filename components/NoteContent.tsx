"use client";

import { useState } from "react";
import { updateNote } from "@/app/(dashboard)/notes/actions";

type Props = {
  noteId: string;
  title: string;
  content: string;
  courseId: string;
};

export default function NoteContent({
  noteId,
  title: initialTitle,
  content: initialContent,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  return (
    <div className="max-w-3xl">
      {!isEditing && (
        <>
          <div className="prose prose-neutral max-w-none whitespace-pre-wrap">
            {initialContent}
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 rounded bg-black px-4 py-2 text-white"
          >
            Edit
          </button>
        </>
      )}

      {isEditing && (
        <form
          action={async () => {
            await updateNote({
              noteId,
              title,
              content,
            });
            setIsEditing(false);
          }}
          className="space-y-4"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border p-2 text-2xl font-semibold"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[60vh] rounded border p-4 leading-7 resize-none"
          />

          <div className="flex gap-3">
            <button className="rounded bg-black px-4 py-2 text-white">
              Save
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-muted-foreground"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

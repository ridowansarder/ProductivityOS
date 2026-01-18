import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { notFound, redirect } from "next/navigation";
import { ConfirmNoteArchiveButton } from "@/components/confirmButtons/NoteButtons";
import NoteContent from "@/components/NoteContent";

const NoteDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const user = await getOrCreateUser();
  if (!user) return redirect("/sign-in");

  const note = await prisma.note.findFirst({
    where: {
      id,
      userId: user.clerkUserId,
      isActive: true,
    },
    include: {
      course: true,
    },
  });

  if (!note) notFound();

  return (
    <div className="py-6 px-6 md:px-12 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">{note.title}</h1>
          <p className="text-sm text-muted-foreground">
            Course: {note.course.title}
          </p>
        </div>

        <ConfirmNoteArchiveButton noteId={note.id} />
      </div>

      <div className="h-px bg-border" />

      {/* CLIENT UI */}
      <NoteContent
        noteId={note.id}
        title={note.title}
        content={note.content}
        courseId={note.courseId}
      />
    </div>
  );
};

export default NoteDetailsPage;

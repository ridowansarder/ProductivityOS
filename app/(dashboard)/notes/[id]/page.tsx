import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { notFound, redirect } from "next/navigation";
import { ConfirmNoteArchiveButton } from "@/components/confirmButtons/NoteButtons";
import { UpdateNoteModal } from "@/components/modals/UpdateNoteModal";

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

        <div className="flex items-center gap-4">
          <ConfirmNoteArchiveButton noteId={note.id} />
          <UpdateNoteModal
            noteId={note.id}
            courseId={note.courseId}
            noteTitle={note.title}
            noteContent={note.content}
          />
        </div>
      </div>

      <div className="h-px bg-border" />

      <div>
        <p className="text-muted-foreground">{note.content}</p>
      </div>
    </div>
  );
};

export default NoteDetailsPage;

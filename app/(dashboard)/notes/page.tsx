import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function NotesPage() {
  const user = await getOrCreateUser();
  if (!user) {
    redirect("/sign-in");
  }

  const notes = await prisma.note.findMany({
    where: {
      userId: user.clerkUserId,
      isActive: true,
      course: {
        isActive: true,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      course: true,
    },
  });

  return (
    <div className="py-6 px-12 space-y-5 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notes</h1>
          <p className="text-muted-foreground mt-1">
            {notes.length} {notes.length === 1 ? "Note" : "Notes"} in total
          </p>
        </div>
        <p>
          Go to{" "}
          <Link href="/courses" className="font-bold">
            Courses
          </Link>{" "}
          and click on a course to create a new Note
        </p>
      </div>

      {/* Empty State */}
      {notes.length === 0 ? (
        <div className="text-center border-2 border-dashed px-4 py-12 mt-4 sm:mt-8 md:mt-12 lg:mt-16">
          <p className="text-muted-foreground">
            No notes yet. Create one inside a course.
          </p>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {notes.map((note) => (
            <Link key={note.id} href={`/notes/${note.id}`}>
              <Card>
                <CardHeader>
                  <CardTitle>{note.title}</CardTitle>
                  <CardDescription>{note.course.title}</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-2">
                  <p className="text-muted-foreground">
                    {note.content.length > 20
                      ? note.content.slice(0, 20) + "..."
                      : note.content}
                  </p>
                  <p>Click to view details</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { archiveCourse } from "@/app/(dashboard)/courses/actions";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function ArchiveButton({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleArchive = () => {
    startTransition(async () => {
      const result = await archiveCourse(courseId);

      if (result?.success === false) {
        toast.error(result.error);
        return;
      }

      toast.success("Course archived");
      router.push("/courses");
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleArchive}
      disabled={isPending}
      className="text-destructive hover:text-destructive/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      aria-label="Archive course"
      type="button"
    >
      <Trash2Icon className="h-5 w-5" />
    </button>
  );
}
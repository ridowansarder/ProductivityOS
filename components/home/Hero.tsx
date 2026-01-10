import { Button } from "../ui/button";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

const Hero = () => {
  return (
    <main className="max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight px-3">
          A focused productivity system built for semester-based coursework.
        </h1>
        <p className="text-md md:text-lg px-3 text-foreground/80">
          Organize courses, assignments, and notes in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 px-4 sm:px-0 justify-center pt-4">
          <Button size="lg" variant={"outline"} asChild>
            <Link href="/sign-up">Plan your semester</Link>
          </Button>
          <Button size="lg" asChild>
            <Link href="/sign-in">Log In</Link>
          </Button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 pt-8 text-left w-full">
        <Card>
          <CardHeader>
            <CardTitle>Course-Centered Organization</CardTitle>
            <CardDescription>
              All work belongs to a course, just like real university life.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Assignment Tracking</CardTitle>
            <CardDescription>
              Track priorities, due dates, statuses, and overdue work without
              noise.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notes With Context</CardTitle>
            <CardDescription>
              Organize notes with context, like a real university course.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
};

export default Hero;

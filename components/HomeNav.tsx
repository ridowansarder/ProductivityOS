import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";

const Navbar = () => {
  return (
    <nav className="border-b sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <h1 className="text-lg md:text-2xl font-bold">ProductivityOS</h1>
          </Link>
          <div className="md:flex gap-4 hidden">
            <Button variant="outline" asChild>
              <Link href="/sign-in">Log in</Link>
            </Button>

            <Button asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>

            <ModeToggle />
          </div>

          <div className="md:hidden">
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
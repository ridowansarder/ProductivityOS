import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t py-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="flex items-center space-x-3">ProductivityOS</div>
        <p className="text-center max-w-xl px-2.5 text-sm font-normal leading-relaxed py-3">
          Designed as a real-world productivity system for students.
        </p>
      </div>
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-6 mt-3 text-center text-sm font-normal">
          <Link href="/">ProductivityOS</Link> ©2026. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
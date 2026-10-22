import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import LogForm from "./LogForm";
import { encyclopediaData } from "@/lib/encyclopediaData";
import { auth } from "@clerk/nextjs/server";

export default async function LogCatchPage() {
  await auth.protect();

  return (
    <div className="flex flex-col min-h-full bg-deep-black">
      {/* Top Header */}
      <header className="flex items-center justify-between p-4 sticky top-0 bg-deep-black/90 backdrop-blur-md z-10">
        <Link href="/" className="p-2 -ml-2 text-light-gray hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-medium text-white">Compartir captura</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>

      {/* Form Content */}
      <main className="flex-1 p-4 pt-0">
        <LogForm speciesOptions={encyclopediaData.map(({ id, name, scientificName }) => ({ id, name, scientificName }))} />
      </main>
    </div>
  );
}

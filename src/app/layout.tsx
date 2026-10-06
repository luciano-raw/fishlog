import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Home, Map, Plus, BookOpen, User } from "lucide-react";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fishlog",
  description: "Registra tus capturas",
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Fishlog",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="h-full flex flex-col bg-deep-black text-light-gray overflow-hidden">
        <ClerkProvider>
          {/* Contenido Principal */}
          <main className="flex-1 overflow-y-auto pb-24">
            {children}
          </main>

          {/* Navegación Inferior (Bottom Bar) */}
          <nav className="fixed bottom-0 left-0 w-full bg-deep-black/90 backdrop-blur-md border-t border-charcoal pb-safe">
            <div className="flex justify-around items-center px-2 py-3">
              <Link href="/" className="flex flex-col items-center text-forest-green hover:text-lime transition-colors">
                <Home size={24} />
                <span className="text-[10px] mt-1 font-medium">Home</span>
              </Link>
              <Link href="/map" className="flex flex-col items-center text-forest-green hover:text-lime transition-colors">
                <Map size={24} />
                <span className="text-[10px] mt-1 font-medium">Map</span>
              </Link>
              
              {/* Botón Central Flotante (Nuevo Registro) */}
              <div className="relative -top-5">
                <Link href="/log" className="flex items-center justify-center w-14 h-14 bg-lime rounded-full shadow-[0_0_15px_rgba(164,255,61,0.3)] text-deep-black hover:scale-105 transition-transform">
                  <Plus size={32} strokeWidth={2.5} />
                </Link>
              </div>

              <Link href="/history" className="flex flex-col items-center text-forest-green hover:text-lime transition-colors">
                <BookOpen size={24} />
                <span className="text-[10px] mt-1 font-medium">Log</span>
              </Link>
              
              <div className="flex flex-col items-center text-forest-green hover:text-lime transition-colors">
                <Show when="signed-in">
                  <Link href="/profile" className="flex flex-col items-center text-forest-green hover:text-lime transition-colors">
                    <UserButton appearance={{ elements: { userButtonAvatarBox: "w-6 h-6" } }} />
                    <span className="text-[10px] mt-1 font-medium text-forest-green">Profile</span>
                  </Link>
                </Show>
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button className="flex flex-col items-center">
                      <User size={24} />
                      <span className="text-[10px] mt-1 font-medium">Log in</span>
                    </button>
                  </SignInButton>
                </Show>
              </div>
            </div>
          </nav>
        </ClerkProvider>
      </body>
    </html>
  );
}
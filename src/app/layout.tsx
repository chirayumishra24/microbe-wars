import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import { TopScoreboard } from "@/components/common/TopScoreboard";
import { GardenBackground3D } from "@/components/3d/GardenBackground3D";

export const metadata: Metadata = {
  title: "MICROBE WARS — Small Organisms. Big Impact.",
  description: "A two-team competitive learning adventure for studying microorganisms in the environment, food chains and webs, and decomposition with 3D garden crop growth.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'Microbe Wars',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen text-slate-900 selection:bg-emerald-500 selection:text-white relative bg-transparent">
        <GameProvider>
          {/* 3D Living Garden Engine at z-0 */}
          <GardenBackground3D />
          {/* Claymorphic Top Scoreboard at z-50 */}
          <TopScoreboard />
          {/* Main Stage at z-10 */}
          <main className="w-full relative z-10">
            {children}
          </main>
        </GameProvider>
      </body>
    </html>
  );
}

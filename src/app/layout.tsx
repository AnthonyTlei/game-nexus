import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s - Game Nexus",
    absolute: "Game Nexus",
  },
  description:
    "Your ultimate online hub for discovering, buying, and recommending games. Seamlessly connect with a curated game library, powered by AI-driven insights to tailor recommendations just for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

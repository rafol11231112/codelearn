import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { DevToolsBlocker } from "@/components/DevToolsBlocker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeLearn - Master Coding Skills",
  description: "Modern platform for learning to code with interactive challenges",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <DevToolsBlocker />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/ThemeProvider";
import { useStore } from "@/lib/store";
import { Moon, Sun, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useStore();

  const isAdmin = (user as any)?.isAdmin || false;
  
  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/path", label: "Learning Path" },
    { href: "/challenges", label: "Challenges" },
    { href: "/lessons", label: "Lessons" },
    { href: "/leaderboard", label: "Leaderboard" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <img src="/logo.svg" alt="CodeLearn" className="w-10 h-10" />
              <span className="text-2xl font-bold text-primary">CodeLearn</span>
            </Link>
            
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      pathname === item.href
                        ? "bg-primary text-white"
                        : "hover:bg-secondary"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <Link href="/profile">
              <Button variant="ghost" size="sm">
                <User className="w-5 h-5 mr-2" />
                {user?.username}
              </Button>
            </Link>

            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}


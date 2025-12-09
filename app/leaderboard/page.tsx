"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Navbar } from "@/components/dashboard/Navbar";
import { Card } from "@/components/ui/Card";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  weeklyXP: number;
  completedChallenges: number;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<"global" | "weekly">("global");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (isAuthenticated) {
      fetchLeaderboard();
    }
  }, [isAuthenticated, filter]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?filter=${filter}`);
      const data = await response.json();
      setLeaderboard(data.leaderboard);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <img src="/icons/trophy.svg" alt="1st Place" className="w-8 h-8" />;
      case 2:
        return <img src="/icons/badge-master.svg" alt="2nd Place" className="w-8 h-8" />;
      case 3:
        return <img src="/icons/badge-beginner.svg" alt="3rd Place" className="w-8 h-8" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">{rank}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
            <p className="text-muted-foreground">
              See how you rank against other learners
            </p>
          </div>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setFilter("global")}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                filter === "global"
                  ? "bg-primary text-white"
                  : "bg-card border border-border hover:border-primary"
              }`}
            >
              Global
            </button>
            <button
              onClick={() => setFilter("weekly")}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                filter === "weekly"
                  ? "bg-primary text-white"
                  : "bg-card border border-border hover:border-primary"
              }`}
            >
              Weekly
            </button>
          </div>

          <Card>
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg flex items-center justify-between ${
                    entry.username === user?.username
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-secondary"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 flex items-center justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    <div className="w-12 h-12 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center">
                      <img src="/avatars/default.svg" alt={entry.username} className="w-full h-full" />
                    </div>
                    
                    <div>
                      <p className="font-semibold">{entry.username}</p>
                      <p className="text-sm text-muted-foreground">
                        Level {entry.level} • {entry.completedChallenges} challenges
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {filter === "weekly" ? entry.weeklyXP : entry.xp}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {filter === "weekly" ? "Weekly XP" : "Total XP"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}


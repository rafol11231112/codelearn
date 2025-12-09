"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Navbar } from "@/components/dashboard/Navbar";
import { XPBar } from "@/components/dashboard/XPBar";
import { StatCard } from "@/components/dashboard/StatCard";
import { DailyQuests } from "@/components/dashboard/DailyQuests";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trophy, Target, Flame, Award } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user && !user.onboardingQuiz.finished) {
      router.push("/quiz");
    }
  }, [isAuthenticated, user]);

  if (!user) {
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
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user.username}! 👋
            </h1>
            <p className="text-muted-foreground">
              Continue your coding journey and level up your skills
            </p>
          </div>

          <div className="mb-8">
            <Card className="p-6">
              <XPBar xp={user.xp} level={user.level} />
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total XP"
              value={user.xp}
              icon={Trophy}
            />
            <StatCard
              title="Level"
              value={user.level}
              icon={Target}
            />
            <StatCard
              title="Daily Streak"
              value={`${user.dailyStreak} days`}
              icon={Flame}
              color="text-orange-500"
            />
            <StatCard
              title="Badges"
              value={user.badges.length}
              icon={Award}
              color="text-yellow-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-20">
                  <img src="/mascot-happy.svg" alt="" className="w-24 h-24" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Continue Your Journey</h2>
                <p className="text-muted-foreground mb-6">
                  Pick up where you left off and keep building your skills
                </p>
                
                <div className="space-y-4">
                  <Link href="/path">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-6 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Learning Path 🎯</h3>
                          <p className="text-muted-foreground">
                            Follow your personalized hexagon lesson path
                          </p>
                        </div>
                        <Button>Continue</Button>
                      </div>
                    </motion.div>
                  </Link>

                  <Link href="/challenges">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-6 rounded-xl border-2 border-border hover:border-primary/50 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Coding Challenges</h3>
                          <p className="text-muted-foreground">
                            Solve interactive coding problems
                          </p>
                        </div>
                        <Button variant="outline">Start</Button>
                      </div>
                    </motion.div>
                  </Link>

                  <Link href="/lessons">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-6 rounded-xl border-2 border-border hover:border-primary/50 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Structured Lessons</h3>
                          <p className="text-muted-foreground">
                            Learn programming concepts step by step
                          </p>
                        </div>
                        <Button variant="outline">Browse</Button>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              </Card>
            </div>

            <div>
              <DailyQuests />
            </div>
          </div>

          {user.badges.length > 0 && (
            <Card>
              <h2 className="text-2xl font-bold mb-4">Your Achievements</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {user.badges.map((badge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-primary/10 text-center"
                  >
                    <img src="/icons/trophy.svg" alt="Trophy" className="w-16 h-16 mx-auto mb-2" />
                    <p className="text-sm font-medium">{badge}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}
        </motion.div>
      </main>
    </div>
  );
}


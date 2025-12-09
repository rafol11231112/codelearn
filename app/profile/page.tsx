"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Navbar } from "@/components/dashboard/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Trophy, Target, BookOpen, Code } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, setUser } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      setUsername(user.username);
    }
  }, [isAuthenticated, user]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      
      if (data.user) {
        setUser(data.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = [
    { icon: Trophy, label: "Total XP", value: user.xp, color: "text-yellow-500" },
    { icon: Target, label: "Level", value: user.level, color: "text-blue-500" },
    { icon: Code, label: "Challenges", value: user.completedChallenges?.length || 0, color: "text-green-500" },
    { icon: BookOpen, label: "Lessons", value: user.completedLessons?.length || 0, color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center">
                  <img src="/avatars/default.svg" alt="Avatar" className="w-full h-full" />
                </div>
                
                <div>
                  {isEditing ? (
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="mb-2"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold mb-1">{user.username}</h1>
                  )}
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {user.onboardingQuiz.skillLevel}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      🔥 {user.dailyStreak} day streak
                    </span>
                  </div>
                </div>
              </div>

              <div>
                {isEditing ? (
                  <div className="space-x-2">
                    <Button onClick={handleSave} isLoading={isSaving}>
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center">
                  <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {user.badges.length > 0 && (
            <Card>
              <h2 className="text-2xl font-bold mb-4">Achievements</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {user.badges.map((badge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-xl bg-primary/10 text-center"
                  >
                    <img src="/icons/badge-master.svg" alt="Badge" className="w-16 h-16 mx-auto mb-3" />
                    <p className="font-medium">{badge}</p>
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


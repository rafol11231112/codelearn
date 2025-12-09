"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Navbar } from "@/components/dashboard/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Lock, CheckCircle, Circle, Sparkles } from "lucide-react";
import { CustomChallengeModal } from "@/components/CustomChallengeModal";

interface Challenge {
  _id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  xpReward: number;
  unlockXPRequired: number;
  language: string;
  tags: string[];
}

export default function ChallengesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useStore();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCustomModal, setShowCustomModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (isAuthenticated) {
      fetchChallenges();
    }
  }, [isAuthenticated]);

  const fetchChallenges = async () => {
    try {
      const response = await fetch("/api/challenges");
      const data = await response.json();
      setChallenges(data.challenges);
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-500 bg-green-500/10";
      case "Medium":
        return "text-yellow-500 bg-yellow-500/10";
      case "Hard":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-primary bg-primary/10";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Coding Challenges</h1>
              <p className="text-muted-foreground">
                Solve interactive coding problems and earn XP
              </p>
            </div>
            <Button onClick={() => setShowCustomModal(true)} variant="outline">
              <Sparkles className="w-4 h-4 mr-2" />
              Custom Challenge
            </Button>
          </div>

          {challenges.length === 0 ? (
            <Card className="text-center py-12">
              <img src="/illustrations/empty-state.svg" alt="No challenges" className="w-64 h-48 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No challenges available yet</p>
              <p className="text-sm text-muted-foreground">Check back soon for new challenges!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge, index) => {
                const isLocked = user && user.xp < challenge.unlockXPRequired;
                const isCompleted = user?.completedChallenges?.includes(challenge._id) || false;

                return (
                  <motion.div
                    key={challenge._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={isLocked ? "#" : `/challenges/${challenge._id}`}>
                      <Card
                        hover={!isLocked}
                        className={`h-full ${isLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                              {challenge.difficulty}
                            </span>
                            {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                            {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                          </div>
                          <span className="text-sm font-semibold text-primary">
                            +{challenge.xpReward} XP
                          </span>
                        </div>

                        <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {challenge.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {challenge.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-secondary rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {isLocked && (
                          <p className="text-xs text-muted-foreground">
                            Requires {challenge.unlockXPRequired} XP to unlock
                          </p>
                        )}
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>

      <CustomChallengeModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
      />
    </div>
  );
}


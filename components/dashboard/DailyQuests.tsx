"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Check } from "lucide-react";

interface Quest {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
  progress: number;
  total: number;
}

export function DailyQuests() {
  const quests: Quest[] = [
    { id: "1", title: "Complete 3 challenges", xp: 30, completed: false, progress: 0, total: 3 },
    { id: "2", title: "Earn 50 XP", xp: 20, completed: false, progress: 0, total: 50 },
    { id: "3", title: "Maintain your streak", xp: 15, completed: false, progress: 0, total: 1 },
  ];

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Daily Quests</h2>
      <div className="space-y-3">
        {quests.map((quest, index) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border-2 ${
              quest.completed
                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                : "border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    quest.completed
                      ? "bg-green-500"
                      : "border-2 border-border"
                  }`}
                >
                  {quest.completed && <Check className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <p className="font-medium">{quest.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {quest.progress} / {quest.total}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-primary">+{quest.xp} XP</span>
            </div>
            <div className="mt-2 w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(quest.progress / quest.total) * 100}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}


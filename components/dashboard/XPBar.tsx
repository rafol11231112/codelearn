"use client";

import { motion } from "framer-motion";

interface XPBarProps {
  xp: number;
  level: number;
}

export function XPBar({ xp, level }: XPBarProps) {
  const xpForNextLevel = level * 100;
  const currentLevelXP = xp % xpForNextLevel;
  const progress = (currentLevelXP / xpForNextLevel) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Level {level}</span>
        <span className="text-sm text-muted-foreground">
          {currentLevelXP} / {xpForNextLevel} XP
        </span>
      </div>
      <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}


"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

interface Progress {
  completedLessons: string[];
  currentLesson: number;
  xp: number;
  level: number;
}

export function useProgress() {
  const user = useStore((state) => state.user);
  const [progress, setProgress] = useState<Progress>({
    completedLessons: [],
    currentLesson: 1,
    xp: 0,
    level: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const newProgress = {
        completedLessons: user.completedLessons || [],
        currentLesson: (user as any).currentLesson || 1,
        xp: user.xp || 0,
        level: user.level || 1,
      };
      setProgress(newProgress);
      setLoading(false);
    }
  }, [user]);

  const completeLesson = async (lessonId: string, xpGained: number) => {
    try {
      const response = await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          xpGained,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProgress({
          completedLessons: data.completedLessons,
          currentLesson: data.currentLesson,
          xp: data.xp,
          level: data.level,
        });
        return data;
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  };

  const isLessonUnlocked = (lessonLevel: number) => {
    return lessonLevel <= progress.currentLesson;
  };

  const getLessonStatus = (lessonId: string, lessonLevel: number): "completed" | "current" | "locked" => {
    if (isLessonCompleted(lessonId)) {
      return "completed";
    }
    if (lessonLevel === progress.currentLesson) {
      return "current";
    }
    if (isLessonUnlocked(lessonLevel)) {
      return "current";
    }
    return "locked";
  };

  return {
    progress,
    loading,
    completeLesson,
    isLessonCompleted,
    isLessonUnlocked,
    getLessonStatus,
  };
}

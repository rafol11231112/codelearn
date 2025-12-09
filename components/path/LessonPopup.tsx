"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface LessonPopupProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: {
    id: string;
    title: string;
    description: string;
    level: number;
    xpReward: number;
    estimatedTime: number;
    status: "completed" | "current" | "locked";
  };
}

export default function LessonPopup({ isOpen, onClose, lesson }: LessonPopupProps) {
  const router = useRouter();

  const handleStart = () => {
    router.push(`/lessons/${lesson.id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border-2 border-border rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-primary/10 to-blue-500/10 p-6 border-b border-border">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-background/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Star className="w-4 h-4" />
                <span>Level {lesson.level}</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">{lesson.title}</h2>
              <p className="text-muted-foreground">{lesson.description}</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-around mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">XP Reward</span>
                  <span className="text-lg font-bold">{lesson.xpReward}</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                    <Clock className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-lg font-bold">{lesson.estimatedTime}m</span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleStart}
                className="w-full h-14 text-lg font-semibold"
                size="lg"
              >
                {lesson.status === "completed" ? "REVIEW" : lesson.status === "current" ? "CONTINUE" : "START"}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

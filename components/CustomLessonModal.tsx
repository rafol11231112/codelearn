"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { X, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

interface CustomLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (lessonId: string) => void;
}

export function CustomLessonModal({ isOpen, onClose, onSuccess }: CustomLessonModalProps) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateLesson = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/generate/custom-lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      
      sessionStorage.setItem('customLesson', JSON.stringify(data.lesson));
      
      if (onSuccess && data.lesson) {
        onSuccess('custom');
      } else {
        router.push('/lessons/custom');
      }
      
    } catch (error) {
      console.error("Failed to generate lesson:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card className="relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Custom Lesson</h2>
                  <p className="text-sm text-muted-foreground">Learn anything you want</p>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="What topic do you want to learn?"
                  placeholder="e.g., decorators, async/await, closures..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />

                <div className="p-3 bg-primary/5 rounded-lg text-sm">
                  <p className="text-muted-foreground">
                    Our system will create a comprehensive lesson with examples and explanations tailored to your topic.
                  </p>
                </div>

                <Button
                  onClick={generateLesson}
                  className="w-full"
                  isLoading={isGenerating}
                  disabled={!topic.trim()}
                >
                  {isGenerating ? "Creating Lesson..." : "Create Lesson"}
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


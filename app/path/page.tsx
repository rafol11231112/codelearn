"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useProgress } from "@/hooks/useProgress";
import { Navbar } from "@/components/dashboard/Navbar";
import PathLayout from "@/components/path/PathLayout";
import Mascot from "@/components/Mascot";
import { motion } from "framer-motion";
import { CustomLessonModal } from "@/components/CustomLessonModal";

export default function PathPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useStore();
  const { progress, loading, getLessonStatus } = useProgress();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [showCustomLessonModal, setShowCustomLessonModal] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user && !user.onboardingQuiz.finished) {
      router.push("/quiz");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch("/api/lessons");
        
        if (response.ok) {
          const data = await response.json();
          
          // Extract all lessons from sections
          const allLessons: any[] = [];
          if (data.sections) {
            data.sections.forEach((section: any) => {
              if (section.lessons) {
                allLessons.push(...section.lessons);
              }
            });
          }
          
          // Map lessons with their status
          const mappedLessons = allLessons.map((lesson: any, index: number) => {
            const status = getLessonStatus(lesson._id, lesson.order);
            return {
              id: lesson._id,
              title: lesson.title,
              description: lesson.description,
              level: lesson.order,
              xpReward: lesson.xpReward,
              estimatedTime: lesson.estimatedTime,
              status,
              position: index % 3 === 0 ? "center" : index % 3 === 1 ? "left" : "right",
            };
          });
          
          setLessons(mappedLessons);
        }
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
      } finally {
        setLoadingLessons(false);
      }
    };

    if (!loading) {
      fetchLessons();
    }
  }, [loading, getLessonStatus, user, progress]);

  const handleGenerateNew = () => {
    setShowCustomLessonModal(true);
  };

  const handleLessonGenerated = (lessonId: string) => {
    setShowCustomLessonModal(false);
    router.push(`/lessons/${lessonId}`);
  };

  if (!user || loadingLessons) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your learning path...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {/* Floating Mascot */}
          <div className="flex justify-center mb-6">
            <Mascot variant="happy" size="lg" />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Your Learning Path</h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Master coding one step at a time. Complete lessons to unlock new challenges and level up your skills.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-muted-foreground">Current</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span className="text-muted-foreground">Locked</span>
            </div>
          </div>
        </motion.div>

        <PathLayout lessons={lessons} onGenerateNew={handleGenerateNew} />
      </main>

      {/* Custom Lesson Modal */}
      {showCustomLessonModal && (
        <CustomLessonModal
          isOpen={showCustomLessonModal}
          onClose={() => setShowCustomLessonModal(false)}
          onSuccess={handleLessonGenerated}
        />
      )}
    </div>
  );
}

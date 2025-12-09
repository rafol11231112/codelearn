"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Navbar } from "@/components/dashboard/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Lock, Clock, BookOpen } from "lucide-react";
import { CustomLessonModal } from "@/components/CustomLessonModal";

interface Lesson {
  _id: string;
  title: string;
  description: string;
  xpReward: number;
  estimatedTime: number;
  order: number;
}

interface Section {
  _id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlockXPRequired: number;
  lessons: Lesson[];
}

export default function LessonsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useStore();
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCustomModal, setShowCustomModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (isAuthenticated) {
      fetchLessons();
    }
  }, [isAuthenticated]);

  const fetchLessons = async () => {
    try {
      const response = await fetch("/api/lessons");
      const data = await response.json();
      setSections(data.sections);
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
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
              <h1 className="text-4xl font-bold mb-2">Learning Path</h1>
              <p className="text-muted-foreground">
                Follow structured lessons to master programming concepts
              </p>
            </div>
            <Button onClick={() => setShowCustomModal(true)} variant="outline">
              <BookOpen className="w-4 h-4 mr-2" />
              Custom Lesson
            </Button>
          </div>

          {sections.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-muted-foreground mb-4">No lessons available yet</p>
              <p className="text-sm text-muted-foreground">Check back soon for new content!</p>
            </Card>
          ) : (
            <div className="space-y-8">
              {sections.map((section, sectionIndex) => {
                const isLocked = user && user.xp < section.unlockXPRequired;

                return (
                  <motion.div
                    key={section._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.1 }}
                  >
                    <Card className={isLocked ? "opacity-60" : ""}>
                      <div className="flex items-center space-x-4 mb-6">
                        <div
                          className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                          style={{ backgroundColor: `${section.color}20` }}
                        >
                          {section.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h2 className="text-2xl font-bold">{section.title}</h2>
                            {isLocked && <Lock className="w-5 h-5 text-muted-foreground" />}
                          </div>
                          <p className="text-muted-foreground">{section.description}</p>
                          {isLocked && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Requires {section.unlockXPRequired} XP to unlock
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {section.lessons.map((lesson, lessonIndex) => {
                          const isCompleted = user?.completedLessons?.includes(lesson._id) || false;

                          return (
                            <Link
                              key={lesson._id}
                              href={isLocked ? "#" : `/lessons/${lesson._id}`}
                            >
                              <motion.div
                                whileHover={isLocked ? {} : { scale: 1.02 }}
                                className={`p-4 rounded-xl border-2 ${
                                  isCompleted
                                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                    : "border-border hover:border-primary"
                                } ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-semibold">{lesson.title}</h3>
                                  {isCompleted && (
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                  {lesson.description}
                                </p>
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center text-muted-foreground">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {lesson.estimatedTime} min
                                  </div>
                                  <span className="font-semibold text-primary">
                                    +{lesson.xpReward} XP
                                  </span>
                                </div>
                              </motion.div>
                            </Link>
                          );
                        })}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>

      <CustomLessonModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
      />
    </div>
  );
}


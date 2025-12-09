"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Navbar } from "@/components/dashboard/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Sparkles } from "lucide-react";

interface Lesson {
  _id: string;
  title: string;
  description: string;
  content: string;
  xpReward: number;
  estimatedTime: number;
  exercises: Array<{
    question: string;
    code: string;
    answer: string;
  }>;
}

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, setUser } = useStore();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiContent, setAiContent] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    fetchLesson();
  }, [isAuthenticated, params.id]);

  const fetchLesson = async () => {
    try {
      const response = await fetch(`/api/lessons/${params.id}`);
      const data = await response.json();
      
      if (data.lesson) {
        setLesson(data.lesson);
        setIsCompleted(user?.completedLessons?.includes(params.id as string) || false);
        generateAIContent();
      }
    } catch (error) {
      console.error("Failed to fetch lesson:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIContent = async () => {
    const cached = sessionStorage.getItem(`lesson_content_${params.id}`);
    if (cached) {
      setAiContent(JSON.parse(cached));
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`/api/lessons/${params.id}/generate-content`, {
        method: 'POST',
      });
      const data = await response.json();
      setAiContent(data);
      sessionStorage.setItem(`lesson_content_${params.id}`, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to generate AI content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const completeLesson = async () => {
    setIsCompleting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/lessons/${params.id}/complete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success && user) {
        setUser({
          ...user,
          xp: data.user.xp,
          level: data.user.level,
          currentLesson: data.user.currentLesson,
          completedLessons: data.user.completedLessons,
        });
        setIsCompleted(true);
        
        // Redirect to path after 2 seconds
        setTimeout(() => {
          router.push('/path');
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to complete lesson:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading || !lesson) {
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
          className="max-w-4xl mx-auto"
        >
          <Card className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
                <p className="text-muted-foreground">{lesson.description}</p>
              </div>
              {isCompleted && (
                <div className="flex items-center space-x-2 text-green-500">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-semibold">Completed</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>⏱️ {lesson.estimatedTime} minutes</span>
              <span>•</span>
              <span className="text-primary font-semibold">+{lesson.xpReward} XP</span>
            </div>
          </Card>

          {isGenerating && (
            <Card className="mb-6 text-center p-8">
              <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm text-muted-foreground">Loading lesson content...</p>
            </Card>
          )}

          {!isGenerating && (
            <Card className="mb-6">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed">
                  {aiContent?.enhancedContent || lesson.content.replace(/\n/g, '\n\n')}
                </div>
              </div>
            </Card>
          )}

          {aiContent?.codeExamples && aiContent.codeExamples.length > 0 && !isGenerating && (
            <Card className="mb-6">
              <h2 className="text-xl font-bold mb-4">💻 Code Examples</h2>
              <div className="space-y-4">
                {aiContent.codeExamples.map((example: any, index: number) => (
                  <div key={index} className="border border-border rounded-lg overflow-hidden">
                    <div className="bg-secondary/50 px-4 py-2 font-semibold text-sm">
                      {example.title}
                    </div>
                    <div className="p-4">
                      <pre className="bg-card p-3 rounded mb-2 overflow-x-auto text-sm">
                        <code>{example.code}</code>
                      </pre>
                      <p className="text-sm text-muted-foreground mb-2">{example.explanation}</p>
                      {example.output && (
                        <div className="text-xs bg-secondary/30 p-2 rounded">
                          <span className="font-semibold">Output:</span> {example.output}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {aiContent?.practiceExercises && !isGenerating && (
            <Card className="mb-6">
              <h2 className="text-xl font-bold mb-4">✏️ Practice Exercises</h2>
              <div className="space-y-3">
                {aiContent.practiceExercises.map((exercise: any, index: number) => (
                  <div key={index} className="p-4 bg-secondary/30 rounded-lg">
                    <p className="font-medium mb-2">Question {index + 1}: {exercise.question}</p>
                    <details className="text-sm">
                      <summary className="cursor-pointer text-primary hover:underline">
                        Show hint
                      </summary>
                      <p className="mt-2 text-muted-foreground">{exercise.hint}</p>
                    </details>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {lesson.exercises && lesson.exercises.length > 0 && (
            <Card className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Practice Exercises</h2>
              <div className="space-y-4">
                {lesson.exercises.map((exercise, index) => (
                  <div key={index} className="p-4 rounded-lg bg-secondary">
                    <h3 className="font-semibold mb-2">Exercise {index + 1}</h3>
                    <p className="mb-3">{exercise.question}</p>
                    {exercise.code && (
                      <pre className="bg-card p-4 rounded-lg overflow-x-auto">
                        <code>{exercise.code}</code>
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.push("/path")}>
              Back to Path
            </Button>
            
            {!isCompleted && (
              <Button onClick={completeLesson} isLoading={isCompleting}>
                Mark as Complete
              </Button>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}


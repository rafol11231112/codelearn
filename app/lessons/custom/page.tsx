"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/dashboard/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles } from "lucide-react";

export default function CustomLessonPage() {
  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);

  useEffect(() => {
    const customLesson = sessionStorage.getItem('customLesson');
    if (customLesson) {
      setLesson(JSON.parse(customLesson));
    } else {
      router.push('/lessons');
    }
  }, []);

  if (!lesson) {
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
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h1 className="text-3xl font-bold">{lesson.title}</h1>
            </div>
            <p className="text-muted-foreground mb-2">{lesson.description}</p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>⏱️ {lesson.estimatedTime} minutes</span>
              <span>•</span>
              <span className="text-primary font-semibold">+{lesson.xpReward} XP</span>
            </div>
          </Card>

          <Card className="mb-6">
            <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap">
              {lesson.content}
            </div>
          </Card>

          {lesson.examples && lesson.examples.length > 0 && (
            <Card className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Examples</h2>
              <div className="space-y-4">
                {lesson.examples.map((example: any, index: number) => (
                  <div key={index} className="border border-border rounded-lg overflow-hidden">
                    <pre className="bg-secondary/30 p-4 overflow-x-auto">
                      <code>{example.code}</code>
                    </pre>
                    <div className="p-3 text-sm text-muted-foreground">
                      {example.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Button variant="outline" onClick={() => router.push('/lessons')}>
            Back to Lessons
          </Button>
        </motion.div>
      </main>
    </div>
  );
}


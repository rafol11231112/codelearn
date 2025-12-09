"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { X, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface CustomChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomChallengeModal({ isOpen, onClose }: CustomChallengeModalProps) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [language, setLanguage] = useState("python");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateChallenge = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/generate/custom-challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic, difficulty, language }),
      });

      const data = await response.json();
      
      sessionStorage.setItem('customChallenge', JSON.stringify(data.challenge));
      router.push('/challenges/custom');
      
    } catch (error) {
      console.error("Failed to generate challenge:", error);
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
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Custom Challenge</h2>
                  <p className="text-sm text-muted-foreground">Create a personalized coding challenge</p>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="What do you want to learn?"
                  placeholder="e.g., recursion, sorting algorithms, regex..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />

                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Easy", "Medium", "Hard"].map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`py-2 px-4 rounded-lg border-2 font-medium transition-all ${
                          difficulty === level
                            ? "border-primary bg-primary text-white"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "python", label: "Python" },
                      { value: "javascript", label: "JavaScript" },
                    ].map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => setLanguage(lang.value)}
                        className={`py-2 px-4 rounded-lg border-2 font-medium transition-all ${
                          language === lang.value
                            ? "border-primary bg-primary text-white"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={generateChallenge}
                  className="w-full"
                  isLoading={isGenerating}
                  disabled={!topic.trim()}
                >
                  {isGenerating ? "Generating..." : "Generate Challenge"}
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


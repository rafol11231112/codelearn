"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sparkles, X, Eye } from "lucide-react";

interface AIHelperProps {
  failedAttempts: number;
  challengeId: string;
  onClose: () => void;
}

export function AIHelper({ failedAttempts, challengeId, onClose }: AIHelperProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [solution, setSolution] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getEncouragementMessage = () => {
    if (failedAttempts === 1) {
      return "Don't worry! Everyone makes mistakes. Want some help?";
    } else if (failedAttempts === 2) {
      return "This is tricky! Let me explain the concept better.";
    } else {
      return "You're working hard on this! Want to see the solution and learn from it?";
    }
  };

  const getAIHelp = async (type: 'explanation' | 'solution') => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/challenges/${challengeId}/ai-help`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, failedAttempts }),
      });
      
      const data = await response.json();
      
      if (type === 'explanation') {
        setExplanation(data.explanation);
        setShowExplanation(true);
      } else {
        setSolution(data.solution);
        setShowSolution(true);
      }
    } catch (error) {
      console.error('AI help failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed bottom-6 right-6 z-50 max-w-md"
      >
        <Card className="relative border-2 border-primary shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 rounded-lg hover:bg-secondary"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Need Help?</h3>
              <p className="text-sm text-muted-foreground">{getEncouragementMessage()}</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {failedAttempts >= 1 && !showExplanation && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => getAIHelp('explanation')}
                isLoading={isLoading && !showExplanation}
              >
                💡 Get Better Explanation
              </Button>
            )}

            {failedAttempts >= 3 && !showSolution && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => getAIHelp('solution')}
                isLoading={isLoading && !showSolution}
              >
                <Eye className="w-4 h-4 mr-2" />
                Show Solution & Learn
              </Button>
            )}
          </div>

          {showExplanation && explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-3"
            >
              <h4 className="font-semibold text-sm mb-2">📖 Detailed Explanation</h4>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{explanation}</p>
            </motion.div>
          )}

          {showSolution && solution && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
            >
              <h4 className="font-semibold text-sm mb-2">✅ Solution</h4>
              <pre className="text-xs bg-card p-3 rounded overflow-x-auto">
                <code>{solution}</code>
              </pre>
              <p className="text-xs text-muted-foreground mt-2">
                Study this solution and try to understand each part!
              </p>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}


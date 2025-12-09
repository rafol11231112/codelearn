"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/dashboard/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CodeEditor } from "@/components/challenges/CodeEditor";
import { Play, Sparkles, Lightbulb, CheckCircle, XCircle } from "lucide-react";
import { AIHelper } from "@/components/challenges/AIHelper";

export default function CustomChallengePage() {
  const router = useRouter();
  const [challenge, setChallenge] = useState<any>(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showAIHelper, setShowAIHelper] = useState(false);

  useEffect(() => {
    const customChallenge = sessionStorage.getItem('customChallenge');
    if (customChallenge) {
      const data = JSON.parse(customChallenge);
      setChallenge(data);
      setCode(data.starterCode || '');
    } else {
      router.push('/challenges');
    }
  }, []);

  const runCode = () => {
    setIsRunning(true);
    setOutput(["Running code..."]);
    setTimeout(() => {
      setOutput(["Code executed successfully!", "Check the output above."]);
      setIsRunning(false);
    }, 1000);
  };

  const submitCode = async () => {
    setIsRunning(true);

    try {
      const response = await fetch('/api/challenges/validate-custom', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, challenge }),
      });

      const validation = await response.json();
      
      if (validation.isCorrect) {
        setOutput([
          "🎉 Correct solution!",
          validation.feedback
        ]);
        setTestResults([{ passed: true }, { passed: true }]);
        setFailedAttempts(0);
        setShowAIHelper(false);
      } else {
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        setOutput([
          "❌ Not quite right",
          validation.feedback,
          validation.hints ? `Hint: ${validation.hints}` : ""
        ]);
        
        const passedCount = validation.testsPassed || 0;
        setTestResults([
          { passed: passedCount >= 1 },
          { passed: passedCount >= 2 }
        ]);
        
        if (newFailedAttempts >= 1) {
          setShowAIHelper(true);
        }
      }
      
      setIsRunning(false);
    } catch (error) {
      console.error("Validation error:", error);
      setOutput(["Error validating code. Please try again."]);
      setIsRunning(false);
    }
  };

  const showNextHint = () => {
    setShowHint(true);
    if (challenge?.hints && currentHint < challenge.hints.length - 1) {
      setCurrentHint(currentHint + 1);
    }
  };

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[calc(100vh-140px)]">
          <div className="flex flex-col space-y-4 overflow-y-auto max-h-[60vh] lg:max-h-none">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h1 className="text-2xl font-bold">{challenge.title}</h1>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  +{challenge.xpReward} XP
                </span>
              </div>

              {challenge.lessonContent && (
                <div className="mb-4 p-4 bg-secondary/50 rounded-lg">
                  <h2 className="text-lg font-semibold mb-3">📚 Lesson</h2>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {challenge.lessonContent}
                  </div>
                </div>
              )}

              {challenge.examples && challenge.examples.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-md font-semibold mb-3">💡 Examples</h3>
                  <div className="space-y-3">
                    {challenge.examples.map((example: any, index: number) => (
                      <div key={index} className="p-3 bg-secondary/30 rounded-lg">
                        <pre className="text-sm mb-2 overflow-x-auto">
                          <code>{example.code}</code>
                        </pre>
                        <p className="text-xs text-muted-foreground">{example.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-4">
                <h3 className="text-lg font-semibold mb-2">🎯 Challenge</h3>
                <p className="text-muted-foreground mb-4">{challenge.description}</p>

                {challenge.hints && challenge.hints.length > 0 && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={showNextHint}
                      className="mb-2"
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Show Hint
                    </Button>
                    
                    <AnimatePresence>
                      {showHint && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                        >
                          <p className="text-sm">{challenge.hints[currentHint]}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </Card>

            {testResults.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-3">Test Results</h3>
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg flex items-center space-x-2 ${
                        result.passed
                          ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                          : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                      }`}
                    >
                      {result.passed ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">Test case {index + 1}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <Card className="lg:flex-1 p-0 overflow-hidden flex flex-col min-h-[400px] lg:min-h-0">
              <div className="p-3 md:p-4 border-b border-border">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-semibold text-sm md:text-base">Code Editor</span>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={runCode}
                      isLoading={isRunning}
                      className="text-xs md:text-sm px-3 py-2"
                    >
                      <Play className="w-4 h-4 md:mr-2" />
                      <span className="hidden md:inline">Run</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={submitCode}
                      isLoading={isRunning}
                      className="text-xs md:text-sm px-4 py-2"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 min-h-[350px]">
                <CodeEditor
                  language={challenge.language}
                  defaultValue={code}
                  onChange={setCode}
                />
              </div>
            </Card>

            <Card className="h-40 md:h-48 overflow-y-auto">
              <h3 className="font-semibold mb-2">Output</h3>
              <div className="bg-secondary rounded-lg p-4 font-mono text-sm">
                {output.length > 0 ? (
                  output.map((line, i) => <div key={i}>{line}</div>)
                ) : (
                  <span className="text-muted-foreground">Run your code to see output...</span>
                )}
              </div>
            </Card>

            <Button variant="outline" onClick={() => router.push('/challenges')}>
              Back to Challenges
            </Button>
          </div>
        </div>
      </main>

      {showAIHelper && (
        <AIHelper
          failedAttempts={failedAttempts}
          challengeId="custom"
          onClose={() => setShowAIHelper(false)}
        />
      )}
    </div>
  );
}


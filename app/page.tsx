"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Code2, Zap, Trophy, Target } from "lucide-react";
import { useStore } from "@/lib/store";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/path");
    }
  }, [isAuthenticated, router]);
  const features = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "Interactive Coding",
      description: "Learn by doing with real-time code execution and instant feedback",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Structured Path",
      description: "Follow a carefully designed curriculum from beginner to advanced",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Earn Rewards",
      description: "Unlock badges and level up as you master new skills",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Daily Challenges",
      description: "Build consistency with fresh challenges every day",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4"
      >
        <section className="min-h-screen flex flex-col justify-center items-center text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-8">
              <img src="/logo.svg" alt="CodeLearn" className="w-32 h-32 mx-auto mb-6" />
            </div>
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Modern Coding Education
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              Master Coding
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl">
              Learn programming through interactive challenges, structured lessons, and real-world projects
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg px-10">
                  Start Learning Free
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="text-lg px-10">
                  Log In
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        <section className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-200"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
}


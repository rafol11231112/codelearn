"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import HexNode from "./HexNode";
import Connector from "./Connector";
import LessonPopup from "./LessonPopup";
import { Button } from "@/components/ui/Button";
import { Sparkles } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string;
  level: number;
  xpReward: number;
  estimatedTime: number;
  status: "completed" | "current" | "locked";
  position: "left" | "center" | "right";
}

interface PathLayoutProps {
  lessons: Lesson[];
  onGenerateNew?: () => void;
}

export default function PathLayout({ lessons, onGenerateNew }: PathLayoutProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const positions: ("left" | "center" | "right")[] = ["center", "left", "right", "center", "right", "left"];

  return (
    <div className="relative w-full min-h-screen bg-background py-10 md:py-20">
      <div className="max-w-4xl mx-auto px-2 md:px-4">
        {/* Path Container */}
        <div className="relative flex flex-col items-center gap-2 md:gap-4">
          {lessons.map((lesson, index) => {
            const position = positions[index % positions.length];
            const nextPosition = index < lessons.length - 1 ? positions[(index + 1) % positions.length] : position;
            const showConnector = index < lessons.length - 1;
            const connectorActive = lesson.status === "completed";

            // Mobile: smaller offsets, Desktop: full offsets
            const leftOffset = position === "left" ? "-60px" : position === "right" ? "60px" : "0";
            const leftOffsetMd = position === "left" ? "-120px" : position === "right" ? "120px" : "0";

            return (
              <motion.div
                key={lesson.id}
                className="relative flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.02, 1), duration: 0.3 }}
              >
                {/* Node Container */}
                <div
                  className="relative z-10 transition-all duration-300"
                  style={{
                    marginLeft: leftOffset,
                  }}
                >
                  <style jsx>{`
                    @media (min-width: 768px) {
                      div {
                        margin-left: ${leftOffsetMd} !important;
                      }
                    }
                  `}</style>
                  
                  <HexNode
                    id={lesson.id}
                    title={lesson.title}
                    level={lesson.level}
                    status={lesson.status}
                    onClick={() => setSelectedLesson(lesson)}
                    position={position}
                  />
                  
                  {/* Title below node */}
                  {lesson.status !== "locked" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="absolute -bottom-12 md:-bottom-14 left-1/2 transform -translate-x-1/2 text-center w-24 md:w-32"
                    >
                      <p className="text-[10px] md:text-xs font-medium text-muted-foreground truncate">
                        {lesson.title}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Connector to next node */}
                {showConnector && (
                  <div
                    className="relative"
                    style={{
                      width: "150px",
                      height: "80px",
                      marginLeft: leftOffset,
                    }}
                  >
                    <style jsx>{`
                      @media (min-width: 768px) {
                        div {
                          width: 200px;
                          height: 120px;
                          margin-left: ${leftOffsetMd} !important;
                        }
                      }
                    `}</style>
                    <Connector
                      startPosition={position}
                      endPosition={nextPosition}
                      active={connectorActive}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* AI Generate New Lesson Button */}
        {onGenerateNew && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: lessons.length * 0.05 + 0.3 }}
            className="mt-12 text-center"
          >
            <Button
              onClick={onGenerateNew}
              size="lg"
              className="gap-2 shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              Generate New AI Lesson
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              AI will create a personalized lesson just for you
            </p>
          </motion.div>
        )}

        {/* End of path marker (if no generate button) */}
        {!onGenerateNew && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: lessons.length * 0.05 + 0.3 }}
            className="mt-12 text-center"
          >
            <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-blue-500/20 border-2 border-primary/30">
              <p className="text-sm font-semibold text-foreground">
                🎯 More lessons coming soon!
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Lesson Popup */}
      {selectedLesson && (
        <LessonPopup
          isOpen={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
          lesson={selectedLesson}
        />
      )}
    </div>
  );
}

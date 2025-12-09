"use client";

import { motion } from "framer-motion";
import { Lock, Check, Star, Code, Zap, Trophy, Target, Rocket, Brain, Award } from "lucide-react";

interface HexNodeProps {
  id: string;
  title: string;
  level: number;
  status: "completed" | "current" | "locked";
  onClick: () => void;
  position: "left" | "center" | "right";
}

const icons = [Code, Zap, Trophy, Target, Rocket, Brain, Award, Star];

export default function HexNode({ id, title, level, status, onClick, position }: HexNodeProps) {
  const Icon = icons[level % icons.length];
  
  const hexagonPath = "M50 5 L95 27.5 L95 72.5 L50 95 L5 72.5 L5 27.5 Z";
  
  const colors = {
    completed: {
      bg: "#22c55e",
      border: "#16a34a",
      shadow: "rgba(34, 197, 94, 0.4)",
    },
    current: {
      bg: "#3b82f6",
      border: "#2563eb",
      shadow: "rgba(59, 130, 246, 0.6)",
    },
    locked: {
      bg: "#6b7280",
      border: "#4b5563",
      shadow: "rgba(107, 114, 128, 0.2)",
    },
  };

  const color = colors[status];
  const isLocked = status === "locked";
  const isCurrent = status === "current";

  return (
    <motion.div
      className={`relative cursor-pointer ${isLocked ? "cursor-not-allowed" : ""}`}
      onClick={!isLocked ? onClick : undefined}
      whileHover={!isLocked ? { scale: 1.08 } : {}}
      whileTap={!isLocked ? { scale: 0.95 } : {}}
      transition={{ duration: 0.2 }}
      style={{
        filter: isCurrent ? `drop-shadow(0 0 20px ${color.shadow})` : `drop-shadow(0 4px 8px ${color.shadow})`,
      }}
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 100 100"
        className="relative md:w-[100px] md:h-[100px]"
      >
        {/* Base hexagon */}
        <path
          d={hexagonPath}
          fill={color.bg}
          stroke={color.border}
          strokeWidth="3"
        />
        
        {/* Pulse animation for current node */}
        {isCurrent && (
          <motion.path
            d={hexagonPath}
            fill="none"
            stroke={color.border}
            strokeWidth="2"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ transformOrigin: "50% 50%" }}
          />
        )}
      </svg>

      {/* Icon or status indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isLocked ? (
          <Lock className="w-8 h-8 text-white" />
        ) : status === "completed" ? (
          <Check className="w-10 h-10 text-white font-bold stroke-[3]" />
        ) : (
          <Icon className="w-9 h-9 text-white" />
        )}
      </div>

      {/* Level number */}
      {!isLocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-bold text-foreground"
        >
          {level}
        </motion.div>
      )}
    </motion.div>
  );
}

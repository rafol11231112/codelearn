"use client";

import { motion } from "framer-motion";

interface ConnectorProps {
  startPosition: "left" | "center" | "right";
  endPosition: "left" | "center" | "right";
  active: boolean;
}

export default function Connector({ startPosition, endPosition, active }: ConnectorProps) {
  const getStartX = (pos: string) => {
    if (pos === "left") return 50;
    if (pos === "right") return 50;
    return 50;
  };

  const getEndX = (pos: string) => {
    if (pos === "left") return -100;
    if (pos === "right") return 100;
    return 0;
  };

  const startX = getStartX(startPosition);
  const endX = getEndX(endPosition);
  
  // Create curved path
  const midY = 60;
  const controlPoint1X = startX + (endX - startX) * 0.3;
  const controlPoint1Y = 20;
  const controlPoint2X = startX + (endX - startX) * 0.7;
  const controlPoint2Y = 40;

  const pathD = `M ${startX} 0 
                 C ${controlPoint1X} ${controlPoint1Y}, 
                   ${controlPoint2X} ${controlPoint2Y}, 
                   ${50 + endX} ${midY}`;

  return (
    <svg
      className="absolute left-1/2 transform -translate-x-1/2"
      width="200"
      height="80"
      viewBox="0 0 200 80"
      style={{ top: "80px", zIndex: 0 }}
    >
      {/* Background line */}
      <path
        d={pathD}
        fill="none"
        stroke={active ? "#3b82f6" : "#e5e7eb"}
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Animated line for active connectors */}
      {active && (
        <motion.path
          d={pathD}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      )}
      
      {/* Dots animation for active connectors */}
      {active && (
        <>
          <motion.circle
            r="3"
            fill="#60a5fa"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <animateMotion dur="2s" repeatCount="indefinite">
              <mpath href={`#path-${startPosition}-${endPosition}`} />
            </animateMotion>
          </motion.circle>
          <path id={`path-${startPosition}-${endPosition}`} d={pathD} fill="none" />
        </>
      )}
    </svg>
  );
}

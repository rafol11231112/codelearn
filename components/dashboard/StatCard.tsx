"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

export function StatCard({ title, value, icon: Icon, color = "text-primary" }: StatCardProps) {
  const iconMap: { [key: string]: string } = {
    'Daily Streak': '/icons/fire-streak.svg',
    'Total XP': '/icons/trophy.svg',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl bg-primary/10 ${color}`}>
          {iconMap[title] ? (
            <img src={iconMap[title]} alt={title} className="w-6 h-6" />
          ) : (
            <Icon className="w-6 h-6" />
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </Card>
    </motion.div>
  );
}


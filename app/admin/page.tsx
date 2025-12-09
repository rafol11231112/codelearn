"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Users, BookOpen, Code, Trophy, TrendingUp, Activity } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user && !(user as any).isAdmin) {
      router.push("/dashboard");
      return;
    }

    fetchStats();
  }, [isAuthenticated, user, router]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const quickStats = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-500", href: "/admin/users" },
    { label: "Total Lessons", value: stats?.totalLessons || 0, icon: BookOpen, color: "text-green-500", href: "/admin/lessons" },
    { label: "Total Challenges", value: stats?.totalChallenges || 0, icon: Code, color: "text-purple-500", href: "/admin/challenges" },
    { label: "Active Users (7d)", value: stats?.activeUsers || 0, icon: Activity, color: "text-orange-500", href: "/admin/users" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your learning platform</p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Link key={index} href={stat.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card hover className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <TrendingUp className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/users">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-xl border-2 border-border hover:border-primary cursor-pointer transition-colors"
                >
                  <Users className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Manage Users</h3>
                  <p className="text-sm text-muted-foreground">View, edit, and manage user accounts</p>
                </motion.div>
              </Link>

              <Link href="/admin/lessons">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-xl border-2 border-border hover:border-primary cursor-pointer transition-colors"
                >
                  <BookOpen className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Manage Lessons</h3>
                  <p className="text-sm text-muted-foreground">Create, edit, and organize lessons</p>
                </motion.div>
              </Link>

              <Link href="/admin/challenges">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-xl border-2 border-border hover:border-primary cursor-pointer transition-colors"
                >
                  <Code className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Manage Challenges</h3>
                  <p className="text-sm text-muted-foreground">Create and modify coding challenges</p>
                </motion.div>
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {stats?.recentUsers?.slice(0, 5).map((user: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{user.username}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">Level {user.level}</p>
                    <p className="text-xs text-muted-foreground">{user.xp} XP</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

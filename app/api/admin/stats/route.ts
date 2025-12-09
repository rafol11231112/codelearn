import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Lesson from '@/models/Lesson';
import Challenge from '@/models/Challenge';
import { requireAdmin } from '@/lib/admin';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    await requireAdmin(token);

    const totalUsers = await User.countDocuments();
    const totalLessons = await Lesson.countDocuments();
    const totalChallenges = await Challenge.countDocuments();
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsers = await User.countDocuments({
      lastLoginDate: { $gte: sevenDaysAgo }
    });

    const recentUsers = await User.find()
      .sort({ joinedAt: -1 })
      .limit(10)
      .select('username email xp level joinedAt');

    const topUsers = await User.find()
      .sort({ xp: -1 })
      .limit(10)
      .select('username email xp level');

    return NextResponse.json({
      totalUsers,
      totalLessons,
      totalChallenges,
      activeUsers,
      recentUsers,
      topUsers,
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Unauthorized' },
      { status: 403 }
    );
  }
}

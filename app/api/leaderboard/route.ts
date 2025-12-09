import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const url = new URL(request.url);
    const filter = url.searchParams.get('filter') || 'global';

    let users;

    if (filter === 'weekly') {
      users = await User.find()
        .select('username avatar xp level weeklyXP completedChallenges')
        .sort({ weeklyXP: -1 })
        .limit(100);
    } else {
      users = await User.find()
        .select('username avatar xp level completedChallenges')
        .sort({ xp: -1 })
        .limit(100);
    }

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
      weeklyXP: user.weeklyXP,
      completedChallenges: user.completedChallenges.length,
    }));

    return NextResponse.json({ leaderboard });
  } catch (error: any) {
    console.error('Get leaderboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


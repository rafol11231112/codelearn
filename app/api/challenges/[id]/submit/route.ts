import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Challenge from '@/models/Challenge';
import { getUserFromToken } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.split(' ')[1];
    const userId = getUserFromToken(token);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { code } = await request.json();
    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const alreadyCompleted = user.completedChallenges.includes(id);

    if (!alreadyCompleted) {
      user.completedChallenges.push(id);
      user.xp += challenge.xpReward;
      
      const newLevel = Math.floor(user.xp / 100) + 1;
      if (newLevel > user.level) {
        user.level = newLevel;
      }

      await user.save();
    }

    return NextResponse.json({ 
      success: true, 
      xpEarned: alreadyCompleted ? 0 : challenge.xpReward,
      alreadyCompleted,
      user: {
        xp: user.xp,
        level: user.level,
      }
    });
  } catch (error: any) {
    console.error('Submit challenge error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


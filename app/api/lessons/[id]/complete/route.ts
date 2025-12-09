import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Lesson from '@/models/Lesson';
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
    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
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

    const alreadyCompleted = user.completedLessons.includes(id);

    if (!alreadyCompleted) {
      user.completedLessons.push(id);
      user.xp += lesson.xpReward;
      
      // Update currentLesson to unlock next one
      if (lesson.order >= user.currentLesson) {
        user.currentLesson = lesson.order + 1;
      }
      
      const newLevel = Math.floor(user.xp / 100) + 1;
      if (newLevel > user.level) {
        user.level = newLevel;
      }

      await user.save();
    }

    return NextResponse.json({ 
      success: true, 
      xpEarned: alreadyCompleted ? 0 : lesson.xpReward,
      alreadyCompleted,
      user: {
        xp: user.xp,
        level: user.level,
        currentLesson: user.currentLesson,
        completedLessons: user.completedLessons,
      }
    });
  } catch (error: any) {
    console.error('Complete lesson error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


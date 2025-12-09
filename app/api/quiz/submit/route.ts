import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getUserFromToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
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

    const { answers, score } = await request.json();

    let skillLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    
    if (score >= 80) {
      skillLevel = 'advanced';
    } else if (score >= 50) {
      skillLevel = 'intermediate';
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'onboardingQuiz.finished': true,
          'onboardingQuiz.score': score,
          'onboardingQuiz.answers': answers,
          'onboardingQuiz.skillLevel': skillLevel,
        },
        $inc: { xp: 50 }
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user, skillLevel });
  } catch (error: any) {
    console.error('Submit quiz error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


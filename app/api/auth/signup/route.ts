import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password, username } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email or username already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString());

    const userResponse = {
      _id: user._id,
      email: user.email,
      username: user.username,
      xp: user.xp,
      level: user.level,
      badges: user.badges,
      avatar: user.avatar,
      settings: user.settings,
      onboardingQuiz: user.onboardingQuiz,
      dailyStreak: user.dailyStreak,
      weeklyXP: user.weeklyXP,
    };

    return NextResponse.json({ token, user: userResponse }, { status: 201 });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    user.lastLoginDate = new Date();
    
    const lastLogin = new Date(user.lastLoginDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastLogin.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      user.dailyStreak += 1;
    } else if (diffDays > 1) {
      user.dailyStreak = 1;
    }

    await user.save();

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
      completedLessons: user.completedLessons,
      currentLesson: user.currentLesson,
      isAdmin: user.isAdmin || false,
    };

    return NextResponse.json({ token, user: userResponse });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


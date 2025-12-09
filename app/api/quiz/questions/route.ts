import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import QuizQuestion from '@/models/QuizQuestion';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const questions = await QuizQuestion.find().sort({ order: 1 });

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error('Get questions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


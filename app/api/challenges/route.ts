import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Challenge from '@/models/Challenge';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const challenges = await Challenge.find().sort({ order: 1 });

    return NextResponse.json({ challenges });
  } catch (error: any) {
    console.error('Get challenges error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


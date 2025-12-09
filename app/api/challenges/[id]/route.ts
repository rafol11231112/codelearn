import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Challenge from '@/models/Challenge';
import { obfuscateSolution } from '@/lib/encryption';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    const challengeData = {
      _id: challenge._id,
      title: challenge.title,
      description: challenge.description,
      lessonContent: challenge.lessonContent,
      examples: challenge.examples,
      difficulty: challenge.difficulty,
      xpReward: challenge.xpReward,
      starterCode: challenge.starterCode,
      hints: challenge.hints,
      language: challenge.language,
      tests: challenge.tests.map((test: any) => ({
        description: test.description,
        input: test.input,
      })),
      _s: obfuscateSolution(challenge.solution),
    };

    return NextResponse.json({ challenge: challengeData });
  } catch (error: any) {
    console.error('Get challenge error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


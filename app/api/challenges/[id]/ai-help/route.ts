import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Challenge from '@/models/Challenge';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const { type, failedAttempts } = await request.json();
    
    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (type === 'explanation') {
      let explanation;
      
      if (OPENAI_API_KEY) {
        const prompt = `A student is struggling with this coding challenge (${failedAttempts} failed attempts):

Challenge: ${challenge.title}
Description: ${challenge.description}
Language: ${challenge.language}
Difficulty: ${challenge.difficulty}

Generate a detailed, encouraging explanation (150 words) that:
- Breaks down the problem step-by-step
- Explains the key concept they might be missing
- Gives a clear approach without showing the exact code
- Is motivating and supportive

Return ONLY the explanation text, no JSON.`;

        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.7,
              max_tokens: 300,
            }),
          });

          const data = await response.json();
          explanation = data.choices[0].message.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        } catch (error) {
          explanation = getFallbackExplanation(challenge);
        }
      } else {
        explanation = getFallbackExplanation(challenge);
      }

      return NextResponse.json({ explanation });
    }

    if (type === 'solution') {
      return NextResponse.json({ 
        solution: challenge.solution,
        explanation: "Here's the complete solution. Take time to understand each line and how it solves the problem!"
      });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

  } catch (error: any) {
    console.error('AI help error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getFallbackExplanation(challenge: any) {
  return `Let's break this down!\n\nThis challenge is about ${challenge.tags[0]}. Here's the approach:\n\n1. Understand what the problem is asking\n2. Think about what ${challenge.language} features you need\n3. Start with the basic structure\n4. Test your code step by step\n\nKey concept: ${challenge.description}\n\nYou're on the right track! Try thinking about how to use ${challenge.tags.join(' and ')} to solve this. Don't give up - debugging is part of learning!`;
}


import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    const userId = getUserFromToken(token);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { topic } = await request.json();

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return NextResponse.json(generateFallbackLesson(topic));
    }

    const prompt = `Create a comprehensive programming lesson on: ${topic}

Generate a JSON object with this structure:
{
  "title": "Lesson title",
  "description": "One-sentence summary",
  "content": "Complete lesson content (300-400 words). Include:
    - What this concept is
    - Why it's important
    - How it works
    - Best practices
    - Common use cases",
  "examples": [
    {
      "code": "Code example",
      "explanation": "What it demonstrates"
    }
  ] (4 examples),
  "xpReward": number (20-50 based on complexity),
  "estimatedTime": number (10-20 minutes)
}

Make it beginner-friendly, comprehensive, and engaging.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an enthusiastic coding instructor creating educational content.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });

      const data = await response.json();
      let content = data.choices[0].message.content;
      
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      content = content.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '');
      
      const lesson = JSON.parse(content);

      return NextResponse.json({ lesson });

    } catch (error) {
      console.error('AI generation error:', error);
      return NextResponse.json(generateFallbackLesson(topic));
    }

  } catch (error: any) {
    console.error('Generate lesson error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateFallbackLesson(topic: string) {
  return {
    lesson: {
      title: `Learn ${topic}`,
      description: `Understanding ${topic} in programming`,
      content: `${topic} - A Key Programming Concept\n\nThis lesson covers ${topic} and how to use it effectively in your code.\n\nKey Points:\n• What ${topic} is and why it matters\n• How to implement it correctly\n• Common patterns and best practices\n• Real-world applications\n\nPractice this concept to master it!`,
      examples: [
        { code: `example_code = "${topic}"`, explanation: `Basic ${topic} usage` }
      ],
      xpReward: 30,
      estimatedTime: 15
    }
  };
}


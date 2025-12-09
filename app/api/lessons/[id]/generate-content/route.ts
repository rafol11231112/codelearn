import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lesson from '@/models/Lesson';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return NextResponse.json({
        enhancedContent: generateFallbackContent(lesson),
        codeExamples: generateFallbackExamples(lesson),
        practiceExercises: generateFallbackExercises(lesson)
      });
    }

    const prompt = `You are an expert coding instructor teaching ${lesson.title}.

Topic: ${lesson.title}
Description: ${lesson.description}
Current content: ${lesson.content}

Generate enhanced educational content in JSON format:
{
  "enhancedContent": "Comprehensive explanation (300-400 words) covering:
    - Clear introduction to the concept
    - Why it matters in programming
    - Step-by-step breakdown
    - Common mistakes to avoid
    - Real-world applications
    Make it conversational, encouraging, and beginner-friendly",
  "codeExamples": [
    {
      "title": "Example name",
      "code": "Complete code snippet",
      "explanation": "Line-by-line breakdown",
      "output": "What this produces"
    }
  ] (provide 4 diverse examples),
  "practiceExercises": [
    {
      "question": "Mini exercise question",
      "hint": "Helpful hint",
      "answer": "Brief answer"
    }
  ] (provide 3 quick exercises)
}

Focus on clarity, engagement, and practical understanding.`;

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
              content: 'You are an enthusiastic coding instructor who makes programming fun and accessible.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1200,
        }),
      });

      if (!response.ok) {
        throw new Error('AI generation failed');
      }

      const data = await response.json();
      let content = data.choices[0].message.content;
      
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      content = content.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '');
      
      const parsedContent = JSON.parse(content);

      return NextResponse.json(parsedContent);

    } catch (error) {
      return NextResponse.json({
        enhancedContent: generateFallbackContent(lesson),
        codeExamples: generateFallbackExamples(lesson),
        practiceExercises: generateFallbackExercises(lesson)
      });
    }

  } catch (error: any) {
    console.error('Generate lesson content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateFallbackContent(lesson: any) {
  return `${lesson.title}

${lesson.content}

This concept is fundamental to programming and will help you write better code. Take your time to understand it fully.

Key Takeaways:
• Practice makes perfect
• Experiment with different examples
• Don't be afraid to make mistakes
• Build on what you've learned

Keep coding!`;
}

function generateFallbackExamples(lesson: any) {
  return [
    {
      title: "Basic Example",
      code: "# Example code here",
      explanation: "This demonstrates the concept",
      output: "Example output"
    }
  ];
}

function generateFallbackExercises(lesson: any) {
  return [
    {
      question: "Try applying what you learned",
      hint: "Review the examples above",
      answer: "Practice with different values"
    }
  ];
}


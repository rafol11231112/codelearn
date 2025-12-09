import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, challenge } = await request.json();

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return NextResponse.json(validateBasic(code, challenge));
    }

    const prompt = `You are a coding instructor evaluating a student's solution.

Challenge: ${challenge.title}
Description: ${challenge.description}
Language: ${challenge.language}

Student's Code:
${code}

Analyze if the solution correctly solves the challenge and respond with JSON:
{
  "isCorrect": true/false,
  "feedback": "Detailed, encouraging explanation (100-150 words):
    - If CORRECT: Praise what they did well, explain why it works
    - If WRONG: Explain what's incorrect, what concept they're missing, guide them WITHOUT giving the answer",
  "testsPassed": number (0-2),
  "hints": "Specific hint to improve (if wrong)"
}

Be supportive and educational.`;

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
              content: 'You are an encouraging coding instructor providing constructive feedback.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.6,
          max_tokens: 400,
        }),
      });

      const data = await response.json();
      let content = data.choices[0].message.content;
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const result = JSON.parse(content);
      return NextResponse.json(result);

    } catch (error) {
      return NextResponse.json(validateBasic(code, challenge));
    }

  } catch (error: any) {
    console.error('Validate custom error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function validateBasic(code: string, challenge: any) {
  if (!code || code.trim().length < 5) {
    return {
      isCorrect: false,
      feedback: "You need to write some code first! Don't leave the editor empty. Take a look at the lesson content and examples to get started.",
      testsPassed: 0,
      hints: "Start by writing the basic structure shown in the examples"
    };
  }

  return {
    isCorrect: false,
    feedback: "Your solution needs some work. Make sure you're addressing all parts of the challenge. Review the examples and hints to guide your approach. Remember to test your logic step by step!",
    testsPassed: 0,
    hints: "Check the lesson content and try to apply the concepts shown in the examples"
  };
}


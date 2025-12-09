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
    const { code } = await request.json();
    
    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return NextResponse.json(validateWithoutAI(code, challenge));
    }

    const prompt = `You are a coding instructor evaluating a student's solution.

Challenge: ${challenge.title}
Description: ${challenge.description}
Language: ${challenge.language}
Expected Solution: ${challenge.solution}

Student's Code:
${code}

Analyze the student's code and respond with JSON:
{
  "isCorrect": true/false,
  "feedback": "Detailed explanation (100-150 words):
    - If CORRECT: Praise their work, explain why it's good, mention what they did well
    - If WRONG: Explain what's wrong, what they're missing, guide them toward the solution WITHOUT giving it away",
  "testsPassed": number (0-2, estimate how many tests would pass),
  "hints": "One specific hint to fix the issue (if wrong)"
}

Be encouraging and educational. Focus on learning, not just correctness.`;

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
              content: 'You are an encouraging coding instructor who provides constructive feedback.'
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
      console.error('AI validation error:', error);
      return NextResponse.json(validateWithoutAI(code, challenge));
    }

  } catch (error: any) {
    console.error('Validate error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function validateWithoutAI(code: string, challenge: any) {
  const codeSimplified = code.toLowerCase().replace(/\s+/g, '');
  const solutionSimplified = challenge.solution.toLowerCase().replace(/\s+/g, '');
  
  const similarity = calculateSimilarity(codeSimplified, solutionSimplified);
  const isCorrect = similarity > 0.7;
  
  if (isCorrect) {
    return {
      isCorrect: true,
      feedback: "Great job! Your solution works correctly. You've successfully solved this challenge. Keep up the excellent work!",
      testsPassed: 2,
      hints: ""
    };
  }
  
  const hasKeywords = checkKeywords(code, challenge);
  
  if (!hasKeywords.hasPrint && challenge.tags.includes('print')) {
    return {
      isCorrect: false,
      feedback: "Your code is missing the print() function. Remember, you need to use print() to display output to the console. Review the examples and try again!",
      testsPassed: 0,
      hints: "Make sure to use the print() function to display your output"
    };
  }
  
  if (!hasKeywords.hasFunction && challenge.tags.includes('functions')) {
    return {
      isCorrect: false,
      feedback: "This challenge requires you to define a function. Make sure you're using the 'def' keyword to create your function. Check the lesson content for the correct syntax!",
      testsPassed: 0,
      hints: "Define a function using: def function_name(parameters):"
    };
  }
  
  if (similarity > 0.4) {
    return {
      isCorrect: false,
      feedback: "You're on the right track! Your solution is partially correct, but there are some issues. Double-check your logic, syntax, and make sure you're handling all the requirements. You're close!",
      testsPassed: 1,
      hints: "Review your code carefully - you're almost there!"
    };
  }
  
  return {
    isCorrect: false,
    feedback: "Your solution isn't quite right yet. Take another look at the challenge description and the examples provided. Make sure you understand what the problem is asking for, then try breaking it down into smaller steps.",
    testsPassed: 0,
    hints: "Go back to the lesson content and examples to better understand the concept"
  };
}

function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

function checkKeywords(code: string, challenge: any) {
  const codeLower = code.toLowerCase();
  
  return {
    hasPrint: codeLower.includes('print('),
    hasFunction: codeLower.includes('def ') || codeLower.includes('function '),
    hasReturn: codeLower.includes('return'),
    hasLoop: codeLower.includes('for ') || codeLower.includes('while '),
    hasIf: codeLower.includes('if '),
  };
}


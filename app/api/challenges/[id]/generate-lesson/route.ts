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
    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    const prompt = `You are an expert coding instructor. Generate comprehensive educational content for this coding challenge:

Title: ${challenge.title}
Description: ${challenge.description}
Difficulty: ${challenge.difficulty}
Language: ${challenge.language}
Topic: ${challenge.tags.join(', ')}

CRITICAL: The examples must teach the CONCEPT but NOT solve the exact challenge. Examples should be RELATED but DIFFERENT scenarios.

Generate the following in JSON format:
{
  "lessonContent": "A detailed explanation of the concept (200-300 words). Include:
    - What this concept is and how it works
    - Why it's important in programming
    - Key syntax and rules
    - Best practices
    - Real-world use cases",
  "examples": [
    {
      "code": "Example code - RELATED concept but DIFFERENT problem",
      "explanation": "What this example teaches (NOT the actual challenge)"
    }
  ] (provide 3 examples that teach the concept WITHOUT solving the challenge),
  "hints": [
    "Hint 1: Conceptual guidance (what approach to use)",
    "Hint 2: More specific (mention relevant syntax/methods)",
    "Hint 3: Strong hint (almost the structure, but not the exact code)"
  ]
}

IMPORTANT: 
- Examples must be DIFFERENT problems using the SAME concept
- Do NOT show the exact solution
- Teach the building blocks, let students apply them
- Make it beginner-friendly and encouraging`;

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      return NextResponse.json({
        lessonContent: generateFallbackContent(challenge),
        examples: generateFallbackExamples(challenge),
        hints: challenge.hints || [
          "Think about the problem step by step",
          "Consider the data types involved",
          "Try breaking it into smaller parts"
        ]
      });
    }

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
            content: 'You are an expert coding instructor who creates clear, beginner-friendly educational content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
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

  } catch (error: any) {
    console.error('Generate lesson error:', error);
    
    const { id } = await params;
    const challenge = await Challenge.findById(id);
    
    return NextResponse.json({
      lessonContent: generateFallbackContent(challenge),
      examples: generateFallbackExamples(challenge),
      hints: challenge?.hints || [
        "Break the problem into smaller steps",
        "Consider edge cases",
        "Test with simple examples first"
      ]
    });
  }
}

function generateFallbackContent(challenge: any) {
  const topic = challenge?.title || 'this concept';
  const difficulty = challenge?.difficulty || 'Easy';
  
  return `Understanding ${topic}

This ${difficulty.toLowerCase()} challenge focuses on ${topic.toLowerCase()}. This concept is fundamental in programming and will help you build stronger coding skills.

Key Points:
• Master the basic syntax and structure
• Understand when and why to use this approach
• Practice with different examples
• Apply best practices for clean code

Why This Matters:
This concept appears frequently in real-world programming. Understanding it well will make you a more effective developer and help you solve problems more efficiently.

Best Practices:
• Write clean, readable code
• Test your solution with different inputs
• Think about edge cases
• Comment your code when necessary

Common Use Cases:
This technique is commonly used in data processing, automation, web development, and algorithm design.`;
}

function generateFallbackExamples(challenge: any) {
  const lang = challenge?.language || 'python';
  
  if (lang === 'python') {
    return [
      {
        code: 'x = 10\nprint(x)',
        explanation: 'Basic variable assignment and output'
      },
      {
        code: 'def greet(name):\n    return f"Hello, {name}"',
        explanation: 'Function that returns a formatted string'
      },
      {
        code: 'for i in range(5):\n    print(i)',
        explanation: 'Loop that prints numbers 0 through 4'
      }
    ];
  }
  
  return [
    {
      code: 'let x = 10;\nconsole.log(x);',
      explanation: 'Variable declaration and logging'
    },
    {
      code: 'const greet = (name) => `Hello, ${name}`;',
      explanation: 'Arrow function with string interpolation'
    },
    {
      code: 'for (let i = 0; i < 5; i++) {\n  console.log(i);\n}',
      explanation: 'Loop that logs numbers 0 through 4'
    }
  ];
}


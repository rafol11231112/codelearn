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

    const { topic, difficulty, language } = await request.json();

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return NextResponse.json(generateFallbackChallenge(topic, difficulty, language));
    }

    const prompt = `You are an expert coding instructor. A student wants to learn about: "${topic}"

Create a comprehensive, educational coding challenge in ${language || 'python'} at ${difficulty || 'Medium'} difficulty.

Generate a JSON object with this EXACT structure:
{
  "title": "Descriptive title about ${topic}",
  "description": "What the student will build/solve (be specific, not generic)",
  "lessonContent": "COMPREHENSIVE explanation (250-300 words):
    - What ${topic} is and why it matters
    - How it works step-by-step
    - Syntax and key concepts
    - Common use cases
    - Best practices
    Make it clear, beginner-friendly, and thorough.",
  "examples": [
    {
      "code": "Complete working code example",
      "explanation": "Detailed line-by-line breakdown"
    }
  ] (provide 3 DIFFERENT examples that teach ${topic} but DON'T solve the challenge),
  "starterCode": "Helpful starter template (not empty, give structure)",
  "hints": [
    "Conceptual hint about approach",
    "Specific syntax/method hint", 
    "Almost-complete hint"
  ],
  "difficulty": "${difficulty || 'Medium'}",
  "xpReward": ${difficulty === 'Easy' ? 20 : difficulty === 'Hard' ? 80 : 45},
  "language": "${language || 'python'}",
  "tags": ["${topic}", "custom", "${difficulty?.toLowerCase() || 'medium'}"]
}

CRITICAL:
- Teach ${topic} thoroughly before the challenge
- Examples must be DIFFERENT from the actual challenge
- Make it educational, not just a puzzle
- Starter code should guide but not solve`;

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
              content: 'You are an expert coding instructor who creates educational challenges.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 1500,
        }),
      });

      const data = await response.json();
      let content = data.choices[0].message.content;
      
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      content = content.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '');
      
      const challenge = JSON.parse(content);

      return NextResponse.json({ challenge });

    } catch (error) {
      console.error('AI generation error:', error);
      return NextResponse.json(generateFallbackChallenge(topic, difficulty, language));
    }

  } catch (error: any) {
    console.error('Generate challenge error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateFallbackChallenge(topic: string, difficulty: string, language: string) {
  const difficultyXP: any = { Easy: 20, Medium: 40, Hard: 80 };
  const lang = language || 'python';
  
  const topicSpecificContent: any = {
    'print': {
      title: 'Master the Print Function',
      description: 'Learn how to display output in Python using the print() function. Create a program that prints multiple lines of text.',
      lesson: 'The print() Function in Python\n\nThe print() function is your primary tool for displaying information to users. It takes any data and shows it on the screen.\n\nSyntax:\nprint("your message")\nprint(variable)\nprint("text", variable, "more text")\n\nKey Features:\n• Automatically adds a new line after each print\n• Can print multiple items separated by spaces\n• Converts non-string types to strings automatically\n• Essential for debugging and user interaction\n\nThe print() function accepts any number of arguments and displays them separated by spaces.',
      examples: [
        { code: 'print("Hello, World!")', explanation: 'Prints a simple text message' },
        { code: 'name = "Alice"\nprint("Welcome,", name)', explanation: 'Prints text combined with a variable' },
        { code: 'age = 25\nprint("Age:", age)', explanation: 'Prints a label and number together' }
      ],
      starterCode: 'name = "Your Name"\n\n',
      hints: [
        'Use print() to display text - put your message in quotes',
        'You can print multiple things: print("Hello", name)',
        'Structure: print("your message here")'
      ]
    },
    'variables': {
      title: 'Working with Variables',
      description: 'Master variable creation and usage. Create variables to store different types of data.',
      lesson: 'Variables in Python\n\nVariables are named containers that store data. Think of them as labeled boxes where you put information.\n\nCreating Variables:\nvariable_name = value\n\nPython automatically determines the type:\nage = 25  # integer\nprice = 19.99  # float\nname = "Alice"  # string\nis_active = True  # boolean\n\nNaming Rules:\n• Use letters, numbers, underscores\n• Start with letter or underscore\n• Case-sensitive (age ≠ Age)\n• Use snake_case for multiple words',
      examples: [
        { code: 'score = 100\nprint(score)', explanation: 'Creates and displays a number variable' },
        { code: 'first_name = "John"\nlast_name = "Doe"\nfull_name = first_name + " " + last_name', explanation: 'Combines string variables' },
        { code: 'x = 5\ny = 3\ntotal = x + y\nprint(total)', explanation: 'Uses variables in calculations' }
      ],
      starterCode: '\n\n',
      hints: [
        'Create a variable with: variable_name = value',
        'Strings need quotes, numbers do not',
        'Use descriptive names like age, not just x'
      ]
    }
  };

  const specific = topicSpecificContent[topic.toLowerCase()] || topicSpecificContent[topic.toLowerCase().replace(/[()]/g, '')];
  
  if (specific) {
    return {
      challenge: {
        title: specific.title,
        description: specific.description,
        lessonContent: specific.lesson,
        examples: specific.examples,
        starterCode: specific.starterCode,
        hints: specific.hints,
        difficulty: difficulty || 'Easy',
        xpReward: difficultyXP[difficulty] || 20,
        language: lang,
        tags: [topic.toLowerCase(), 'custom']
      }
    };
  }
  
  return {
    challenge: {
      title: `Learn ${topic}`,
      description: `Master ${topic} by solving this practical challenge using ${lang}.`,
      lessonContent: `Understanding ${topic}\n\nThis challenge will help you learn ${topic}, an important concept in programming.\n\nWhat You'll Learn:\n• Core principles of ${topic}\n• How to implement it in code\n• Common patterns and approaches\n• When to use ${topic}\n\nApproach:\n1. Read the problem carefully\n2. Think about the steps needed\n3. Write your code incrementally\n4. Test with different inputs\n\nDon't rush - understanding is more important than speed!`,
      examples: [
        {
          code: lang === 'python' ? `def example():\n    return "result"` : `function example() {\n  return "result";\n}`,
          explanation: `Basic function structure in ${lang}`
        }
      ],
      starterCode: lang === 'python' ? `def solution():\n    pass\n\n` : `function solution() {\n  \n}\n\n`,
      hints: [
        `Start by understanding what ${topic} requires`,
        `Think about the ${lang} syntax for ${topic}`,
        `Break it down: what's the first step?`
      ],
      difficulty: difficulty || 'Medium',
      xpReward: difficultyXP[difficulty] || 40,
      language: lang,
      tags: [topic.toLowerCase(), 'custom', difficulty?.toLowerCase() || 'medium']
    }
  };
}


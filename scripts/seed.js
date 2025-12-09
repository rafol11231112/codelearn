const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codelearn';

console.log('Connecting to:', MONGODB_URI.substring(0, 30) + '...');

const sectionSchema = new mongoose.Schema({
  title: String,
  description: String,
  order: Number,
  icon: String,
  color: String,
  unlockXPRequired: Number,
});

const lessonSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  xpReward: Number,
  order: Number,
  sectionId: mongoose.Schema.Types.ObjectId,
  exercises: Array,
  estimatedTime: Number,
});

const challengeSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String,
  xpReward: Number,
  starterCode: String,
  solution: String,
  tests: Array,
  tags: [String],
  language: String,
  hints: [String],
  unlockXPRequired: Number,
  order: Number,
});

const quizQuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
  order: Number,
  category: String,
});

const Section = mongoose.models.Section || mongoose.model('Section', sectionSchema);
const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);
const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', challengeSchema);
const QuizQuestion = mongoose.models.QuizQuestion || mongoose.model('QuizQuestion', quizQuestionSchema);

const quizQuestions = [
  {
    question: "What is your current coding experience?",
    options: [
      "Complete beginner - never coded before",
      "Some experience - basics only",
      "Intermediate - built a few projects",
      "Advanced - professional experience"
    ],
    correctAnswer: 0,
    order: 1,
    category: "experience"
  },
  {
    question: "Which programming language would you like to learn?",
    options: [
      "Python - great for beginners",
      "JavaScript - for web development",
      "Both Python and JavaScript",
      "Other languages"
    ],
    correctAnswer: 2,
    order: 2,
    category: "goals"
  },
  {
    question: "How much time can you dedicate to learning daily?",
    options: [
      "15-30 minutes",
      "30-60 minutes",
      "1-2 hours",
      "2+ hours"
    ],
    correctAnswer: 1,
    order: 3,
    category: "commitment"
  },
  {
    question: "What is your main learning goal?",
    options: [
      "Build a career in tech",
      "Create personal projects",
      "Learn for fun/hobby",
      "Improve existing skills"
    ],
    correctAnswer: 0,
    order: 4,
    category: "goals"
  },
  {
    question: "What type of projects interest you most?",
    options: [
      "Websites and web apps",
      "Data analysis and automation",
      "Mobile apps",
      "Games and graphics"
    ],
    correctAnswer: 0,
    order: 5,
    category: "interests"
  },
  {
    question: "How do you learn best?",
    options: [
      "Hands-on coding challenges",
      "Video tutorials and reading",
      "Building real projects",
      "Mix of everything"
    ],
    correctAnswer: 3,
    order: 6,
    category: "learning-style"
  }
];

const sections = [
  {
    title: "Python Fundamentals",
    description: "Learn the basics of Python programming",
    order: 1,
    icon: "🐍",
    color: "#3776AB",
    unlockXPRequired: 0,
  },
  {
    title: "JavaScript Essentials",
    description: "Master JavaScript from scratch",
    order: 2,
    icon: "⚡",
    color: "#F7DF1E",
    unlockXPRequired: 100,
  },
  {
    title: "Web Development",
    description: "Build modern web applications",
    order: 3,
    icon: "🌐",
    color: "#E34F26",
    unlockXPRequired: 0,
  },
];

const pythonChallenges = [
  {
    title: "Print Your Name",
    description: "Write a program that prints your full name on one line.",
    lessonContent: "",
    examples: [],
    difficulty: "Easy",
    xpReward: 10,
    starterCode: ``,
    solution: `print("John Doe")`,
    tests: [
      { input: null, expectedOutput: "John Doe", description: "Should print a name" }
    ],
    tags: ["basics", "print"],
    language: "python",
    hints: [],
    unlockXPRequired: 0,
    order: 1,
  },
  {
    title: "Store Your Age",
    description: "Create a variable called 'age' and set it to your age, then print it.",
    lessonContent: "",
    examples: [],
    difficulty: "Easy",
    xpReward: 12,
    starterCode: ``,
    solution: `age = 25\nprint(age)`,
    tests: [
      { input: null, expectedOutput: "25", description: "Should store and print age" }
    ],
    tags: ["variables", "basics"],
    language: "python",
    hints: [],
    unlockXPRequired: 0,
    order: 2,
  },
  {
    title: "Calculate Rectangle Area",
    description: "Given width=5 and height=8, calculate and print the area (width * height).",
    lessonContent: "",
    examples: [],
    difficulty: "Easy",
    xpReward: 15,
    starterCode: `width = 5\nheight = 8\n\n`,
    solution: `width = 5\nheight = 8\narea = width * height\nprint(area)`,
    tests: [
      { input: null, expectedOutput: "40", description: "Should calculate 5 * 8 = 40" }
    ],
    tags: ["math", "variables"],
    language: "python",
    hints: [],
    unlockXPRequired: 0,
    order: 3,
  },
  {
    title: "Greet a User",
    description: "Create a variable 'name' with any name, then print 'Hello, [name]!'",
    lessonContent: "",
    examples: [],
    difficulty: "Easy",
    xpReward: 15,
    starterCode: ``,
    solution: `name = 'Alice'\nprint('Hello, ' + name + '!')`,
    tests: [
      { input: null, expectedOutput: "Hello, Alice!", description: "Should greet Alice" }
    ],
    tags: ["strings", "concatenation"],
    language: "python",
    hints: [],
    unlockXPRequired: 0,
    order: 4,
  },
  {
    title: "Temperature Converter",
    description: "Convert 100 degrees Fahrenheit to Celsius using the formula: C = (F - 32) * 5/9",
    lessonContent: "",
    examples: [],
    difficulty: "Easy",
    xpReward: 18,
    starterCode: `fahrenheit = 100\n\n`,
    solution: `fahrenheit = 100\ncelsius = (fahrenheit - 32) * 5/9\nprint(celsius)`,
    tests: [
      { input: null, expectedOutput: "37.77777777777778", description: "100°F = 37.78°C" }
    ],
    tags: ["math", "formulas"],
    language: "python",
    hints: [],
    unlockXPRequired: 0,
    order: 5,
  },
  {
    title: "Count String Length",
    description: "Create a variable 'word' with 'Python', then print how many characters it has.",
    lessonContent: "",
    examples: [],
    difficulty: "Easy",
    xpReward: 18,
    starterCode: `word = 'Python'\n\n`,
    solution: `word = 'Python'\nprint(len(word))`,
    tests: [
      { input: null, expectedOutput: "6", description: "'Python' has 6 characters" }
    ],
    tags: ["strings", "functions"],
    language: "python",
    hints: [],
    unlockXPRequired: 0,
    order: 6,
  },
  {
    title: "Check if Even",
    description: "Given number=10, check if it's even (divisible by 2) and print True or False.",
    lessonContent: "",
    examples: [],
    difficulty: "Easy",
    xpReward: 20,
    starterCode: `number = 10\n\n`,
    solution: `number = 10\nis_even = number % 2 == 0\nprint(is_even)`,
    tests: [
      { input: null, expectedOutput: "True", description: "10 is even" }
    ],
    tags: ["logic", "modulus"],
    language: "python",
    hints: [],
    unlockXPRequired: 50,
    order: 7,
  },
  {
    title: "Find Greater Number",
    description: "Given a=15 and b=20, print which number is greater.",
    lessonContent: "",
    examples: [],
    difficulty: "Easy",
    xpReward: 20,
    starterCode: `a = 15\nb = 20\n\n`,
    solution: `a = 15\nb = 20\nif a > b:\n    print(a)\nelse:\n    print(b)`,
    tests: [
      { input: null, expectedOutput: "20", description: "20 is greater than 15" }
    ],
    tags: ["conditionals", "comparison"],
    language: "python",
    hints: [],
    unlockXPRequired: 50,
    order: 8,
  },
  {
    title: "Repeat a Word",
    description: "Print the word 'Hello' 5 times (each on a new line) using a loop.",
    lessonContent: "",
    examples: [],
    difficulty: "Easy",
    xpReward: 22,
    starterCode: ``,
    solution: `for i in range(5):\n    print('Hello')`,
    tests: [
      { input: null, expectedOutput: "Hello\nHello\nHello\nHello\nHello", description: "5 Hellos" }
    ],
    tags: ["loops", "for-loop"],
    language: "python",
    hints: [],
    unlockXPRequired: 100,
    order: 9,
  },
  {
    title: "Sum First 5 Numbers",
    description: "Calculate the sum of numbers 1 through 5 (1+2+3+4+5) and print it.",
    lessonContent: "",
    examples: [],
    difficulty: "Easy",
    xpReward: 25,
    starterCode: ``,
    solution: `total = 0\nfor i in range(1, 6):\n    total += i\nprint(total)`,
    tests: [
      { input: null, expectedOutput: "15", description: "1+2+3+4+5 = 15" }
    ],
    tags: ["loops", "math"],
    language: "python",
    hints: [],
    unlockXPRequired: 100,
    order: 10,
  },
  {
    title: "Create a List of Colors",
    description: "Create a list called 'colors' with 'red', 'blue', 'green' and print it.",
    lessonContent: "",
    examples: [],
    difficulty: "Easy",
    xpReward: 20,
    starterCode: ``,
    solution: `colors = ['red', 'blue', 'green']\nprint(colors)`,
    tests: [
      { input: null, expectedOutput: "['red', 'blue', 'green']", description: "List of 3 colors" }
    ],
    tags: ["lists", "data-structures"],
    language: "python",
    hints: [],
    unlockXPRequired: 150,
    order: 11,
  },
  {
    title: "Access List Item",
    description: "Given list fruits = ['apple', 'banana', 'orange'], print the second item.",
    lessonContent: "",
    examples: [],
    difficulty: "Easy",
    xpReward: 22,
    starterCode: `fruits = ['apple', 'banana', 'orange']\n\n`,
    solution: `fruits = ['apple', 'banana', 'orange']\nprint(fruits[1])`,
    tests: [
      { input: null, expectedOutput: "banana", description: "Second item (index 1)" }
    ],
    tags: ["lists", "indexing"],
    language: "python",
    hints: [],
    unlockXPRequired: 150,
    order: 12,
  },
  {
    title: "Count List Items",
    description: "Given list numbers = [10, 20, 30, 40, 50], print how many items are in it.",
    lessonContent: "",
    examples: [],
    difficulty: "Easy",
    xpReward: 22,
    starterCode: `numbers = [10, 20, 30, 40, 50]\n\n`,
    solution: `numbers = [10, 20, 30, 40, 50]\nprint(len(numbers))`,
    tests: [
      { input: null, expectedOutput: "5", description: "List has 5 items" }
    ],
    tags: ["lists", "functions"],
    language: "python",
    hints: [],
    unlockXPRequired: 150,
    order: 13,
  },
  {
    title: "Multiply Function",
    description: "Create a function called 'multiply' that takes two numbers and returns their product.",
    lessonContent: "",
    examples: [],
    difficulty: "Medium",
    xpReward: 30,
    starterCode: `\n\nresult = multiply(4, 7)\nprint(result)`,
    solution: `def multiply(a, b):\n    return a * b\n\nresult = multiply(4, 7)\nprint(result)`,
    tests: [
      { input: [4, 7], expectedOutput: "28", description: "4 * 7 = 28" }
    ],
    tags: ["functions", "math"],
    language: "python",
    hints: [],
    unlockXPRequired: 200,
    order: 14,
  },
  {
    title: "Is Adult Function",
    description: "Create a function 'is_adult' that takes age and returns True if age >= 18, False otherwise.",
    lessonContent: "",
    examples: [],
    difficulty: "Medium",
    xpReward: 30,
    starterCode: `\n\nprint(is_adult(20))\nprint(is_adult(15))`,
    solution: `def is_adult(age):\n    return age >= 18\n\nprint(is_adult(20))\nprint(is_adult(15))`,
    tests: [
      { input: 20, expectedOutput: "True", description: "20 >= 18 is True" },
      { input: 15, expectedOutput: "False", description: "15 < 18 is False" }
    ],
    tags: ["functions", "conditionals"],
    language: "python",
    hints: [],
    unlockXPRequired: 200,
    order: 15,
  },
  {
    title: "Count Vowels",
    description: "Create a function that counts how many vowels (a,e,i,o,u) are in the string 'hello'.",
    lessonContent: "",
    examples: [],
    difficulty: "Medium",
    xpReward: 35,
    starterCode: ``,
    solution: `def count_vowels(text):\n    count = 0\n    for char in text:\n        if char in 'aeiou':\n            count += 1\n    return count\n\nprint(count_vowels('hello'))`,
    tests: [
      { input: "hello", expectedOutput: "2", description: "'hello' has 2 vowels (e, o)" }
    ],
    tags: ["strings", "loops", "functions"],
    language: "python",
    hints: [],
    unlockXPRequired: 250,
    order: 16,
  },
  {
    title: "Reverse a String",
    description: "Create a function that reverses the string 'Python' to 'nohtyP'.",
    lessonContent: "",
    examples: [],
    difficulty: "Medium",
    xpReward: 35,
    starterCode: ``,
    solution: `def reverse_string(text):\n    return text[::-1]\n\nprint(reverse_string('Python'))`,
    tests: [
      { input: "Python", expectedOutput: "nohtyP", description: "Reversed 'Python'" }
    ],
    tags: ["strings", "slicing"],
    language: "python",
    hints: [],
    unlockXPRequired: 250,
    order: 17,
  },
  {
    title: "Find Maximum in List",
    description: "Create a function that finds the largest number in the list [3, 7, 2, 9, 1].",
    lessonContent: "",
    examples: [],
    difficulty: "Medium",
    xpReward: 40,
    starterCode: ``,
    solution: `def find_max(numbers):\n    return max(numbers)\n\nprint(find_max([3, 7, 2, 9, 1]))`,
    tests: [
      { input: [3, 7, 2, 9, 1], expectedOutput: "9", description: "9 is the largest" }
    ],
    tags: ["lists", "functions"],
    language: "python",
    hints: [],
    unlockXPRequired: 300,
    order: 18,
  },
  {
    title: "Fibonacci Sequence",
    description: "Create a function that returns the first 7 Fibonacci numbers [0, 1, 1, 2, 3, 5, 8].",
    lessonContent: "",
    examples: [],
    difficulty: "Hard",
    xpReward: 50,
    starterCode: ``,
    solution: `def fibonacci(n):\n    fib = [0, 1]\n    for i in range(2, n):\n        fib.append(fib[i-1] + fib[i-2])\n    return fib\n\nprint(fibonacci(7))`,
    tests: [
      { input: 7, expectedOutput: "[0, 1, 1, 2, 3, 5, 8]", description: "First 7 Fibonacci" }
    ],
    tags: ["algorithms", "loops", "lists"],
    language: "python",
    hints: [],
    unlockXPRequired: 400,
    order: 19,
  },
  {
    title: "Prime Number Checker",
    description: "Create a function that checks if 17 is a prime number (returns True).",
    lessonContent: "",
    examples: [],
    difficulty: "Hard",
    xpReward: 50,
    starterCode: ``,
    solution: `def is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n ** 0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nprint(is_prime(17))`,
    tests: [
      { input: 17, expectedOutput: "True", description: "17 is prime" }
    ],
    tags: ["algorithms", "math", "loops"],
    language: "python",
    hints: [],
    unlockXPRequired: 450,
    order: 20,
  }
];

const oldChallenges = [
  {
    title: "Python Print Function",
    description: "Learn how to display output in Python using the print() function.",
    lessonContent: `The Print Function

The print() function in Python is used to display information on the screen.

Key Points:
• Displays text, numbers, or variables
• Text must be enclosed in quotes (single ' or double ")
• Can print multiple items separated by commas
• Automatically adds a new line after printing

Syntax:
print("your text here")

The print() function is one of the most basic and important functions in Python. It allows you to see the output of your code and is essential for debugging and user interaction.`,
    examples: [
      {
        code: 'print("Hello, World!")',
        explanation: 'Prints the text "Hello, World!" to the console'
      },
      {
        code: 'print(42)',
        explanation: 'Prints the number 42 (numbers don\'t need quotes)'
      },
      {
        code: 'print("Hello", "World")',
        explanation: 'Prints multiple items: Hello World'
      }
    ],
    difficulty: "Easy",
    xpReward: 10,
    starterCode: `# Write code that prints "Hello, World!" to the console\n# Replace the ? with your code\n\n?`,
    solution: `print("Hello, World!")`,
    tests: [
      { input: null, expectedOutput: "Hello, World!", description: "Should print 'Hello, World!'" }
    ],
    tags: ["basics", "print", "output"],
    language: "python",
    hints: [
      "Use the print() function to display output",
      "Text must be inside quotes: print(\"your text\")",
      "Make sure to spell 'Hello, World!' exactly as shown, including the comma and capital letters"
    ],
    unlockXPRequired: 0,
    order: 1,
  },
  {
    title: "Variables in Python",
    description: "Learn how to store and work with data using variables.",
    lessonContent: `Variables in Python

Variables are containers that hold data values. They allow you to store, manipulate, and display information throughout your program.

Key Concepts:
• Variables have a unique name and a value
• Python automatically detects the variable type
• Variable names should be descriptive
• Use = to assign a value to a variable

Variable Initialization Format:
variable_name = value

Number Types:
• int: Integers (whole numbers like 1, -2, 42)
• float: Real numbers (decimals like 1.32, 0.98, 3.14)

Variables make your code flexible and reusable. Instead of hardcoding values, you store them in variables and use the variable name.`,
    examples: [
      {
        code: 'a = 3',
        explanation: 'Creates a variable named "a" with integer value 3'
      },
      {
        code: 'b = 13.2',
        explanation: 'Creates a variable named "b" with float value 13.2'
      },
      {
        code: 'name = "Alice"\nprint(name)',
        explanation: 'Stores text in a variable and prints it'
      }
    ],
    difficulty: "Easy",
    xpReward: 15,
    starterCode: `# Write code that initializes a variable named var with the value 5\n# Replace the ? with the correct value\n# Lines starting with # are comments - they explain but don't run\n# Only change the line that says var = ?\n\nvar = ?`,
    solution: `var = 5`,
    tests: [
      { input: null, expectedOutput: 5, description: "var should equal 5" }
    ],
    tags: ["basics", "variables", "numbers"],
    language: "python",
    hints: [
      "Variables are created using the format: variable_name = value",
      "You need to set var equal to the number 5",
      "Don't use quotes - 5 is a number, not text. Just write: var = 5"
    ],
    unlockXPRequired: 0,
    order: 2,
  },
  {
    title: "Functions in Python",
    description: "Learn how to create reusable blocks of code with functions.",
    lessonContent: `Python Functions

Functions are reusable blocks of code that perform specific tasks. They help organize your code and avoid repetition.

Function Structure:
def function_name(parameters):
    # code to execute
    return result

Key Concepts:
• def keyword defines a function
• Parameters are inputs the function receives
• return sends back a result
• Call the function by writing its name with ()

Why Use Functions?
• Code reusability - write once, use many times
• Better organization - break complex problems into smaller parts
• Easier testing and debugging

The return statement is crucial - it sends the result back to whoever called the function.`,
    examples: [
      {
        code: 'def greet():\n    print("Hello!")\n\ngreet()',
        explanation: 'Function with no parameters that prints a greeting'
      },
      {
        code: 'def add(a, b):\n    return a + b\n\nresult = add(5, 3)',
        explanation: 'Function that takes two parameters and returns their sum'
      },
      {
        code: 'def square(x):\n    return x * x\n\nprint(square(4))',
        explanation: 'Function that squares a number and returns the result'
      }
    ],
    difficulty: "Easy",
    xpReward: 25,
    starterCode: `# Create a function that adds two numbers\n# Replace the ? with the correct operation\n\ndef add_numbers(a, b):\n    return ?\n\n# Test your function\nresult = add_numbers(5, 3)\nprint(result)`,
    solution: `def add_numbers(a, b):\n    return a + b\n\nresult = add_numbers(5, 3)\nprint(result)`,
    tests: [
      { input: [5, 3], expectedOutput: 8, description: "add_numbers(5, 3) should return 8" },
      { input: [10, 20], expectedOutput: 30, description: "add_numbers(10, 20) should return 30" }
    ],
    tags: ["functions", "math", "basics"],
    language: "python",
    hints: [
      "Use the + operator to add two numbers together",
      "The return statement should be: return a + b",
      "Remember that a and b are the parameter names - they hold the values passed to the function"
    ],
    unlockXPRequired: 0,
    order: 3,
  },
];

const oldJSToDelete = [
  {
    title: "JavaScript Variables (OLD)",
    description: "Learn about different data types and how to declare variables in JavaScript.",
    lessonContent: `JavaScript Variables and Data Types

Variables in JavaScript are containers for storing data. JavaScript has three ways to declare variables: let, const, and var.

Variable Declaration:
let variableName = value;    // Can be reassigned
const constantName = value;  // Cannot be reassigned
var oldWay = value;          // Old style (avoid)

Common Data Types:
• String: Text data in quotes ("Hello" or 'Hello')
• Number: Integers and decimals (42, 3.14)
• Boolean: true or false values
• undefined: Variable declared but not assigned
• null: Intentionally empty value

Best Practices:
• Use const by default
• Use let when value needs to change
• Avoid var (it's the old way)
• Choose descriptive variable names`,
    examples: [
      {
        code: 'let name = "Alice";',
        explanation: 'String variable - text in quotes'
      },
      {
        code: 'let age = 25;',
        explanation: 'Number variable - no quotes needed'
      },
      {
        code: 'let isStudent = true;',
        explanation: 'Boolean variable - true or false'
      }
    ],
    difficulty: "Easy",
    xpReward: 10,
    starterCode: `// Declare three variables with the correct values\n// Replace the ? with actual values\n\nlet myString = ?;\nlet myNumber = ?;\nlet myBoolean = ?;\n\nconsole.log(myString, myNumber, myBoolean);`,
    solution: `let myString = "Hello";\nlet myNumber = 42;\nlet myBoolean = true;\n\nconsole.log(myString, myNumber, myBoolean);`,
    tests: [
      { input: null, expectedOutput: "Hello 42 true", description: "Should log: Hello 42 true" }
    ],
    tags: ["basics", "variables", "types"],
    language: "javascript",
    hints: [
      "Strings must be in quotes: \"text\" or 'text'",
      "Numbers don't use quotes: just write the number",
      "Booleans are either true or false (no quotes)"
    ],
    unlockXPRequired: 100,
    order: 4,
  },
  {
    title: "Arrow Functions",
    description: "Learn the modern ES6 arrow function syntax.",
    lessonContent: `Arrow Functions in JavaScript

Arrow functions are a shorter syntax for writing functions, introduced in ES6 (modern JavaScript).

Traditional Function:
function name(params) {
  return result;
}

Arrow Function:
const name = (params) => result;

Key Features:
• Shorter syntax
• Implicit return for single expressions
• No need for 'function' keyword
• Cleaner code for simple functions

When to Use:
• Short, simple functions
• Callbacks and array methods
• When you want concise code

Arrow functions are especially popular in modern JavaScript and React development.`,
    examples: [
      {
        code: 'const add = (a, b) => a + b;',
        explanation: 'Arrow function that returns sum of two numbers'
      },
      {
        code: 'const greet = name => `Hello ${name}`;',
        explanation: 'Single parameter - parentheses optional'
      },
      {
        code: 'const square = x => x * x;',
        explanation: 'Concise way to square a number'
      }
    ],
    difficulty: "Medium",
    xpReward: 20,
    starterCode: `// Convert this function to arrow function syntax\n// Replace the entire function with arrow function\n\nfunction multiply(a, b) {\n  return a * b;\n}\n\nconsole.log(multiply(4, 5));`,
    solution: `const multiply = (a, b) => a * b;\n\nconsole.log(multiply(4, 5));`,
    tests: [
      { input: [4, 5], expectedOutput: 20, description: "multiply(4, 5) should return 20" }
    ],
    tags: ["es6", "functions", "arrow-functions"],
    language: "javascript",
    hints: [
      "Arrow function format: const name = (params) => expression",
      "For single expression, you can omit curly braces and return",
      "Complete syntax: const multiply = (a, b) => a * b;"
    ],
    unlockXPRequired: 150,
    order: 5,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Section.deleteMany({});
    await Lesson.deleteMany({});
    await Challenge.deleteMany({});
    await QuizQuestion.deleteMany({});
    console.log('Cleared existing data');

    const createdSections = await Section.insertMany(sections);
    console.log(`Created ${createdSections.length} sections`);

    const pythonSection = createdSections.find(s => s.title === "Python Fundamentals");
    const jsSection = createdSections.find(s => s.title === "JavaScript Essentials");
    const webSection = createdSections.find(s => s.title === "Web Development");

    const lessons = [
      { title: "Introduction to Python", description: "Learn what Python is and why it's popular", content: "Python is a high-level, interpreted programming language known for its simplicity and readability.\n\nKey features:\n- Easy to learn syntax\n- Extensive standard library\n- Great for beginners\n- Used in web development, data science, AI, and more", xpReward: 20, order: 1, sectionId: pythonSection._id, estimatedTime: 10, exercises: [] },
      { title: "Variables and Assignment", description: "Learn to store and use data with variables", content: "Variables are containers for storing data values.\n\nCreating variables:\nname = 'Alice'\nage = 25\n\nPython automatically detects the type!", xpReward: 22, order: 2, sectionId: pythonSection._id, estimatedTime: 12, exercises: [] },
      { title: "Numbers and Math", description: "Work with numbers and perform calculations", content: "Python supports integers and floats.\n\nOperations:\n+ addition\n- subtraction\n* multiplication\n/ division\n** exponent", xpReward: 22, order: 3, sectionId: pythonSection._id, estimatedTime: 12, exercises: [] },
      { title: "Strings and Text", description: "Master text manipulation in Python", content: "Strings are sequences of characters.\n\nCreate with quotes:\n'Hello' or \"Hello\"\n\nConcatenate with +:\n'Hello' + ' World'", xpReward: 24, order: 4, sectionId: pythonSection._id, estimatedTime: 14, exercises: [] },
      { title: "Input and Output", description: "Interact with users using input()", content: "Get user input:\nname = input('Your name: ')\n\nDisplay output:\nprint('Hello, ' + name)", xpReward: 24, order: 5, sectionId: pythonSection._id, estimatedTime: 14, exercises: [] },
      { title: "Type Conversion", description: "Convert between different data types", content: "Convert types:\nint('42') → 42\nstr(100) → '100'\nfloat('3.14') → 3.14\n\nUseful for input!", xpReward: 26, order: 6, sectionId: pythonSection._id, estimatedTime: 14, exercises: [] },
      { title: "String Methods", description: "Powerful string manipulation techniques", content: "String methods:\n.upper() - UPPERCASE\n.lower() - lowercase\n.strip() - remove spaces\n.replace(old, new)", xpReward: 26, order: 7, sectionId: pythonSection._id, estimatedTime: 16, exercises: [] },
      { title: "Comments and Documentation", description: "Write clear, documented code", content: "Comments explain code:\n# Single line comment\n\n'''\nMulti-line\ncomment\n'''\n\nGood code explains WHY, not WHAT", xpReward: 20, order: 8, sectionId: pythonSection._id, estimatedTime: 10, exercises: [] },
      { title: "Boolean Values", description: "Work with True and False values", content: "Booleans:\nTrue or False\n\nComparisons:\n5 > 3 → True\n10 == 10 → True\n7 < 2 → False", xpReward: 24, order: 9, sectionId: pythonSection._id, estimatedTime: 12, exercises: [] },
      { title: "Python Basics Summary", description: "Review everything you've learned", content: "You've learned:\n✓ Variables\n✓ Data types\n✓ Math operations\n✓ Strings\n✓ Input/Output\n✓ Comments\n\nReady for conditionals!", xpReward: 30, order: 10, sectionId: pythonSection._id, estimatedTime: 20, exercises: [] },
      { title: "If Statements", description: "Make decisions in your code", content: "If statement structure:\nif condition:\n    do_something\n\nExample:\nif age >= 18:\n    print('Adult')", xpReward: 28, order: 11, sectionId: jsSection._id, estimatedTime: 15, exercises: [] },
      { title: "Else Clause", description: "Handle alternative conditions", content: "If-Else:\nif condition:\n    option_1\nelse:\n    option_2\n\nOne or the other runs!", xpReward: 28, order: 12, sectionId: jsSection._id, estimatedTime: 15, exercises: [] },
      { title: "Elif for Multiple Conditions", description: "Check multiple conditions", content: "Multiple conditions:\nif score >= 90:\n    'A'\nelif score >= 80:\n    'B'\nelse:\n    'C'", xpReward: 30, order: 13, sectionId: jsSection._id, estimatedTime: 16, exercises: [] },
      { title: "Comparison Operators", description: "Compare values in Python", content: "Operators:\n== equal\n!= not equal\n> greater\n< less\n>= greater or equal\n<= less or equal", xpReward: 28, order: 14, sectionId: jsSection._id, estimatedTime: 14, exercises: [] },
      { title: "Logical AND", description: "Combine multiple conditions", content: "AND operator:\nif age > 18 and has_license:\n    print('Can drive')\n\nBoth must be True!", xpReward: 30, order: 15, sectionId: jsSection._id, estimatedTime: 15, exercises: [] },
      { title: "Logical OR", description: "Check if either condition is true", content: "OR operator:\nif is_weekend or is_holiday:\n    print('No work!')\n\nOne or both True!", xpReward: 30, order: 16, sectionId: jsSection._id, estimatedTime: 15, exercises: [] },
      { title: "Logical NOT", description: "Negate boolean values", content: "NOT operator:\nif not is_raining:\n    print('Go outside!')\n\nReverses True/False", xpReward: 28, order: 17, sectionId: jsSection._id, estimatedTime: 14, exercises: [] },
      { title: "Nested Conditionals", description: "If statements inside if statements", content: "Nested if:\nif has_account:\n    if is_premium:\n        print('VIP access')\n    else:\n        print('Basic access')", xpReward: 32, order: 18, sectionId: jsSection._id, estimatedTime: 16, exercises: [] },
      { title: "Ternary Operator", description: "One-line if-else statements", content: "Compact syntax:\nresult = 'Pass' if score >= 50 else 'Fail'\n\nvalue_if_true if condition else value_if_false", xpReward: 30, order: 19, sectionId: jsSection._id, estimatedTime: 14, exercises: [] },
      { title: "Conditionals Review", description: "Master decision-making in code", content: "Conditionals let programs make decisions!\n\nYou learned:\n✓ if/else/elif\n✓ Comparisons\n✓ and/or/not\n✓ Nested conditions\n\nNext: Loops!", xpReward: 35, order: 20, sectionId: jsSection._id, estimatedTime: 18, exercises: [] },
      { title: "HTML Fundamentals", description: "Introduction to HTML structure", content: "HTML (HyperText Markup Language) is the foundation of web pages.\n\nBasic Structure:\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Page Title</title>\n</head>\n<body>\n  <h1>Hello Web!</h1>\n</body>\n</html>\n\nHTML uses tags to structure content. Tags have opening <tag> and closing </tag>.", xpReward: 30, order: 21, sectionId: webSection._id, estimatedTime: 15, exercises: [], unlocked: true },
      { title: "HTML Text Elements", description: "Headings, paragraphs, and text formatting", content: "Common text elements:\n\n<h1> to <h6>: Headings (h1 largest)\n<p>: Paragraphs\n<strong>: Bold text\n<em>: Italic text\n<br>: Line break\n<hr>: Horizontal line\n\nExample:\n<h1>Main Title</h1>\n<p>This is a <strong>bold</strong> paragraph.</p>", xpReward: 32, order: 22, sectionId: webSection._id, estimatedTime: 16, exercises: [], unlocked: true },
      { title: "HTML Links and Images", description: "Add links and images to web pages", content: "Links:\n<a href=\"https://example.com\">Click here</a>\n\nImages:\n<img src=\"image.jpg\" alt=\"Description\">\n\nAttributes:\n- href: link destination\n- src: image source\n- alt: alternative text", xpReward: 32, order: 23, sectionId: webSection._id, estimatedTime: 16, exercises: [], unlocked: true },
      { title: "HTML Lists", description: "Create ordered and unordered lists", content: "Unordered list (bullets):\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>\n\nOrdered list (numbers):\n<ol>\n  <li>First</li>\n  <li>Second</li>\n</ol>\n\nGreat for navigation menus!", xpReward: 30, order: 24, sectionId: webSection._id, estimatedTime: 14, exercises: [], unlocked: true },
      { title: "CSS Basics", description: "Style your web pages with CSS", content: "CSS (Cascading Style Sheets) adds visual design.\n\nThree ways to add CSS:\n1. Inline: <p style=\"color: blue;\">\n2. Internal: <style> in <head>\n3. External: <link rel=\"stylesheet\">\n\nSyntax:\nselector {\n  property: value;\n}", xpReward: 34, order: 25, sectionId: webSection._id, estimatedTime: 16, exercises: [], unlocked: true },
      { title: "CSS Selectors", description: "Target HTML elements with selectors", content: "CSS Selectors:\n\nElement: p { color: red; }\nClass: .button { color: blue; }\nID: #header { font-size: 24px; }\n\nHTML:\n<p class=\"intro\">Text</p>\n\nCSS:\n.intro { color: green; }", xpReward: 34, order: 26, sectionId: webSection._id, estimatedTime: 16, exercises: [] },
      { title: "CSS Box Model", description: "Understanding spacing and layout", content: "Every element is a box with:\n\n1. Content: the actual content\n2. Padding: space inside border\n3. Border: edge of the box\n4. Margin: space outside border\n\nExample:\ndiv {\n  padding: 20px;\n  border: 2px solid black;\n  margin: 10px;\n}", xpReward: 36, order: 27, sectionId: webSection._id, estimatedTime: 18, exercises: [] },
      { title: "JavaScript for Web", description: "Add interactivity with JavaScript", content: "JavaScript makes web pages interactive!\n\nAdd JS:\n<script>\n  alert('Hello!');\n</script>\n\nVariables:\nlet name = 'Alice';\nconst age = 25;\n\nOutput:\nconsole.log(name);", xpReward: 34, order: 28, sectionId: webSection._id, estimatedTime: 16, exercises: [] },
      { title: "DOM Manipulation", description: "Change web pages with JavaScript", content: "DOM (Document Object Model) lets JS interact with HTML.\n\nGet elements:\nlet elem = document.getElementById('myId');\n\nChange content:\nelem.textContent = 'New text';\n\nChange style:\nelem.style.color = 'blue';", xpReward: 38, order: 29, sectionId: webSection._id, estimatedTime: 18, exercises: [] },
      { title: "Event Listeners", description: "Respond to user actions", content: "Events are user actions (clicks, typing, etc.)\n\nAdd listener:\nbutton.addEventListener('click', function() {\n  alert('Clicked!');\n});\n\nCommon events:\n- click\n- submit\n- keypress\n- mouseover", xpReward: 38, order: 30, sectionId: webSection._id, estimatedTime: 18, exercises: [] }
    ];

    const createdLessons = await Lesson.insertMany(lessons);
    console.log(`Created ${createdLessons.length} lessons`);

    const createdChallenges = await Challenge.insertMany(pythonChallenges);
    console.log(`Created ${createdChallenges.length} challenges`);

    const createdQuizQuestions = await QuizQuestion.insertMany(quizQuestions);
    console.log(`Created ${createdQuizQuestions.length} quiz questions`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();


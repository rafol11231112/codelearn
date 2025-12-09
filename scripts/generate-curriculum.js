const fs = require('fs');
const path = require('path');

const sections = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/sections.json'), 'utf8'));

const lessonTemplates = {
  "Python Basics": [
    { topic: "Print Statements", concept: "Output", starter: "print(?)" },
    { topic: "Variables", concept: "Data Storage", starter: "x = ?" },
    { topic: "Numbers", concept: "Integer Math", starter: "a = ?\nb = ?" },
    { topic: "Strings", concept: "Text Data", starter: 'name = "?"' },
    { topic: "Input", concept: "User Input", starter: "user_input = input(?)" },
    { topic: "Type Conversion", concept: "Casting", starter: "num = int(?)" },
    { topic: "String Operations", concept: "Concatenation", starter: "full = ? + ?" },
    { topic: "Comments", concept: "Documentation", starter: "# ?" },
    { topic: "Basic Math", concept: "Arithmetic", starter: "result = ? + ?" },
    { topic: "Variables Practice", concept: "Assignment", starter: "var1 = ?\nvar2 = ?" }
  ],
  "Python Logic & Conditions": [
    { topic: "If Statements", concept: "Conditionals" },
    { topic: "Else Clause", concept: "Alternative Path" },
    { topic: "Elif", concept: "Multiple Conditions" },
    { topic: "Comparison Operators", concept: "==, !=, <, >" },
    { topic: "Logical AND", concept: "Both True" },
    { topic: "Logical OR", concept: "Either True" },
    { topic: "Logical NOT", concept: "Negation" },
    { topic: "Nested If", concept: "Complex Logic" },
    { topic: "Ternary Operator", concept: "Inline If" },
    { topic: "Boolean Logic", concept: "True/False" }
  ],
  "Python Loops": [
    { topic: "While Loop", concept: "Repeat While True" },
    { topic: "For Loop", concept: "Iterate Sequence" },
    { topic: "Range Function", concept: "Number Sequences" },
    { topic: "Break Statement", concept: "Exit Loop" },
    { topic: "Continue Statement", concept: "Skip Iteration" },
    { topic: "Nested Loops", concept: "Loop in Loop" },
    { topic: "Loop with Else", concept: "Completion Action" },
    { topic: "List Iteration", concept: "For Each Item" },
    { topic: "Enumerate", concept: "Index + Value" },
    { topic: "Loop Patterns", concept: "Common Uses" }
  ],
  "Data Structures": [
    { topic: "Lists", concept: "Ordered Collection" },
    { topic: "List Methods", concept: "append, remove" },
    { topic: "List Slicing", concept: "Sub-lists" },
    { topic: "Tuples", concept: "Immutable Lists" },
    { topic: "Dictionaries", concept: "Key-Value Pairs" },
    { topic: "Dictionary Methods", concept: "keys, values, items" },
    { topic: "Sets", concept: "Unique Elements" },
    { topic: "Set Operations", concept: "Union, Intersection" },
    { topic: "List Comprehension", concept: "Compact Lists" },
    { topic: "Nested Structures", concept: "Complex Data" }
  ],
  "Functions & Modules": [
    { topic: "Defining Functions", concept: "def keyword" },
    { topic: "Function Parameters", concept: "Input Values" },
    { topic: "Return Statement", concept: "Output Values" },
    { topic: "Default Parameters", concept: "Optional Args" },
    { topic: "Keyword Arguments", concept: "Named Args" },
    { topic: "*args", concept: "Variable Args" },
    { topic: "**kwargs", concept: "Keyword Dict" },
    { topic: "Lambda Functions", concept: "Anonymous Functions" },
    { topic: "Importing Modules", concept: "import, from" },
    { topic: "Creating Modules", concept: "Own .py Files" }
  ],
  "OOP Theory": [
    { topic: "Classes", concept: "Objects Blueprint" },
    { topic: "__init__", concept: "Constructor" },
    { topic: "self Parameter", concept: "Instance Reference" },
    { topic: "Instance Attributes", concept: "Object Data" },
    { topic: "Methods", concept: "Object Functions" },
    { topic: "Inheritance", concept: "Parent Class" },
    { topic: "super()", concept: "Parent Methods" },
    { topic: "Encapsulation", concept: "Private Data" },
    { topic: "Polymorphism", concept: "Method Override" },
    { topic: "Class Variables", concept: "Shared Data" }
  ],
  "File Handling + Errors": [
    { topic: "Opening Files", concept: "open() function" },
    { topic: "Reading Files", concept: "read(), readline()" },
    { topic: "Writing Files", concept: "write() method" },
    { topic: "With Statement", concept: "Auto-close" },
    { topic: "File Modes", concept: "r, w, a, rb" },
    { topic: "Try-Except", concept: "Error Handling" },
    { topic: "Exception Types", concept: "Specific Errors" },
    { topic: "Finally Block", concept: "Always Execute" },
    { topic: "Raising Exceptions", concept: "raise keyword" },
    { topic: "Custom Exceptions", concept: "Own Error Classes" }
  ],
  "Mini Projects": [
    { topic: "Calculator", concept: "Math Program" },
    { topic: "Todo List", concept: "Task Manager" },
    { topic: "Number Guessing", concept: "Game Logic" },
    { topic: "Password Generator", concept: "Random Strings" },
    { topic: "Quiz App", concept: "Q&A System" },
    { topic: "Contact Book", concept: "Data Management" },
    { topic: "Weather App", concept: "API Integration" },
    { topic: "File Organizer", concept: "Automation" },
    { topic: "Budget Tracker", concept: "Finance App" },
    { topic: "Flashcard App", concept: "Learning Tool" }
  ],
  "Algorithms Basics": [
    { topic: "Linear Search", concept: "Find in List" },
    { topic: "Binary Search", concept: "Sorted Search" },
    { topic: "Bubble Sort", concept: "Simple Sorting" },
    { topic: "Selection Sort", concept: "Min Selection" },
    { topic: "Insertion Sort", concept: "Build Sorted" },
    { topic: "Recursion", concept: "Self-calling" },
    { topic: "Factorial", concept: "n! calculation" },
    { topic: "Fibonacci", concept: "Sequence Gen" },
    { topic: "Two Pointers", concept: "Array Technique" },
    { topic: "Sliding Window", concept: "Subarray Pattern" }
  ],
  "Web Dev Intro": [
    { topic: "HTML Basics", concept: "Structure" },
    { topic: "HTML Tags", concept: "Elements" },
    { topic: "CSS Basics", concept: "Styling" },
    { topic: "CSS Selectors", concept: "Target Elements" },
    { topic: "CSS Box Model", concept: "Layout" },
    { topic: "JS Variables", concept: "let, const" },
    { topic: "JS Functions", concept: "Reusable Code" },
    { topic: "DOM Manipulation", concept: "Change HTML" },
    { topic: "Event Listeners", concept: "User Actions" },
    { topic: "Build Webpage", concept: "Complete Page" }
  ]
};

const lessons = [];
let lessonOrder = 1;

sections.forEach((section, sectionIndex) => {
  const templates = lessonTemplates[section.title] || [];
  
  templates.forEach((template, index) => {
    const lessonId = `l_${lessonOrder}`;
    const xpReward = 10 + Math.floor(lessonOrder / 10) * 5;
    
    lessons.push({
      id: lessonId,
      title: template.topic,
      section: section.id,
      sectionTitle: section.title,
      order: lessonOrder,
      content: `Learn about ${template.concept} in ${section.title}.\n\nThis lesson covers ${template.topic.toLowerCase()} and how to use it effectively in Python programming.`,
      examples: [
        `Example of ${template.topic}`,
        `Practical use case for ${template.concept}`
      ],
      miniExercise: {
        task: `Practice ${template.topic}`,
        starterCode: template.starter || `# Your code here`,
        solution: `# Solution for ${template.topic}`
      },
      xpReward: xpReward,
      isLocked: lessonOrder > 1,
      requiredLessonId: lessonOrder > 1 ? `l_${lessonOrder - 1}` : null,
      estimatedTime: 10 + (index % 5) * 2
    });
    
    lessonOrder++;
  });
});

fs.writeFileSync(
  path.join(__dirname, '../data/lessons.json'),
  JSON.stringify(lessons, null, 2)
);

console.log(`✅ Generated ${lessons.length} lessons`);

const challenges = [];
const challengeCategories = [
  "Print & Variables", "Math Operations", "String Manipulation", 
  "Conditionals", "Loops", "Lists", "Functions", "Dictionaries",
  "File Operations", "Classes", "Algorithms", "Problem Solving"
];

for (let i = 1; i <= 100; i++) {
  const difficulty = i <= 40 ? "Easy" : i <= 80 ? "Medium" : "Hard";
  const xpReward = i <= 40 ? 15 + i : i <= 80 ? 50 + i : 100 + i;
  const category = challengeCategories[Math.floor((i - 1) / 8.33)];
  
  challenges.push({
    id: `c_${i}`,
    title: `Challenge ${i}: ${category}`,
    description: `Solve this ${difficulty.toLowerCase()} problem involving ${category.toLowerCase()}.`,
    difficulty: difficulty,
    xpReward: xpReward,
    starterCode: `# Challenge ${i}\n# Write your solution here\n\ndef solution():\n    pass`,
    tests: [
      { input: "test_case_1", expected: "expected_output_1" },
      { input: "test_case_2", expected: "expected_output_2" }
    ],
    solution: `# Solution for Challenge ${i}\ndef solution():\n    return "solved"`,
    unlockLevel: Math.ceil(i / 2),
    requiredChallengeId: i > 1 ? `c_${i - 1}` : null,
    language: "python",
    tags: [category.toLowerCase().replace(/ /g, '-'), difficulty.toLowerCase()],
    hints: [
      `Hint 1 for Challenge ${i}`,
      `Hint 2: Think about ${category}`,
      `Hint 3: Solution approach`
    ]
  });
}

fs.writeFileSync(
  path.join(__dirname, '../data/challenges.json'),
  JSON.stringify(challenges, null, 2)
);

console.log(`✅ Generated ${challenges.length} challenges`);

const levels = [];
const levelTitles = [
  "Code Newbie", "Script Learner", "Syntax Explorer", "Logic Builder",
  "Loop Master", "Function Creator", "Data Handler", "Algorithm Solver",
  "Code Craftsman", "Python Apprentice", "Syntax Warrior", "Logic Expert",
  "Problem Solver", "Code Architect", "Python Adept", "Senior Developer",
  "Code Wizard", "Python Master", "Algorithm Expert", "Code Ninja",
  "Programming Guru", "Code Sage", "Python Pro", "Elite Coder",
  "Code Legend", "Master Programmer", "Python Virtuoso", "Code Titan",
  "Supreme Coder", "Code Demigod", "Python Deity", "Code Immortal",
  "Grandmaster", "Code Oracle", "Python Overlord", "Code Emperor",
  "Ultimate Coder", "Code Champion", "Python Hero", "Code Savant",
  "Elite Master", "Code Prodigy", "Python Genius", "Code Maestro",
  "Supreme Master", "Code Sovereign", "Python Luminary", "Code Transcendent",
  "Legendary Coder", "Code Omniscient"
];

for (let i = 1; i <= 50; i++) {
  const xpRequired = (i - 1) * 150;
  levels.push({
    level: i,
    xpRequired: xpRequired,
    title: levelTitles[i - 1] || `Level ${i} Master`,
    reward: i % 10 === 0 ? "Special Badge" : "Progress Badge"
  });
}

fs.writeFileSync(
  path.join(__dirname, '../data/levels.json'),
  JSON.stringify(levels, null, 2)
);

console.log(`✅ Generated ${levels.length} levels`);
console.log('\n🎉 Curriculum generation complete!');


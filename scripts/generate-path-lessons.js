// Dynamic lesson path generator
// This script generates initial lessons for the path using AI

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const lessonTopics = [
  // Basics (1-20)
  "Variables and Data Types",
  "String Manipulation",
  "Numbers and Math Operations",
  "Boolean Logic",
  "Conditional Statements (if/else)",
  "Switch Statements",
  "While Loops",
  "For Loops",
  "Arrays Basics",
  "Array Methods",
  "Objects Introduction",
  "Object Properties and Methods",
  "Functions Basics",
  "Function Parameters",
  "Return Values",
  "Arrow Functions",
  "Array Iteration",
  "Template Literals",
  "Type Conversion",
  "Null and Undefined",
  
  // Intermediate (21-50)
  "Array Destructuring",
  "Object Destructuring",
  "Spread Operator",
  "Rest Parameters",
  "Higher-Order Functions",
  "Map Function",
  "Filter Function",
  "Reduce Function",
  "forEach Method",
  "Find and FindIndex",
  "Sorting Arrays",
  "String Methods Advanced",
  "Regular Expressions Basics",
  "Date and Time",
  "Error Handling (try/catch)",
  "Throwing Errors",
  "Async Basics",
  "Promises Introduction",
  "Async/Await",
  "Fetch API",
  "JSON Parsing",
  "Local Storage",
  "DOM Manipulation",
  "Event Listeners",
  "Forms and Input",
  "Classes and OOP",
  "Constructors",
  "Class Methods",
  "Inheritance",
  "Encapsulation",
  
  // Advanced (51-80)
  "Prototypes",
  "Closures",
  "Scope and Hoisting",
  "this Keyword",
  "Call, Apply, Bind",
  "Modules (import/export)",
  "ES6+ Features",
  "Generators",
  "Iterators",
  "Symbols",
  "WeakMap and WeakSet",
  "Proxy and Reflect",
  "Memory Management",
  "Event Loop",
  "Callbacks",
  "Promise Chaining",
  "Promise.all",
  "Promise.race",
  "Web APIs",
  "Timers (setTimeout/setInterval)",
  "Debouncing",
  "Throttling",
  "Design Patterns: Singleton",
  "Design Patterns: Factory",
  "Design Patterns: Observer",
  "Design Patterns: Module",
  "Functional Programming",
  "Pure Functions",
  "Immutability",
  "Composition",
  
  // Expert (81-100)
  "Recursion",
  "Memoization",
  "Dynamic Programming Basics",
  "Algorithm Complexity",
  "Binary Search",
  "Sorting Algorithms",
  "Data Structures: Stack",
  "Data Structures: Queue",
  "Data Structures: Linked List",
  "Data Structures: Tree",
  "Data Structures: Graph",
  "Breadth-First Search",
  "Depth-First Search",
  "Hash Tables",
  "Sets and Maps",
  "Testing Basics",
  "Unit Testing",
  "Test-Driven Development",
  "Debugging Techniques",
  "Performance Optimization"
];

const LessonSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  xpReward: Number,
  order: Number,
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  exercises: [{
    question: String,
    code: String,
    answer: String,
  }],
  estimatedTime: Number,
});

const SectionSchema = new mongoose.Schema({
  title: String,
  description: String,
  order: Number,
  icon: String,
});

const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);
const Section = mongoose.models.Section || mongoose.model('Section', SectionSchema);

async function generateLessons() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create sections
    console.log('\n📚 Creating sections...');
    const sections = [
      { title: 'Fundamentals', description: 'Master the basics', order: 1, icon: 'Code2' },
      { title: 'Intermediate', description: 'Level up your skills', order: 2, icon: 'Zap' },
      { title: 'Advanced', description: 'Expert techniques', order: 3, icon: 'Trophy' },
      { title: 'Expert', description: 'Master level', order: 4, icon: 'Target' },
    ];

    const createdSections = [];
    for (const section of sections) {
      const exists = await Section.findOne({ title: section.title });
      if (!exists) {
        const created = await Section.create(section);
        createdSections.push(created);
        console.log(`  ✓ Created section: ${section.title}`);
      } else {
        createdSections.push(exists);
        console.log(`  ⊙ Section exists: ${section.title}`);
      }
    }

    // Create lessons
    console.log('\n🎯 Creating lessons...');
    let created = 0;
    let skipped = 0;

    for (let i = 0; i < lessonTopics.length; i++) {
      const topic = lessonTopics[i];
      const order = i + 1;
      const sectionIndex = Math.floor(i / 25); // 25 lessons per section
      const section = createdSections[Math.min(sectionIndex, createdSections.length - 1)];

      const exists = await Lesson.findOne({ order });
      if (!exists) {
        const lesson = {
          title: topic,
          description: `Learn about ${topic} in JavaScript`,
          content: `<h2>${topic}</h2><p>This lesson will teach you everything you need to know about ${topic}. Complete the exercises to master this concept.</p>`,
          xpReward: 50 + (order * 5), // Progressive XP rewards
          order,
          sectionId: section._id,
          exercises: [
            {
              question: `What is your understanding of ${topic}?`,
              code: `// Write your code here`,
              answer: 'varies'
            }
          ],
          estimatedTime: 10 + Math.floor(order / 10), // 10-20 minutes
        };

        await Lesson.create(lesson);
        created++;
        
        if (created % 10 === 0) {
          console.log(`  ⏳ Created ${created}/${lessonTopics.length} lessons...`);
        }
      } else {
        skipped++;
      }
    }

    console.log('\n✅ Lesson generation complete!');
    console.log(`  📊 Created: ${created} lessons`);
    console.log(`  ⊙ Skipped: ${skipped} lessons (already exist)`);
    console.log(`  📚 Total: ${lessonTopics.length} lessons in database`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

generateLessons();

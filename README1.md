# 🚀 CodeLearn Platform

A modern, interactive coding education platform built with Next.js, featuring gamified learning experiences, AI-powered assistance, and comprehensive progress tracking.

## ✨ Features

### 📚 Learning Experience
- **Interactive Lessons** - Step-by-step coding tutorials with hands-on practice
- **Code Challenges** - Test your skills with real-world coding problems
- **Live Code Editor** - Built-in Monaco editor with syntax highlighting
- **AI Assistant** - Get intelligent help when you're stuck
- **Quiz System** - Reinforce learning with interactive quizzes

### 🎮 Gamification
- **XP & Leveling System** - Earn experience points and level up
- **Achievement Badges** - Unlock badges for completing milestones
- **Leaderboard** - Compete with other learners globally
- **Daily Quests** - Complete daily challenges for bonus rewards
- **Streak Tracking** - Build and maintain learning streaks

### 🛤️ Learning Path
- **Hexagonal Path Layout** - Visual progression through topics
- **Structured Curriculum** - Organized lessons from beginner to advanced
- **Progress Tracking** - See your completion status at a glance
- **Unlock System** - Complete prerequisites to unlock new content

### 👥 User Features
- **User Authentication** - Secure login and signup
- **Personal Profile** - Track your stats and achievements
- **Custom Challenges** - Create and share your own coding challenges
- **Custom Lessons** - Design personalized learning content

### 🔧 Admin Panel
- **User Management** - Manage user accounts and permissions
- **Content Management** - Create and edit lessons and challenges
- **Analytics Dashboard** - View platform statistics and user activity
- **Admin Controls** - Toggle admin privileges and moderate content

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT with bcrypt
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Code Editor:** Monaco Editor
- **Icons:** Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB instance running
- Git installed

### Installation

1. Clone the repository
```bash
git clone https://github.com/rafol11231112/codelearn.git
cd codelearn
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
```

4. Seed the database
```bash
npm run seed
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with initial data
- `npm run generate-path` - Generate learning path lessons
- `npm run make-admin` - Promote user to admin
- `npm run clear-users` - Clear all users from database

## 📁 Project Structure

```
codelearn/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   ├── admin/          # Admin endpoints
│   │   ├── auth/           # Authentication
│   │   ├── challenges/     # Challenge management
│   │   ├── lessons/        # Lesson management
│   │   └── quiz/           # Quiz system
│   ├── auth/               # Auth pages
│   ├── challenges/         # Challenge pages
│   ├── dashboard/          # User dashboard
│   ├── lessons/            # Lesson pages
│   ├── path/               # Learning path
│   └── profile/            # User profile
├── components/              # React components
│   ├── auth/               # Auth components
│   ├── challenges/         # Challenge components
│   ├── dashboard/          # Dashboard components
│   ├── path/               # Path components
│   ├── quiz/               # Quiz components
│   └── ui/                 # Reusable UI components
├── data/                    # Static data files
│   ├── challenges.json     # Challenge definitions
│   ├── lessons.json        # Lesson content
│   └── levels.json         # Level progression
├── lib/                     # Utility libraries
│   ├── auth.ts             # Auth helpers
│   ├── db.ts               # Database connection
│   └── encryption.ts       # Security utilities
├── models/                  # Database models
│   ├── User.ts             # User model
│   ├── Challenge.ts        # Challenge model
│   └── Lesson.ts           # Lesson model
└── scripts/                 # Utility scripts
```

## 🎨 Key Features Explained

### AI-Powered Help
Get contextual assistance while solving challenges. The AI helper understands your code and provides targeted hints without giving away the solution.

### Custom Content Creation
Users can create their own challenges and lessons, fostering a community-driven learning experience.

### Progress Persistence
All progress is saved in real-time, so you never lose your place. Pick up right where you left off.

### Responsive Design
Fully responsive interface works seamlessly on desktop, tablet, and mobile devices.

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Admin-only endpoints
- Input validation and sanitization
- DevTools blocker for production

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 🐛 Issues

If you encounter any bugs or have feature requests, please open an issue on GitHub.

## 📧 Contact

For questions or support, please open an issue on this repository.

---

Built with ❤️ for aspiring developers

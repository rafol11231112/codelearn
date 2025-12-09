import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  xp: number;
  level: number;
  badges: string[];
  completedLessons: string[];
  completedChallenges: string[];
  currentLesson: number;
  isAdmin: boolean;
  joinedAt: Date;
  avatar: string;
  settings: {
    theme: 'light' | 'dark';
  };
  onboardingQuiz: {
    finished: boolean;
    score: number;
    answers: any[];
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
  };
  dailyStreak: number;
  lastLoginDate: Date;
  weeklyXP: number;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{ type: String }],
  completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  completedChallenges: [{ type: Schema.Types.ObjectId, ref: 'Challenge' }],
  currentLesson: { type: Number, default: 1 },
  isAdmin: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now },
  avatar: { type: String, default: '/avatars/default.svg' },
  settings: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  },
  onboardingQuiz: {
    finished: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    answers: [{ type: Schema.Types.Mixed }],
    skillLevel: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced'], 
      default: 'beginner' 
    },
  },
  dailyStreak: { type: Number, default: 0 },
  lastLoginDate: { type: Date, default: Date.now },
  weeklyXP: { type: Number, default: 0 },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);


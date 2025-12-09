import mongoose, { Schema, Document } from 'mongoose';

export interface IChallenge extends Document {
  title: string;
  description: string;
  lessonContent: string;
  examples: Array<{
    code: string;
    explanation: string;
  }>;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  starterCode: string;
  solution: string;
  tests: Array<{
    input: any;
    expectedOutput: any;
    description: string;
  }>;
  tags: string[];
  language: 'python' | 'javascript' | 'html';
  hints: string[];
  unlockXPRequired: number;
  order: number;
  sectionId?: string;
}

const ChallengeSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  lessonContent: { type: String, default: '' },
  examples: [{
    code: { type: String },
    explanation: { type: String },
  }],
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    required: true 
  },
  xpReward: { type: Number, required: true },
  starterCode: { type: String, required: true },
  solution: { type: String, required: true },
  tests: [{
    input: { type: Schema.Types.Mixed },
    expectedOutput: { type: Schema.Types.Mixed },
    description: { type: String },
  }],
  tags: [{ type: String }],
  language: { 
    type: String, 
    enum: ['python', 'javascript', 'html'], 
    required: true 
  },
  hints: [{ type: String }],
  unlockXPRequired: { type: Number, default: 0 },
  order: { type: Number, required: true },
  sectionId: { type: Schema.Types.ObjectId, ref: 'Section' },
});

export default mongoose.models.Challenge || mongoose.model<IChallenge>('Challenge', ChallengeSchema);


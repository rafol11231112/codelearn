import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson extends Document {
  title: string;
  description: string;
  content: string;
  xpReward: number;
  order: number;
  sectionId: string;
  exercises: Array<{
    question: string;
    code: string;
    answer: string;
  }>;
  estimatedTime: number;
}

const LessonSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  xpReward: { type: Number, required: true },
  order: { type: Number, required: true },
  sectionId: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
  exercises: [{
    question: { type: String },
    code: { type: String },
    answer: { type: String },
  }],
  estimatedTime: { type: Number, default: 15 },
});

export default mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema);


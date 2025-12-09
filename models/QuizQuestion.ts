import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizQuestion extends Document {
  question: string;
  options: string[];
  correctAnswer: number;
  order: number;
  category: string;
}

const QuizQuestionSchema: Schema = new Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  order: { type: Number, required: true },
  category: { type: String, required: true },
});

export default mongoose.models.QuizQuestion || mongoose.model<IQuizQuestion>('QuizQuestion', QuizQuestionSchema);


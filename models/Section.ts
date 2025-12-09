import mongoose, { Schema, Document } from 'mongoose';

export interface ISection extends Document {
  title: string;
  description: string;
  order: number;
  icon: string;
  color: string;
  unlockXPRequired: number;
}

const SectionSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, required: true },
  icon: { type: String, default: '📚' },
  color: { type: String, default: '#3B82F6' },
  unlockXPRequired: { type: Number, default: 0 },
});

export default mongoose.models.Section || mongoose.model<ISection>('Section', SectionSchema);


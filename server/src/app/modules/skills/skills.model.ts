import { Schema, model } from 'mongoose';
import { TSkill } from './skills.interface';

const skillSchema = new Schema<TSkill>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const Skill = model<TSkill>('Skill', skillSchema);

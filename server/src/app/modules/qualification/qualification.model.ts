import { Schema, model } from 'mongoose';
import { TQualification } from './qualification.interface';

const qualificationSchema = new Schema<TQualification>(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const Qualification = model<TQualification>('Qualification', qualificationSchema);

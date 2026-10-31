import { Schema, model } from 'mongoose';
import { TReview } from './review.interface';

const reviewSchema = new Schema<TReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true },
    content: { type: String, required: true }
  },
  {
    timestamps: true,
  },
);

export const Review = model<TReview>('Review', reviewSchema);

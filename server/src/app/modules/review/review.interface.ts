import { Types } from 'mongoose';

export type TReview = {
  user: Types.ObjectId;
  rating: number;
  content: string;
};

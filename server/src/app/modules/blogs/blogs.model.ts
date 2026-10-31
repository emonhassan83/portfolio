import { Schema, model } from 'mongoose';
import { TBlog } from './blogs.interface';

const blogSchema = new Schema<TBlog>(
  {
    name: { type: String, required: true },
    banner: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: String, required: true },
    tags: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const Blog = model<TBlog>('Blog', blogSchema);

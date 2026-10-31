import { Types } from "mongoose";

export type TBlog = {
    name: string;
    banner: string;
    description: string;
    images?: string;
    tags: string;
    author: Types.ObjectId;
    isPublished?: boolean;
  };
  
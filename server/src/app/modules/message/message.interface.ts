import { Types } from 'mongoose';
import { MESSAGE_STATUS } from './message.constant';

export type TMessageStatus = (typeof MESSAGE_STATUS)[number];

export interface TMessage {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  message: string;
  status: TMessageStatus;
  /** Private admin note, never shown to the sender. */
  note?: string;
  readAt?: Date | null;
  repliedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TCreateMessage {
  name: string;
  email: string;
  message: string;
  /** Honeypot: real visitors never fill it. */
  website?: string;
}

export interface TUpdateMessage {
  status?: TMessageStatus;
  note?: string;
}

export interface TMessageListQuery {
  status?: TMessageStatus;
  searchTerm?: string;
  page?: string;
  limit?: string;
}

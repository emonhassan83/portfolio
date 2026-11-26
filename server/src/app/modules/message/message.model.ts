import { Schema, model } from 'mongoose';
import { MESSAGE_STATUS } from './message.constant';
import { TMessage } from './message.interface';

const messageSchema = new Schema<TMessage>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true },
    status: { type: String, enum: MESSAGE_STATUS, default: 'new', index: true },
    note: { type: String, default: '' },
    readAt: { type: Date, default: null },
    repliedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

messageSchema.index({ createdAt: -1 });

export const Message = model<TMessage>('Message', messageSchema);

import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { Message } from './message.model';
import { MESSAGE_STATUS, MessageSearchableFields } from './message.constant';
import { TCreateMessage, TMessageListQuery, TMessageStatus, TUpdateMessage } from './message.interface';

const MAX_LIMIT = 100;

/** Search text is matched literally, so it cannot be used as a (slow) regular expression. */
const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Saves a contact form submission. Honeypot hits are dropped silently. */
const createMessage = async (payload: TCreateMessage) => {
  if (payload.website) return null;
  const { name, email, message } = payload;
  const created = await Message.create({ name, email, message });
  return { _id: created._id };
};

const listMessages = async (query: TMessageListQuery) => {
  // Only known, validated keys reach the database query.
  const limit = Math.min(Number(query.limit) || 20, MAX_LIMIT);
  const safeQuery: Record<string, unknown> = { page: query.page || '1', limit: String(limit) };
  if (query.status) safeQuery.status = query.status;
  if (query.searchTerm) safeQuery.searchTerm = escapeRegex(query.searchTerm);

  const builder = new QueryBuilder(Message.find(), safeQuery)
    .search(MessageSearchableFields)
    .filter()
    .sort()
    .paginate();

  const [data, meta, grouped] = await Promise.all([
    builder.modelQuery,
    builder.countTotal(),
    Message.aggregate<{ _id: TMessageStatus; count: number }>([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);

  const counts = Object.fromEntries(MESSAGE_STATUS.map((s) => [s, 0])) as Record<TMessageStatus, number>;
  for (const g of grouped) counts[g._id] = g.count;

  return { data, meta: { ...meta, counts } };
};

/** Status changes stamp when a message was first read and last replied to. */
const updateMessage = async (id: string, payload: TUpdateMessage) => {
  const existing = await Message.findById(id);
  if (!existing) throw new AppError(httpStatus.NOT_FOUND, 'Message not found');

  const update: Record<string, unknown> = { ...payload };
  if (payload.status && payload.status !== 'new' && !existing.readAt) update.readAt = new Date();
  if (payload.status === 'replied') update.repliedAt = new Date();

  return Message.findByIdAndUpdate(id, update, { returnDocument: 'after' });
};

const deleteMessage = async (id: string) => {
  const deleted = await Message.findByIdAndDelete(id);
  if (!deleted) throw new AppError(httpStatus.NOT_FOUND, 'Message not found');
};

export const MessageServices = { createMessage, listMessages, updateMessage, deleteMessage };

/** Tracking states for a contact message, in workflow order. */
export const MESSAGE_STATUS = ['new', 'read', 'replied', 'archived'] as const;

export const MessageSearchableFields = ['name', 'email', 'message', 'note'];

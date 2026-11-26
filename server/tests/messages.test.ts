import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';
import { createClient, createUser, PASSWORD, startTestServer, stopTestServer } from './helpers';
import { Message } from '../src/app/modules/message/message.model';

before(startTestServer);
after(stopTestServer);

const valid = { name: 'Jane Doe', email: 'jane@example.com', message: 'Hello, I would like to talk about a project.' };

const signedInAdmin = async () => {
  const user = await createUser();
  const client = createClient();
  await client.post('/auth/login', { email: user.email, password: PASSWORD });
  return client;
};

describe('contact messages', () => {
  test('anyone can send a message; it is stored as new', async () => {
    const res = await createClient().post('/messages', valid);
    assert.equal(res.status, 201);
    const stored = await Message.findOne({ email: valid.email }).lean();
    assert.equal(stored?.status, 'new');
    assert.equal(res.body.data, null, 'the public response does not echo stored data');
  });

  test('honeypot submissions get the same answer but are not stored', async () => {
    const before = await Message.countDocuments();
    const res = await createClient().post('/messages', { ...valid, website: 'http://spam.example' });
    assert.equal(res.status, 201);
    assert.equal(await Message.countDocuments(), before);
  });

  test('invalid, oversized and extra fields are rejected', async () => {
    const client = createClient();
    assert.equal((await client.post('/messages', { ...valid, email: 'not-an-email' })).status, 400);
    assert.equal((await client.post('/messages', { ...valid, message: 'x'.repeat(5001) })).status, 400);
    assert.equal((await client.post('/messages', { ...valid, status: 'replied' })).status, 400);
  });

  test('more than five messages an hour from one client are rate limited', async () => {
    const client = createClient();
    for (let i = 0; i < 5; i++) assert.equal((await client.post('/messages', valid)).status, 201);
    assert.equal((await client.post('/messages', valid)).status, 429);
  });

  test('a message without the CSRF header is refused', async () => {
    assert.equal((await createClient({ csrf: false }).post('/messages', valid)).status, 403);
  });

  test('only admins can list, update or delete messages', async () => {
    const created = await Message.create(valid);
    const id = String(created._id);

    const anonymous = createClient();
    assert.equal((await anonymous.get('/messages')).status, 401);
    assert.equal((await anonymous.request('PATCH', `/messages/${id}`, { status: 'read' })).status, 401);
    assert.equal((await anonymous.del(`/messages/${id}`)).status, 401);

    const user = await createUser({ role: 'user' });
    const member = createClient();
    await member.post('/auth/login', { email: user.email, password: PASSWORD });
    assert.equal((await member.get('/messages')).status, 403);
  });

  test('admins can track status, add a note, search and delete', async () => {
    const admin = await signedInAdmin();
    const created = await Message.create({ ...valid, email: 'tracked@example.com', message: 'Budget is (approx) $5k' });
    const id = String(created._id);

    const replied = await admin.request('PATCH', `/messages/${id}`, { status: 'replied', note: 'Call on Monday' });
    assert.equal(replied.status, 200);
    assert.equal(replied.body.data.status, 'replied');
    assert.ok(replied.body.data.readAt && replied.body.data.repliedAt, 'read and replied times are stamped');

    // Regex characters are matched literally.
    const found = await admin.get('/messages?searchTerm=(approx)%20%245k');
    assert.equal(found.status, 200);
    assert.ok(found.body.data.some((m: { _id: string }) => m._id === id));
    assert.equal(typeof found.body.meta.counts.replied, 'number');

    assert.equal((await admin.get('/messages?status=bogus')).status, 400);
    assert.equal((await admin.get('/messages?status[$ne]=new')).status, 400);

    assert.equal((await admin.del(`/messages/${id}`)).status, 200);
    assert.equal(await Message.findById(id), null);
  });
});

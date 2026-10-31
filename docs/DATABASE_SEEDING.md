# Portfolio Platform - Database Architecture & Seeding Guide

This guide details the MongoDB database architecture, Mongoose schemas, indexing strategies, and database seeding procedures for the **Portfolio Platform**.

---

## 1. Database Architecture & Collections

The backend connects to MongoDB using **Mongoose ODM**. The database schema is organized into six core collections:

1. **`users`**: Administrative and user account records, credentials, roles, and profiles.
2. **`projects`**: Portfolio showcase projects, live URLs, repository links, feature highlights, and tech stacks.
3. **`blogs`**: Developer articles, tutorials, markdown content, tags, and publishing statuses.
4. **`skills`**: Technical competencies, icons, and categories.
5. **`qualifications`**: Educational degrees and professional work milestones.
6. **`reviews`**: Testimonials and ratings submitted by clients or collaborators.

---

## 2. Schema Specifications & Indexes

### `User` Collection
- **Index**: `{ email: 1 }` (Unique index for high-performance lookup and preventing duplicate accounts).
- **Middleware**: Pre-save hook hashes `password` with bcrypt.

### `Project` Collection
- **Searchable Fields**: `name`, `technologies`, `description`, `features`.
- **Fields**: `name`, `image`, `description`, `features`, `technologies`, `duration`, `live_site_url`, `client_site_url`, `server_site_url`.

### `Blog` Collection
- **Searchable Fields**: `name`, `tags`, `description`.
- **References**: `author` points to `User._id`.
- **Fields**: `name`, `banner`, `description`, `images`, `tags`, `author`, `isPublished`.

### `Skill` Collection
- **Fields**: `name`, `image`.

### `Qualification` Collection
- **Fields**: `name`, `designation`, `description`, `duration`.

### `Review` Collection
- **References**: `user` points to `User._id`.
- **Fields**: `user`, `rating`, `content`.

---

## 3. Database Connection Configuration

The MongoDB connection is established in `server/src/server.ts` using Mongoose:

```typescript
import mongoose from 'mongoose';
import config from './app/config';
import app from './app';

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('MongoDB connection established successfully.');

    app.listen(config.port, () => {
      console.log(`Portfolio server listening on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to connect to database:', err);
  }
}

main();
```

---

## 4. Initial Database Seeding

To seed the initial Admin account and default data:

### 1. Configure Initial Admin in `server/.env`
Ensure valid database credentials and admin parameters are defined:
```env
DATABASE_URL=mongodb+srv://<user>:<password>@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority
BCRYPT_SALT_ROUNDS=12
```

### 2. Admin Seeding Procedure
When initializing a clean database, create the primary administrator account:
```json
{
  "name": "Emon Hasan",
  "email": "admin@portfolio.com",
  "password": "SecureAdminPassword123!",
  "contactNumber": "+8801700000000",
  "address": "Dhaka, Bangladesh",
  "role": "admin",
  "status": "active",
  "gender": "male"
}
```
You can register this user via `POST /api/user/create-user` or directly insert the document into the `users` collection with the password hashed using bcrypt.

### 3. Verification
Verify data population by testing the endpoints:
```bash
# Verify skills
curl http://localhost:5000/api/skills

# Verify projects
curl http://localhost:5000/api/project
```

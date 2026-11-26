# Portfolio Platform - Database Architecture & Seeding Guide

This guide details the MongoDB database architecture, Mongoose schemas, indexing strategies, and database seeding procedures for the **Portfolio Platform**.

---

## 1. Database Architecture & Collections

The backend connects to MongoDB using **Mongoose ODM**. The database schema is organized into these collections:

1. **`users`**: Administrative and user account records, credentials, roles, security settings (two-factor, security question) and profiles.
2. **`portfolioprofiles`**: Singleton with the profile and hero content of the home page.
3. **`portfolioexperiences`**, **`portfolioprojects`** (case studies), **`portfoliostackgroups`**, **`portfoliopractices`**, **`portfoliocredentials`**: Ordered home page collections managed from the dashboard.
4. **`messages`**: Contact-form submissions with status (`new`, `read`, `replied`, `archived`), admin note and read/replied timestamps.

Collections from earlier versions of the app (`projects`, `blogs`, `skills`, `qualifications`, `reviews`) are no longer served by the API. Any data still in them is left untouched in MongoDB and can be dropped manually.

---

## 2. Schema Specifications & Indexes

### `User` Collection
- **Index**: `{ email: 1 }` (Unique index for high-performance lookup and preventing duplicate accounts).
- **Middleware**: Pre-save hook hashes `password` with bcrypt.

### Portfolio collections
- **Models**: `PortfolioProfile`, `PortfolioExperience`, `PortfolioProject`, `PortfolioStackGroup`, `PortfolioPractice`, `PortfolioCredential` (`server/src/app/modules/portfolio/portfolio.model.ts`).
- Collections other than the profile support ordering via `PATCH /api/portfolio/:resource/reorder`.

### `Message` Collection
- **Fields**: `name`, `email`, `message`, `status`, `note`, `readAt`, `repliedAt`.
- **Indexes**: `status` and `createdAt` (descending).

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

To seed the initial Admin account and the default home page content:

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
Public sign-up is disabled (`POST /api/user/register` requires an admin), so insert the first admin document directly into the `users` collection with the password hashed using bcrypt. See "First admin account" in [development.md](development.md).

### 3. Default Home Page Content
Sign in to the dashboard and run the one-time import via **Import current content** under **Dashboard → Home page → Profile & Hero** (`POST /api/portfolio/import`). It is refused once any content exists. Until then the home page falls back to the static data file.

### 4. Verification
Verify data population by testing the public endpoint:
```bash
curl http://localhost:5000/api/portfolio
```

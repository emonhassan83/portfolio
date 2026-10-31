# Portfolio App Server

An Express and TypeScript backend providing APIs for projects, blogs, skills, qualifications, and reviews.

## Tech Stack
- **Runtime & Language**: Node.js, TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Validation**: Zod
- **Authentication**: JWT, bcrypt

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection URI

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root directory based on the following template:
   ```env
   PORT=5000
   DATABASE_URL=mongodb://localhost:27017/portfolio
   BCRYPT_SALT_ROUNDS=12
   JWT_ACCESS_SECRET=your_jwt_secret
   JWT_ACCESS_EXPIRES_IN=7d
   ```

### Scripts
- `npm run dev`: Start the development server using `ts-node-dev`
- `npm run build`: Compile TypeScript into the `dist` directory
- `npm run prod`: Run the compiled JavaScript production server
- `npm run lint`: Check linting issues
- `npm run prettier`: Format codebase with Prettier

## Folder Structure
```
server/
├── src/
│   ├── app/
│   │   ├── config/          # Configurations (env, database)
│   │   ├── errors/          # Custom error handlers and classes
│   │   ├── middlewares/     # Auth, global error handler, validation
│   │   └── modules/         # API Features (blogs, projects, auth, etc.)
│   │       ├── blogs/
│   │       ├── projects/
│   │       └── ...
│   ├── app.ts               # Express App definition
│   └── server.ts            # Entrypoint (database connection & listener)
├── package.json
└── tsconfig.json
```

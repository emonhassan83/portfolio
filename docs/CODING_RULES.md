# Portfolio Platform - Engineering Standards & Coding Rules

This document specifies the software engineering conventions, directory standards, TypeScript practices, and design patterns for the **Portfolio Platform**.

---

## 1. Modular Directory & File Naming Conventions

### Backend (`server/src/app/modules/<module-name>/`)
Each domain module must strictly encapsulate its concerns in separate files:

```
modules/project/
├── project.interface.ts   # TypeScript interfaces and custom types
├── project.model.ts       # Mongoose Schema & Model definition
├── project.validation.ts  # Zod validation schemas
├── project.constant.ts    # Searchable fields, filterable fields, enums
├── project.service.ts     # Business logic & QueryBuilder interaction
├── project.controller.ts  # Request handling & sendResponse
└── project.routes.ts      # Express Router mapping
```

### Frontend (`client/src/`)
- **Pages**: Use Next.js App Router conventions (`page.jsx`, `layout.jsx`, `loading.jsx`, `error.jsx`).
- **Components**: Reusable components placed in `src/components/<Domain>/<Component>.jsx` using PascalCase.
- **Redux Slices**: RTK Query slices located in `src/redux/features/<name>Api.js` and Redux state slices in `<name>Slice.js`.

---

## 2. Server Architectural Rules

### 1. Routes (`*.route.ts`)
- Never place business logic or DB calls inside route handlers.
- Bind `auth()` middleware where permission checks are needed.
- Bind `validateRequest(schema)` to validate incoming payloads before reaching controllers.

### 2. Controllers (`*.controller.ts`)
- Wrap every controller handler in `catchAsync(async (req, res) => { ... })`.
- Never execute Mongoose queries directly inside controllers.
- Standardize all outgoing responses using `sendResponse(res, { statusCode, success, message, data, meta })`.

```typescript
// Example: Standard Controller Pattern
export const getProjects = catchAsync(async (req, res) => {
  const result = await ProjectServices.getAllProjectsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Projects retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});
```

### 3. Services (`*.service.ts`)
- Implement all data access, model queries, transactions, and transformations here.
- For listing endpoints, instantiate `QueryBuilder` with the model query and `query` parameters:
```typescript
const projectQuery = new QueryBuilder(Project.find(), query)
  .search(projectSearchableFields)
  .filter()
  .sort()
  .paginate()
  .fields();

const result = await projectQuery.modelQuery;
const meta = await projectQuery.countTotal();
return { meta, result };
```
- Throw `AppError(statusCode, message)` on validation or business rule failures.

### 4. Models & Schemas (`*.model.ts`)
- Enforce strict typing via generics: `Schema<TProject>(...)`.
- Enable `{ timestamps: true }` on all Mongoose schemas.
- Use pre-save hooks for side-effects (e.g., password hashing with bcrypt).

---

## 3. Type Safety Standards

- **No `any`**: Explicitly type request parameters, payloads, and function returns.
- **Strict Interfaces**: Match Mongoose models with corresponding TypeScript interfaces (`TUser`, `TProject`, `TBlog`, `TSkill`, `TQualification`, `TReview`).

---

## 4. Centralized Error Handling

- Custom errors must inherit from `AppError`:
```typescript
throw new AppError(httpStatus.NOT_FOUND, 'Project not found with the requested ID');
```
- The `globalErrorHandler` centrally maps and formats:
  - Zod Validation Errors (`handleZodError`)
  - Mongoose Cast Errors (`handleCastError`)
  - Duplicate Key Errors (`handleDuplicateError`)
  - Mongoose Validation Errors (`handleValidationError`)

---

## 5. Frontend & UI Guidelines

1. **Tailwind & DaisyUI**: Prioritize utility classes and theme variables (`bg-base-100`, `text-base-content`). Avoid hardcoded absolute pixel styles where responsive utility classes apply.
2. **RTK Query Caching**:
   - Define query and mutation tags accurately.
   - Provide tags on queries (`providesTags: ['Project']`) and invalidate tags on mutations (`invalidatesTags: ['Project']`).
3. **Form Handling**: Utilize `react-hook-form` for form validation and input state management.

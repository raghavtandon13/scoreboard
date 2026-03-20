# AGENTS.md - Scoreboard Project Guidelines

## Project Overview

This is a TypeScript monorepo using Turborepo with the Better-T-Stack framework:
- **apps/web** - Next.js 16 frontend (runs on port 3001)
- **apps/server** - Hono API server with tRPC (runs on port 3000)
- **packages/ui** - Shared shadcn/ui components
- **packages/api** - tRPC routers and business logic
- **packages/auth** - Better-Auth configuration
- **packages/db** - Drizzle ORM schema and queries
- **packages/env** - Environment variable validation (Zod)
- **packages/config** - Shared TypeScript configuration

## Build, Lint, and Test Commands

### Development
```bash
bun run dev                    # Start all applications
bun run dev:web                # Start only web (Next.js on :3001)
bun run dev:server             # Start only server (Hono on :3000)
```

### Building
```bash
bun run build                  # Build all applications
bun run check-types            # Type-check all packages (runs tsc -b in each)
bun run check                  # Biome format + lint fix
```

### Database Commands
```bash
bun run db:local               # Start local SQLite with Turso
bun run db:push                # Push schema changes (drizzle-kit push)
bun run db:generate            # Generate types (drizzle-kit generate)
bun run db:migrate             # Run migrations
bun run db:studio              # Open Drizzle Studio UI
```

### Server-Specific (apps/server)
```bash
cd apps/server && bun run dev                   # Dev with hot reload
cd apps/server && bun run build                  # Production build
cd apps/server && bun run compile                # Compile to binary (bun build)
```

### Web-Specific (apps/web)
```bash
cd apps/web && bun run generate-pwa-assets       # Generate PWA assets
```

## Code Style Guidelines

### Tooling
- **Biome** is used for formatting and linting (configured in `biome.json`)
- **TypeScript** with strict mode enabled
- Run `bun run check` before committing to auto-fix formatting/linting issues

### Formatting Rules (biome.json)
- **Indentation**: Tabs
- **JavaScript quotes**: Double quotes (`"use quotes"`)
- **Imports**: Auto-organized on save/fix

### TypeScript Configuration
Strict settings enforced:
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `verbatimModuleSyntax: true`

### Naming Conventions
- **Files**: kebab-case (`auth-client.ts`, `user-menu.tsx`)
- **Components**: PascalCase (`.tsx` files, e.g., `SignInForm.tsx`)
- **Functions/variables**: camelCase
- **Types/interfaces**: PascalCase with descriptive names
- **Packages**: kebab-case scoped (`@scoreboard/ui`)

### Imports Organization
Order imports as:
1. External packages (React, Next.js, etc.)
2. Internal packages (`@scoreboard/*`)
3. Relative imports (`./`, `@/`)

```typescript
import { Button } from "@scoreboard/ui/components/button";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import Loader from "./loader";
```

### Path Aliases
- **apps/web**: `@/*` maps to `./src/*`, `@scoreboard/ui/*` maps to `../../packages/ui/src/*`
- **apps/server**: `@/*` maps to `./src/*`

### React/Component Patterns
- Use functional components with explicit return types where helpful
- Prefer named exports for components
- Use TanStack Form for form handling with Zod validation
- Use `sonner` for toast notifications
- Use shadcn/ui components from `@scoreboard/ui/components/*`

### Error Handling
- Use tRPC's `TRPCError` for API errors with appropriate error codes
- Wrap async operations with try/catch for user-facing errors
- Use `toast.error()` for displaying errors to users

```typescript
// tRPC error pattern
throw new TRPCError({
  code: "UNAUTHORIZED",
  message: "Authentication required",
  cause: "No session",
});

// Client-side error handling
onError: (error) => {
  toast.error(error.error.message || error.error.statusText);
}
```

### Database Patterns (Drizzle ORM)
- Schema defined in `packages/db/src/schema.ts`
- Use `db` instance from `packages/db/src/index.ts`
- Wrap queries in try/catch for error handling

### CSS/Tailwind Patterns
- Use `cn()` utility (from `packages/ui/src/lib/utils.ts`) for class merging
- Supports Tailwind CSS 4 with `tw-animate-css` for animations
- Use shadcn/ui component patterns with `class-variance-authority`

### Comments Policy
- **DO NOT add comments** unless explicitly requested by the user
- Code should be self-documenting with descriptive naming

### Git Workflow
- Run `bun run check` before committing
- Use conventional commit messages if applicable
- Never commit `.env` files or secrets

## Architecture Notes

### tRPC Setup
- Procedures defined in `packages/api/src/routers/index.ts`
- Context creation in `packages/api/src/context.ts`
- Protected procedures require `ctx.session` (checked in middleware)

### API Router Pattern
```typescript
export const appRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),
  privateData: protectedProcedure.query(({ ctx }) => ({
    user: ctx.session.user,
  })),
});
```

### Environment Variables
- Use `@scoreboard/env/server` for server-side env vars
- Use `@scoreboard/env/web` for client-side env vars
- Schema validation with Zod in env packages

## Database Schema Location
- Main schema: `packages/db/src/schema.ts`
- Drizzle config: `packages/db/drizzle.config.ts`

## Testing
This project currently has **no test setup**. Do not add test files or test frameworks unless explicitly requested.

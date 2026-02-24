# AGENTS.md - Coding Guidelines for Boxed Repository

## Build Commands

```bash
# Development
bun run dev              # Start all apps in dev mode
bun run dev:web          # Start web app only
bun run dev:native       # Start native app only

# Production
bun run build            # Build all apps
bun run serve            # Preview production build

# Type Checking
bun run check-types      # Run TypeScript type checking
```

## Code Style Guidelines

### TypeScript
- Use strict TypeScript settings (see tsconfig.base.json)
- Always define explicit return types for exported functions
- Use `type` over `interface` for object shapes
- Enable `verbatimModuleSyntax` - use `import type` for type-only imports
- No unchecked indexed access - validate array/object access
- No unused locals or parameters

### Imports
```typescript
// Group imports: React/External → Internal → Types
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { BreathingPhase } from "@/lib/breathing";

// Use path aliases (configured in tsconfig.json)
// @/components, @/lib, @/hooks
```

### Naming Conventions
- **Components**: PascalCase (e.g., `BoxedBreathing.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useBreathingTimer.ts`)
- **Utilities**: camelCase (e.g., `audio.ts`)
- **Types/Interfaces**: PascalCase (e.g., `BreathingPhase`)
- **Constants**: UPPER_SNAKE_CASE for true constants

### Component Structure
```typescript
// 1. Imports
// 2. Types/Interfaces
// 3. Component function with explicit props type
// 4. Hooks and state
// 5. Effects
// 6. Event handlers
// 7. Render

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Implementation
}
```

### Error Handling
- Use try-catch for async operations and external API calls
- Log errors in development with `console.error`
- Never expose sensitive error details to users
- Use optional chaining (`?.`) and nullish coalescing (`??`)

### React Patterns
- Use functional components with hooks
- Prefer `useCallback` for event handlers passed to children
- Use `useMemo` for expensive computations
- Keep components focused and composable

### Styling (Tailwind CSS v4)
- Use Tailwind's utility-first approach
- Custom colors defined in `index.css` with CSS variables
- Neobrutalism theme: thick borders (`border-4`), no rounded corners, hard shadows
- Mobile-first responsive design with `sm:`, `md:`, `lg:` prefixes

### File Organization
```
src/
  components/
    ui/           # shadcn/ui base components
    breathing/    # Feature-specific components
    settings/     # Feature-specific components
  hooks/          # Custom React hooks
  lib/            # Utility functions and types
  routes/         # TanStack Router routes
```

### Git
- Use conventional commits (feat:, fix:, refactor:, docs:)
- Keep commits atomic and focused
- No commits directly to main (use PRs)

### PWA Considerations
- App is a Progressive Web App using vite-plugin-pwa
- Service worker generated automatically
- Test on mobile devices - primary target platform
- Use `ios-haptics` for haptic feedback on iOS Safari

### Environment
- Package manager: **bun** (v1.3.6)
- Node version: Use latest LTS
- Monorepo structure with workspaces in `apps/` and `packages/`

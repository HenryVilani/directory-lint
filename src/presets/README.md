# Directory Lint Presets

Pre-configured schemas for popular frameworks and tools. Use these presets to quickly validate or generate project structures.

## Available Presets

### Frontend Frameworks

#### Vite
```typescript
import { vite } from 'directory-lint/presets';

const schema = vite({
  withTypeScript: true,
  withReact: true,
  withVue: false,
  withSvelte: false,
  withTailwind: true,
  withVitest: true,
});
```

#### Next.js
```typescript
import { nextjs } from 'directory-lint/presets';

const schema = nextjs({
  appRouter: true,          // Use App Router (vs Pages Router)
  withTypeScript: true,
  withTailwind: true,
  withSrcDir: true,        // Use src/ directory
  withESLint: true,
});
```

#### React (Create React App)
```typescript
import { react } from 'directory-lint/presets';

const schema = react({
  withTypeScript: true,
  withRedux: true,
  withRouter: true,
  withTesting: true,
});
```

#### Vue
```typescript
import { vue } from 'directory-lint/presets';

const schema = vue({
  withTypeScript: true,
  withPinia: true,
  withRouter: true,
  withVuetify: false,
  withTesting: true,
});
```

#### Angular
```typescript
import { angular } from 'directory-lint/presets';

const schema = angular({
  withStandalone: true,    // Use standalone components
  withNgrx: true,
  withMaterial: true,
  withTesting: true,
});
```

#### Svelte / SvelteKit
```typescript
import { svelte } from 'directory-lint/presets';

const schema = svelte({
  withSvelteKit: true,
  withTypeScript: true,
  withTailwind: true,
  withAdapter: 'vercel',   // 'auto' | 'node' | 'static' | 'vercel' | 'netlify'
});
```

#### Nuxt
```typescript
import { nuxt } from 'directory-lint/presets';

const schema = nuxt({
  withTypeScript: true,
  withPinia: true,
  withTailwind: true,
  withContent: true,       // Nuxt Content module
});
```

#### Astro
```typescript
import { astro } from 'directory-lint/presets';

const schema = astro({
  withTypeScript: true,
  withReact: true,
  withVue: false,
  withSvelte: false,
  withTailwind: true,
  withMDX: true,
});
```

#### Remix
```typescript
import { remix } from 'directory-lint/presets';

const schema = remix({
  withTypeScript: true,
  withTailwind: true,
  withPrisma: true,
});
```

#### Gatsby
```typescript
import { gatsby } from 'directory-lint/presets';

const schema = gatsby({
  withTypeScript: true,
  withContentful: false,
  withMDX: true,
  withTailwind: true,
});
```

### Backend Frameworks

#### NestJS
```typescript
import { nestjs } from 'directory-lint/presets';

const schema = nestjs({
  withMicroservices: false,
  withGraphQL: true,
  withPrisma: true,
  withTypeORM: false,
  withSwagger: true,
  withTesting: true,
});
```

#### Express
```typescript
import { express } from 'directory-lint/presets';

const schema = express({
  withTypeScript: true,
  withMongoDB: true,
  withPostgreSQL: false,
  withPrisma: false,
  withAuthentication: true,
  withTesting: true,
});
```

### Desktop

#### Electron
```typescript
import { electron } from 'directory-lint/presets';

const schema = electron({
  withTypeScript: true,
  withReact: true,
  withVue: false,
  withVite: true,
});
```

### Monorepo

#### Turborepo / Nx / Lerna
```typescript
import { monorepo } from 'directory-lint/presets';

const schema = monorepo({
  withTypeScript: true,
  packageManager: 'pnpm',  // 'npm' | 'yarn' | 'pnpm'
  withTurborepo: true,
  withNx: false,
  withLerna: false,
});
```

## Usage Examples

### Validate an Existing Project

```typescript
import { DirectoryLint } from 'directory-lint';
import { nextjs } from 'directory-lint/presets';

const linter = new DirectoryLint();
const schema = nextjs({
  appRouter: true,
  withTypeScript: true,
  withTailwind: true,
});

try {
  linter.validate('./my-nextjs-app', schema);
  console.log('✅ Project structure is valid!');
} catch (error) {
  console.error('❌ Validation failed:', error.message);
}
```

### Generate a New Project Structure

```typescript
import { DirectoryLint } from 'directory-lint';
import { nestjs } from 'directory-lint/presets';

const linter = new DirectoryLint();
const schema = nestjs({
  withPrisma: true,
  withGraphQL: true,
  withTesting: true,
});

linter.generate('./new-api', schema);
console.log('✅ NestJS project structure generated!');
```

### Combine Multiple Presets

```typescript
import type { LintSchema } from 'directory-lint';
import { monorepo, nextjs, nestjs } from 'directory-lint/presets';

// Create a custom monorepo schema
const myMonorepoSchema: LintSchema = {
  ...monorepo({ withTurborepo: true, packageManager: 'pnpm' }),
  "apps": {
    type: "dir",
    required: true,
    children: {
      "web": {
        type: "dir",
        required: true,
        children: nextjs({ appRouter: true, withTypeScript: true }),
      },
      "api": {
        type: "dir",
        required: true,
        children: nestjs({ withPrisma: true, withGraphQL: true }),
      },
    },
  },
};
```

## Common Use Cases

### CI/CD Validation

```typescript
// .github/workflows/validate.yml
import { DirectoryLint } from 'directory-lint';
import { nextjs } from 'directory-lint/presets';

const linter = new DirectoryLint();
const schema = nextjs({ appRouter: true, withTypeScript: true });

try {
  linter.validate('.', schema);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
```

### Project Scaffolding

```typescript
import { DirectoryLint } from 'directory-lint';
import { react } from 'directory-lint/presets';

function createReactProject(name: string) {
  const linter = new DirectoryLint();
  const schema = react({
    withTypeScript: true,
    withRedux: true,
    withRouter: true,
  });

  linter.generate(`./${name}`, schema);
  console.log(`✅ Created new React project: ${name}`);
}

createReactProject('my-awesome-app');
```

## Contributing

Want to add a new preset? See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

MIT

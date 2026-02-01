# Directory Lint

A powerful TypeScript library for validating and generating directory structures based on schema definitions. Ensure your project follows the correct file and folder organization with ease.

[![npm version](https://img.shields.io/npm/v/directory-lint.svg)](https://www.npmjs.com/package/directory-lint)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🔍 **Schema-based Validation** - Define your directory structure using intuitive schemas
- 🏗️ **Automatic Generation** - Create directory structures from schemas with templates
- 📝 **Pattern Matching** - Support for wildcards and regex patterns
- 🎯 **15+ Framework Presets** - Built-in schemas for popular frameworks (Next.js, NestJS, Vite, etc.)
- 🔧 **Flexible Backend** - Pluggable backend system (File System or custom)
- 📦 **Zero Dependencies** - Lightweight with minimal footprint
- 🎯 **TypeScript First** - Full TypeScript support with comprehensive types

## 📦 Installation

```bash
npm install directory-lint
```

## 🚀 Quick Start

### Validating a Directory Structure

```typescript
import { DirectoryLint, type LintSchema } from "directory-lint";

const schema: LintSchema = {
  "src": {
    type: "dir",
    required: true,
    children: {
      "index.ts": {
        type: "file",
        required: true
      },
      "components": {
        type: "dir",
        required: true
      }
    }
  },
  "package.json": {
    type: "file",
    required: true
  }
};

const linter = new DirectoryLint();

const result = await linter.validate("./my-project", schema, {
  ignore: ["node_modules", "dist", ".git"]
});

if (result.valid) {
  console.log("✅ Directory structure is valid!");
} else {
  console.error("❌ Validation errors:", result.errors);
  console.warn("⚠️ Warnings:", result.warnings);
}
```

### Generating a Directory Structure

```typescript
import { DirectoryLint, type LintSchema } from "directory-lint";

const schema: LintSchema = {
  "src": {
    type: "dir",
    required: true,
    children: {
      "index.ts": {
        type: "file",
        required: true,
        template: "export * from './components';\n"
      },
      "utils": {
        type: "dir",
        children: {
          "helper.ts": {
            type: "file",
            template: () => `// Generated on ${new Date().toISOString()}\n`
          }
        }
      }
    }
  }
};

const linter = new DirectoryLint();

const result = await linter.generate("./new-project", schema, {
  overwrite: true,
  recursive: true
});

console.log("✅ Directory structure generated!");
if (result.warnings.length > 0) {
  console.warn("⚠️ Warnings:", result.warnings);
}
```

## 📚 Schema Definition

### Basic Schema Structure

A schema is defined as a `LintSchema` object where keys represent file/directory names or patterns, and values define the node type and properties.

```typescript
type LintSchema = Record<string, LintNode>;

type LintNode = FileLintNode | DirectoryLintNode;
```

### Node Types

#### File Node

```typescript
{
  type: "file",
  required?: boolean,           // Default: true
  example?: string,             // Example name for pattern-based keys
  template?: string | (() => string),  // File content template
  validate?: (content: string) => boolean | Promise<boolean>  // Custom validation
}
```

#### Directory Node

```typescript
{
  type: "dir",
  required?: boolean,           // Default: true
  example?: string,             // Example name for pattern-based keys
  children?: LintSchema         // Nested schema for subdirectories
}
```

### Pattern Matching

Directory Lint supports flexible pattern matching:

#### 1. Exact Match
```typescript
{
  "config.json": {
    type: "file",
    required: true
  }
}
```

#### 2. Wildcard Pattern
```typescript
{
  "*.test.ts": {
    type: "file",
    required: false,
    example: "example.test.ts"
  }
}
```

#### 3. Regex Pattern
```typescript
{
  "/^component-.+\\.tsx$/": {
    type: "file",
    required: false,
    example: "component-button.tsx"
  }
}
```

## 🎯 Framework Presets

Directory Lint includes **15+ pre-configured schemas** for popular frameworks:

### Frontend
- **Vite** - React, Vue, Svelte + Tailwind + Vitest
- **Next.js** - App Router & Pages Router
- **React** - CRA with Redux & Router
- **Vue** - Vue 3 with Pinia & Router
- **Angular** - Standalone & Module-based
- **Svelte/SvelteKit** - With adapters
- **Nuxt** - Nuxt 3 with plugins
- **Astro** - Multi-framework support
- **Remix** - Full-stack framework
- **Gatsby** - Static site generator

### Backend
- **NestJS** - Microservices, GraphQL, Prisma
- **Express** - REST APIs with databases

### Desktop
- **Electron** - Desktop applications

### Monorepo
- **Turborepo** - Modern monorepo tool
- **Nx** - Smart monorepo
- **Lerna** - Classic monorepo

### Using Presets

```typescript
import { DirectoryLint } from "directory-lint";
import { nextjs, nestjs, vite } from "directory-lint/presets";

// Next.js with App Router
const nextSchema = nextjs({
  appRouter: true,
  withTypeScript: true,
  withTailwind: true,
  withSrcDir: true
});

// NestJS with Prisma and GraphQL
const nestSchema = nestjs({
  withPrisma: true,
  withGraphQL: true,
  withTesting: true
});

// Vite with React
const viteSchema = vite({
  withTypeScript: true,
  withReact: true,
  withVitest: true
});

const linter = new DirectoryLint();
await linter.validate("./my-app", nextSchema);
```

See the [Presets Documentation](./src/presets/README.md) for all available options.

## 🔧 Advanced Features

### File Templates

```typescript
const schema: LintSchema = {
  "README.md": {
    type: "file",
    template: "# My Project\n\nGenerated with Directory Lint"
  },
  "package.json": {
    type: "file",
    template: () => JSON.stringify({
      name: "my-project",
      version: "1.0.0",
      createdAt: new Date().toISOString()
    }, null, 2)
  }
};
```

### Custom Validation

```typescript
const schema: LintSchema = {
  "package.json": {
    type: "file",
    required: true,
    validate: async (content) => {
      const pkg = JSON.parse(content);
      return pkg.name && pkg.version;
    }
  }
};
```

### Validation Options

```typescript
const result = await linter.validate("./project", schema, {
  ignore: ["node_modules", "dist", ".git", "*.log"]
});
```

### Generation Options

```typescript
const result = await linter.generate("./project", schema, {
  overwrite: true,    // Overwrite existing files
  recursive: true     // Create parent directories
});
```

### Validation Results

```typescript
interface ValidationResult {
  valid: boolean;
  errors: Array<{
    path: string;
    message: string;
    type: "missing" | "invalid-type" | "custom";
  }>;
  warnings: Array<{
    path: string;
    message: string;
  }>;
}
```

## 💡 Use Cases

### 1. Project Templates
Ensure scaffolded projects follow the correct structure:

```typescript
import { DirectoryLint } from "directory-lint";
import { react } from "directory-lint/presets";

async function createProject(name: string) {
  const linter = new DirectoryLint();
  const schema = react({ withTypeScript: true, withRedux: true });
  
  await linter.generate(`./${name}`, schema);
  console.log(`✅ Created ${name}`);
}
```

### 2. CI/CD Validation
Verify repository structure in build pipelines:

```typescript
// validate-structure.ts
import { DirectoryLint } from "directory-lint";
import { nextjs } from "directory-lint/presets";

const linter = new DirectoryLint();
const schema = nextjs({ appRouter: true, withTypeScript: true });

const result = await linter.validate(".", schema, {
  ignore: ["node_modules", "dist", ".next"]
});

if (!result.valid) {
  console.error("Structure validation failed!");
  console.error(result.errors);
  process.exit(1);
}
```

### 3. Monorepo Validation
Ensure consistent structure across packages:

```typescript
import { DirectoryLint, type LintSchema } from "directory-lint";
import { monorepo, nextjs, nestjs } from "directory-lint/presets";

const schema: LintSchema = {
  ...monorepo({ withTurborepo: true, packageManager: "pnpm" }),
  "apps": {
    type: "dir",
    required: true,
    children: {
      "web": {
        type: "dir",
        children: nextjs({ appRouter: true })
      },
      "api": {
        type: "dir",
        children: nestjs({ withPrisma: true })
      }
    }
  }
};

const linter = new DirectoryLint();
await linter.validate(".", schema);
```

## 🔌 Custom Backend

Create custom backends for different environments:

```typescript
import { LintBackend, LintItem } from "directory-lint";

const S3Backend: LintBackend = {
  getAllItems(path: string): LintItem[] {
    // Your S3 implementation
    return [];
  },

  writeFile(path: string, content: string): void {
    // Your S3 implementation
  },

  makeDirectory(path: string, recursive?: boolean): void {
    // Your S3 implementation
  },

  exists(path: string): boolean {
    // Your S3 implementation
    return false;
  }
};

const linter = new DirectoryLint(S3Backend);
```

## 📖 API Reference

### `DirectoryLint`

#### Constructor
```typescript
constructor(backend?: LintBackend)
```

#### Methods

##### `validate(path: string, schema: LintSchema, options?: ValidateOptions): Promise<ValidationResult>`
Validates a directory structure against a schema.

**Options:**
- `ignore`: Array of patterns to ignore

**Returns:** Validation result with errors and warnings

##### `generate(path: string, schema: LintSchema, options?: GenerateOptions): Promise<GenerationResult>`
Generates a directory structure based on a schema.

**Options:**
- `overwrite`: Overwrite existing files (default: false)
- `recursive`: Create parent directories (default: false)

**Returns:** Generation result with warnings

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Adding a New Preset

1. Create a new file in `src/presets/`
2. Export a function that returns a `LintSchema`
3. Add the export to `src/presets/index.ts`
4. Update the presets README

## 📝 License

MIT © Henry Vilani

## 🙏 Acknowledgments

Built with ❤️ for the developer community.

---

**Keywords:** linter,validation, filesystem, directorystructure, architecture, lint
# Directory Lint

A powerful TypeScript library for validating and generating directory structures based on schema definitions. Ensure your project follows the correct file and folder organization with ease.

[![npm version](https://img.shields.io/npm/v/directory-lint.svg)](https://www.npmjs.com/package/directory-lint)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🔍 **Schema-based Validation** - Define your directory structure using intuitive schemas
- 🏗️ **Automatic Generation** - Create directory structures from schemas with content templates
- 📝 **Pattern Matching** - Support for wildcards and regex patterns
- 🔧 **Flexible Backend** - Pluggable backend system (File System or custom)
- 📦 **Zero Dependencies** - Lightweight with minimal footprint
- 🎯 **TypeScript First** - Full TypeScript support with comprehensive types
- ✅ **Custom Validation** - Validate file content with custom functions

## 📦 Installation

```bash
npm install directory-lint
```

## 🚀 Quick Start

### Validating a Directory Structure

```typescript
import { DirectoryLint, type ValidateSchema } from "directory-lint";

const schema: ValidateSchema = {
  "src": {
    type: "directory",
    required: true,
    children: {
      "index.ts": {
        type: "file",
        required: true
      },
      "components": {
        type: "directory",
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

console.log("Validation result:", result);
```

### Generating a Directory Structure

```typescript
import { DirectoryLint, type GenerateSchema } from "directory-lint";

const schema: GenerateSchema = {
  "src": {
    type: "directory",
    children: {
      "index.ts": {
        type: "file",
        content: "export * from './components';\n"
      },
      "utils": {
        type: "directory",
        children: {
          "helper.ts": {
            type: "file",
            content: `// Generated on ${new Date().toISOString()}\n`
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
console.log("Generated paths:", result.paths);
```

## 📚 Schema Definition

### Schema Types

Directory Lint uses two distinct schema types:

- **`GenerateSchema`** - For creating directory structures
- **`ValidateSchema`** - For validating existing directory structures

### Validate Schema Structure

```typescript
type ValidateSchema = Record<string, ValidateNode>;

type ValidateNode = ValidateFileSchema | ValidateDirectorySchema;

interface ValidateFileSchema {
  type: "file";
  validate?: (content: any) => boolean;
  required?: boolean;  // Default: true
}

interface ValidateDirectorySchema {
  type: "directory";
  children?: ValidateSchema;
  required?: boolean;  // Default: true
}
```

### Generate Schema Structure

```typescript
type GenerateSchema = Record<string, GenerateNode>;

type GenerateNode = GenerateFileSchema | GenerateDirectorySchema;

interface GenerateFileSchema {
  type: "file";
  content?: any;  // File content (string, Buffer, etc.)
}

interface GenerateDirectorySchema {
  type: "directory";
  children?: GenerateSchema;
}
```

### Pattern Matching

Directory Lint supports flexible pattern matching in validation schemas:

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
    required: false
  }
}
```

#### 3. Regex Pattern
```typescript
{
  "/^component-.+\\.tsx$/": {
    type: "file",
    required: false
  }
}
```

**Note:** Regex patterns are **not supported** in `GenerateSchema` and will throw a `RegexNotSupported` error.

## 💡 Examples

### Basic Generation

```typescript
import { DirectoryLint, type GenerateSchema } from "directory-lint";

const schema: GenerateSchema = {
  "basic_file": {
    type: "file",
  },
  "basic_folder": {
    type: "directory",
    children: {
      "sub_dir_file": {
        type: "file",
        content: "Hello, World!"
      }
    }
  }
}

const linter = new DirectoryLint();
await linter.generate("./generated", schema, { overwrite: true });
```

### Basic Validation with Custom Validation

```typescript
import { DirectoryLint, type ValidateSchema } from "directory-lint";

const schema: ValidateSchema = {
  "generated": {
    type: "directory",
    required: true,
    children: {
      "content.txt": {
        type: "file",
        required: true
      },
      "*.txt": {
        type: "file",
        validate: (content: string): boolean => {
          return content.length > 1;
        }
      }
    }
  }
}

const linter = new DirectoryLint();
const result = await linter.validate("./", schema, { 
  ignore: ["node_modules"] 
});
```

### Project Template Generation

```typescript
import { DirectoryLint, type GenerateSchema } from "directory-lint";

const projectSchema: GenerateSchema = {
  "src": {
    type: "directory",
    children: {
      "index.ts": {
        type: "file",
        content: "console.log('Hello, TypeScript!');"
      },
      "types": {
        type: "directory",
        children: {
          "index.d.ts": {
            type: "file",
            content: "export {};"
          }
        }
      }
    }
  },
  "package.json": {
    type: "file",
    content: JSON.stringify({
      name: "my-project",
      version: "1.0.0",
      main: "src/index.ts"
    }, null, 2)
  },
  "tsconfig.json": {
    type: "file",
    content: JSON.stringify({
      compilerOptions: {
        target: "ES2020",
        module: "commonjs",
        strict: true
      }
    }, null, 2)
  }
};

const linter = new DirectoryLint();
await linter.generate("./my-new-project", projectSchema, {
  recursive: true,
  overwrite: false
});
```

### CI/CD Validation

```typescript
import { DirectoryLint, type ValidateSchema } from "directory-lint";

const ciSchema: ValidateSchema = {
  "src": {
    type: "directory",
    required: true,
    children: {
      "index.ts": {
        type: "file",
        required: true
      }
    }
  },
  "package.json": {
    type: "file",
    required: true,
    validate: (content: any) => {
      try {
        const pkg = JSON.parse(content);
        return pkg.name && pkg.version;
      } catch {
        return false;
      }
    }
  },
  "*.config.js": {
    type: "file",
    required: false
  }
};

const linter = new DirectoryLint();

try {
  const result = await linter.validate(".", ciSchema, {
    ignore: ["node_modules", "dist", ".git"]
  });
  console.log("✅ Structure validation passed!");
} catch (error) {
  console.error("❌ Structure validation failed:", error.message);
  process.exit(1);
}
```

## 🔌 Custom Backend

Create custom backends for different storage systems:

```typescript
import { LintBackend, LintItem } from "directory-lint";

const CustomBackend: LintBackend = {
  getAllItems(path: string): LintItem[] {
    // Return items in the directory
    return [
      { name: "file.txt", type: "file" },
      { name: "folder", type: "directory" }
    ];
  },

  writeFile(path: string, content: any): void {
    // Write file content
    console.log(`Writing to ${path}:`, content);
  },

  readFile(path: string): any {
    // Read file content
    return "file content";
  },

  makeDirectory(path: string, recursive?: boolean): void {
    // Create directory
    console.log(`Creating directory ${path}, recursive: ${recursive}`);
  },

  exists(path: string): boolean {
    // Check if path exists
    return true;
  }
};

const linter = new DirectoryLint(CustomBackend);
```

## 📖 API Reference

### `DirectoryLint`

#### Constructor
```typescript
constructor(backend?: LintBackend)
```

Creates a new DirectoryLint instance with an optional custom backend. Defaults to `FileSystemBackend`.

#### Methods

##### `generate(cwd: string, schema: GenerateSchema, options?: GenerateOptions): Promise<GenerateResult>`

Generates a directory structure based on a schema.

**Parameters:**
- `cwd`: Current working directory (base path)
- `schema`: Generation schema definition
- `options`: Optional generation options

**Options:**
- `overwrite?: boolean` - Overwrite existing files (default: false)
- `recursive?: boolean` - Create parent directories if they don't exist (default: false)

**Returns:**
```typescript
interface GenerateResult {
  cwd: string;
  paths: Record<string, {
    type: "file" | "directory";
    path: string;
    children?: Record<string, ...>;
  }>;
}
```

**Throws:**
- `RegexNotSupported` - If regex patterns are used in the schema

##### `validate(cwd: string, schema: ValidateSchema, options?: ValidateOptions): Promise<ValidateResult>`

Validates a directory structure against a schema.

**Parameters:**
- `cwd`: Current working directory (base path)
- `schema`: Validation schema definition
- `options`: Optional validation options

**Options:**
- `ignore: string[]` - Array of file/directory names to ignore during validation

**Returns:**
```typescript
interface ValidateResult {
  cwd: string;
  paths: Record<string, {
    type: "file" | "directory";
    name: string;
    path: string;
    children?: Record<string, ...>;
  }>;
}
```

**Throws:**
- `InvalidStructure` - If required items are missing or have incorrect types
- `InvalidContent` - If file content fails custom validation

### Backend Interface

```typescript
interface LintBackend {
  getAllItems(path: string): LintItem[];
  writeFile(path: string, content: any): void;
  readFile(path: string): any;
  makeDirectory(path: string, recursive?: boolean): void;
  exists(path: string): boolean;
}

interface LintItem {
  name: string;
  type: "file" | "directory";
}
```

## 🚨 Error Handling

Directory Lint throws specific errors for different failure scenarios:

```typescript
import { InvalidStructure, InvalidContent, RegexNotSupported } from "directory-lint";

try {
  await linter.validate("./project", schema, { ignore: [] });
} catch (error) {
  if (error instanceof InvalidStructure) {
    console.error("Structure error:", error.message);
  } else if (error instanceof InvalidContent) {
    console.error("Content validation failed:", error.message);
  } else if (error instanceof RegexNotSupported) {
    console.error("Regex not allowed in generate schema:", error.message);
  }
}
```

## 🔍 Pattern Matching Details

### Wildcard Patterns

Use `*` to match any sequence of characters:

```typescript
{
  "*.ts": { type: "file" },        // Matches: file.ts, index.ts, etc.
  "test-*": { type: "directory" }  // Matches: test-unit, test-e2e, etc.
}
```

### Regex Patterns

Use `/pattern/` syntax for complex matching:

```typescript
{
  "/^[a-z]+\\.config\\.(js|ts)$/": {
    type: "file"
  }
}
// Matches: vite.config.js, jest.config.ts, etc.
```

### Exact Match

Simple string keys match exactly:

```typescript
{
  "package.json": { type: "file" },
  "src": { type: "directory" }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/directory-lint.git

# Install dependencies
npm install

# Build the project
npm run build

# Run examples
npm run example:generate
npm run example:validate
```

## 📝 License

MIT © Henry Vilani

## 🙏 Acknowledgments

Built with ❤️ for the developer community.

import { LintSchema } from "../core/types/schema.types.js";

export interface MonorepoPresetOptions {
  withTypeScript?: boolean;
  packageManager?: 'npm' | 'yarn' | 'pnpm';
  withTurborepo?: boolean;
  withNx?: boolean;
  withLerna?: boolean;
}

export function monorepo(options: MonorepoPresetOptions = {}): LintSchema {
  const {
    withTypeScript = true,
    packageManager = 'pnpm',
    withTurborepo = true,
    withNx = false,
    withLerna = false,
  } = options;

  const schema: LintSchema = {
    "packages": {
      type: "dir",
      required: true,
      children: {
        "*": {
          type: "dir",
          example: "web",
          required: false,
          children: {
            "package.json": {
              type: "file",
              required: true,
            },
            "src": {
              type: "dir",
              required: false,
            },
            "tsconfig.json": {
              type: "file",
              required: withTypeScript,
            },
          },
        },
      },
    },
    "apps": {
      type: "dir",
      required: false,
      children: {
        "*": {
          type: "dir",
          example: "web",
          required: false,
          children: {
            "package.json": {
              type: "file",
              required: true,
            },
            "src": {
              type: "dir",
              required: false,
            },
          },
        },
      },
    },
    "package.json": {
      type: "file",
      required: true,
    },
    "tsconfig.json": {
      type: "file",
      required: withTypeScript,
    },
    ".gitignore": {
      type: "file",
      required: true,
    },
    "README.md": {
      type: "file",
      required: false,
    },
  };

  if (packageManager === 'pnpm') {
    schema["pnpm-workspace.yaml"] = {
      type: "file",
      required: true,
    };
    schema["pnpm-lock.yaml"] = {
      type: "file",
      required: false,
    };
  }

  if (packageManager === 'yarn') {
    schema["yarn.lock"] = {
      type: "file",
      required: false,
    };
  }

  if (packageManager === 'npm') {
    schema["package-lock.json"] = {
      type: "file",
      required: false,
    };
  }

  if (withTurborepo) {
    schema["turbo.json"] = {
      type: "file",
      required: true,
    };
  }

  if (withNx) {
    schema["nx.json"] = {
      type: "file",
      required: true,
    };
    schema[".nxignore"] = {
      type: "file",
      required: false,
    };
  }

  if (withLerna) {
    schema["lerna.json"] = {
      type: "file",
      required: true,
    };
  }

  return schema;
}

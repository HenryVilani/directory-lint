import { LintSchema } from "../core/types/schema.types.js";

export interface RemixPresetOptions {
  withTypeScript?: boolean;
  withTailwind?: boolean;
  withPrisma?: boolean;
}

export function remix(options: RemixPresetOptions = {}): LintSchema {
  const {
    withTypeScript = true,
    withTailwind = false,
    withPrisma = false,
  } = options;

  const ext = withTypeScript ? 'tsx' : 'jsx';
  const configExt = withTypeScript ? 'ts' : 'js';

  const schema: LintSchema = {
    "app": {
      type: "dir",
      required: true,
      children: {
        [`entry.client.${ext}`]: {
          type: "file",
          required: true,
        },
        [`entry.server.${ext}`]: {
          type: "file",
          required: true,
        },
        [`root.${ext}`]: {
          type: "file",
          required: true,
        },
        "routes": {
          type: "dir",
          required: true,
          children: {
            [`_index.${ext}`]: {
              type: "file",
              required: true,
            },
            [`*.${ext}`]: {
              type: "file",
              required: false,
              example: `about.${ext}`,
            },
          },
        },
        "components": {
          type: "dir",
          required: false,
        },
        "utils": {
          type: "dir",
          required: false,
        },
        "styles": {
          type: "dir",
          required: false,
          children: {
            "*.css": {
              type: "file",
              required: false,
              example: "global.css",
            },
          },
        },
      },
    },
    "public": {
      type: "dir",
      required: true,
      children: {
        "favicon.ico": {
          type: "file",
          required: false,
        },
      },
    },
    "package.json": {
      type: "file",
      required: true,
    },
    [`remix.config.${configExt}`]: {
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

  if (withTailwind) {
    schema["tailwind.config.js"] = {
      type: "file",
      required: true,
    };
    schema["postcss.config.js"] = {
      type: "file",
      required: true,
    };
  }

  if (withPrisma) {
    schema["prisma"] = {
      type: "dir",
      required: true,
      children: {
        "schema.prisma": {
          type: "file",
          required: true,
        },
        "migrations": {
          type: "dir",
          required: false,
        },
      },
    };
  }

  return schema;
}

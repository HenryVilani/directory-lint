import { LintSchema } from "../core/types/schema.types.js";

export interface ExpressPresetOptions {
  withTypeScript?: boolean;
  withMongoDB?: boolean;
  withPostgreSQL?: boolean;
  withPrisma?: boolean;
  withAuthentication?: boolean;
  withTesting?: boolean;
}

export function express(options: ExpressPresetOptions = {}): LintSchema {
  const {
    withTypeScript = true,
    withMongoDB = false,
    withPostgreSQL = false,
    withPrisma = false,
    withAuthentication = false,
    withTesting = false,
  } = options;

  const ext = withTypeScript ? 'ts' : 'js';

  const schema: LintSchema = {
    "src": {
      type: "dir",
      required: true,
      children: {
        [`index.${ext}`]: {
          type: "file",
          required: true,
        },
        [`app.${ext}`]: {
          type: "file",
          required: true,
        },
        "routes": {
          type: "dir",
          required: true,
          children: {
            [`*.${ext}`]: {
              type: "file",
              required: false,
              example: `users.${ext}`,
            },
          },
        },
        "controllers": {
          type: "dir",
          required: true,
          children: {
            [`*.${ext}`]: {
              type: "file",
              required: false,
              example: `user.controller.${ext}`,
            },
          },
        },
        "services": {
          type: "dir",
          required: false,
          children: {
            [`*.${ext}`]: {
              type: "file",
              required: false,
              example: `user.service.${ext}`,
            },
          },
        },
        "models": {
          type: "dir",
          required: withMongoDB || withPostgreSQL,
          children: {
            [`*.${ext}`]: {
              type: "file",
              required: false,
              example: `user.model.${ext}`,
            },
          },
        },
        "middlewares": {
          type: "dir",
          required: false,
          children: {
            [`*.${ext}`]: {
              type: "file",
              required: false,
              example: `auth.middleware.${ext}`,
            },
          },
        },
        "utils": {
          type: "dir",
          required: false,
        },
        "config": {
          type: "dir",
          required: false,
          children: {
            [`database.${ext}`]: {
              type: "file",
              required: withMongoDB || withPostgreSQL,
            },
          },
        },
      },
    },
    "tests": {
      type: "dir",
      required: withTesting,
      children: {
        [`*.test.${ext}`]: {
          type: "file",
          required: false,
          example: `user.test.${ext}`,
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
    ".env": {
      type: "file",
      required: false,
    },
    ".env.example": {
      type: "file",
      required: false,
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

  if (withAuthentication && schema.src?.type === "dir" && schema.src.children) {
    schema.src.children["auth"] = {
      type: "dir",
      required: true,
      children: {
        [`auth.controller.${ext}`]: {
          type: "file",
          required: true,
        },
        [`auth.service.${ext}`]: {
          type: "file",
          required: true,
        },
      },
    };
  }

  return schema;
}

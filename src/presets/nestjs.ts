import { LintSchema } from "../core/types/schema.types.js";


export interface NestJsPresetOptions {
  withMicroservices?: boolean;
  withGraphQL?: boolean;
  withPrisma?: boolean;
  withTypeORM?: boolean;
  withSwagger?: boolean;
  withTesting?: boolean;
}

export function nestjs(options: NestJsPresetOptions = {}): LintSchema {
  const {
    withMicroservices = false,
    withGraphQL = false,
    withPrisma = false,
    withTypeORM = false,
    withSwagger = false,
    withTesting = true,
  } = options;

  const schema: LintSchema = {
    "src": {
      type: "dir",
      required: true,
      children: {
        "main.ts": {
          type: "file",
          required: true,
        },
        "app.module.ts": {
          type: "file",
          required: true,
        },
        "app.controller.ts": {
          type: "file",
          required: true,
        },
        "app.controller.spec.ts": {
          type: "file",
          required: withTesting,
        },
        "app.service.ts": {
          type: "file",
          required: true,
        },
        "*": {
          type: "dir",
          example: "users",
          required: false,
          children: {
            "*.module.ts": {
              type: "file",
              required: false,
              example: "users.module.ts",
            },
            "*.controller.ts": {
              type: "file",
              required: false,
              example: "users.controller.ts",
            },
            "*.service.ts": {
              type: "file",
              required: false,
              example: "users.service.ts",
            },
            "*.controller.spec.ts": {
              type: "file",
              required: false,
              example: "users.controller.spec.ts",
            },
            "*.service.spec.ts": {
              type: "file",
              required: false,
              example: "users.service.spec.ts",
            },
            "dto": {
              type: "dir",
              required: false,
              children: {
                "*.dto.ts": {
                  type: "file",
                  required: false,
                  example: "create-user.dto.ts",
                },
              },
            },
            "entities": {
              type: "dir",
              required: false,
              children: {
                "*.entity.ts": {
                  type: "file",
                  required: false,
                  example: "user.entity.ts",
                },
              },
            },
          },
        },
        "common": {
          type: "dir",
          required: false,
          children: {
            "filters": {
              type: "dir",
              required: false,
            },
            "guards": {
              type: "dir",
              required: false,
            },
            "interceptors": {
              type: "dir",
              required: false,
            },
            "pipes": {
              type: "dir",
              required: false,
            },
            "decorators": {
              type: "dir",
              required: false,
            },
          },
        },
        "config": {
          type: "dir",
          required: false,
        },
      },
    },
    "test": {
      type: "dir",
      required: withTesting,
      children: {
        "app.e2e-spec.ts": {
          type: "file",
          required: true,
        },
        "jest-e2e.json": {
          type: "file",
          required: true,
        },
      },
    },
    "package.json": {
      type: "file",
      required: true,
    },
    "tsconfig.json": {
      type: "file",
      required: true,
    },
    "tsconfig.build.json": {
      type: "file",
      required: true,
    },
    "nest-cli.json": {
      type: "file",
      required: true,
    },
    ".eslintrc.js": {
      type: "file",
      required: true,
    },
    ".prettierrc": {
      type: "file",
      required: true,
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

  if (withGraphQL && schema.src?.type === "dir" && schema.src.children) {
    schema.src.children["schema.gql"] = {
      type: "file",
      required: true,
    };
    schema.src.children["*.resolver.ts"] = {
      type: "file",
      required: false,
      example: "users.resolver.ts",
    };
  }

  if (withMicroservices && schema.src?.type === "dir" && schema.src.children) {
    schema.src.children["microservices"] = {
      type: "dir",
      required: false,
    };
  }

  return schema;
}

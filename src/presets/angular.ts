import { LintSchema } from "../core/types/schema.types.js";

export interface AngularPresetOptions {
  withStandalone?: boolean;
  withNgrx?: boolean;
  withMaterial?: boolean;
  withTesting?: boolean;
}

export function angular(options: AngularPresetOptions = {}): LintSchema {
  const {
    withStandalone = true,
    withNgrx = false,
    withMaterial = false,
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
        "index.html": {
          type: "file",
          required: true,
        },
        "styles.css": {
          type: "file",
          required: false,
        },
        "app": {
          type: "dir",
          required: true,
          children: {
            "app.component.ts": {
              type: "file",
              required: true,
            },
            "app.component.html": {
              type: "file",
              required: true,
            },
            "app.component.css": {
              type: "file",
              required: false,
            },
            "app.component.spec.ts": {
              type: "file",
              required: withTesting,
            },
            "app.config.ts": {
              type: "file",
              required: withStandalone,
            },
            "app.module.ts": {
              type: "file",
              required: !withStandalone,
            },
            "app.routes.ts": {
              type: "file",
              required: withStandalone,
            },
            "app-routing.module.ts": {
              type: "file",
              required: !withStandalone,
            },
            "components": {
              type: "dir",
              required: false,
            },
            "services": {
              type: "dir",
              required: false,
            },
            "models": {
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
          },
        },
        "assets": {
          type: "dir",
          required: false,
        },
        "environments": {
          type: "dir",
          required: false,
          children: {
            "environment.ts": {
              type: "file",
              required: true,
            },
            "environment.development.ts": {
              type: "file",
              required: false,
            },
          },
        },
      },
    },
    "angular.json": {
      type: "file",
      required: true,
    },
    "package.json": {
      type: "file",
      required: true,
    },
    "tsconfig.json": {
      type: "file",
      required: true,
    },
    "tsconfig.app.json": {
      type: "file",
      required: true,
    },
    "tsconfig.spec.json": {
      type: "file",
      required: withTesting,
    },
    ".editorconfig": {
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

  if (withNgrx && schema.src?.type === "dir" && schema.src.children?.app?.type === "dir" && schema.src.children.app.children) {
    schema.src.children.app.children["store"] = {
      type: "dir",
      required: true,
      children: {
        "actions": {
          type: "dir",
          required: false,
        },
        "reducers": {
          type: "dir",
          required: false,
        },
        "effects": {
          type: "dir",
          required: false,
        },
        "selectors": {
          type: "dir",
          required: false,
        },
      },
    };
  }

  return schema;
}

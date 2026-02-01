import { LintSchema } from "../core/types/schema.types.js";

export interface VuePresetOptions {
  withTypeScript?: boolean;
  withPinia?: boolean;
  withRouter?: boolean;
  withVuetify?: boolean;
  withTesting?: boolean;
}

export function vue(options: VuePresetOptions = {}): LintSchema {
  const {
    withTypeScript = true,
    withPinia = false,
    withRouter = false,
    withVuetify = false,
    withTesting = false,
  } = options;

  const ext = withTypeScript ? 'ts' : 'js';

  const schema: LintSchema = {
    "src": {
      type: "dir",
      required: true,
      children: {
        [`main.${ext}`]: {
          type: "file",
          required: true,
        },
        "App.vue": {
          type: "file",
          required: true,
        },
        "components": {
          type: "dir",
          required: false,
          children: {
            "*.vue": {
              type: "file",
              required: false,
              example: "HelloWorld.vue",
            },
          },
        },
        "views": {
          type: "dir",
          required: withRouter,
          children: {
            "*.vue": {
              type: "file",
              required: false,
              example: "HomeView.vue",
            },
          },
        },
        "composables": {
          type: "dir",
          required: false,
        },
        "assets": {
          type: "dir",
          required: false,
        },
      },
    },
    "public": {
      type: "dir",
      required: true,
    },
    "package.json": {
      type: "file",
      required: true,
    },
    "vite.config.ts": {
      type: "file",
      required: withTypeScript,
    },
    "vite.config.js": {
      type: "file",
      required: !withTypeScript,
    },
    "tsconfig.json": {
      type: "file",
      required: withTypeScript,
    },
    "tsconfig.app.json": {
      type: "file",
      required: withTypeScript,
    },
    "tsconfig.node.json": {
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

  if (withPinia && schema.src?.type === "dir" && schema.src.children) {
    schema.src.children["stores"] = {
      type: "dir",
      required: true,
      children: {
        [`*.${ext}`]: {
          type: "file",
          required: false,
          example: `counter.${ext}`,
        },
      },
    };
  }

  if (withRouter && schema.src?.type === "dir" && schema.src.children) {
    schema.src.children["router"] = {
      type: "dir",
      required: true,
      children: {
        [`index.${ext}`]: {
          type: "file",
          required: true,
        },
      },
    };
  }

  if (withTesting) {
    schema["tests"] = {
      type: "dir",
      required: true,
      children: {
        "unit": {
          type: "dir",
          required: false,
        },
        "e2e": {
          type: "dir",
          required: false,
        },
      },
    };
    schema["vitest.config.ts"] = {
      type: "file",
      required: withTypeScript,
    };
  }

  return schema;
}

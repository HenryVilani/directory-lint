import { LintSchema } from "../core/types/schema.types.js";

export interface NuxtPresetOptions {
  withTypeScript?: boolean;
  withPinia?: boolean;
  withTailwind?: boolean;
  withContent?: boolean;
}

export function nuxt(options: NuxtPresetOptions = {}): LintSchema {
  const {
    withTypeScript = true,
    withPinia = false,
    withTailwind = false,
    withContent = false,
  } = options;

  const ext = withTypeScript ? 'ts' : 'js';

  const schema: LintSchema = {
    "pages": {
      type: "dir",
      required: false,
      children: {
        "index.vue": {
          type: "file",
          required: false,
        },
        "*.vue": {
          type: "file",
          required: false,
          example: "about.vue",
        },
      },
    },
    "components": {
      type: "dir",
      required: false,
      children: {
        "*.vue": {
          type: "file",
          required: false,
          example: "TheHeader.vue",
        },
      },
    },
    "layouts": {
      type: "dir",
      required: false,
      children: {
        "default.vue": {
          type: "file",
          required: false,
        },
      },
    },
    "composables": {
      type: "dir",
      required: false,
    },
    "plugins": {
      type: "dir",
      required: false,
    },
    "middleware": {
      type: "dir",
      required: false,
    },
    "server": {
      type: "dir",
      required: false,
      children: {
        "api": {
          type: "dir",
          required: false,
        },
        "routes": {
          type: "dir",
          required: false,
        },
        "middleware": {
          type: "dir",
          required: false,
        },
      },
    },
    "assets": {
      type: "dir",
      required: false,
      children: {
        "css": {
          type: "dir",
          required: false,
        },
      },
    },
    "public": {
      type: "dir",
      required: false,
    },
    "app.vue": {
      type: "file",
      required: false,
    },
    [`nuxt.config.${ext}`]: {
      type: "file",
      required: true,
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

  if (withPinia) {
    schema["stores"] = {
      type: "dir",
      required: false,
      children: {
        [`*.${ext}`]: {
          type: "file",
          required: false,
          example: `counter.${ext}`,
        },
      },
    };
  }

  if (withTailwind) {
    schema["tailwind.config.js"] = {
      type: "file",
      required: true,
    };
  }

  if (withContent) {
    schema["content"] = {
      type: "dir",
      required: true,
      children: {
        "*.md": {
          type: "file",
          required: false,
          example: "index.md",
        },
      },
    };
  }

  return schema;
}

import { LintSchema } from "../core/types/schema.types.js";

export interface VitePresetOptions {
  withTypeScript?: boolean;
  withReact?: boolean;
  withVue?: boolean;
  withSvelte?: boolean;
  withTailwind?: boolean;
  withVitest?: boolean;
}

export function vite(options: VitePresetOptions = {}): LintSchema {
  const {
    withTypeScript = true,
    withReact = false,
    withVue = false,
    withSvelte = false,
    withTailwind = false,
    withVitest = false,
  } = options;

  const schema: LintSchema = {
    "src": {
      type: "dir",
      required: true,
      children: {
        "main.ts": {
          type: "file",
          required: !withTypeScript,
        },
        "main.tsx": {
          type: "file",
          required: withTypeScript && withReact,
        },
        "App.tsx": {
          type: "file",
          required: withReact,
        },
        "App.vue": {
          type: "file",
          required: withVue,
        },
        "App.svelte": {
          type: "file",
          required: withSvelte,
        },
        "index.css": {
          type: "file",
          required: false,
        },
        "assets": {
          type: "dir",
          required: false,
        },
        "components": {
          type: "dir",
          required: false,
        },
      },
    },
    "public": {
      type: "dir",
      required: true,
    },
    "index.html": {
      type: "file",
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
    "tsconfig.node.json": {
      type: "file",
      required: withTypeScript,
    },
    "tailwind.config.js": {
      type: "file",
      required: withTailwind,
    },
    "postcss.config.js": {
      type: "file",
      required: withTailwind,
    },
    "vitest.config.ts": {
      type: "file",
      required: withVitest,
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

  return schema;
}

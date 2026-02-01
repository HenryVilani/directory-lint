import { LintSchema } from "../core/types/schema.types.js";

export interface ElectronPresetOptions {
  withTypeScript?: boolean;
  withReact?: boolean;
  withVue?: boolean;
  withVite?: boolean;
}

export function electron(options: ElectronPresetOptions = {}): LintSchema {
  const {
    withTypeScript = true,
    withReact = false,
    withVue = false,
    withVite = false,
  } = options;

  const ext = withTypeScript ? 'ts' : 'js';
  const uiExt = withReact ? 'tsx' : (withVue ? 'vue' : (withTypeScript ? 'ts' : 'js'));

  const schema: LintSchema = {
    "src": {
      type: "dir",
      required: true,
      children: {
        "main": {
          type: "dir",
          required: true,
          children: {
            [`main.${ext}`]: {
              type: "file",
              required: true,
            },
            [`preload.${ext}`]: {
              type: "file",
              required: true,
            },
          },
        },
        "renderer": {
          type: "dir",
          required: true,
          children: {
            "index.html": {
              type: "file",
              required: true,
            },
            [`index.${uiExt}`]: {
              type: "file",
              required: true,
            },
            "components": {
              type: "dir",
              required: false,
            },
            "assets": {
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
    "electron-builder.json": {
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

  if (withVite) {
    schema[`vite.config.${ext}`] = {
      type: "file",
      required: true,
    };
  }

  return schema;
}

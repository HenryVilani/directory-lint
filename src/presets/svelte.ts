import { LintSchema } from "../core/types/schema.types.js";

export interface SveltePresetOptions {
  withSvelteKit?: boolean;
  withTypeScript?: boolean;
  withTailwind?: boolean;
  withAdapter?: 'auto' | 'node' | 'static' | 'vercel' | 'netlify';
}

export function svelte(options: SveltePresetOptions = {}): LintSchema {
  const {
    withSvelteKit = true,
    withTypeScript = true,
    withTailwind = false,
    withAdapter = 'auto',
  } = options;

  const ext = withTypeScript ? 'ts' : 'js';

  if (withSvelteKit) {
    const schema: LintSchema = {
      "src": {
        type: "dir",
        required: true,
        children: {
          "routes": {
            type: "dir",
            required: true,
            children: {
              "+page.svelte": {
                type: "file",
                required: true,
              },
              "+layout.svelte": {
                type: "file",
                required: false,
              },
              [`+page.${ext}`]: {
                type: "file",
                required: false,
              },
              [`+layout.${ext}`]: {
                type: "file",
                required: false,
              },
            },
          },
          "lib": {
            type: "dir",
            required: false,
            children: {
              "components": {
                type: "dir",
                required: false,
              },
              [`index.${ext}`]: {
                type: "file",
                required: false,
              },
            },
          },
          "app.html": {
            type: "file",
            required: true,
          },
          "app.css": {
            type: "file",
            required: false,
          },
        },
      },
      "static": {
        type: "dir",
        required: true,
      },
      "package.json": {
        type: "file",
        required: true,
      },
      [`svelte.config.${ext === 'ts' ? 'js' : 'js'}`]: {
        type: "file",
        required: true,
      },
      [`vite.config.${ext}`]: {
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

    return schema;
  } else {
    // Regular Svelte (with Vite)
    const schema: LintSchema = {
      "src": {
        type: "dir",
        required: true,
        children: {
          "App.svelte": {
            type: "file",
            required: true,
          },
          [`main.${ext}`]: {
            type: "file",
            required: true,
          },
          "lib": {
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
      [`vite.config.${ext}`]: {
        type: "file",
        required: true,
      },
      [`svelte.config.${ext === 'ts' ? 'js' : 'js'}`]: {
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

    return schema;
  }
}

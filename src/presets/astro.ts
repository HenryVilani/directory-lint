import { LintSchema } from "../core/types/schema.types.js";

export interface AstroPresetOptions {
  withTypeScript?: boolean;
  withReact?: boolean;
  withVue?: boolean;
  withSvelte?: boolean;
  withTailwind?: boolean;
  withMDX?: boolean;
}

export function astro(options: AstroPresetOptions = {}): LintSchema {
  const {
    withTypeScript = true,
    withReact = false,
    withVue = false,
    withSvelte = false,
    withTailwind = false,
    withMDX = false,
  } = options;

  const configExt = withTypeScript ? 'mjs' : 'mjs';

  const schema: LintSchema = {
    "src": {
      type: "dir",
      required: true,
      children: {
        "pages": {
          type: "dir",
          required: true,
          children: {
            "index.astro": {
              type: "file",
              required: true,
            },
            "*.astro": {
              type: "file",
              required: false,
              example: "about.astro",
            },
          },
        },
        "components": {
          type: "dir",
          required: false,
          children: {
            "*.astro": {
              type: "file",
              required: false,
              example: "Card.astro",
            },
          },
        },
        "layouts": {
          type: "dir",
          required: false,
          children: {
            "*.astro": {
              type: "file",
              required: false,
              example: "Layout.astro",
            },
          },
        },
        "content": {
          type: "dir",
          required: false,
          children: {
            "config.ts": {
              type: "file",
              required: false,
            },
          },
        },
        "styles": {
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
    [`astro.config.${configExt}`]: {
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

  if (withTailwind) {
    schema["tailwind.config.cjs"] = {
      type: "file",
      required: true,
    };
  }

  if (withMDX && schema.src?.type === "dir" && schema.src.children?.pages?.type === "dir" && schema.src.children.pages.children) {
    schema.src.children.pages.children["*.mdx"] = {
      type: "file",
      required: false,
      example: "blog.mdx",
    };
  }

  return schema;
}

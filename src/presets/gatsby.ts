import { LintSchema } from "../core/types/schema.types.js";

export interface GatsbyPresetOptions {
  withTypeScript?: boolean;
  withContentful?: boolean;
  withMDX?: boolean;
  withTailwind?: boolean;
}

export function gatsby(options: GatsbyPresetOptions = {}): LintSchema {
  const {
    withTypeScript = true,
    withContentful = false,
    withMDX = false,
    withTailwind = false,
  } = options;

  const ext = withTypeScript ? 'tsx' : 'jsx';
  const configExt = withTypeScript ? 'ts' : 'js';

  const schema: LintSchema = {
    "src": {
      type: "dir",
      required: true,
      children: {
        "pages": {
          type: "dir",
          required: true,
          children: {
            [`index.${ext}`]: {
              type: "file",
              required: true,
            },
            [`404.${ext}`]: {
              type: "file",
              required: false,
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
          children: {
            [`*.${ext}`]: {
              type: "file",
              required: false,
              example: `layout.${ext}`,
            },
          },
        },
        "templates": {
          type: "dir",
          required: false,
          children: {
            [`*.${ext}`]: {
              type: "file",
              required: false,
              example: `blog-post.${ext}`,
            },
          },
        },
        "images": {
          type: "dir",
          required: false,
        },
        "styles": {
          type: "dir",
          required: false,
        },
      },
    },
    "static": {
      type: "dir",
      required: false,
    },
    "content": {
      type: "dir",
      required: withMDX,
      children: {
        "*.mdx": {
          type: "file",
          required: false,
          example: "hello-world.mdx",
        },
      },
    },
    "package.json": {
      type: "file",
      required: true,
    },
    [`gatsby-config.${configExt}`]: {
      type: "file",
      required: true,
    },
    [`gatsby-node.${configExt}`]: {
      type: "file",
      required: false,
    },
    [`gatsby-browser.${configExt}`]: {
      type: "file",
      required: false,
    },
    [`gatsby-ssr.${configExt}`]: {
      type: "file",
      required: false,
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
}

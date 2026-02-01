import { LintSchema } from "../core/types/schema.types.js";

export interface NextJsPresetOptions {
  appRouter?: boolean;
  withTypeScript?: boolean;
  withTailwind?: boolean;
  withSrcDir?: boolean;
  withESLint?: boolean;
}

export function nextjs(options: NextJsPresetOptions = {}): LintSchema {
  const {
    appRouter = true,
    withTypeScript = true,
    withTailwind = false,
    withSrcDir = false,
    withESLint = true,
  } = options;

  const ext = withTypeScript ? 'tsx' : 'jsx';
  const configExt = withTypeScript ? 'ts' : 'js';
  const baseDir = withSrcDir ? 'src' : '';

  const appDirectory: LintSchema = {
    [`layout.${ext}`]: {
      type: "file",
      required: true,
    },
    [`page.${ext}`]: {
      type: "file",
      required: true,
    },
    "globals.css": {
      type: "file",
      required: false,
    },
    "api": {
      type: "dir",
      required: false,
      children: {
        "*": {
          type: "dir",
          example: "users",
          children: {
            [`route.${configExt}`]: {
              type: "file",
              required: true,
            },
          },
        },
      },
    },
  };

  const pagesDirectory: LintSchema = {
    [`_app.${ext}`]: {
      type: "file",
      required: true,
    },
    [`_document.${ext}`]: {
      type: "file",
      required: false,
    },
    [`index.${ext}`]: {
      type: "file",
      required: true,
    },
    "api": {
      type: "dir",
      required: false,
      children: {
        "*.ts": {
          type: "file",
          required: false,
          example: "hello.ts",
        },
      },
    },
  };

  const schema: LintSchema = {
    "package.json": {
      type: "file",
      required: true,
    },
    [`next.config.${configExt}`]: {
      type: "file",
      required: true,
    },
    "tsconfig.json": {
      type: "file",
      required: withTypeScript,
    },
    ".eslintrc.json": {
      type: "file",
      required: withESLint,
    },
    "tailwind.config.js": {
      type: "file",
      required: withTailwind,
    },
    "postcss.config.js": {
      type: "file",
      required: withTailwind,
    },
    "public": {
      type: "dir",
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

  if (withSrcDir) {
    schema["src"] = {
      type: "dir",
      required: true,
      children: {
        [appRouter ? "app" : "pages"]: {
          type: "dir",
          required: true,
          children: appRouter ? appDirectory : pagesDirectory,
        },
        "components": {
          type: "dir",
          required: false,
        },
      },
    };
  } else {
    schema[appRouter ? "app" : "pages"] = {
      type: "dir",
      required: true,
      children: appRouter ? appDirectory : pagesDirectory,
    };
    schema["components"] = {
      type: "dir",
      required: false,
    };
  }

  return schema;
}

import { LintSchema } from "../core/types/schema.types.js";

export interface ReactPresetOptions {
  withTypeScript?: boolean;
  withRedux?: boolean;
  withRouter?: boolean;
  withTesting?: boolean;
}

export function react(options: ReactPresetOptions = {}): LintSchema {
  const {
    withTypeScript = true,
    withRedux = false,
    withRouter = false,
    withTesting = true,
  } = options;

  const ext = withTypeScript ? 'tsx' : 'jsx';
  const testExt = withTypeScript ? 'tsx' : 'js';

  const schema: LintSchema = {
    "src": {
      type: "dir",
      required: true,
      children: {
        [`App.${ext}`]: {
          type: "file",
          required: true,
        },
        [`App.test.${testExt}`]: {
          type: "file",
          required: withTesting,
        },
        "App.css": {
          type: "file",
          required: false,
        },
        [`index.${ext}`]: {
          type: "file",
          required: true,
        },
        "index.css": {
          type: "file",
          required: false,
        },
        "components": {
          type: "dir",
          required: false,
        },
        "hooks": {
          type: "dir",
          required: false,
        },
        "utils": {
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
      children: {
        "index.html": {
          type: "file",
          required: true,
        },
        "favicon.ico": {
          type: "file",
          required: false,
        },
        "manifest.json": {
          type: "file",
          required: false,
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
    ".gitignore": {
      type: "file",
      required: true,
    },
    "README.md": {
      type: "file",
      required: false,
    },
  };

  if (withRedux && schema.src?.type === "dir" && schema.src.children) {
    schema.src.children["store"] = {
      type: "dir",
      required: true,
      children: {
        [`index.${withTypeScript ? 'ts' : 'js'}`]: {
          type: "file",
          required: true,
        },
        "slices": {
          type: "dir",
          required: false,
        },
      },
    };
  }

  if (withRouter && schema.src?.type === "dir" && schema.src.children) {
    schema.src.children["pages"] = {
      type: "dir",
      required: false,
    };
    schema.src.children["routes"] = {
      type: "dir",
      required: false,
    };
  }

  return schema;
}

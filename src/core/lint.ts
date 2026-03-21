import { join } from "path";
import { LintBackend } from "./backend.js";
import { FileSystemBackend } from "../backends/FileSystemBackend.js";
import {
  GenerateOptions,
  GenerateResult,
  ValidateOptions,
  ValidateResult,
} from "./types/lint.types.js";
import { GenerateSchema, ValidateSchema } from "./types/schema.types.js";
import {
  InvalidContent,
  InvalidStructure,
  RegexNotSupported,
} from "./errors.js";

export class DirectoryLint {
  constructor(private readonly backend: LintBackend = FileSystemBackend) {}

  async generate(
    cwd: string,
    schema: GenerateSchema,
    options?: GenerateOptions,
  ): Promise<GenerateResult> {
    const result: GenerateResult = {
      cwd,
      paths: {},
    };

    if (!this.backend.exists(cwd)) {
      this.backend.makeDirectory(cwd, options?.recursive);
    }

    for (const [name, node] of Object.entries(schema)) {
      const isRegexLiteral = name.startsWith("/") && name.endsWith("/");
      if (isRegexLiteral) throw new RegexNotSupported(name);

      const fullPath = join(cwd, name);

      if (node.type === "directory") {
        let childrenResult: GenerateResult | undefined;

        if (!this.backend.exists(fullPath)) {
          this.backend.makeDirectory(fullPath, options?.recursive);
        }

        if (node.children) {
          childrenResult = await this.generate(
            fullPath,
            node.children,
            options,
          );
        }

        result.paths[name] = {
          type: "directory",
          path: fullPath,
          ...(childrenResult?.paths && {
            children: childrenResult.paths,
          }),
        };
      }

      if (node.type === "file") {
        if (!this.backend.exists(fullPath)) {
          this.backend.writeFile(fullPath, node.content ?? "");
        } else if (options?.overwrite) {
          this.backend.writeFile(fullPath, node.content ?? "");
        }

        result.paths[name] = {
          type: "file",
          path: fullPath,
        };
      }
    }

    return result;
  }

  async validate<TSchema extends ValidateSchema>(
    cwd: string,
    schema: TSchema,
    options?: ValidateOptions,
  ): Promise<ValidateResult<TSchema>> {
    const result = {
      cwd,
      paths: {},
    } as ValidateResult<TSchema>;

    const items = this.backend.getAllItems(cwd);
    const processedNames = new Set<string>();

    const sortedEntries = (
      Object.entries(schema) as [keyof TSchema, TSchema[keyof TSchema]][]
    ).sort(([a], [b]) => {
      const aHasWildcard = String(a).includes("*");
      const bHasWildcard = String(b).includes("*");
      if (!aHasWildcard && bHasWildcard) return -1;
      if (aHasWildcard && !bHasWildcard) return 1;
      return 0;
    });

    for (const [pattern, node] of sortedEntries) {
      const regex = this.patternToRegex(String(pattern));

      const matchedItems = items.filter(
        (item) => regex.test(item.name) && !processedNames.has(item.name),
      );

      const isRequired = (node as any).required ?? true;

      if (matchedItems.length === 0 && isRequired) {
        throw new InvalidStructure(String(pattern));
      }

      for (const { name, type } of matchedItems) {
        if (options?.ignore.includes(name)) continue;

        processedNames.add(name);

        const fullPath = join(cwd, name);

        if (node.type === "directory") {
          if (type !== "directory") {
            throw new InvalidStructure(fullPath);
          }

          let childrenResult;

          if (node.children) {
            childrenResult = await this.validate(
              fullPath,
              node.children,
              options,
            );
          }

          (result.paths as any)[name] = {
            path: fullPath,
            name,
            type: "directory",
            ...(childrenResult?.paths && {
              children: childrenResult.paths,
            }),
          };
        }

        if (node.type === "file") {
          if (type !== "file") {
            throw new InvalidStructure(fullPath);
          }

          const content = this.backend.readFile(fullPath);

          if (node.validate && !node.validate(content)) {
            throw new InvalidContent(fullPath);
          }

          (result.paths as any)[name] = {
            path: fullPath,
            name,
            type: "file",
          };
        }
      }
    }

    return result;
  }

  private patternToRegex(pattern: string): RegExp {
    if (pattern.startsWith("/") && pattern.endsWith("/")) {
      return new RegExp(pattern.slice(1, -1));
    }

    const escaped = pattern
      .replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*");

    return new RegExp(`^${escaped}$`);
  }
}


import { join } from "path";
import { LintBackend } from "./backend.js";
import { FileSystemBackend } from "../backends/FileSystemBackend.js";
import { LintSchema } from "./types/schema.types.js";
import { GenerateOptions, GenerationResult, ValidateOptions, ValidationResult } from "./types/lint.types.js";

export class DirectoryLint {

    constructor(
        private readonly backend: LintBackend = FileSystemBackend
    ) {}

    async generate(path: string, schema: LintSchema, options?: GenerateOptions): Promise<GenerationResult> {

        const result: GenerationResult = {

            warnings: []

        };
       
        if (!this.backend.exists(path)) this.backend.makeDirectory(path, options?.recursive);

        for (const [pattern, node] of Object.entries(schema)) {
            
            const isRegexLiteral = pattern.startsWith('/') && pattern.endsWith('/');
            const name = node.example || (isRegexLiteral ? null : pattern.replace(/\*/g, ''));

            if (!name) {
                console.warn(`[Warn] No example field setted to: ${pattern}.`);
                result.warnings.push({
                    type: "missing",
                    path: join(path, name ?? pattern),
                    message: `No example field setted ${pattern}`
                })
                continue;
            }

            const fullPath = join(path, name);

            if (node.type === "dir") {

                if (!this.backend.exists(fullPath)) {
                    this.backend.makeDirectory(fullPath, options?.recursive);
                }
                
                if (node.children) {
                    this.generate(fullPath, node.children);
                }
                
            } else if (node.type === "file") {
                
                if (!this.backend.exists(fullPath)) {
                    this.backend.writeFile(fullPath, ""); 
                }else {

                    if (options?.overwrite) {

                        this.backend.writeFile(
                            fullPath,
                            (typeof node.template === "function" ? node.template() : node.template) ?? ""
                        );

                    }

                }

            }
        }

        return result;
    }

    async validate(path: string, schema: LintSchema, options?: ValidateOptions): Promise<ValidationResult> {

        const result: ValidationResult = {
            valid: false,
            errors: [],
            warnings: []
        }

        this.recursiveValidate(path, schema, result, options);

        return result;

    }

    private patternToRegex(pattern: string): RegExp {

        if (pattern.startsWith('/') && pattern.endsWith('/')) {
            return new RegExp(pattern.slice(1, -1));
        }

        const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
        return new RegExp(`^${escaped}$`);
    }

    private async recursiveValidate(path: string, schema: LintSchema, result: ValidationResult, options?: ValidateOptions) {

        const items = this.backend.getAllItems(path);

        for (const [pattern, node] of Object.entries(schema)) {

            const regex = this.patternToRegex(pattern);
            const matchedItems = items.filter(item => regex.test(item.name));

            if (matchedItems.length === 0 && node.required !== false) {

                result.errors.push({
                    type: "missing",
                    message: `not found item with pattern: ${pattern}`,
                    path: join(path, pattern)
                });
                result.valid = false;
                continue;

            }

            for (const {name, type} of matchedItems) {

                if (options?.ignore.includes(name)) continue;

                const fullPath = join(path, name);

                if (node.type === "dir") {
                    
                    if (type !== "dir") {
                        result.errors.push({
                            type: "invalid-type",
                            message: "Inconsistent types found",
                            path: fullPath
                        })
                        result.valid = false;
                        continue;

                    }
                    else if (node.children) {

                        this.recursiveValidate(fullPath, node.children, result, options);

                    }

                }else if (node.type === "file") {

                    if (type !== "file") {

                        result.errors.push({
                            type: "invalid-type",
                            message: "Inconsistent types found",
                            path: fullPath
                        })
                        result.valid = false;
                        continue;

                    }

                    const content = this.backend.readFile(fullPath);
                    if (!(await node.validate?(content) : true)) {

                        result.errors.push({
                            type: "custom",
                            message: `custom validation error in ${name}`,
                            path: fullPath
                        })

                    }

                }

            }

        }

    }

}

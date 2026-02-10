
import { join } from "path";
import { LintBackend } from "./backend.js";
import { FileSystemBackend } from "../backends/FileSystemBackend.js";
import { GenerateOptions, GenerateResult, ValidateOptions, ValidateResult } from "./types/lint.types.js";
import { GenerateSchema, ValidateSchema } from "./types/schema.types.js";
import { InvalidContent, InvalidStructure, RegexNotSupported } from "./errors.js";


export class DirectoryLint {

    constructor(
        private readonly backend: LintBackend = FileSystemBackend
    ) {}

    async generate(cwd: string, schema: GenerateSchema, options?: GenerateOptions): Promise<GenerateResult> {

        const result: GenerateResult = {
            
            cwd: cwd,
            paths: {}
            
        };

        if (!this.backend.exists(cwd)) this.backend.makeDirectory(cwd, options?.recursive);

        for (const [name, node] of Object.entries(schema)) {

            const isRegexLiteral = name.startsWith('/') && name.endsWith('/');
            if (isRegexLiteral) throw new RegexNotSupported(name);

            const fullPath = join(cwd, name);

            if (node.type === "directory") {
                
                let childrenResult: GenerateResult | undefined = undefined;
                
                if (!this.backend.exists(fullPath)) {
                    this.backend.makeDirectory(fullPath, options?.recursive);
                }
                
                if (node.children) {
                    childrenResult = await this.generate(fullPath, node.children, options);
                }

                result.paths[name] = {
                    type: node.type,
                    path: fullPath,
                    ...(childrenResult?.paths && { children: childrenResult.paths })
                };

            } else if (node.type === "file") {

                if (!this.backend.exists(fullPath)) {

                    this.backend.writeFile(fullPath, node.content === undefined ? "" : node.content); 

                }else {

                    if (options?.overwrite) {
                        this.backend.writeFile(fullPath, node.content === undefined ? "" : node.content);
                    }

                }

            }
        }

        return result;
    }

    async validate(cwd: string, schema: ValidateSchema, options?: ValidateOptions): Promise<ValidateResult> {

        const result: ValidateResult = {
            cwd: cwd,
            paths: {},
        }

        const items = this.backend.getAllItems(cwd);

        for (const [pattern, node] of Object.entries(schema)) {

            const regex = this.patternToRegex(pattern);
            const matchedItems = items.filter(item => regex.test(item.name));
            
            if (matchedItems.length === 0 && node.required !== false) throw new InvalidStructure(pattern);

            for (const {name, type} of matchedItems) {

                if (options?.ignore.includes(name)) continue;

                const fullPath = join(cwd, name);

                if (node.type === "directory") {

                    let childrenResult: ValidateResult | undefined = undefined;

                    if (type !== "directory") throw new InvalidStructure(fullPath);
                    else if (node.children) {
                        childrenResult = await this.validate(fullPath, node.children, options);
                    }

                    result.paths[name] = {
                        path: fullPath,
                        name: name,
                        type: node.type,
                        ...(childrenResult?.paths && { children: childrenResult.paths })

                    }

                }else if (node.type === "file") {

                    if (type !== "file") throw new InvalidStructure(fullPath);

                    const content = this.backend.readFile(fullPath);

                    if (node.validate ? !node.validate(content) : false) throw new InvalidContent(fullPath);

                }

            }


        }

        return result;

    }

    private patternToRegex(pattern: string): RegExp {

        if (pattern.startsWith('/') && pattern.endsWith('/')) {
            return new RegExp(pattern.slice(1, -1));
        }

        const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
        return new RegExp(`^${escaped}$`);
    }

}

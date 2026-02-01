import { join } from "path";
import { LintSchema } from "./types.js";
import { LintBackend } from "./backend.js";
import { InvalidItemType, NotFoundRequiredItem } from "../errors.js";
import { FileSystemBackend } from "../backends/FileSystemBackend.js";


export class DirectoryLint {

    constructor(
        private readonly backend: LintBackend = FileSystemBackend
    ) {}

    generate(path: string, schema: LintSchema) {
       
        if (!this.backend.exists(path)) this.backend.makeDirectory(path);

        for (const [pattern, node] of Object.entries(schema)) {
            
            const isRegexLiteral = pattern.startsWith('/') && pattern.endsWith('/');
            const name = node.example || (isRegexLiteral ? null : pattern.replace(/\*/g, ''));

            if (!name) {
                console.warn(`[Warn] No example field setted to: ${pattern}.`);
                continue;
            }

            const fullPath = join(path, name);

            if (node.type === "dir") {

                if (!this.backend.exists(fullPath)) {
                    this.backend.makeDirectory(fullPath);
                }
                
                if (node.children) {
                    this.generate(fullPath, node.children);
                }
                
            } else if (node.type === "file") {
                
                if (!this.backend.exists(fullPath)) {
                    this.backend.writeFile(fullPath, ""); 
                }

            }
        }
    }

    validate(path: string, schema: LintSchema) {

        this.recursiveValidate(path, schema);

    }

    private patternToRegex(pattern: string): RegExp {

        if (pattern.startsWith('/') && pattern.endsWith('/')) {
            return new RegExp(pattern.slice(1 -1));
        }

        const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
        return new RegExp(`^${escaped}$`);
    }

    private recursiveValidate(path: string, schema: LintSchema) {

        const items = this.backend.getAllItems(path);

        for (const [pattern, node] of Object.entries(schema)) {

            const regex = this.patternToRegex(pattern);

            const matchedItems = items.filter(item => regex.test(item.name));

            if (matchedItems.length === 0 && node.required !== false) throw new NotFoundRequiredItem(pattern);

            for (const {name, type} of matchedItems) {

                const fullPath = join(path, name);

                if (node.type === "dir") {
                    
                    if (type !== "dir") throw new InvalidItemType(name);
                    else if (node.children) {
                        this.recursiveValidate(fullPath, node.children);
                    }

                }else if (node.type === "file" && type !== "file") throw new InvalidItemType(name);

            }

        }


    }

}

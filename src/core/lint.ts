
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

                result.paths[name] = {
                    path: fullPath,
                    type: node.type

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
        // Rastreador para evitar que o mesmo arquivo seja processado por múltiplos padrões (ex: 'manifest.yaml' e '*')
        const processedNames = new Set<string>();

        // Ordenamos as chaves para que padrões específicos (sem *) sejam processados antes dos genéricos
        const sortedEntries = Object.entries(schema).sort(([a], [b]) => {
            const aHasWildcard = a.includes('*');
            const bHasWildcard = b.includes('*');
            if (!aHasWildcard && bHasWildcard) return -1;
            if (aHasWildcard && !bHasWildcard) return 1;
            return 0;
        });

        for (const [pattern, node] of sortedEntries) {
            const regex = this.patternToRegex(pattern);
            
            // Filtramos apenas itens que batem com a regex E que ainda não foram "reivindicados"
            const matchedItems = items.filter(item => 
                regex.test(item.name) && !processedNames.has(item.name)
            );

            const isRequired = node.required ?? true;
            if (matchedItems.length === 0 && isRequired) throw new InvalidStructure(pattern);

            for (const { name, type } of matchedItems) {
                if (options?.ignore.includes(name)) continue;

                // Marcamos como processado para que o próximo padrão (ex: '*') ignore este item
                processedNames.add(name);

                const fullPath = join(cwd, name);

                if (node.type === "directory") {
                    if (type !== "directory") throw new InvalidStructure(fullPath);
                    
                    let childrenResult: ValidateResult | undefined = undefined;
                    if (node.children) {
                        childrenResult = await this.validate(fullPath, node.children, options);
                    }

                    result.paths[name] = {
                        path: fullPath,
                        name: name,
                        type: "directory",
                        ...(childrenResult?.paths && { children: childrenResult.paths })
                    };

                } else if (node.type === "file") {
                    if (type !== "file") throw new InvalidStructure(fullPath);

                    const content = this.backend.readFile(fullPath);
                    if (node.validate ? !node.validate(content) : false) throw new InvalidContent(fullPath);

                    result.paths[name] = {
                        path: fullPath,
                        name: name,
                        type: "file",
                    };
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

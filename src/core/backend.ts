import { LintItem } from "./types/backend.types.js";

export interface LintBackend {

    getAllItems(path: string): LintItem[];

    writeFile(path: string, content: string): void;
    readFile(path: string): string;

    makeDirectory(path: string, recursive?: boolean): void;

    exists(path: string): boolean;

}

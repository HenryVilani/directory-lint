import { LintItem } from "./types/backend.types.js";

export interface LintBackend {

    getAllItems(path: string): LintItem[];

    writeFile(path: string, content: any): void;
    readFile(path: string): any;

    makeDirectory(path: string, recursive?: boolean): void;

    exists(path: string): boolean;

}

import { LintTypes } from "./types.js";

export type LintItem = {
    name: string;
    type: LintTypes;
}

export interface LintBackend {

    getAllItems(path: string): LintItem[];

    writeFile(path: string, content: string): void;

    makeDirectory(path: string): void;

    exists(path: string): boolean;

}

import { LintItem } from "src/core/types/backend.types.js";
import { LintBackend } from "../core/backend.js";
import * as fs from "fs";

export const FileSystemBackend: LintBackend = {

    getAllItems(path: string): LintItem[] {
        return fs.readdirSync(path, { withFileTypes: true }).map(item => (
            {
                name: item.name,
                type: item.isDirectory() ? "dir" : "file"
            }
        ));
    },

    writeFile(path: string, content: string): void {
        fs.writeFileSync(path, content, { encoding: "utf-8"});
    },

    makeDirectory(path: string, recursive?: boolean): void {
        fs.mkdirSync(path, { recursive });
    },

    exists(path: string) {
        return fs.existsSync(path);
    },

}

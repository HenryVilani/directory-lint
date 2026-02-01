import { LintNode } from "./schema.types.js";

export type LintItem = {
    name: string;
    type: LintNode["type"];
}
import { ValidateNode } from "./schema.types.js";

export type LintItem = {
    name: string;
    type: ValidateNode["type"];
}
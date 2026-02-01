
interface BaseLintNode {

    required?: boolean;
    example?: string;

}

interface FileLintNode extends BaseLintNode {
    type: "file";
}

interface DirectoryLintNode extends BaseLintNode{
    type: "dir";
    children?: LintSchema;
}

export type LintTypes = "file" | "dir";

export type LintSchema = {

    [K: string]: (DirectoryLintNode | FileLintNode);

}


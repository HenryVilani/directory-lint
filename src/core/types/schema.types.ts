
interface BaseLintNode {

    required?: boolean;
    example?: string;

}

interface FileLintNode extends BaseLintNode {
    
    type: "file";
    validate?: (content: string) => boolean | Promise<boolean>;
    template?: string | (() => string);

}

interface DirectoryLintNode extends BaseLintNode{
    type: "dir";
    children?: LintSchema;
}

export type LintNode = FileLintNode | DirectoryLintNode;
export type LintSchema = Record<string, LintNode>;

